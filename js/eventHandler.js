window.addEventListener('keydown', (e) => {
  document.getElementById('keyField').textContent = `↓ ${e.code}`;

  const keyboardTypes = ['mac-ansi', 'mac-iso', 'mac-jis', 'win-ansi', 'win-iso', 'win-abnt', 'win-ks', 'win-jis'];
  for (let item of keyboardTypes) {
    const targetKey = document.getElementById(`${item}-${e.code}`);
    if (targetKey)
      targetKey.classList.add('pressed');
  }

  if (document.querySelector('dialog[open]'))
    return;

  if (e.code === 'Backspace') {
    if (currentInputSource.composer && currentInputSource.composer.composing) {
      const buffer = currentInputSource.composer.composingBuffer;
      buffer.splice(buffer.length - 1, 1);
      if (buffer.length < 1)
        currentInputSource.composer.composing = false;
    } else {
      endCaretPosition = Math.max(0, endCaretPosition - 1);
      processedText.splice(endCaretPosition, 1);
      beginCaretPosition = endCaretPosition;
    }
  } else if (e.code === 'Delete') {
    if (currentInputSource.composer) {
      if (currentInputSource.composer.composing) {
        const composingResult = currentInputSource.composer.endCompose();
        processedText.splice(endCaretPosition, 0, ...composingResult);
        endCaretPosition += composingResult.length;
        beginCaretPosition = endCaretPosition;
      }
    }
    processedText.splice(endCaretPosition, 1);
  } else if (e.code === 'Tab') {
    if (currentInputSource.composer) {
      if (currentInputSource.composer.composing) {
        const composingResult = currentInputSource.composer.endCompose();
        processedText.splice(endCaretPosition, 0, ...composingResult);
        endCaretPosition += composingResult.length;
        beginCaretPosition = endCaretPosition;
      }
    }
    processedText.splice(endCaretPosition, 0, '\t');
    endCaretPosition++;
    beginCaretPosition = endCaretPosition;
  } else if (e.code === 'Enter') {
    if (currentInputSource.composer) {
      if (currentInputSource.composer.composing) {
        const composingResult = currentInputSource.composer.endCompose();
        processedText.splice(endCaretPosition, 0, ...composingResult);
        endCaretPosition += composingResult.length;
        beginCaretPosition = endCaretPosition;
      }
    }
    processedText.splice(endCaretPosition, 0, '\n');
    endCaretPosition++;
    beginCaretPosition = endCaretPosition;
  } else if (e.code === 'ArrowLeft') {
    if (currentInputSource.composer) {
      if (currentInputSource.composer.composing) {
        const composingResult = currentInputSource.composer.endCompose();
        processedText.splice(endCaretPosition, 0, ...composingResult);
        endCaretPosition += composingResult.length;
        beginCaretPosition = endCaretPosition;
      }
    }
    if (e.shiftKey) {
      switch (caretDirection) {
        case 1:
          endCaretPosition--;
          caretDirection = beginCaretPosition === endCaretPosition ? 0 : 1;
          break;
        default:
          beginCaretPosition = Math.max(0, beginCaretPosition - 1);
          caretDirection = beginCaretPosition === endCaretPosition ? 0 : -1;
      }
    } else {
      switch (caretDirection) {
        case -1:
          endCaretPosition = beginCaretPosition;
        case 1:
          break;
        default:
          endCaretPosition = Math.max(beginCaretPosition - 1, 0);
      }
      caretDirection = 0;
      beginCaretPosition = endCaretPosition;
    }
  } else if (e.code === 'ArrowRight') {
    if (currentInputSource.composer) {
      if (currentInputSource.composer.composing) {
        const composingResult = currentInputSource.composer.endCompose();
        processedText.splice(endCaretPosition, 0, ...composingResult);
        endCaretPosition += composingResult.length;
        beginCaretPosition = endCaretPosition;
      }
    }
    if (e.shiftKey) {
      switch (caretDirection) {
        case -1:
          beginCaretPosition++;
          caretDirection = beginCaretPosition === endCaretPosition ? 0 : -1;
          break;
        default:
          endCaretPosition = Math.min(processedText.length, endCaretPosition + 1);
          caretDirection = beginCaretPosition === endCaretPosition ? 0 : 1;
      }
    } else {
      switch (caretDirection) {
        case -1:
          endCaretPosition = beginCaretPosition;
        case 1:
          break;
        default:
          endCaretPosition = Math.min(endCaretPosition + 1, processedText.length);
      }
      caretDirection = 0;
      beginCaretPosition = endCaretPosition;
    }
  } else if (['ShiftLeft', 'ShiftRight', 'AltLeft', 'AltRight', 'ControlLeft', 'ControlRight', 'MetaLeft', 'MetaRight'].includes(e.code)) {
    ;
  } else if (['Escape'].includes(e.code)) {
    if (currentInputSource.composer) {
      const composingResult = currentInputSource.composer.endCompose();
      processedText.splice(endCaretPosition, 0, ...composingResult);
      endCaretPosition += composingResult.length;
      beginCaretPosition = endCaretPosition;
    }
  } else {
    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyA') {
      // 전체 선택 단축키
      e.preventDefault();
      beginCaretPosition = 0;
      endCaretPosition = processedText.length;
      caretDirection = 1;
    } else if ((e.ctrlKey || e.metaKey) && e.code === 'KeyC') {
      // 복사 단축키
      e.preventDefault();
      if (beginCaretPosition === endCaretPosition) {
        // 전체 복사
        navigator.clipboard.writeText(processedText.join(''));
      } else {
        // 선택 영역 복사
        navigator.clipboard.writeText(processedText.slice(beginCaretPosition, endCaretPosition).join(''));
      }
    } else {
      if (e.metaKey || e.ctrlKey)
        return;
      e.preventDefault();

      // 문자 입력 키를 누른 경우
      const key = currentInputSource.keys[e.code] || fallBackInputSource.keys[e.code];
      if (key) { // if statement used to filter 'undefined' case; occured by caps-lock key on mac used as input source changer
        let keyValue;
        if (e.altKey && e.shiftKey)
          keyValue = key.getKeyValues()[key.getKeyValues().length - 1];
        else if (e.altKey && !e.shiftKey)
          keyValue = key.getKeyValues().length > 2 ? key.getKeyValues()[2] : key.getKeyValues()[0];
        else if (!e.altKey && e.shiftKey && key.getKeyValues().length > 1)
          keyValue = key.getKeyValues()[1];
        else
          keyValue = key.getKeyValues()[0];
        switch (keyValue.type) {
        case 1:
          break;

        case 2:
          currentInputSource.composer.composing = true;
          currentInputSource.composer.composingBuffer.push({value: keyValue.value, position: keyValue.position});
          break;
        
        default:
          if (currentInputSource.composer) {
            if (currentInputSource.composer.composing) {
              const composingResult = currentInputSource.composer.endCompose();
              processedText.splice(endCaretPosition, 0, ...composingResult);
              endCaretPosition += composingResult.length;
              beginCaretPosition = endCaretPosition;
            }
          }
          processedText.splice(endCaretPosition, 0, keyValue.value);
          endCaretPosition++;
          beginCaretPosition = endCaretPosition;
        }
      }
    }
  }

  /* 처리된 텍스트를 표시 */
  const preCaretText = processedText.slice(0, beginCaretPosition).join('');
  const preCaretElement = document.createElement('span');
  preCaretElement.textContent = preCaretText;

  const selectedText = processedText.slice(beginCaretPosition, endCaretPosition).join('');
  const selectedTextElement = document.createElement('span');
  selectedTextElement.classList.add('caret');
  selectedTextElement.textContent = selectedText;
  
  const postCaretText = processedText.slice(endCaretPosition).join('');
  const postCaretElement = document.createElement('span');
  postCaretElement.textContent = postCaretText;

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
  processedTextElement.append(selectedTextElement);
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