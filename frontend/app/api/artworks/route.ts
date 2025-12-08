import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_ART_SERVICE_URL || 'http://art-service:4001/artworks';

export async function GET() {
  try {
    const res = await fetch(BACKEND_URL);
    const artworks = await res.json();
    return NextResponse.json(artworks, { status: res.status });
  } catch (err) {
    console.error('Erreur GET /artworks:', err);
    return NextResponse.json([], { status: 500 });
  }
}
