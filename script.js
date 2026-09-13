document.addEventListener("DOMContentLoaded", function () {
  const button = document.querySelector("#masuk");

  if (button) {
    button.addEventListener("click", function () {
      window.location.href = "home.html";
    });
  }

  const exit = document.querySelector("#keluar");

  if(exit){
    exit.addEventListener("click", function(){
      window.location.href = "index.html";
    })
  }
});