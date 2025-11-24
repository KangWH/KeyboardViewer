class InputSource {
  constructor (o) {
    try {
      this.identifier = o.identifier;

      this.lang = o.lang;
      this.script = o.script;
      this.country = o.country;
      this.region = o.region;

      this.altGr = o.altGr === undefined ? false : o.altGr;
      this.sourceOS = o.sourceOS || 'general';

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
            }).catch((err) => {
              console.error(err);
            });
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
    for (let keyCell of document.querySelectorAll('.keyCell')) {
      keyCell.innerHTML = '';

      const keyCode = keyCell.id;
      const keyElement = document.createElement('div');
      keyElement.classList.add('key');
      keyCell.append(keyElement);
      
      const keyValues = this.keys[keyCode];
      if (keyValues === undefined)
        continue;

      for (let i = 0; i < keyValues.length; i++) {
        const keyLabelElement = document.createElement('span');
        keyLabelElement.classList.add('keyLabel');
        keyLabelElement.classList.add(`layer${i}`);
        keyLabelElement.textContent = keyValues[i].label;
        keyElement.append(keyLabelElement);

        if (keyValues[i].type === 'dead')
          keyLabelElement.classList.add('dead');
        else if (this.lang === 'ko' && keyValues[i].type === 'composeChar')
          keyLabelElement.classList.add(keyValues[i].subtype);
      }

      if (
        keyValues.length > 1
        && keyValues[0].type === keyValues[1].type
        && keyValues[0].subtype === keyValues[1].subtype
      ) {
        const char0 = keyValues[0].character;
        const char1 = keyValues[1].character;
        if (char0 === char1) {
          keyElement.querySelector('.layer0').remove();
          keyElement.querySelector('.layer1').classList.add('layer0');
        } else if (char0.toLowerCase() === char1.toLowerCase()) {
          if (char0.toLowerCase() === char0) {
            keyElement.querySelector('.layer0').classList.add('lowercase');
            keyElement.querySelector('.layer1').classList.add('uppercase');
          } else {
            keyElement.querySelector('.layer0').classList.add('uppercase');
            keyElement.querySelector('.layer1').classList.add('lowercase');
          }
        }
      }
      if (
        keyValues.length > 3
        && keyValues[2].type === keyValues[3].type
        && keyValues[2].subtype === keyValues[3].subtype
      ) {
        const char0 = keyValues[2].character;
        const char1 = keyValues[3].character;
        if (char0 === char1) {
          keyElement.querySelector('.layer2').remove();
          keyElement.querySelector('.layer3').classList.add('layer0');
        } else if (char0.toLowerCase() === char1.toLowerCase()) {
          console.log(char0, char1);
          if (char0.toLowerCase() === char0) {
            keyElement.querySelector('.layer2').classList.add('lowercase');
            keyElement.querySelector('.layer3').classList.add('uppercase');
          } else {
            keyElement.querySelector('.layer2').classList.add('uppercase');
            keyElement.querySelector('.layer3').classList.add('lowercase');
          }
        }
      }
    }

    document.getElementById('keyboard').classList.toggle('altGr', this.altGr);
    document.getElementById('keyboard').classList.toggle('japanese', ['kana', 'romaji'].includes(this.identifier));
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
      throw new Error('Character value for current key is not given: ' + JSON.stringify(o));
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