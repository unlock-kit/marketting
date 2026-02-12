import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { PrismaClient, CampaignStatus } from '@prisma/client';
import { Queue } from 'bullmq';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

const emailQueue = new Queue('email-queue', {
  connection: { url: process.env.REDIS_URL || 'redis://cache:6379' }
});

app.use(express.json());

// Resolve path relative to the runtime dist/server folder
const rootPath = path.resolve(__dirname, '..');
app.use(express.static(rootPath));

// TRIGGER CAMPAIGN
app.post('/api/campaigns/:id/launch', async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  
  try {
    const campaign = await prisma.campaign.findUnique({ where: { id } });
    const subscribers = await prisma.subscriber.findMany({ where: { status: 'ACTIVE' } });

    if (!campaign) {
      res.status(404).json({ error: 'Campaign not found' });
      return;
    }

    const jobs = subscribers.map((sub) => ({
      name: 'send-email',
      data: {
        campaignId: campaign.id,
        recipient: { id: sub.id, email: sub.email },
        subject: campaign.subject,
        body: (campaign.content as any)?.html || '',
        trackingId: `${campaign.id}-${sub.id}`
      },
      opts: { 
        attempts: 3, 
        backoff: { type: 'exponential' as const, delay: 1000 } 
      }
    }));

    await emailQueue.addBulk(jobs);
    await prisma.campaign.update({ 
      where: { id }, 
      data: { status: CampaignStatus.SENDING } 
    });

    res.json({ success: true, count: subscribers.length });
  } catch (error) {
    console.error('Dispatch failed:', error);
    res.status(500).json({ error: 'Engine failure' });
  }
});

// TRACKING PIXEL
app.get('/track/open/:trackingId', async (req: express.Request, res: express.Response) => {
  const { trackingId } = req.params;
  const parts = trackingId.split('-');
  
  if (parts.length >= 2) {
    const [campaignId, subscriberId] = parts;
    try {
      await prisma.deliveryLog.updateMany({
        where: { campaignId, subscriberId },
        data: { status: 'OPENED' }
      });
      await prisma.campaign.update({
        where: { id: campaignId },
        data: { openCount: { increment: 1 } }
      });
    } catch (e) {
      // Quiet fail to not interrupt pixel delivery
    }
  }

  const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
  res.writeHead(200, {
    'Content-Type': 'image/gif',
    'Content-Length': pixel.length,
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  }).end(pixel);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(rootPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Zenith Engine LIVE: ${process.env.APP_URL}`);
});
