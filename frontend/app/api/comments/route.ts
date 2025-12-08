import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    return Response.json({ detail: 'unauthorized' }, { status: 401 })
  }

  try {
    const r = await fetch(
      `${process.env.COMMENT_SERVICE_URL || 'http://localhost:4001/comments'}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const json = await r.json().catch(() => ({}))
    return Response.json(json, { status: r.status })
  } catch {
    return Response.json({ detail: 'comment service unreachable' }, { status: 503 })
  }
}

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    return Response.json({ detail: 'unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()

    const r = await fetch(
      `${process.env.COMMENT_SERVICE_URL || 'http://localhost:4001/comments'}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    )

    const json = await r.json().catch(() => ({}))
    return Response.json(json, { status: r.status })
  } catch (error) {
    console.error('Erreur lors de l envoi du commentaire:', error)
  
    const message =
      error instanceof Error ? error.message : 'Unknown error'
  
    return Response.json(
      { detail: 'comment creation failed', error: message },
      { status: 500 }
    )
  }
  
  
}

