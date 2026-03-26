type JwtPayload = Record<string, unknown>;

export function decodeJwtPayload(token: string): JwtPayload | null {
  const parts = token.split('.');

  if (parts.length < 2) {
    return null;
  }

  const payloadPart = parts[1]
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const paddedPayload = payloadPart + '='.repeat((4 - (payloadPart.length % 4)) % 4);

  try {
    const decoded = atob(paddedPayload);
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
}

export function extractRoleFromToken(token: string): string | null {
  const payload = decodeJwtPayload(token);

  if (!payload) {
    return null;
  }

  const roleValue = payload['role'] ?? payload['roles'];

  if (typeof roleValue === 'string') {
    return roleValue;
  }

  if (Array.isArray(roleValue) && roleValue.length > 0 && typeof roleValue[0] === 'string') {
    return roleValue[0];
  }

  return null;
}