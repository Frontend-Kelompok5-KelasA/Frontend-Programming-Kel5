const content = document.getElementsByClassName("content")[0];

let attached = null;
let attached2 = null;

let cable = null;

let isConnecting = null;
let isRotating = null;

let offsets = {};

let wireElement = null;
let rotateElement = null;

export function setup(type, element){
    switch(type){
        case "wire":
            wireElement = element;
            break;

        case "rotate":
            rotateElement = element;
            break;
    }
}

export function initComponent(component){
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

            checkCablePos(attached);
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

        cable.style.objectFit = "fill";

        cable.style.height = "9px";
        cable.style.borderRadius = "10%";

        content.appendChild(cable);

        attached = component;

        checkAttachedCable(event);
    });
}

window.addEventListener("pointermove", (event) => {
    if(isConnecting && attached){
        checkAttachedCable(event);
        return;
    }

    if(isRotating && attached){
        const rect = attached.getBoundingClientRect();

        const angle = Math.atan2(
            event.clientX - (rect.left + (rect.width / 2)),
            event.clientY - (rect.top + (rect.height / 2))
        ) * (-180 / Math.PI);

        attached.style.transform = `scale(1.5) rotate(${angle}deg)`;

        checkCablePos(attached);
    }
})

window.addEventListener("pointerup", (event) => {
    if(isRotating){
        try {
            if(event.target.dataset.type !== "rotate"){
                toggleRotating();
            }
        } catch (e) {
            toggleRotating();
        }
    }
})

function checkAttachedCable(event){
    const pointer = attached.getElementsByClassName("left-pointer")[0];
    if(!pointer)return;

    const pointerRect = pointer.getBoundingClientRect();

    const screenX = pointerRect.left + (pointerRect.width / 2);
    const screenY = pointerRect.top + (pointerRect.height / 2);

    cable.style.left = screenX + window.scrollX + "px";
    cable.style.top = (screenY + window.scrollY - (cable.offsetHeight / 2)) + "px";

    const dx = event.clientX - screenX;
    const dy = event.clientY - screenY;

    cable.style.width = Math.sqrt(dx * dx + dy * dy) + "px";

    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    cable.style.transform = `rotate(${angle}deg)`;
}

function checkCablePos(component){
    const leftPointer = component.getElementsByClassName("left-pointer")[0];
    if(leftPointer.cable){
        updateCablePos(leftPointer.cable, leftPointer, leftPointer.cable.rightPointer)
    }

    const rightPointer = component.getElementsByClassName("right-pointer")[0];
    if(rightPointer.cable){
        updateCablePos(rightPointer.cable, rightPointer.cable.leftPointer, rightPointer)
    }
}

function updateCablePos(cable, leftPointer, rightPointer){
    const leftRect = leftPointer.getBoundingClientRect();
    const leftX = leftRect.left + (leftRect.width / 2);
    const leftY = leftRect.top + (leftRect.height / 2);

    const rightRect = rightPointer.getBoundingClientRect();
    const rightX = rightRect.left + (rightRect.width / 2);
    const rightY = rightRect.top + (rightRect.height / 2);

    cable.style.left = leftX + window.scrollX + "px";
    cable.style.top = (leftY + window.scrollY - (cable.offsetHeight / 2)) + "px";

    const dx = rightX - leftX;
    const dy = rightY - leftY;

    cable.style.width = Math.sqrt(dx * dx + dy * dy) + "px";

    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
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
            const leftPointer = attached.getElementsByClassName("left-pointer")[0];
            const rightPointer = attached2.getElementsByClassName("right-pointer")[0];

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

export function toggleConnecting(){
    if(isRotating)toggleRotating();

    isConnecting = !isConnecting;

    if(wireElement){
        wireElement.style.backgroundSize = isConnecting ? "100% 80%" : "0";
    }

    checkConnector();
}

export function toggleRotating(){
    if(isConnecting)toggleConnecting();

    isRotating = !isRotating;

    if(rotateElement){
        rotateElement.style.borderRadius = "100%";
        rotateElement.style.backgroundSize = isRotating ? "100% 90%" : "0";
    }
}