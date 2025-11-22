class InputSource {
  constructor (o) {
    try {
      this.identifier = o.identifier;
      this.langid = o.langid;

      this.keys = {};
      for (let code in o.keys) {
        const keyValues = o.keys[code];
        this.keys[code] = [];
        for (let keyValue of keyValues) {
          const keyValueObj = new KeyValue(keyValue);
          this.keys[code].push(keyValueObj);
        }
      }

      this.composingRules = new ComposingRules();
      if (o.composingRulePresets) {
        for (let presetName of o.composingRulePresets) {
          let preset = ComposingRulePresets[presetName];
          if (!preset) {
            const promise = getComposingRulePreset(presetName);
            promise.then(() => {
              preset = ComposingRulePresets[presetName];
              this.composingRules.addRules(preset);
            })
          } else
            this.composingRules.addRules(preset);
        }
      }
      if (o.composingRules)
        this.composingRules.addRules(o.composingRules);

      this.composer = o.composer ? Composers[o.composer] : undefined;
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  }

  showLayout () {
    const oss = ['mac', 'win'];
    const layouts = {mac: ['ansi', 'iso', 'jis'], win: ['ansi', 'iso', 'abnt', 'ks', 'jis']};

    for (let os of oss) {
      for (let layout of layouts[os]) {
        for (let code in this.keys) {
          if (
            !code.includes('Key') && !code.includes('Digit')
            && !code.includes('Intl') && !code.includes('Bracket')
            && !['Backquote', 'Backslash', 'Comma', 'Period', 'Slash', 'Equal', 'Minus', 'Semicolon', 'Quote'].includes(code)
          )
            continue;

          const keyValues = this.keys[code];
          const keyNode = document.getElementById(`${os}-${layout}-${code}`);
          if (keyNode) {
            keyNode.innerHTML = '';
            if (keyValues.length < 2 || !keyValues[1].label) {
              const span = document.createElement('span');
              span.classList.add('layersZeroOne');
              span.textContent = keyValues[0].label;
              keyNode.append(span);
            } else if (!keyValues[0].label) {
              const span = document.createElement('span');
              span.classList.add('layersZeroOne');
              span.textContent = keyValues[1].label;
              keyNode.append(span);
            } else {
              const span1 = document.createElement('span');
              span1.classList.add('layerOne');
              span1.textContent = keyValues[1].label;
              keyNode.append(span1);
              const span0 = document.createElement('span');
              span0.classList.add('layerZero');
              span0.textContent = keyValues[0].label;
              keyNode.append(span0);
            }
            if (keyValues.length > 2) {
              const span = document.createElement('span');
              span.classList.add('layerTwo');
              span.textContent = keyValues[2].label;
              keyNode.append(span);
            }
            if (keyValues.length > 3) {
              const span = document.createElement('span');
              span.classList.add('layerThree');
              span.textContent = keyValues[3].label;
              keyNode.append(span);
            }
          }
        }
      }
    }
  }
}

class KeyValue {
  constructor (o) {
    this.character = o.character === undefined ? o.value === undefined || o.value < 0 ? undefined : String.fromCharCode(o.value) : o.character;
    this.label = (o.label || o.character || '').trim();
    this.type = o.type || KeyType.char;
    this.subtype = o.subtype;
    this.value = o.value === undefined ? o.character === undefined ? undefined : o.character.codePointAt(0) : o.value;

    if (this.character === undefined && [KeyType.char, KeyType.dead, KeyType.composeChar].includes(this.type))
      throw new Error('Character value for current key is not given.');
  }
}

class ComposingRules {
  constructor (rules = []) {
    this.length = 0;
    try {
      this.addRules(rules);
    } catch (err) {
      console.error(err);
    }
  }

  addRule (rule) {
    this[this.length] = [[], []];
    for (let keyValue of rule[0])
      this[this.length][0].push(new KeyValue(keyValue));
    for (let keyValue of rule[1])
      this[this.length][1].push(new KeyValue(keyValue));

    this.length++;

    return this;
  }

  addRules (rules) {
    for (let rule of rules)
      this.addRule(rule);

    return this;
  }

  get (index) {
    return this[index];
  }

  [Symbol.iterator] () {
    let i = 0;
    return {
      next: () => {
        if (i < this.length)
          return {value: this[i++], done: false};
        else
          return {done: true};
      }
    }
  }

  getRule (givenBuffer) {
    const buffer = givenBuffer.slice();

    let result = undefined;
    for (let rule of this) {
      const sequence = rule[0];

      // 버퍼에 남은 글자들보다 확인할 문자열이 더 긴 경우: 실패
      if (sequence.length > buffer.length)
        continue;

      // 첫 글자부터 비교
      let match = true; // 현재 비교한 글자가 일치하는지 아닌지 체크
      for (let i = 0; i < sequence.length; i++) {
        const obj1 = structuredClone(sequence[i]);
        delete obj1.label;
        const json1 = JSON.stringify(Object.entries(obj1).sort());
        const obj2 = structuredClone(buffer[i]);
        delete obj2.label;
        const json2 = JSON.stringify(Object.entries(obj2).sort());
        match = json1 === json2;

        if (!match)
          break;
      }
      if (match) {
        result = rule;
        break;
      }
    }

    return result;
  }
}