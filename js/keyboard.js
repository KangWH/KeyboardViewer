class InputSource {
  constructor (name, script, language, keys, noWin = false, noMac = false) {
    this.name = name;
    this.script = script;
    this.language = language;
    this.keys = keys;
    this.noWin = noWin;
    this.noMac = noMac;
  }

  load (showAll = false) {
    const oss = ['mac', 'win'];
    if (this.noWin)
      oss.splice(1, 1);
    if (this.noMac)
      oss.splice(0, 1);
    const layouts = {mac: ['ansi', 'iso', 'jis'], win: ['ansi', 'iso', 'abnt', 'ks', 'jis']};

    for (let os of oss) {
      for (let layout of layouts[os]) {
        for (let code in this.keys) {
          const keyObject = this.keys[code];
          const keyNode = document.getElementById(`${os}-${layout}-${code}`);
          if (keyNode) {
            const labels = keyObject.getKeyLabels(os, layout, showAll);
            keyNode.innerHTML = labels.join('');
            keyNode.classList.toggle('singleLabel', labels.length < 2);
          }
        }
      }
    }
  }
}

class Key {
  constructor (code, values) {
    this.code = code;
    this.values = values;
  }
  /* Specification of values
   * Key: `${os}-${layout}` or `${os}` or 'default'
   * Value: Array of KeyValue's
   * Index means the layer of the key, or the modifiers pressed
   * (0: No modifier, 1: Shift, 2: Alt Gr/Option, 3: Alt Gr/Option + Shift)
   */

  getKeyLabels (os, layout, showAll = false) {
    const array = [];
    let osValueString = `${os}-${layout}`;
    if (this.values[osValueString] === undefined)
      osValueString = this.values[os] === undefined ? 'default' : os;

    if (showAll && this.values[osValueString].length > 2) {
      // Layers 2 and 3 are also shown
      if (this.values.length > 3) {
        const sanitizedLabel = this.values[osValueString][3].label
          .replaceAll('<', '&lt;')
          .replaceAll('>', '&gt;');
        array.push({class: 'layerThree', label: sanitizedLabel});
      }
      const sanitizedLabel = this.values[osValueString][2].label
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;');
      array.push({class: 'layerTwo', label: sanitizedLabel});
    }

    // Layers 0 and 1
    if (this.values[osValueString].length > 1) {
      if (this.values[osValueString][1].label === null) {
        const sanitizedLabel = this.values[osValueString][0].label
          .replaceAll('<', '&lt;')
          .replaceAll('>', '&gt;');
        array.push({class: 'layersZeroOne', label: sanitizedLabel});
      } else {
        const sanitizedLabel1 = this.values[osValueString][1].label
          .replaceAll('<', '&lt;')
          .replaceAll('>', '&gt;');
        array.push({class: 'layerOne', label: sanitizedLabel1});
        const sanitizedLabel0 = this.values[osValueString][0].label
          .replaceAll('<', '&lt;')
          .replaceAll('>', '&gt;');
        array.push({class: 'layerZero', label: sanitizedLabel0});
      }
    } else {
      const sanitizedLabel = this.values[osValueString][0].label
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;');
      array.push({class: 'layersZeroOne', label: sanitizedLabel});
    }
    const HTMLs = array.map((x) => `<span class="${x.class}">${x.label}</span>`);
    return HTMLs;
  }

  getKeyValues (os = 'mac', layout = 'ansi') {
    let osLayoutString = `${os}-${layout}`;
    if (this.values[osLayoutString] === undefined)
      osLayoutString = this.values[os] === undefined ? 'default' : os;
    return this.values[osLayoutString];
  }
}

class KeyValue {
  constructor (value, label = undefined, type = 0) {
    this.value = value;
    this.label = label === undefined ? value : label;
    // if label === undefined, it uses the same string of value
    // if label === null, label is hidden, and the label for lower layer is used
    // (useful for lowercase/uppercase pair)
    this.type = type;
    // 0: normal (direct letter input)
    // 1: dead
    // 2: compose
    // 3: change ime mode
    // 4: delete
    // 5: move caret
    // 6: change focus/insert tab
    // 7: end input/new line
  }
}
