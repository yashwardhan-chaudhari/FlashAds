import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const users = [
  {
    name: 'FlashAds Super Admin',
    email: 'admin@flashads.in',
    phone: '+91 98220 11111',
    password: 'adminSecret123',
    role: 'admin',
    isActive: true,
  },
  {
    name: 'Meena Deshmukh (Owner)',
    email: 'meena.owner@example.com',
    phone: '+91 98220 22222',
    password: 'password123',
    role: 'advertiser',
    isActive: true,
  },
  {
    name: 'Rahul Kulkarni (Client)',
    email: 'rahul.client@example.com',
    phone: '+91 98220 33333',
    password: 'password123',
    role: 'client',
    isActive: true,
  },
];

export const seedDefaultUsers = async () => {
  try {
    for (const u of users) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        await User.create(u);
        console.log(`[Seed] Created initial ${u.role} account: ${u.email}`);
      }
    }
  } catch (error) {
    console.error('[Seed] Error seeding users:', error.message);
  }
};

export default seedDefaultUsers;
