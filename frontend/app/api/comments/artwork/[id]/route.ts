import { cookies } from 'next/headers'

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    return Response.json({ detail: 'unauthorized' }, { status: 401 })
  }

  try {
    const serviceUrl = process.env.COMMENT_SERVICE_URL || 'http://localhost:4001/comments'
    const url = `${serviceUrl}/artwork/${id}`
    
    console.log(`[Comments API] Fetching from: ${url}`)
    
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      console.log(`[Comments API] Response not OK: ${res.status}`)
      return Response.json([], { status: 200 })
    }

    const contentType = res.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      console.log(`[Comments API] Invalid content-type: ${contentType}`)
      return Response.json([], { status: 200 })
    }

    const text = await res.text()
    if (!text || text.trim() === '' || text === 'undefined' || text.trim() === 'undefined') {
      console.log(`[Comments API] Empty or undefined response: "${text}"`)
      return Response.json([], { status: 200 })
    }

    let json
    try {
      json = JSON.parse(text)
    } catch (parseErr) {
      console.error(`[Comments API] JSON parse error:`, parseErr, `Text: "${text}"`)
      return Response.json([], { status: 200 })
    }

    return Response.json(json, { status: res.status })
  } catch (err) {
    console.error("[Comments API] ERROR PROXY:", err)
    // Retourner un tableau vide au lieu d'une erreur pour éviter de casser le frontend
    return Response.json([], { status: 200 })
  }
}
