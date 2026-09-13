// class untuk menangani perhitungan matematis dan graph circuit
class CircuitLogic {
  constructor() {
    // inisialisasi array komponen dan batas arus maksimal
    this.componentArray = [];
    this.maxCurrent = 3;
  }

  addComponent(id, type, value, nA, nB) {
    // menambahkan komponen ke dalam array (baterai, resistor, bohlam, switch)
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
    // menambahkan kabel ke dalam array sebagai komponen
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
    // menghapus komponen dari array berdasarkan id
    this.componentArray = this.componentArray.filter(
      (component) => component.id !== id,
    );
  }

  upDownSwitch(id, state) {
    // mengubah status on/off pada switch
    let switchComponent = this.componentArray.find(
      (component) => component.id === id,
    );
    if (switchComponent) switchComponent.value = state;
  }

  solveCircuit() {
    // auto-repair semua bohlam rusak 
    this.componentArray.forEach((component) => {
      if (component.type === "Bulb") {
        component.isBroken = false;
      }
    });

    // mencari semua baterai dalam circuit
    let batteries = this.componentArray.filter(
      (component) => component.type === "Battery",
    );

    // jika tidak ada baterai, mengembalikan nilai kosong
    if (batteries.length === 0) {
      return {
        currentValue: 0,
        actualPath: [],
        totalVoltage: 0,
        bulbs: [],
        isShortCircuit: false,
      };
    }

    // menyimpan semua loop yang ditemukan
    let foundLoopsArray = [];

    // mencari jalur dari semua baterai menggunakan DFS
    batteries.forEach((startBattery) => {
      // fungsi rekursif untuk menyelusuri jalur dari kabel dan komponen
      const depthFirstSearch = (
        currentComponentId,
        currentResistance,
        currentVoltage,
        visitedWires,
        pathComponents,
      ) => {
        // mencari kabel yang nyambung ke komponen saat ini dan belom dikunjungin
        let candidateWires = this.componentArray.filter(
          (component) =>
            component.type === "Wire" &&
            !visitedWires.has(component.id) &&
            (component.nA === currentComponentId ||
              component.nB === currentComponentId),
        );
        
        // cek tiap kabel yang nyambung
        for (let wire of candidateWires) {
          let nextComponentId =
            wire.nA === currentComponentId ? wire.nB : wire.nA;

          // kalo balik lagi ke baterai awal, berarti dapet 1 loop tertutup
          if (nextComponentId === startBattery.id && visitedWires.size >= 1) {
            foundLoopsArray.push({
              resistance: currentResistance,
              voltage: currentVoltage,
              componentsArray: [...pathComponents, wire],
            });
            continue;
          }

          // mencari komponen selanjutnya yang nyambung sama kabel
          let nextComponent = this.componentArray.find(
            (component) => component.id === nextComponentId,
          );
          // kalo komponennya ga ada, rusak, atau switch lagi off, stop penelusuran
          if (
            !nextComponent ||
            nextComponent.isBroken ||
            (nextComponent.type === "Switch" && nextComponent.value === 0)
          ) {
            continue;
          }

          // menghitung hambatan
          let resistance =
            nextComponent.type === "Resistor" ||
            nextComponent.type === "Bulb" ||
            nextComponent.type === "Wire"
              ? nextComponent.value
              : 0;
          // menghitung tegangan
          let voltage =
            nextComponent.type === "Battery" ? nextComponent.value : 0;

          // menandakan kabel sudah dilewatkan dan masukin ke path 
          visitedWires.add(wire.id);
          pathComponents.push(wire);
          pathComponents.push(nextComponent);

          // lanjut telusurin ke komponen berikutnya
          depthFirstSearch(
            nextComponentId,
            currentResistance + resistance,
            currentVoltage + voltage,
            visitedWires,
            pathComponents,
          );

          // backtrack jalur buat nyari rute lain
          visitedWires.delete(wire.id);
          pathComponents.pop();
          pathComponents.pop();
        }
      };
      // hambatan awal dari baterainya sendiri
      let initialResistance =
        startBattery.type === "Resistor" || startBattery.type === "Bulb"
          ? startBattery.value
          : 0;

      // mulai pencarian dari baterai
      depthFirstSearch(
        startBattery.id,
        initialResistance,
        startBattery.value,
        new Set(),
        [startBattery],
      );
    });

    // kalo tidak menemukan jalur tertutup sama sekali
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

    // cek setiap loop yang ketemu buat ngitung arus dan status komponen
    foundLoopsArray.forEach((circuitLoop) => {
      let loopResistance = circuitLoop.resistance;

      // kalo ga ada hambatan sama sekali, berarti korslet
      if (loopResistance === 0) {
        globalShortCircuit = true;
        loopResistance = 0.0001;
      }

      // ngitung arus pake hukum ohm
      let loopCurrentValue = circuitLoop.voltage / loopResistance;

      // kalo arusnya kegedean, bikin semua bohlam di loop ini jadi rusak
      if (loopCurrentValue > this.maxCurrent) {
        circuitLoop.componentsArray.forEach((circuitComponent) => {
          if (circuitComponent.type === "Bulb") {
            circuitComponent.isBroken = true;
          }
        });
        loopCurrentValue = 0;
      }

      // ngitung tingkat kecerahan tiap bohlam di loop ini
      circuitLoop.componentsArray.forEach((circuitComponent) => {
        if (circuitComponent.type === "Bulb") {
          let currentBrightness = circuitComponent.isBroken
            ? 0
            : Math.min(1.0, loopCurrentValue / this.maxCurrent);

          // kalo bohlam ada di beberapa loop, ambil kecerahan paling tinggi dan status rusaknya
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

    // ngumpulin hasil perhitungan bohlam jadi array
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

// class untuk sinkronisasi circuit dengan tampilan visual
class ComponentInteraction {
  // menghubungkan interaksi visual dengan instance CircuitLogic
  constructor(circuitLogic) {
    this.circuitLogic = circuitLogic;
  }

  handleSwitchToggle(switchId, element) {
    // pas switch di klik, ganti state dan gambar
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

  updateBoardFeedback() {
    // ngupdate gambar di canvas sesuai hasil perhitungan sirkuit
    const circuitResult = this.circuitLogic.solveCircuit();

    // balikin semua bohlam dan kabel ke gambar default/mati dulu
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

    // nampilin teks status sirkuit
    const statusDisplay = document.querySelector("#circuit-status");
    if (statusDisplay) {
      statusDisplay.textContent = circuitResult.isShortCircuit
        ? "SHORT CIRCUIT!"
        : "Normal";
    }

    // ngubah gambar bohlam sesuai tingkat kecerahan atau kalo rusak
    circuitResult.bulbs.forEach((bulb) => {
      const bulbElement = document.querySelector(`[data-id="${bulb.id}"]`);
      if (!bulbElement) return;

      const image = bulbElement.tagName === "IMG" ? bulbElement : bulbElement.querySelector("img");
      if (!image) return;

      if (bulb.isBroken) {
        image.src = "assets/overload.png";
      } else if (bulb.brightness >= 0.7) {
        image.src = "assets/light_high.png";
      } else if (bulb.brightness >= 0.35) {
        image.src = "assets/light_medium.png";
      } else if (bulb.brightness >= 0.1) {
        image.src = "assets/light_low.png";
      } else {
        image.src = "assets/light_off.png";
      }
    });

    return circuitResult;
  }
}

// inisialisasi class logika sirkuit dan interaksi UI
const circuitLogic = new CircuitLogic();
const componentInteraction = new ComponentInteraction(circuitLogic);

// wrapper buat nambah komponen dari editor
export function registerComponent(id, type, value, nA, nB) {
  circuitLogic.addComponent(id, type, value, nA, nB);
  return componentInteraction.updateBoardFeedback();
}

// wrapper buat nyambungin kabel antar komponen
export function connectNodes(id, nA, nB) {
  circuitLogic.addWire(id, nA, nB);
  return componentInteraction.updateBoardFeedback();
}

// wrapper buat ngeklik switch
export function toggleSwitch(id, element) {
  return componentInteraction.handleSwitchToggle(id, element);
}

// wrapper buat ngehapus komponen dari sirkuit
export function unregisterComponent(id) {
  circuitLogic.removeComponent(id);
  return componentInteraction.updateBoardFeedback();
}