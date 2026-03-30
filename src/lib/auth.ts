export type AppUser = {
  id: string;
  full_name: string;
  email: string;
  role: 'student' | 'mentor' | 'admin';
};

const USER_KEY = 'unimentor_user';

export async function hashPassword(rawPassword: string): Promise<string> {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(rawPassword);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function saveCurrentUser(user: AppUser, rememberMe: boolean): void {
  const payload = JSON.stringify(user);
  if (rememberMe) {
    localStorage.setItem(USER_KEY, payload);
    sessionStorage.removeItem(USER_KEY);
    return;
  }
  sessionStorage.setItem(USER_KEY, payload);
  localStorage.removeItem(USER_KEY);
}

export function getCurrentUser(): AppUser | null {
  const payload = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
  if (!payload) {
    return null;
  }

  try {
    return JSON.parse(payload) as AppUser;
  } catch {
    return null;
  }
}

export function clearCurrentUser(): void {
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(USER_KEY);
}
