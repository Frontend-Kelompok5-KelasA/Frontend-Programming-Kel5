export function esc(s: string) {
  const toReplace: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };

  return s.replace(/[&<>"']/g, (c) => toReplace[c] || s);
}

export function loadSession() {
  fetch("/api/session").then(async (res) => {
    const session = await res.json();
    if (session) {
      document.getElementById("profile-logged")?.classList.remove("d-none");
      return;
    }

    document.getElementById("profile-out")?.classList.remove("d-none");
  });
}

export function countPerMonth(
  items: { created_at: string }[],
  year = new Date().getFullYear(),
) {
  const result = Array(12).fill(0);
  items.forEach((item) => {
    const d = new Date(item.created_at);
    if (d.getFullYear() === year) result[d.getMonth()]++;
  });
  return result;
}

export async function hapusData(
  url: string,
  pesanKonfirmasi: string,
): Promise<boolean> {
  if (!window.confirm(pesanKonfirmasi)) return false;

  try {
    const res = await fetch(url, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));

    if (!res.ok || data.error) {
      alert(data.error ?? "Gagal menghapus data.");
      return false;
    }

    return true;
  } catch (err) {
    console.error("Gagal menghapus data:", err);
    alert("Gagal menghapus data.");
    return false;
  }
}

export const DEFAULT_RESTO_IMAGE = "/images/restaurantImages/migor.png";

export function resolveImage(image?: string | null): string {
  if (!image) return DEFAULT_RESTO_IMAGE;
  if (image.startsWith("http")) return image;
  return `/images/restaurantImages/${image}`;
}
