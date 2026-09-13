import {connectNodes, registerComponent, toggleSwitch, unregisterComponent, clickBulb} from "./circuit.js";

const content = document.getElementsByClassName("content")[0];

let attached = null;
let attached2 = null;

let cable = null;

let isConnecting = null;
let isRotating = null;
let isDeleting = null;

let offsets = {};

let wireElement = null;
let rotateElement = null;
let deleteElement = null;

// buat setup referensi panel, biar bisa buat highlight dan toggle
export function setup(type, element){
    switch(type){
        case "wire":
            wireElement = element;
            break;

        case "rotate":
            rotateElement = element;
            break;

        case "delete":
            deleteElement = element;
            break;
    }
}

export function initComponent(component){
    component.style.position = "absolute";

    component.querySelectorAll("img").forEach((e) => e.draggable = false);

    // pas teken mouse (mindahin komponen)
    component.addEventListener("pointerdown", (event) => {
        if(isConnecting || isDeleting)return;

        attached = component

        offsets["x"] = (parseFloat(attached.style.left) || 0) - event.clientX;
        offsets["y"] = (parseFloat(attached.style.top) || 0) - event.clientY;

        attached.style.cursor = 'grabbing';
        attached.setPointerCapture(event.pointerId);
    })

    // pas lepas mouse (mindahin komponen)
    component.addEventListener("pointerup", (event) => {
        if(isConnecting || isRotating || isDeleting || !attached)return;

        attached.style.cursor = "grab";
        attached.releasePointerCapture(event.pointerId);

        attached = null
    })

    // pas gerakin mouse (mindahin komponen)
    component.addEventListener("pointermove", (event) => {
        if(isConnecting)return;
        if(isDeleting)return;

        if(attached === component){
            if(!isRotating){
                attached.style.left = (offsets["x"] + event.clientX) + 'px';
                attached.style.top = (offsets["y"] + event.clientY) + 'px';
            }

            checkCablePos(attached);
        }
    });

    component.addEventListener("click", (event) => {
        if(isDeleting){
            removeComponent(component)
            return;
        }

        // interaksi dengan switch dan bohlam
        if(!isConnecting){
            const componentType = component.children[0].dataset.type;
            if (componentType === "switch-off" || componentType === "switch-on") {
                toggleSwitch(component.id, component.children[0]);
            }
            if (componentType === 'bulb') {
                clickBulb(component.id);
            }
            return;
        }

        // pas mau hubungin ke komponen 2
        if(attached){
            if(attached === component)return;

            attached2 = component;

            const pointer = component.getElementsByClassName("right-pointer")[0];
            if(pointer.cable){
                if(pointer.cable.leftPointer)pointer.cable.leftPointer.cable = null;
                unregisterComponent(pointer.cable.id);
                pointer.cable.remove();
                pointer.cable = null;
            }

            checkConnector();
            return;
        }

        // pas baru narik kabel dari komponen 1
        const pointer = component.getElementsByClassName("left-pointer")[0];
        if(pointer.cable){
            if(pointer.cable.rightPointer)pointer.cable.rightPointer.cable = null;
            unregisterComponent(pointer.cable.id);
            pointer.cable.remove();
            pointer.cable = null;
        }

        // clone kabel dan beberapa penyesuaian
        cable = wireElement.cloneNode();
        cable.className = "";

        cable.id = crypto.randomUUID();
        cable.dataset.id = cable.id;

        cable.style.position = "absolute";
        cable.style.transformOrigin = "0 50%";

        cable.style.objectFit = "fill";

        cable.draggable = false;

        cable.style.pointerEvents = "none";

        cable.style.height = "12px";
        cable.style.borderRadius = "10%";

        content.appendChild(cable);

        attached = component;

        checkAttachedCable(event);
    });

    let compType = "";
    let compVal = 0;
    // mengubah id pada editor menjadi id pada circuit
    switch(component.children[0].dataset.type){
        case "wire":
            compType = "Wire";
            compVal = 0;
            break;

        case "battery":
            compType = "Battery";
            compVal = 12;
            break;

        case "resistor":
            compType = "Resistor";
            compVal = 10;
            break;

        case "switch-off":
        case "switch-on":
            compType = "Switch";
            compVal = 0;
            break;

        case "bulb":
            compType = "Bulb";
            compVal = 10;
            break;
    }

    component.dataset.id = component.id;
    registerComponent(component.id, compType, compVal, null, null);
}

window.addEventListener("pointermove", (event) => {
    // deteksi pergerakan mouse (narik kabel)
    if(isConnecting && attached){
        checkAttachedCable(event);
        return;
    }

    // deteksi pergerakan mouse (rotate komponen)
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
                attached = null;
            }
        } catch (e) {
            attached = null;
        }
    }
})

// menyesuaikan posisi dan panjang kabel dengan mouse (saat narik kabel)
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

// menyesuaikan posisi dan panjang kabel dengan pointer komponen
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
    // kalo batalin toggle wire, bakal hapus attachment saat ini
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

    // saat berhasil sambungan kabel antar 2 komponen
    if(attached && attached2){
        if(cable){
            const leftPointer = attached.getElementsByClassName("left-pointer")[0];
            const rightPointer = attached2.getElementsByClassName("right-pointer")[0];

            leftPointer.cable = cable;
            rightPointer.cable = cable;

            cable.leftPointer = leftPointer;
            cable.rightPointer = rightPointer;

            updateCablePos(cable, leftPointer, rightPointer);

            cable.style.pointerEvents = "auto";

            cable.style.userSelect = "none";
            cable.draggable = false;

            const cableRef = cable;
            cableRef.addEventListener("click", () => {
                if(isDeleting){
                    removeComponent(cableRef);
                }
            })
        }

        connectNodes(cable.id, attached.id, attached2.id);

        attached = null;
        attached2 = null;

        cable = null;
    }
}

function removeComponent(component){
    toggleDeleting();

    // kalo hapus kabel, bakal langsung hilangkan attachment pointer
    if(component.dataset.type === "wire"){
        component.leftPointer.cable = null;
        component.rightPointer.cable = null;

        unregisterComponent(component.id);
        component.remove();
        return;
    }

    // pengecekan pointer kiri, jika ada attachment kabel maka akan dihapus
    const leftPointer = component.getElementsByClassName("left-pointer")[0];
    if(leftPointer && leftPointer.cable){
        const rightSide = leftPointer.cable.rightPointer;
        if(rightSide)rightSide.cable = null;

        unregisterComponent(leftPointer.cable.id);
        leftPointer.cable.remove();
    }

    // pengecekan pointer kanan, jika ada attachment kabel maka akan dihapus
    const rightPointer = component.getElementsByClassName("right-pointer")[0];
    if(rightPointer && rightPointer.cable){
        const leftSide = rightPointer.cable.leftPointer;
        if(leftSide)leftSide.cable = null;

        unregisterComponent(rightPointer.cable.id);
        rightPointer.cable.remove();
    }

    unregisterComponent(component.id);
    component.remove();
}

export function toggleConnecting(){
    // mencegah toggle agar tidak tabrakan
    if(isRotating)toggleRotating();
    if(isDeleting)toggleDeleting();

    isConnecting = !isConnecting;

    if(wireElement){
        wireElement.style.backgroundSize = isConnecting ? "100% 80%" : "0";
    }

    checkConnector();
}

export function toggleRotating(){
    // mencegah toggle agar tidak tabrakan
    if(isConnecting)toggleConnecting();
    if(isDeleting)toggleDeleting();

    isRotating = !isRotating;

    if(rotateElement){
        rotateElement.style.borderRadius = "100%";
        rotateElement.style.backgroundSize = isRotating ? "100% 90%" : "0";
    }
}

export function toggleDeleting(){
    // mencegah toggle agar tidak tabrakan
    if(isConnecting)toggleConnecting();
    if(isRotating)toggleRotating();

    isDeleting = !isDeleting;

    if(deleteElement){
        deleteElement.style.backgroundSize = isDeleting ? "100% 100%" : "0";
    }
}

export function onClear(){
    // nonaktifkan tiap toggle sebelum clear
    if(isConnecting)toggleConnecting();
    if(isRotating)toggleRotating();
    if(isDeleting)toggleDeleting();

    [...content.children].forEach((element) => {
        try {
            if(element.dataset.type || element.children[0].dataset.type){
                removeComponent(element);
            }
        } catch(err){}
    });
}