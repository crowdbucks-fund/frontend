import { AUTH_TOKEN_KEY } from 'lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export const GET = (request: NextRequest) => {
  const response = NextResponse.redirect(new URL('/auth', request.url))
  response.cookies.delete(AUTH_TOKEN_KEY)
  return response
}
