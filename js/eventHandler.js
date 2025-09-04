window.addEventListener('keydown', (e) => {
  if (!(e.keyCode === 82 && e.metaKey) && !(e.keyCode === 82 && e.ctrlKey))
    e.preventDefault();

  document.getElementById('keyField').textContent = `↓ ${e.code}`;

  const keyboardTypes = ['mac-ansi', 'mac-iso', 'mac-jis', 'win-ansi', 'win-iso', 'win-abnt', 'win-ks', 'win-jis'];
  for (let item of keyboardTypes) {
    const targetKey = document.getElementById(`${item}-${e.code}`);
    if (targetKey)
      targetKey.classList.add('pressed');
  }

  if (e.code === 'Backspace') {
    if (currentInputSource.composer && currentInputSource.composer.composing) {
      const buffer = currentInputSource.composer.composingBuffer;
      buffer.splice(buffer.length - 1, 1);
      if (buffer.length < 1)
        currentInputSource.composer.composing = false;
    } else {
      caretPosition = Math.max(0, caretPosition - 1);
      processedText.splice(caretPosition, 1);
    }
  } else if (e.code === 'Delete') {
    if (currentInputSource.composer) {
      if (currentInputSource.composer.composing) {
        const composingResult = currentInputSource.composer.endCompose();
        processedText.splice(caretPosition, 0, ...composingResult);
        caretPosition += composingResult.length;
      }
    }
    processedText.splice(caretPosition, 1);
  } else if (e.code === 'Tab') {
    if (currentInputSource.composer) {
      if (currentInputSource.composer.composing) {
        const composingResult = currentInputSource.composer.endCompose();
        processedText.splice(caretPosition, 0, ...composingResult);
        caretPosition += composingResult.length;
      }
    }
    processedText.splice(caretPosition, 0, '\t');
    caretPosition++;
  } else if (e.code === 'Enter') {
    if (currentInputSource.composer) {
      if (currentInputSource.composer.composing) {
        const composingResult = currentInputSource.composer.endCompose();
        processedText.splice(caretPosition, 0, ...composingResult);
        caretPosition += composingResult.length;
      }
    }
    processedText.splice(caretPosition, 0, '\n');
    caretPosition++;
  } else if (e.code === 'ArrowLeft') {
    if (currentInputSource.composer) {
      if (currentInputSource.composer.composing) {
        const composingResult = currentInputSource.composer.endCompose();
        processedText.splice(caretPosition, 0, ...composingResult);
        caretPosition += composingResult.length;
      }
    }
    caretPosition = Math.max(caretPosition - 1, 0);
  } else if (e.code === 'ArrowRight') {
    if (currentInputSource.composer) {
      if (currentInputSource.composer.composing) {
        const composingResult = currentInputSource.composer.endCompose();
        processedText.splice(caretPosition, 0, ...composingResult);
        caretPosition += composingResult.length;
      }
    }
    caretPosition = Math.min(caretPosition + 1, processedText.length);
  } else if (['ShiftLeft', 'ShiftRight', 'AltLeft', 'AltRight', 'ControlLeft', 'ControlRight', 'MetaLeft', 'MetaRight'].includes(e.code)) {
    ;
  } else if (['Escape'].includes(e.code)) {
    if (currentInputSource.composer) {
      const composingResult = currentInputSource.composer.endCompose();
      processedText.splice(caretPosition, 0, ...composingResult);
      caretPosition += composingResult.length;
    }
  } else {
    // 문자 입력 키를 누른 경우
    const key = currentInputSource.keys[e.code] || fallBackInputSource.keys[e.code];
    if (key) { // if statement used to filter 'undefined' case; occured by caps-lock key on mac used as input source changer
      let keyValue;
      if (e.shiftKey && key.getKeyValues().length > 1)
        keyValue = key.getKeyValues()[1];
      else
        keyValue = key.getKeyValues()[0];
      if (keyValue.type !== 2) {
        if (currentInputSource.composer) {
          if (currentInputSource.composer.composing) {
            const composingResult = currentInputSource.composer.endCompose();
            processedText.splice(caretPosition, 0, ...composingResult);
            caretPosition += composingResult.length;
          }
        }
        processedText.splice(caretPosition, 0, keyValue.value);
        caretPosition++;
      } else {
        currentInputSource.composer.composing = true;
        currentInputSource.composer.composingBuffer.push({value: keyValue.value, position: keyValue.position});
      }
    }
  }

  /* 처리된 텍스트를 표시 */
  const preCaretText = processedText.slice(0, caretPosition).join('');
  const preCaretElement = document.createElement('span');
  preCaretElement.textContent = preCaretText;
  
  const postCaretText = processedText.slice(caretPosition).join('');
  const postCaretElement = document.createElement('span');
  postCaretElement.textContent = postCaretText;

  const caretElement = document.createElement('span');
  caretElement.classList.add('caret');

  const composedTextElement = document.createElement('span');
  if (currentInputSource.composer && currentInputSource.composer.composing) {
    const currentlyComposedText = currentInputSource.composer.compose().join('');
    composedTextElement.classList.add('composing');
    composedTextElement.textContent = currentlyComposedText;
  }

  const processedTextElement = document.getElementById('processedText');
  processedTextElement.innerHTML = '';
  processedTextElement.append(preCaretElement);
  if (composedTextElement.textContent)
    processedTextElement.append(composedTextElement);
  processedTextElement.append(caretElement);
  processedTextElement.append(postCaretElement);
  
  /* 입력기가 처리 중인 텍스트를 표시 */
  if (currentInputSource.composer) {
    document.getElementById('wordBuffer').textContent = currentInputSource.composer.composingBuffer.map((x) => `${x.value}${x.position}`).join(' ');
    if (currentInputSource.composer.composingBuffer.length < 1) {
      document.getElementById('wordBuffer').innerHTML = '&nbsp;';
    }
  }
});

window.addEventListener('keyup', (e) => {
  e.preventDefault();

  document.getElementById('keyField').textContent = `↑ ${e.code}`;

  const keyboardTypes = ['mac-ansi', 'mac-iso', 'mac-jis', 'win-ansi', 'win-iso', 'win-abnt', 'win-ks', 'win-jis'];
  for (let item of keyboardTypes) {
    const targetKey = document.getElementById(`${item}-${e.code}`);
    if (targetKey)
      targetKey.classList.remove('pressed');
  }
});

for (let button of document.querySelectorAll('button[aria-controls]')) {
  const dialogId = button.getAttribute('aria-controls');
  const dialog = document.getElementById(dialogId);
  if (dialog && dialog.nodeName === 'DIALOG') {
    button.addEventListener('click', (e) => {dialog.showModal()});
  }
}

const initializeInputSourceSelector = (sources = inputSources) => {
  const scripts = new Set();
  for (let source of Object.values(sources))
    scripts.add(source.script);
  
  const form = document.getElementById('inputSourceSelector-form');
  form.script.innerHTML = '';
  form.language.innerHTML = '';
  form.name.innerHTML = '';

  for (let script of scripts) {
    const option = document.createElement('option');
    option.textContent = script;
    form.script.append(option);
  }
  form.script.value = '';
}
const updateScriptInputSourceSelector = (sources = inputSources) => {
  const form = document.getElementById('inputSourceSelector-form');

  const script = form.script.value;

  form.language.innerHTML = '';
  form.name.innerHTML = '';

  const languages = new Set();
  for (let source of Object.values(sources).filter((x) => x.script === script))
    languages.add(source.language);

  for (let language of languages) {
    const option = document.createElement('option');
    option.textContent = language;
    form.language.append(option);
  }
  form.language.value = '';
}
const updateLanguageInputSourceSelector = (sources = inputSources) => {
  const form = document.getElementById('inputSourceSelector-form');

  const script = form.script.value;
  const language = form.language.value;

  form.name.innerHTML = '';

  const names = new Set();
  for (let source of Object.values(sources).filter((x) => x.script === script && x.language === language))
    names.add(source.name);

  for (let name of names) {
    const option = document.createElement('option');
    option.textContent = name;
    form.name.append(option);
  }
  form.name.value = '';
}

document.querySelector('button[aria-controls="inputSourceSelector-dialog"]').addEventListener('click', (e) => {initializeInputSourceSelector(inputSources)});
document.getElementById('inputSourceSelector-form').addEventListener('change', (e) => {
  if (e.target === e.currentTarget.script)
    updateScriptInputSourceSelector(inputSources);
  else if (e.target === e.currentTarget.language)
    updateLanguageInputSourceSelector(inputSources);
});

document.getElementById('inputSourceSelector-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const form = e.currentTarget;
  if (form.script.value && form.language.value && form.name.value) {
    const source = Object.values(inputSources).filter((x) => x.script === form.script.value && x.language === form.language.value && x.name === form.name.value)[0];
    setInputSource(source);

    document.getElementById('inputSourceSelector-dialog').close();
  }
})

document.getElementById('inputSourceSelector-form').cancel.addEventListener('click', (e) => {
  document.getElementById('inputSourceSelector-dialog').close();
})