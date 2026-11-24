export async function checkSession() {
  const res = await fetch("/api/session");

  const session = await res.json();

  if (session) {
    window.location.href = "/";
  }
}