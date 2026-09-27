document.addEventListener("DOMContentLoaded", function () {

    const hamburger = document.getElementById("nav-hamburger");
    const navLinks = document.getElementById("nav-links");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }

    function redirectButton(id, page) {
        const button = document.querySelector(id);

        if (button) {
            button.addEventListener("click", function () {
                window.location.href = page;
            });
        }
    }

    redirectButton("#tombol-explore-food", "explore.html");
    redirectButton("#profile-button", "login.html");

    const navBack = document.querySelector("#nav-back");

    if (navBack) {
        navBack.addEventListener("click", function () {
            window.history.back();
        });
    }

    // explore.html: generate card resto dari data.json
    const foodList = document.getElementById("food-list");
    const gambar_def = "nasgor.png";

    if (foodList) {
        fetch("data.json")
            .then((response) => response.json())
            .then((restos) => renderFoodCards(restos))
            .catch((error) => console.error("Failed fetching data.json:", error));
    }

    function renderFoodCards(restos) {
        foodList.innerHTML = "";

        restos.forEach((resto) => {
            const imageFile = resto.image ? resto.image : gambar_def;

            const card = document.createElement("div");
            card.className = "card";
            card.style.width = "18rem";

            card.innerHTML = `
                <img src="images/${imageFile}" class="card-img-top" alt="${resto.name}">
                <div class="card-body">
                    <h5 class="card-title">${resto.name}</h5>
                    <p class="card-text">${resto.place}</p>
                    <a href="#tes" class="but-card">Go somewhere</a>
                </div>
            `;

            foodList.appendChild(card);
        });
    }

});