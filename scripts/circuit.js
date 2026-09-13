class CircuitLogic {
  constructor() {
    this.componentArray = [];
    this.maxCurrent = 3;
  }

  addComponent(id, type, value, nA, nB) {
    this.componentArray.push({
      id,
      type,
      value,
      nA,
      nB,
      isBroken: false,
    });
  }

  addWire(id, nA, nB) {
    this.componentArray.push({
      id,
      type: "Wire",
      value: 0,
      nA,
      nB,
      isBroken: false,
    });
  }

  removeComponent(id) {
    this.componentArray = this.componentArray.filter(
      (component) => component.id !== id,
    );
  }

  clearCircuit() {
    this.componentArray = [];
  }

  upDownSwitch(id, state) {
    let switchComponent = this.componentArray.find(
      (component) => component.id === id,
    );
    if (switchComponent) switchComponent.value = state;
  }

  repairBulb() {
    this.componentArray.forEach((component) => {
      if (component.type === "Bulb") component.isBroken = false;
    });
  }

solveCircuit() {
    this.componentArray.forEach((component) => {
    if (component.type === "Bulb") {
      component.isBroken = false;
    }
  });
  
    let batteries = this.componentArray.filter(
      (component) => component.type === "Battery",
    );

    if (batteries.length === 0) {
      return {
        currentValue: 0,
        actualPath: [],
        totalVoltage: 0,
        bulbs: [],
        isShortCircuit: false,
      };
    }

    let foundLoopsArray = [];

    batteries.forEach((startBattery) => {
      const depthFirstSearch = (
        currentComponentId,
        currentResistance,
        currentVoltage,
        visitedWires,
        pathComponents,
      ) => {
        let candidateWires = this.componentArray.filter(
          (component) =>
            component.type === "Wire" &&
            !visitedWires.has(component.id) &&
            (component.nA === currentComponentId ||
              component.nB === currentComponentId),
        );

        for (let wire of candidateWires) {
          let nextComponentId =
            wire.nA === currentComponentId ? wire.nB : wire.nA;

          if (nextComponentId === startBattery.id && visitedWires.size >= 1) {
            foundLoopsArray.push({
              resistance: currentResistance,
              voltage: currentVoltage,
              componentsArray: [...pathComponents, wire],
            });
            continue;
          }

          let nextComponent = this.componentArray.find(
            (component) => component.id === nextComponentId,
          );
          if (
            !nextComponent ||
            nextComponent.isBroken ||
            (nextComponent.type === "Switch" && nextComponent.value === 0)
          ) {
            continue;
          }

          let resistance =
            nextComponent.type === "Resistor" ||
            nextComponent.type === "Bulb" ||
            nextComponent.type === "Wire"
              ? nextComponent.value
              : 0;
          let voltage =
            nextComponent.type === "Battery" ? nextComponent.value : 0;

          visitedWires.add(wire.id);
          pathComponents.push(wire);
          pathComponents.push(nextComponent);

          depthFirstSearch(
            nextComponentId,
            currentResistance + resistance,
            currentVoltage + voltage,
            visitedWires,
            pathComponents,
          );

          visitedWires.delete(wire.id);
          pathComponents.pop();
          pathComponents.pop();
        }
      };

      let initialResistance =
        startBattery.type === "Resistor" || startBattery.type === "Bulb"
          ? startBattery.value
          : 0;

      depthFirstSearch(
        startBattery.id,
        initialResistance,
        startBattery.value,
        new Set(),
        [startBattery],
      );
    });

    if (foundLoopsArray.length === 0) {
      return {
        currentValue: 0,
        actualPath: [],
        totalVoltage: 0,
        bulbs: [],
        isShortCircuit: false,
      };
    }

    let globalShortCircuit = false;
    let bulbDictionary = new Map();

    foundLoopsArray.forEach((circuitLoop) => {
      let loopResistance = circuitLoop.resistance;

      if (loopResistance === 0) {
        globalShortCircuit = true;
        loopResistance = 0.0001;
      }

      let loopCurrentValue = circuitLoop.voltage / loopResistance;

      if (loopCurrentValue > this.maxCurrent) {
        circuitLoop.componentsArray.forEach((circuitComponent) => {
          if (circuitComponent.type === "Bulb") {
            circuitComponent.isBroken = true;
          }
        });
        loopCurrentValue = 0;
      }

      circuitLoop.componentsArray.forEach((circuitComponent) => {
        if (circuitComponent.type === "Bulb") {
          let currentBrightness = circuitComponent.isBroken
            ? 0
            : Math.min(1.0, loopCurrentValue / this.maxCurrent);

          if (bulbDictionary.has(circuitComponent.id)) {
            let existingBulb = bulbDictionary.get(circuitComponent.id);
            existingBulb.isBroken =
              existingBulb.isBroken || circuitComponent.isBroken;
            existingBulb.brightness = existingBulb.isBroken
              ? 0
              : Math.max(existingBulb.brightness, currentBrightness);
          } else {
            bulbDictionary.set(circuitComponent.id, {
              id: circuitComponent.id,
              isBroken: circuitComponent.isBroken,
              brightness: currentBrightness,
            });
          }
        }
      });
    });

    let finalBulbsArray = Array.from(bulbDictionary.values());

    return {
      currentValue: 0,
      actualPath: [],
      totalVoltage: 0,
      bulbs: finalBulbsArray,
      isShortCircuit: globalShortCircuit,
    };
  }
}

class ComponentInteraction {
  constructor(circuitLogic) {
    this.circuitLogic = circuitLogic;
  }

    handleSwitchToggle(switchId, element) {
    let switchComponent = this.circuitLogic.componentArray.find(
      (component) => component.id === switchId,
    );
    if (!switchComponent || switchComponent.type !== "Switch") return;

    let newState = switchComponent.value === 1 ? 0 : 1;
    this.circuitLogic.upDownSwitch(switchId, newState);

    if (newState === 1) {
      element.src = "assets/switch_on.png";
      element.dataset.type = "switch-on";
    } else {
      element.src = "assets/switch_off.png";
      element.dataset.type = "switch-off";
    }

    this.updateBoardFeedback();
  }

  handleBulbClick(bulbId) {
    let bulbComponent = this.circuitLogic.componentArray.find(
      (component) => component.id === bulbId,
    );
    if (bulbComponent && bulbComponent.isBroken) {
      bulbComponent.isBroken = false;
      this.updateBoardFeedback();
    }
  }

  handleValueChange(componentId, newValue) {
    let targetComponent = this.circuitLogic.componentArray.find(
      (component) => component.id === componentId,
    );
    if (targetComponent) {
      targetComponent.value = parseFloat(newValue) || 0;
      this.updateBoardFeedback();
    }
  }

  updateBoardFeedback() {
    const circuitResult = this.circuitLogic.solveCircuit();

    this.circuitLogic.componentArray.forEach((component) => {
      const element = document.querySelector(`[data-id="${component.id}"]`);
      if (!element) return;

      const image = element.tagName === "IMG" ? element : element.querySelector("img");
      if (!image) return;

      if (component.type === "Bulb") {
        image.src = "assets/light_off.png";
      } else if (component.type === "Wire") {
        image.src = "assets/wire.png";
      }
    });

    const statusDisplay = document.querySelector("#circuit-status");
    if (statusDisplay) {
      statusDisplay.textContent = circuitResult.isShortCircuit
        ? "SHORT CIRCUIT!"
        : "Normal";
    }

    circuitResult.bulbs.forEach((bulb) => {
      const bulbElement = document.querySelector(`[data-id="${bulb.id}"]`);
      if (!bulbElement) return;

      const image = bulbElement.tagName === "IMG" ? bulbElement : bulbElement.querySelector("img");
      if (!image) return;

      if (bulb.isBroken) {
        image.src = "assets/overload.png";
      } else if (bulb.brightness > 0) {
        if (bulb.brightness >= 0.7) {
          image.src = "assets/light_high.png";
        } else if (bulb.brightness >= 0.35) {
          image.src = "assets/light_medium.png";
        } else {
          image.src = "assets/light_low.png";
        }
      }
    });

    return circuitResult;
  }
}

const circuitLogic = new CircuitLogic();
const componentInteraction = new ComponentInteraction(circuitLogic);

export function registerComponent(id, type, value, nA, nB) {
  circuitLogic.addComponent(id, type, value, nA, nB);
  return componentInteraction.updateBoardFeedback();
}

export function connectNodes(id, nA, nB) {
  circuitLogic.addWire(id, nA, nB);
  return componentInteraction.updateBoardFeedback();
}

export function toggleSwitch(id, element) {
  return componentInteraction.handleSwitchToggle(id, element);
}

export function unregisterComponent(id) {
  circuitLogic.removeComponent(id);
  return componentInteraction.updateBoardFeedback();
}

export function clickBulb(id) {
  return componentInteraction.handleBulbClick(id);
}