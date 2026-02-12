
export enum CampaignStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  SENDING = 'SENDING',
  COMPLETED = 'COMPLETED',
  PAUSED = 'PAUSED'
}

export type UserRole = 'OWNER' | 'ADMIN' | 'MANAGER' | 'ANALYST';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: 'ACTIVE' | 'PENDING' | 'DEACTIVATED';
  lastLogin: string;
  avatar?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  category: 'AUTH' | 'CAMPAIGN' | 'CONTACTS' | 'SYSTEM';
  ipAddress: string;
  timestamp: string;
}

export interface Campaign {
  id: string;
  name: string;
  subject: string;
  status: CampaignStatus;
  sentCount: number;
  failedCount: number;
  openRate: number;
  clickRate: number;
  lastUpdated: string;
  audience: string;
  sentDate: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  thumbnail: string;
  lastModified: string;
  blocks: any[]; 
}

export interface Subscriber {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  tags: string[];
  status: 'ACTIVE' | 'UNSUBSCRIBED' | 'BOUNCED';
  createdAt: string;
}
