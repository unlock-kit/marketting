
import { Worker, Job } from 'bullmq';
import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  pool: true,
  maxConnections: 10
});

const emailWorker = new Worker('email-queue', async (job: Job) => {
  const { campaignId, recipient, body, subject, trackingId } = job.data;

  try {
    const trackedBody = `${body}<img src="${process.env.APP_URL}/track/open/${trackingId}" width="1" height="1" />`;

    const info = await transporter.sendMail({
      from: `"ZenithMail" <${process.env.SMTP_USER}>`,
      to: recipient.email,
      subject,
      html: trackedBody,
      headers: { 'X-Campaign-ID': campaignId }
    });

    await prisma.deliveryLog.create({
      data: {
        campaignId,
        subscriberId: recipient.id,
        status: 'SENT',
        metadata: { messageId: info.messageId }
      }
    });

    await prisma.campaign.update({
      where: { id: campaignId },
      data: { sentCount: { increment: 1 } }
    });

  } catch (error: any) {
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { failedCount: { increment: 1 } }
    });
    throw error;
  }
}, {
  connection: { url: process.env.REDIS_URL || 'redis://cache:6379' },
  concurrency: 50
});

console.log('👷 ZenithMail Worker Pool Active');
