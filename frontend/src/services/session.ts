export type AuthSession = {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    company: {
      id: string;
      name: string;
      document: string | null;
    };
  };
};

const ACCESS_TOKEN_KEY = "diaslocacao.accessToken";
const USER_KEY = "diaslocacao.user";

export function saveSession(session: AuthSession) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken);
  window.localStorage.setItem(USER_KEY, JSON.stringify(session.user));
}

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  const user = window.localStorage.getItem(USER_KEY);

  if (!accessToken || !user) {
    return null;
  }

  try {
    return {
      accessToken,
      user: JSON.parse(user) as AuthSession["user"],
    };
  } catch {
    clearSession();
    return null;
  }
}

export function clearSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}
