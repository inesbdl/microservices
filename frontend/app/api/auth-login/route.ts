import { cookies } from 'next/headers'

/**
 * Authentification initiale.
 * Reçoit username/password, appelle le Auth Service,
 * et écrit access_token + refresh_token via cookies().
 */
export async function POST(request: Request) {
  const cookieStore = await cookies()

  try {
    const body = await request.json()
    const { username, password } = body
    console.log("appel api nest avec : ", username, password)
    const r = await fetch(
      `${process.env.AUTH_SERVICE_URL || process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:8000'}/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      }
    )

    if (!r.ok) {
      console.log("reponse pas ok")
      const err = await r.json().catch(() => ({}))
      return Response.json(
        { detail: err.detail || 'login failed' },
        { status: r.status }
      )
    }

    console.log("reponse ok")
    const { access_token, refresh_token, expires_in, user } = await r.json()

    // Dépôt du access_token en httpOnly
    cookieStore.set({
      name: 'access_token',
      value: access_token,
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: expires_in || 3600, // 1 heure par défaut
    })

    // Dépôt du refresh_token si présent
    if (refresh_token) {
      cookieStore.set({
        name: 'refresh_token',
        value: refresh_token,
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 jours
      })
    }

    console.log("user retourné apres login")
    console.log(user)
    return Response.json({ ok: true, user })
  } catch {
    return Response.json({ detail: 'login failed' }, { status: 500 })
  }
}