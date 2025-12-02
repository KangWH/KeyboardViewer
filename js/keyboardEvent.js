const userAgent = navigator.userAgent;
const os = userAgent.includes('Win') ? 'Windows' : userAgent.includes('Mac') ? 'macOS' : 'misc';

const keyDownEvent = (e) => {
  /* 화면에 현재 누른 키 표시 */
  document.getElementById('keyField').textContent = `↓ ${e.code}`;

  /* 화면 키보드 그림에 누른 키 표시 */
  try {
    document.getElementById(e.code).classList.add('pressed');
    if (e.code === 'Enter')
      document.getElementById('Ent').classList.add('pressed');
  } catch (err) {}
  if (e.code.includes('Shift'))
    document.getElementById('keyboard').classList.add('shiftDown')
  else if ((os === 'macOS' && e.code.includes('Alt')) || (os !== 'macOS' && e.code === 'AltRight'))
    document.getElementById('keyboard').classList.add('altGrDown')

  /* 단축키 처리 */
  let isHotkeyUsed = false;
  if (e.code.includes('Digit') && e.code !== 'Digit0') {
    if (
      os === 'macOS' && (e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey)
      || os !== 'macOS' && (e.ctrlKey && e.altKey && !e.shiftKey)
    ) {
      const number = Number(e.code.replaceAll('Digit', ''));
      activeInputSources.useSource(number);
      isHotkeyUsed = true;
    }
  }
  switch (e.code) {
  case 'KeyA':
    if (
      os === 'macOS' && (!e.ctrlKey && !e.altKey && !e.shiftKey && e.metaKey)
      || os !== 'macOS' && (e.ctrlKey && !e.altKey && !e.shiftKey)
    ) {
      e.preventDefault();
      activeInputSource.flush();
      textBuffer.beginCaretPosition = 0;
      textBuffer.endCaretPosition = textBuffer.text.length;
      textBuffer.renderText();
      isHotkeyUsed = true;
    }
    break;
  
  case 'KeyC':
    if (
      os === 'macOS' && (!e.ctrlKey && !e.altKey && !e.shiftKey && e.metaKey)
      || os !== 'macOS' && (e.ctrlKey && !e.altKey && !e.shiftKey)
    ) {
      e.preventDefault();
      // TODO
      isHotkeyUsed = true;
    }
    break;

  case 'KeyS':
    if (
      os === 'macOS' && (!e.ctrlKey && !e.altKey && e.shiftKey && e.metaKey)
      || os !== 'macOS' && (e.ctrlKey && !e.altKey && e.shiftKey)
    ) {
      e.preventDefault();
      document.getElementById('inputSourceSelector-button').click();
      isHotkeyUsed = true;
    }

  case 'KeyV':
    if (
      os === 'macOS' && (!e.ctrlKey && !e.altKey && !e.shiftKey && e.metaKey)
      || os !== 'macOS' && (e.ctrlKey && !e.altKey && !e.shiftKey)
    ) {
      e.preventDefault();
      // TODO
      isHotkeyUsed = true;
    }
    break;

  case 'KeyX':
    if (
      os === 'macOS' && (!e.ctrlKey && !e.altKey && !e.shiftKey && e.metaKey)
      || os !== 'macOS' && (e.ctrlKey && !e.altKey && !e.shiftKey)
    ) {
      e.preventDefault();
      // TODO
      isHotkeyUsed = true;
    }

  case 'Backspace':
    if (textBuffer.beginCaretPosition !== textBuffer.endCaretPosition) {
      e.preventDefault();
      textBuffer.deleteSelection();
      isHotkeyUsed = true;
    } else if (
      os === 'macOS' && (!e.ctrlKey && e.altKey && !e.shiftKey && !e.metaKey)
      || os !== 'macOS' && (e.ctrlKey && !e.altKey && !e.shiftKey)
    ) {
      e.preventDefault();
      textBuffer.deleteCharacters(-1, RangeSubtype.word);
      isHotkeyUsed = true;
    }
    break;

  case 'Delete':
    if (textBuffer.beginCaretPosition !== textBuffer.endCaretPosition) {
      e.preventDefault();
      textBuffer.deleteSelection();
      isHotkeyUsed = true;
    } else if (
      os === 'macOS' && (!e.ctrlKey && e.altKey && !e.shiftKey && !e.metaKey)
      || os !== 'macOS' && (e.ctrlKey && !e.altKey && !e.shiftKey)
    ) {
      e.preventDefault();
      textBuffer.deleteCharacters(1, RangeSubtype.word);
      isHotkeyUsed = true;
    }
    break;
  }
  if (isHotkeyUsed || e.ctrlKey || (os === 'macOS' && e.metaKey))
    return;

  e.preventDefault();

  /* 키 분류별 처리 */
  if (e.code.substring(0, 6) === 'Numpad' && e.code !== 'NumpadEnter')
    textBuffer.addCharacter(e.key);
  else if (activeInputSource.getKeyValues(e.code)) {
    // const keyValues = activeInputSource.getKeyValues(e.code);
    // 레이어 선택하는 코드는 activeInputSource 안으로 옮기기
    // const keyValue = e.shiftKey && e.altKey ? keyValues[keyValues.length - 1]
    //   : !e.shiftKey && e.altKey ? keyValues[2] || keyValues[0]
    //   : e.shiftKey && !e.altKey ? keyValues[1] || keyValues[0] : keyValues[0];
    const layer = e.shiftKey && e.altKey ? 3
      : !e.shiftKey && e.altKey ? 2
      : e.shiftKey && !e.altKey ? 1 : 0;
    const keyValue = activeInputSource.getKeyValue(e.code, layer);
    if (keyValue === undefined)
      return;
    
    switch (keyValue.type) {
    case KeyType.move:
      activeInputSource.flush();
      if (textBuffer.beginCaretPosition !== textBuffer.endCaretPosition)
        textBuffer.beginCaretPosition = textBuffer.endCaretPosition;
      else {
        if (keyValue.value > 0) {
          switch (keyValue.subtype) {
          case RangeSubtype.character:
            textBuffer.endCaretPosition = Math.min(textBuffer.endCaretPosition + 1, textBuffer.text.length);
            break;
          case RangeSubtype.end:
            textBuffer.endCaretPosition = textBuffer.text.length;
            break;
          }
        } else {
          switch (keyValue.subtype) {
          case RangeSubtype.character:
            textBuffer.endCaretPosition = Math.max(textBuffer.endCaretPosition - 1, 0);
            break;
          case RangeSubtype.end:
            textBuffer.endCaretPosition = 0;
            break;
          }
        }
        textBuffer.beginCaretPosition = textBuffer.endCaretPosition;
      }
      textBuffer.renderText();
      break;

    case KeyType.select:
      activeInputSource.flush();
      if (keyValue.value > 0) {
        switch (keyValue.subtype) {
        case RangeSubtype.character:
          textBuffer.endCaretPosition = Math.min(textBuffer.endCaretPosition + 1, textBuffer.text.length);
          break;
        case RangeSubtype.end:
          textBuffer.endCaretPosition = textBuffer.text.length;
          break;
        }
      } else if (keyValue.value < 0) {
        switch (keyValue.subtype) {
        case RangeSubtype.character:
          textBuffer.endCaretPosition = Math.max(textBuffer.endCaretPosition - 1, 0);
          break;
        case RangeSubtype.end:
          textBuffer.endCaretPosition = 0;
          break;
        }
      }
      textBuffer.renderText();
      break;

    case KeyType.delete:
      // 일단은 한 글자 지우기만 구현
      if (activeInputSource.composing) {
        activeInputSource.deleteComposeChar();
        textBuffer.renderText();
      } else {
        if (textBuffer.beginCaretPosition === textBuffer.endCaretPosition) {
          textBuffer.deleteCharacters(keyValue.value, RangeSubtype.character);
        } else
          textBuffer.deleteSelection();
      }
      break;

    case KeyType.dead:
      if (activeInputSource.deadKey)
        activeInputSource.endDeadKey();
      activeInputSource.setDeadKey(keyValue);
      textBuffer.renderText();
      break;
    
    case KeyType.composeMod:
      activeInputSource.composingBuffer = activeInputSource.data.composer(keyValue);
      textBuffer.renderText();
      break;

    case KeyType.composeChar:
      if (!activeInputSource.inhibitComposition) {
        // 블록 잡힌 부분이 있는 경우
        if (textBuffer.beginCaretPosition !== textBuffer.endCaretPosition)
          textBuffer.deleteSelection();

        if (activeInputSource.deadKey)
          activeInputSource.endDeadKey();

        activeInputSource.addComposeChar(keyValue);
        textBuffer.renderText();
        break;
      }
    default:
      if (activeInputSource.deadKey) {
        const buffer = [activeInputSource.deadKey, keyValue];
        const rule = activeInputSource.data.composingRules.getRule(buffer);
        if (rule) {
          activeInputSource.deadKey = null;
          textBuffer.addCharacter(rule[1].map((x) => x.character).join(''));
        } else {
          const deadKeyChar = activeInputSource.deadKey.character;
          activeInputSource.deadKey = null;
          textBuffer.addCharacter(deadKeyChar);
          textBuffer.addCharacter(keyValue.character);
        }
        break;
      } else if (activeInputSource.composing)
        activeInputSource.endComposition();
      textBuffer.addCharacter(keyValue.character);
    }
  } else {
    // 데드 키 기본값 입력, 조합 종료 후 버퍼에 추가
  }
};
const keyUpEvent = (e) => {
  e.preventDefault();

  /* 화면에 현재 뗀 키 표시 */
  document.getElementById('keyField').textContent = `↑ ${e.code}`;
  if (e.code.includes('Shift'))
    document.getElementById('keyboard').classList.remove('shiftDown')
  else if ((os === 'macOS' && e.code.includes('Alt')) || (os !== 'macOS' && e.code === 'AltRight'))
    document.getElementById('keyboard').classList.remove('altGrDown')

  /* 화면 키보드 그림에 뗀 키 표시 */
  try {
    document.getElementById(e.code).classList.remove('pressed');
    if (e.code === 'Enter')
      document.getElementById('Ent').classList.remove('pressed');
    // command 키를 뗄 때 눌렀던 모든 키(조합 키 제외)를 떼도록 처리
    if (e.code.substring(0, 4) === 'Meta' && os === 'macOS') {
      for (let keyCellElement of document.querySelectorAll('.keyCell.pressed')) {
        const cellCode = keyCellElement.id;
        if (['ControlLeft', 'ControlRight', 'AltLeft', 'AltRight', 'ShiftLeft', 'ShiftRight'].includes(cellCode))
          continue;
        keyCellElement.classList.remove('pressed');
      }
    }
  } catch (err) {}
}
document.getElementById('processedText').addEventListener('keydown', keyDownEvent);
window.addEventListener('keyup', keyUpEvent);