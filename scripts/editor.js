let attached = null;
let attached2 = null;

let cable = null;

let isConnecting = null;
let isRotating = null;

let offsets = {};

const content = document.getElementsByClassName("content")[0];

export function initComponent(component){
    component.style.userSelect = "none";
    component.style.position = "absolute";

    component.querySelectorAll("img").forEach((e) => e.draggable = false);

    component.addEventListener("pointerdown", (event) => {
        if(isConnecting)return;

        attached = component

        offsets["x"] = (parseFloat(attached.style.left) || 0) - event.clientX;
        offsets["y"] = (parseFloat(attached.style.top) || 0) - event.clientY;

        attached.style.cursor = 'grabbing';
        attached.setPointerCapture(event.pointerId);
    })

    component.addEventListener("pointerup", (event) => {
        if(isConnecting)return;

        attached.style.cursor = "grab";
        attached.releasePointerCapture(event.pointerId);

        attached = null
    })

    component.addEventListener("pointermove", (event) => {
        if(isConnecting)return;

        if(attached === component){
            if(!isRotating){
                attached.style.left = (offsets["x"] + event.clientX) + 'px';
                attached.style.top = (offsets["y"] + event.clientY) + 'px';
            }

            const leftPointer = attached.getElementsByClassName("left-pointer")[0];
            if(leftPointer.cable){
                updateCablePos(leftPointer.cable, leftPointer, leftPointer.cable.rightPointer)
            }

            const rightPointer = attached.getElementsByClassName("right-pointer")[0];
            if(rightPointer.cable){
                updateCablePos(rightPointer.cable, rightPointer.cable.leftPointer, rightPointer)
            }
        }
    });

    component.addEventListener("click", (event) => {
        if(!isConnecting)return;

        if(attached){
            if(attached === component)return;

            attached2 = component;

            const pointer = component.getElementsByClassName("right-pointer")[0];
            if(pointer.cable){
                if(pointer.cable.leftPointer)pointer.cable.leftPointer.cable = null;
                pointer.cable.remove();
                pointer.cable = null;
            }

            checkConnector();
            return;
        }

        const pointer = component.getElementsByClassName("left-pointer")[0];
        if(pointer.cable){
            if(pointer.cable.rightPointer)pointer.cable.rightPointer.cable = null;
            pointer.cable.remove();
            pointer.cable = null;
        }

        cable = wireElement.cloneNode();
        cable.className = "";

        cable.style.position = "absolute";
        cable.style.transformOrigin = "0 50%";
        cable.style.pointerEvents = "none";

        cable.style.margin = "0px";
        cable.style.padding = "0px";

        cable.style.objectFit = "fill";
        cable.style.height = "9px";
        cable.style.borderRadius = "10%";

        content.appendChild(cable);

        attached = component;
    });

    component.style.cursor = "grab";
}

window.addEventListener("pointermove", (event) => {
    if(isConnecting && attached){
        const pointer = attached.getElementsByClassName("left-pointer")[0];
        const anchorRect = pointer.getBoundingClientRect();

        const screenX = anchorRect.left + (anchorRect.width / 2);
        const screenY = anchorRect.top + (anchorRect.height / 2);

        let offsetX = 0;
        let offsetY = 0;

        if(cable.offsetParent && getComputedStyle(cable.offsetParent).position !== "static"){
            const parentRect = cable.offsetParent.getBoundingClientRect();
            offsetX = parentRect.left + cable.offsetParent.clientLeft;
            offsetY = parentRect.top + cable.offsetParent.clientTop;
        }

        cable.style.left = (screenX - offsetX) + window.scrollX + "px";
        cable.style.top = ((screenY - offsetY) + window.scrollY - (cable.offsetHeight / 2)) + "px";

        const dx = event.clientX - screenX;
        const dy = event.clientY - screenY;

        cable.style.width = Math.sqrt(dx * dx + dy * dy) + "px";

        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        cable.style.transform = `rotate(${angle}deg)`;

        return;
    }

    if(isRotating && attached){
        console.log("hmmm");

        const rect = attached.getBoundingClientRect();

        const dx = event.clientX - (rect.left + (rect.width / 2));
        const dy = event.clientY - (rect.top + (rect.height / 2));

        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        attached.style.transform = `scale(1.5) rotate(${angle}deg)`;

        const leftPointer = attached.getElementsByClassName("left-pointer")[0];
        if(leftPointer.cable){
            updateCablePos(leftPointer.cable, leftPointer, leftPointer.cable.rightPointer)
        }

        const rightPointer = attached.getElementsByClassName("right-pointer")[0];
        if(rightPointer.cable){
            updateCablePos(rightPointer.cable, rightPointer.cable.leftPointer, rightPointer)
        }
    }
})

window.addEventListener("pointerup", (event) => {
    if(isRotating){
        toggleRotating();
    }
})

function updateCablePos(cable, leftPointer, rightPointer){
    const rect1 = leftPointer.getBoundingClientRect();
    const leftX = rect1.left + (rect1.width / 2);
    const leftY = rect1.top + (rect1.height / 2);

    const rect2 = rightPointer.getBoundingClientRect();
    const rightX = rect2.left + (rect2.width / 2);
    const rightY = rect2.top + (rect2.height / 2);

    let offsetX = 0;
    let offsetY = 0;
    const parent = cable.offsetParent;

    if (parent && getComputedStyle(parent).position !== "static") {
        const parentRect = parent.getBoundingClientRect();
        offsetX = parentRect.left + parent.clientLeft;
        offsetY = parentRect.top + parent.clientTop;
    }

    const cssX = (leftX - offsetX) + window.scrollX;
    const cssY = (leftY - offsetY) + window.scrollY;

    cable.style.left = cssX + "px";
    cable.style.top = (cssY - (cable.offsetHeight / 2)) + "px";

    const dx = rightX - leftX;
    const dy = rightY - leftY;

    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    cable.style.width = length + "px";
    cable.style.transform = `rotate(${angle}deg)`;
}

function checkConnector(){
    if(!isConnecting){
        attached = null;
        attached2 = null;

        if(cable) {
            if(cable.leftPointer)cable.leftPointer.cable = null;
            if(cable.rightPointer)cable.rightPointer.cable = null;

            cable.remove();
            cable = null;
        }

        return;
    }

    if(attached && attached2){
        attached.linked = true;
        attached2.linked = true;

        if(cable){
            const leftPointer = attached.getElementsByClassName("left-pointer")[0] || attached;
            const rightPointer = attached2.getElementsByClassName("right-pointer")[0] || attached2;

            leftPointer.cable = cable;
            rightPointer.cable = cable;

            cable.leftPointer = leftPointer;
            cable.rightPointer = rightPointer;

            updateCablePos(cable, leftPointer, rightPointer);
        }

        attached = null;
        attached2 = null;

        cable = null;

        toggleConnecting();
    }
}

let wireElement = null;
export function toggleConnecting(element){
    if(isRotating)toggleRotating();

    if(element)wireElement = element;

    isConnecting = !isConnecting;

    if(wireElement){
        wireElement.style.backgroundSize = isConnecting ? "100% 80%" : "0";
    }

    checkConnector();
}

let rotateElement = null;
export function toggleRotating(element){
    if(isConnecting)toggleConnecting();

    if(element)rotateElement = element;

    isRotating = !isRotating;

    if(rotateElement){
        rotateElement.style.backgroundSize = isRotating ? "100% 80%" : "0";
    }
}