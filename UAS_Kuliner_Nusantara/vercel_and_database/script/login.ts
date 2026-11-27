export async function checkSession() {
  const res = await fetch("/api/session");

  const session = await res.json();

  if(session){
    if(session.role === "admin")window.location.href = "/admin";
    window.location.href = "/";
  }
}