import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET() {
  try {
    console.log('=== KV DEBUG START ===');
    console.log('UPSTASH_REDIS_REST_URL exists:', !!process.env.UPSTASH_REDIS_REST_URL);
    console.log('UPSTASH_REDIS_REST_TOKEN exists:', !!process.env.UPSTASH_REDIS_REST_TOKEN);
    console.log('KV_REST_API_URL exists:', !!process.env.KV_REST_API_URL);
    console.log('KV_REST_API_TOKEN exists:', !!process.env.KV_REST_API_TOKEN);
    
    // Try to get the data with the exact key
    const key = "negotiation_leaderboard";
    console.log('Trying to get key:', key);
    
    const data = await kv.get(key);
    console.log('Raw KV data:', data);
    console.log('Data type:', typeof data);
    console.log('Data length:', Array.isArray(data) ? data.length : 'not array');
    
    // Also try to get all keys to see what's there
    try {
      const keys = await kv.keys('*');
      console.log('All KV keys:', keys);
    } catch (e) {
      console.log('Could not get keys:', e);
    }
    
    return NextResponse.json({
      hasEnvVars: {
        upstashUrl: !!process.env.UPSTASH_REDIS_REST_URL,
        upstashToken: !!process.env.UPSTASH_REDIS_REST_TOKEN,
        kvUrl: !!process.env.KV_REST_API_URL,
        kvToken: !!process.env.KV_REST_API_TOKEN
      },
      key: key,
      data: data,
      dataType: typeof data,
      isArray: Array.isArray(data),
      length: Array.isArray(data) ? data.length : null
    });
    
  } catch (error: any) {
    console.error('KV Debug Error:', error);
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
} 