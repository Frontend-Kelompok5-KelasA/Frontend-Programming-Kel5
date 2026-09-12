document.addEventListener('DOMContentLoaded', function() {
    const button = document.querySelector('#masuk');

    button.addEventListener('click', function() {
        window.location.href = 'home.html';
        console.log('Button clicked!');
    });
 
});

class CircuitLogic {
    constructor() {
        this.componentArray = [];
        this.maxCurrent = 2;
    }

addComponent(id, type, value, nA, nB) {
    this.componentArray.push({ 
        id, type, value, nA, nB, 
        isBroken: false
    });
}

removeComponent(id) {
    this.componentArray = this.componentArray.filter(component => component.id !== id);
}

clearCircuit() {
    this.componentArray = [];
}

upDownSwitch(id, state) {
    let switchComponent = this.componentArray.find(component => component.id === id);
    if (switchComponent) switchComponent.value = state;
} 

repairBulb() {
    this.componentArray.forEach(component => {
        if (component.type === 'Bulb') component.isBroken = false;
    });
}

solveCircuit() {
    let batteries = this.componentArray.filter(component => component.type === 'Battery');
    if (batteries.length === 0) return { currentValue: 0, actualPath: [], totalVoltage: 0, bulbs: [], isShortCircuit: false };

    let startBattery = batteries[0];
    let start = startBattery.nA;
    let end = startBattery.nB;

    let visitedNodes = new Set();
    let totalResistance = 0;
    let totalVoltage = startBattery.value;
    let isLoop = false;
    let actualPath = [];
    
    const dfs = (currentNode, currentResistance, currentVoltage, path) => {
        if (currentNode === end) {
            isLoop = true;
            totalResistance = currentResistance;
            totalVoltage = currentVoltage;
            actualPath = [startBattery, ...path];
            return;
        }

        visitedNodes.add(currentNode);
    
        for (let component of this.componentArray) {
            if (component.nA === currentNode || component.nB === currentNode) {

                if (component.id === startBattery.id) continue;
                if (component.isBroken || component.type === 'Switch' && component.value === 0) continue;
                
                let nextNode = (currentNode === component.nA) ? component.nB : component.nA;
                
                if (!visitedNodes.has(nextNode)) {
                    let resistance = (component.type === 'Resistor' || component.type === 'Bulb' || component.type === 'Wire') ? component.value : 0;
                    let voltage = (component.type === 'Battery') ? component.value : 0;

                    path.push(component);
                    dfs(nextNode, currentResistance + resistance, currentVoltage + voltage, path);
                    path.pop();
                }
            }
            if (isLoop) return;
        }
    };

    dfs(start, 0, startBattery.value, []);

    if (!isLoop) return { currentValue: 0, actualPath: [], totalVoltage: 0, bulbs: [], isShortCircuit: false };
    let isShortCircuit = false;
    if (totalResistance === 0) {
        isShortCircuit = true;
        totalResistance = 0.0001;
    }

    let currentValue = totalVoltage / totalResistance;

    if (currentValue > this.maxCurrent) {
        actualPath.forEach(component => {
            if (component.type === 'Bulb') component.isBroken = true;
        });
        currentValue = 0;
    }

    let bulbs = actualPath
        .filter(component => component.type === 'Bulb')
        .map(bulb => ({
            id: bulb.id,
            isBroken: bulb.isBroken,
            brightness: bulb.isBroken ? 0 : Math.min(1.0, currentValue / this.maxCurrent)
        }));
    return { currentValue, actualPath, totalVoltage, bulbs, isShortCircuit };
    }
}