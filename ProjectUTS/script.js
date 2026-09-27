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

});