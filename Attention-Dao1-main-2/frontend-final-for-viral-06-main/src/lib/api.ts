const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function checkAuth() {
  return fetch(`${BACKEND_URL}/auth/user`, {
    method: "GET",
    credentials: "include", 
  }).then((res) => res.json());
}

export async function registerUser(privyId: string, username: string) {
  return fetch(`${BACKEND_URL}/auth/register-user-by-username`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Privy-ID": privyId,
    },
    body: JSON.stringify({ username }),
  }).then((res) => res.json());
}
