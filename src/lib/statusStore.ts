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

const TIMEOUT_MS = 70000; // 70 seconds (slightly more than 2x tracker interval)

export const getStatus = () => {
  // If status is online but we haven't heard from the tracker in a while, assume offline
  if (currentStatus.status === 'online' && Date.now() - currentStatus.lastUpdated > TIMEOUT_MS) {
    return {
      status: 'offline' as StatusType,
      lastUpdated: currentStatus.lastUpdated
    };
  }
  return currentStatus;
};

export const setStatus = (status: StatusType) => {
  currentStatus = {
    status,
    lastUpdated: Date.now(),
  };
  return currentStatus;
};

