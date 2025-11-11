import { getServerBootstrapData } from '@/lib/getServerBootstrapData';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const revalidate = 0;

export const GET = async () => {
  const bootstrap = await getServerBootstrapData();
  return NextResponse.json(bootstrap);
};
