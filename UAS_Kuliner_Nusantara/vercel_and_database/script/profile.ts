import { hapusData } from "./utils";

// kalau ada karakter spesial akan menggantinya agar support
function esc(s: unknown): string {
  return String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ] as string,
  );
}

export async function checkProfile() {
  type Review = {
    review_id: number | string;
    created_at?: string;
    restaurant_id: string;
    restaurant_name?: string;
    city?: string;
    username?: string;
    email?: string;
    rating: number;
    comment: string;
  };

  async function loadReviews() {
    const title = document.getElementById("review-title")!;
    const summary = document.getElementById("review-summary")!;
    const head = document.getElementById("review-head")!;
    const body = document.getElementById("review-body")!;
    const search = document.getElementById("review-search") as HTMLInputElement;

    const res = await fetch("/api/reviews");
    if (!res.ok) {
      summary.textContent = "Failed to load reviews.";
      return;
    }

    const data = await res.json();
    if (!data.reviews) {
      summary.textContent = "Failed to load reviews.";
      return;
    }

    const reviews: Review[] = data.reviews;
    const showUser = data.scope === "all";

    const canEdit = !showUser;
    const columns = showUser ? 5 : 4;

    title.textContent = showUser ? "All Reviews" : "My Reviews";

    head.innerHTML = `
            <tr>
                <th>Date</th>
                <th>Restaurant</th>
                ${showUser ? "<th>User</th>" : ""}
                <th>Rating</th>
                <th>Comment</th>
                ${canEdit ? "<th>Action</th>" : ""}
            </tr>`;

    function render(list: Review[]) {
      if (list.length === 0) {
        let msg = "No reviews match your search.";
        if (reviews.length === 0) {
          msg = showUser
            ? "No reviews have been written yet."
            : 'You haven\'t written any reviews yet. Open a restaurant on the <a href="/explore">Explore</a> page to write one.';
        }
        body.innerHTML = `<tr><td colspan="${columns}" class="text-center text-muted">${msg}</td></tr>`;
        return;
      }

      body.innerHTML = list
        .map(
          (r) => `
                <tr>
                    <td class="text-nowrap">${esc(r.created_at ?? "-")}</td>
                    <td>
                        <strong>${esc(r.restaurant_name ?? r.restaurant_id)}</strong><br>
                        <small class="text-muted">${esc(r.city ?? "-")} (${esc(r.restaurant_id)})</small>
                    </td>
                    ${showUser ? `<td>${esc(r.username ?? "-")}<br><small class="text-muted">${esc(r.email)}</small></td>` : ""}
                    <td class="text-nowrap">⭐ ${r.rating}/5</td>
                    <td style="white-space: pre-wrap;">${esc(r.comment)}</td>
                    ${
                      canEdit
                        ? `
                    <td class="text-nowrap">
                        <a class="btn-tambah" href="/user_edit_review/${encodeURIComponent(String(r.review_id))}">Edit</a>
                        <button type="button" class="btn-tambah" data-delete-id="${esc(r.review_id)}" data-delete-name="${esc(r.restaurant_name ?? r.restaurant_id)}">Delete</button>
                    </td>`
                        : ""
                    }
                </tr>
            `,
        )
        .join("");
    }

    const avg = reviews.length
      ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(2)
      : "-";
    summary.textContent = `${reviews.length} review${reviews.length === 1 ? "" : "s"} · average rating ${avg}`;

    search.value = "";
    render(reviews);

    body.onclick = async (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(
        "button[data-delete-id]",
      );
      if (!btn) return;

      const ok = await hapusData(
        `/api/reviews/${encodeURIComponent(btn.dataset.deleteId!)}`,
        `Hapus review untuk ${btn.dataset.deleteName ?? "restoran ini"}? Tindakan ini tidak bisa dibatalkan.`,
      );
      if (ok) await loadReviews();
    };

    search.oninput = () => {
      const kw = search.value.trim().toLowerCase();
      render(
        reviews.filter((r) =>
          [r.restaurant_name, r.city, r.username, r.email, r.comment].some(
            (v) => v?.toLowerCase().includes(kw),
          ),
        ),
      );
    };
  }

  fetch("/api/session").then(async (res) => {
    const session = await res.json();
    if (!session) {
      window.location.href = "/login";
      return;
    }

    document.getElementById("profile-username")!.textContent = session.username;
    loadReviews();
  });
}
