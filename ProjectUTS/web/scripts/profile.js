async function loadReviews() {
    const title = document.getElementById("review-title");
    const summary = document.getElementById("review-summary");
    const head = document.getElementById("review-head");
    const body = document.getElementById("review-body");
    const search = document.getElementById("review-search");

    const res = await fetch("/api/reviews");
    if (!res.ok) {
        summary.textContent = "Failed to load reviews.";
        return;
    }

    const { scope, reviews } = await res.json();
    const showUser = scope === "all";
    const columns = showUser ? 5 : 4;

    title.textContent = showUser ? "All Reviews" : "My Reviews";

    head.innerHTML = `
        <tr>
            <th>Date</th>
            <th>Restaurant</th>
            ${showUser ? "<th>User</th>" : ""}
            <th>Rating</th>
            <th>Comment</th>
        </tr>`;

    function render(list) {
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

        body.innerHTML = list.map((r) => `
            <tr>
                <td class="text-nowrap">${esc(r.created_at ?? "-")}</td>
                <td>
                    <strong>${esc(r.restaurant_name ?? r.restaurant_id)}</strong><br>
                    <small class="text-muted">${esc(r.city ?? "-")} (${esc(r.restaurant_id)})</small>
                </td>
                ${showUser ? `<td>${esc(r.username ?? "-")}<br><small class="text-muted">${esc(r.email)}</small></td>` : ""}
                <td class="text-nowrap">⭐ ${r.rating}/5</td>
                <td style="white-space: pre-wrap;">${esc(r.comment)}</td>
            </tr>
        `).join("");
    }

    const avg = reviews.length
        ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(2)
        : "-";
    summary.textContent = `${reviews.length} review${reviews.length === 1 ? "" : "s"} · average rating ${avg}`;

    render(reviews);

    search.addEventListener("input", () => {
        const kw = search.value.trim().toLowerCase();
        render(reviews.filter((r) =>
            [r.restaurant_name, r.city, r.username, r.email, r.comment]
                .some((v) => v?.toLowerCase().includes(kw))
        ));
    });
}

fetch("api/session").then(async (res) => {
    const session = await res.json();
    if (!session) {
        window.location.href = "/login";
        return;
    }

    document.getElementById("profile-name").textContent = session.username;
    loadReviews();
});