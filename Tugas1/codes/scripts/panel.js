import {initComponent, setup, toggleConnecting, toggleRotating, toggleDeleting, onClear} from "./editor.js";

const content = document.getElementsByClassName("content")[0];

// init panel biar bisa interaksi nambah komponen
[...document.getElementsByClassName("item")].forEach((element) => {
    const imgChild = element.children[0];
    if(imgChild && imgChild.dataset.type){
        imgChild.draggable = false;
        setup(imgChild.dataset.type, imgChild);
    }

    element.style.userSelect = "none";
    element.style.cursor = "grab";

    element.getElementsByTagName("img")[0].addEventListener("click", () => {
        // buat handle opsi yang non item
        switch(element.childNodes[1].dataset.type){
            case "wire":
                toggleConnecting(element.childNodes[1]);
                return;

            case "rotate":
                toggleRotating(element.childNodes[1]);
                return;
            
            case "delete":
                toggleDeleting(element.childNodes[1]);
                return;

            case "clear":
                onClear();
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
