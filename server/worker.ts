import { Worker, Job } from 'bullmq';
import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  pool: true,
  maxConnections: 10
});

const emailWorker = new Worker('email-queue', async (job: Job) => {
  const { campaignId, recipient, body, subject, trackingId } = job.data;

  try {
    // Inject Tracking Pixel
    const trackingUrl = `${process.env.APP_URL}/track/open/${trackingId}`;
    const trackedBody = `${body}<img src="${trackingUrl}" width="1" height="1" style="display:none;" />`;

    const info = await transporter.sendMail({
      from: `"ZenithMail Engine" <${process.env.SMTP_USER}>`,
      to: recipient.email,
      subject,
      html: trackedBody,
      headers: {
        'X-Campaign-ID': campaignId,
        'X-Subscriber-ID': recipient.id,
        'Precedence': 'bulk'
      }
    });

    // Log successful dispatch
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
    console.error(`Worker error for job ${job.id}:`, error.message);
    
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { failedCount: { increment: 1 } }
    });
    
    throw error; // Let BullMQ handle retries
  }
}, {
  connection: { url: process.env.REDIS_URL || 'redis://cache:6379' },
  concurrency: 25 // Optimized for 4GB RAM
});

console.log('👷 ZenithMail High-Volume Worker Pool Active');
