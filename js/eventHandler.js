window.addEventListener('keydown', (e) => {
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
});

document.getElementById('inputSourceSelector-form').cancel.addEventListener('click', (e) => {
  document.getElementById('inputSourceSelector-dialog').close();
});

// 클릭한 지점으로 캐럿 이동
let dragging = false;
document.getElementById('processedText').addEventListener('mousedown', (e) => {
  const x = e.clientX;
  const y = e.clientY;

  let textNode, offset;
  if (document.caretPositionFromPoint) {
    const caretPosition = document.caretPositionFromPoint(x, y);
    textNode = caretPosition.offsetNode;
    offset = caretPosition.offset;
  } else {
    const caretPosition = document.caretRangeFromPoint(x, y);
    textNode = caretPosition.startContainer;
    offset = caretPosition.startOffset;
  }

  if (textNode.nodeType === Node.TEXT_NODE) {
    caretDirection = 0;
    dragging = true;
    const processedTextElement = document.getElementById('processedText');
    if (processedTextElement.contains(textNode)) {
      if (textNode.parentNode === processedTextElement.childNodes[1])
        offset += beginCaretPosition;
      if (textNode.parentNode === processedTextElement.childNodes[2])
        offset += endCaretPosition;
      beginCaretPosition = offset;
      endCaretPosition = offset;

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

      processedTextElement.innerHTML = '';
      processedTextElement.append(preCaretElement);
      if (composedTextElement.textContent)
        processedTextElement.append(composedTextElement);
      processedTextElement.append(selectedTextElement);
      processedTextElement.append(postCaretElement);
    }
  }
});
document.addEventListener('mousemove', (e) => {
  if (!dragging)
    return;

  const x = e.clientX;
  const y = e.clientY;

  let textNode, offset;
  if (document.caretPositionFromPoint) {
    const caretPosition = document.caretPositionFromPoint(x, y);
    textNode = caretPosition.offsetNode;
    offset = caretPosition.offset;
  } else {
    const caretPosition = document.caretRangeFromPoint(x, y);
    textNode = caretPosition.startContainer;
    offset = caretPosition.startOffset;
  }

  if (textNode.nodeType === Node.TEXT_NODE) {
    const processedTextElement = document.getElementById('processedText');
    if (processedTextElement.contains(textNode)) {
      if (textNode.parentNode === processedTextElement.childNodes[1])
        offset += beginCaretPosition;
      if (textNode.parentNode === processedTextElement.childNodes[2])
        offset += endCaretPosition;
      if ((caretDirection === 0 && endCaretPosition < offset) || caretDirection === 1) {
        caretDirection = 1;
        endCaretPosition = offset;
      } else if ((caretDirection === 0 && beginCaretPosition > offset) || caretDirection === -1) {
        caretDirection = -1;
        beginCaretPosition = offset;
      }
      if (beginCaretPosition === endCaretPosition)
        caretDirection = 0;
      else if (beginCaretPosition > endCaretPosition)
        caretDirection *= -1;

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

      processedTextElement.innerHTML = '';
      processedTextElement.append(preCaretElement);
      if (composedTextElement.textContent)
        processedTextElement.append(composedTextElement);
      processedTextElement.append(selectedTextElement);
      processedTextElement.append(postCaretElement);
    }
  }
});
document.addEventListener('mouseup', (e) => {
  dragging = false;
});