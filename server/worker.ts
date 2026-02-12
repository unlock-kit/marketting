import { Worker, Job } from 'bullmq';
import nodemailer from 'nodemailer';
import { PrismaClient, DeliveryStatus } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
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
    const trackingUrl = `${process.env.APP_URL}/track/open/${trackingId}`;
    const trackedBody = `${body}<img src="${trackingUrl}" width="1" height="1" style="display:none;" />`;

    await transporter.sendMail({
      from: `"Zenith Marketing" <${process.env.SMTP_USER}>`,
      to: recipient.email,
      subject,
      html: trackedBody,
      headers: {
        'X-Campaign-ID': campaignId,
        'X-Subscriber-ID': recipient.id,
        'Precedence': 'bulk'
      }
    });

    await prisma.deliveryLog.create({
      data: {
        campaignId,
        subscriberId: recipient.id,
        status: DeliveryStatus.SENT
      }
    });

    await prisma.campaign.update({
      where: { id: campaignId },
      data: { sentCount: { increment: 1 } }
    });

  } catch (error: any) {
    console.error(`Job ${job.id} failed:`, error.message);
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { failedCount: { increment: 1 } }
    });
    throw error;
  }
}, {
  connection: { url: process.env.REDIS_URL || 'redis://cache:6379' },
  concurrency: 15
});

console.log('👷 Worker Ready: Processing Queue');
