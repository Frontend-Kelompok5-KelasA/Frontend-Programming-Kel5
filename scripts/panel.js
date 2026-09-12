import {initComponent, toggleConnecting, toggleRotating} from "./editor.js";

const content = document.getElementsByClassName("content")[0];
[...document.getElementsByClassName("item")].forEach((element) => {
    element.addEventListener("click", (event) => {
        if(element.childNodes[1].dataset.type === "wire"){
            toggleConnecting(element.childNodes[1]);
            return;
        }

        if(element.childNodes[1].dataset.type === "rotate"){
            toggleRotating(element.childNodes[1]);
            return;
        }

        const cloned = element.cloneNode(true);
        cloned.id = crypto.randomUUID();

        cloned.querySelectorAll("span").forEach((e) => e.remove());

        cloned.style.left = (window.innerWidth / 2) - (cloned.offsetWidth / 2) + "px";
        cloned.style.top = (window.innerHeight / 2) - (cloned.offsetWidth / 2) + "px";

        cloned.querySelectorAll("div").forEach((e) => e.style.display = "block");

        cloned.style.transform = "scale(1.5)";

        content.appendChild(cloned);

        initComponent(cloned);
    })
})
