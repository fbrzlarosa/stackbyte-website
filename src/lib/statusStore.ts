// Simple in-memory store. 
// WARNING: In Vercel Serverless, this resets on cold boot.
// For production, use Vercel KV, Redis, or a real database.

type StatusType = 'online' | 'offline' | 'holidays';

interface StatusData {
  status: StatusType;
  lastUpdated: number;
}

// Global variable to hold state across requests (in the same lambda instance)
let currentStatus: StatusData = {
  status: 'offline',
  lastUpdated: Date.now(),
};

export const getStatus = () => currentStatus;

export const setStatus = (status: StatusType) => {
  currentStatus = {
    status,
    lastUpdated: Date.now(),
  };
  return currentStatus;
};

