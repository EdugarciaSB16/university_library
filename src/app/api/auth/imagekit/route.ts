import ImageKit from 'imagekit';
import config from '@/lib/config';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

const {
  env: {
    imagekit: { publicKey, privateKey, urlEndpoint },
  },
} = config;

const imagekit = new ImageKit({
  publicKey,
  privateKey,
  urlEndpoint,
});

export async function GET() {
  const headersList = await headers();
  const origin = headersList.get('origin') || '*';

  return NextResponse.json(imagekit.getAuthenticationParameters(), {
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function OPTIONS() {
  const headersList = await headers();
  const origin = headersList.get('origin') || '*';

  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
