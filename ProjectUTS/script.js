const hamburger = document.getElementById("nav-hamburger");
const navLinks = document.getElementById("nav-links");

hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

document.addEventListener("DOMContentLoaded", function () {
  const button = document.querySelector("#tombol-explore-food");

  if (button) {
    button.addEventListener("click", function () {
      window.location.href = "explore.html";
    });
  }
});