import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_ART_SERVICE_URL || 'http://localhost:4001/artworks';

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ici on await parce que c'est une promesse

  if (!id) {
    return NextResponse.json({ detail: 'ID manquant' }, { status: 400 });
  }

  try {
    const res = await fetch(`${BACKEND_URL}/${id}`);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error(`Erreur GET /${id}:`, err);
    return NextResponse.json({ detail: 'Erreur serveur' }, { status: 500 });
  }
}
