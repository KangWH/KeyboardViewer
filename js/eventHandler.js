let caretPosition = 0;
const processedText = [];
let currentInputSource;

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