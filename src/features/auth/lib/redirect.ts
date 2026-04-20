const AUTH_ROUTE_PREFIXES = ['/sign-in', '/sign-up', '/forgot-password', '/otp']

export function normalizeAuthRedirect(redirect?: string) {
  if (!redirect || !redirect.startsWith('/')) {
    return '/'
  }

  const [path] = redirect.split('?')

  if (AUTH_ROUTE_PREFIXES.some((prefix) => path === prefix)) {
    return '/'
  }

  return redirect
}
