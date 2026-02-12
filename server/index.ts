
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { Queue } from 'bullmq';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// High-speed queue connection
const emailQueue = new Queue('email-queue', {
  connection: { url: process.env.REDIS_URL || 'redis://cache:6379' }
});

app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// TRIGGER CAMPAIGN
app.post('/api/campaigns/:id/launch', async (req, res) => {
  const { id } = req.params;
  
  try {
    const campaign = await prisma.campaign.findUnique({ where: { id } });
    const subscribers = await prisma.subscriber.findMany({ where: { status: 'ACTIVE' } });

    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });

    // Batch add to worker queue
    const jobs = subscribers.map(sub => ({
      name: 'send-email',
      data: {
        campaignId: campaign.id,
        recipient: sub,
        subject: campaign.subject,
        body: (campaign.content as any).html,
        trackingId: `${campaign.id}-${sub.id}`
      },
      opts: { attempts: 3, backoff: { type: 'exponential', delay: 1000 } }
    }));

    await emailQueue.addBulk(jobs);
    await prisma.campaign.update({ where: { id }, data: { status: 'SENDING' } });

    res.json({ success: true, count: subscribers.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to launch campaign' });
  }
});

// TRACKING PIXEL
app.get('/track/open/:trackingId', async (req, res) => {
  const { trackingId } = req.params;
  const [campaignId, subscriberId] = trackingId.split('-');

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
    console.error('Tracking log error');
  }

  const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
  res.writeHead(200, {
    'Content-Type': 'image/gif',
    'Content-Length': pixel.length,
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  }).end(pixel);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 ZenithMail Engine LIVE at ${process.env.APP_URL}`);
});
