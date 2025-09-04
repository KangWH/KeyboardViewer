const sebeolsik391 = new HangulInputSource('Sebeolsik', 'Hangul', 'Korean', {
  'Backquote': new Key('Backquote', {
    default: [new KeyValue('*'), new KeyValue('※')]
  }),
  'Digit1': new Key('Digit1', {
    default: [new HangulKeyValue('ㅎ', 3), new HangulKeyValue('ㄲ', 3)]
  }),
  'Digit2': new Key('Digit2', {
    default: [new HangulKeyValue('ㅆ', 3), new HangulKeyValue('ㄺ', 3)]
  }),
  'Digit3': new Key('Digit3', {
    default: [new HangulKeyValue('ㅂ', 3), new HangulKeyValue('ㅈ', 3)]
  }),
  'Digit4': new Key('Digit4', {
    default: [new HangulKeyValue('ㅛ', 2), new HangulKeyValue('ㄿ', 3)]
  }),
  'Digit5': new Key('Digit5', {
    default: [new HangulKeyValue('ㅠ', 2), new HangulKeyValue('ㄾ', 3)]
  }),
  'Digit6': new Key('Digit6', {
    default: [new HangulKeyValue('ㅑ', 2), new KeyValue('=')]
  }),
  'Digit7': new Key('Digit7', {
    default: [new HangulKeyValue('ㅖ', 2), new KeyValue('“')]
  }),
  'Digit8': new Key('Digit8', {
    default: [new HangulKeyValue('ㅢ', 2), new KeyValue('”')]
  }),
  'Digit9': new Key('Digit9', {
    default: [new HangulKeyValue('ㅜ', 2), new KeyValue('\'')]
  }),
  'Digit0': new Key('Digit0', {
    default: [new HangulKeyValue('ㅋ', 1), new KeyValue('~')]
  }),
  'Minus': new Key('Minus', {
    default: [new KeyValue(')'), new KeyValue(';')]
  }),
  'Equal': new Key('Equal', {
    default: [new KeyValue('>'), new KeyValue('+')]
  }),

  'KeyQ': new Key('KeyQ', {
    default: [new HangulKeyValue('ㅅ', 3), new HangulKeyValue('ㅍ', 3)]
  }),
  'KeyW': new Key('KeyW', {
    default: [new HangulKeyValue('ㄹ', 3), new HangulKeyValue('ㅌ', 3)]
  }),
  'KeyE': new Key('KeyE', {
    default: [new HangulKeyValue('ㅕ', 2), new HangulKeyValue('ㄵ', 3)]
  }),
  'KeyR': new Key('KeyR', {
    default: [new HangulKeyValue('ㅐ', 2), new HangulKeyValue('ㅀ', 3)]
  }),
  'KeyT': new Key('KeyT', {
    default: [new HangulKeyValue('ㅓ', 2), new HangulKeyValue('ㄽ', 3)]
  }),
  'KeyY': new Key('KeyY', {
    default: [new HangulKeyValue('ㄹ', 1), new KeyValue('5')]
  }),
  'KeyU': new Key('KeyU', {
    default: [new HangulKeyValue('ㄷ', 1), new KeyValue('6')]
  }),
  'KeyI': new Key('KeyI', {
    default: [new HangulKeyValue('ㅁ', 1), new KeyValue('7')]
  }),
  'KeyO': new Key('KeyO', {
    default: [new HangulKeyValue('ㅊ', 1), new KeyValue('8')]
  }),
  'KeyP': new Key('KeyP', {
    default: [new HangulKeyValue('ㅍ', 1), new KeyValue('9')]
  }),
  'BracketLeft': new Key('BracketLeft', {
    default: [new KeyValue('('), new KeyValue('%')]
  }),
  'BracketRight': new Key('BracketRight', {
    default: [new KeyValue('<'), new KeyValue('/')]
  }),
  'Backslash': new Key('Backslash', {
    default: [new KeyValue(':'), new KeyValue('\\')]
  }),

  'KeyA': new Key('KeyA', {
    default: [new HangulKeyValue('ㅇ', 3), new HangulKeyValue('ㄷ', 3)]
  }),
  'KeyS': new Key('KeyS', {
    default: [new HangulKeyValue('ㄴ', 3), new HangulKeyValue('ㄶ', 3)]
  }),
  'KeyD': new Key('KeyD', {
    default: [new HangulKeyValue('ㅣ', 2), new HangulKeyValue('ㄼ', 3)]
  }),
  'KeyF': new Key('KeyF', {
    default: [new HangulKeyValue('ㅏ', 2), new HangulKeyValue('ㄻ', 3)]
  }),
  'KeyG': new Key('KeyG', {
    default: [new HangulKeyValue('ㅡ', 2), new HangulKeyValue('ㅒ', 2)]
  }),
  'KeyH': new Key('KeyH', {
    default: [new HangulKeyValue('ㄴ', 1), new KeyValue('0')]
  }),
  'KeyJ': new Key('KeyJ', {
    default: [new HangulKeyValue('ㅇ', 1), new KeyValue('1')]
  }),
  'KeyK': new Key('KeyK', {
    default: [new HangulKeyValue('ㄱ', 1), new KeyValue('2')]
  }),
  'KeyL': new Key('KeyL', {
    default: [new HangulKeyValue('ㅈ', 1), new KeyValue('3')]
  }),
  'Semicolon': new Key('Semicolon', {
    default: [new HangulKeyValue('ㅂ', 1), new KeyValue('4')]
  }),
  'Quote': new Key('Quote', {
    default: [new HangulKeyValue('ㅌ', 1), new KeyValue('·')]
  }),

  'KeyZ': new Key('KeyZ', {
    default: [new HangulKeyValue('ㅁ', 3), new HangulKeyValue('ㅊ', 3)]
  }),
  'KeyX': new Key('KeyX', {
    default: [new HangulKeyValue('ㄱ', 3), new HangulKeyValue('ㅄ', 3)]
  }),
  'KeyC': new Key('KeyC', {
    default: [new HangulKeyValue('ㅔ', 2), new HangulKeyValue('ㅋ', 3)]
  }),
  'KeyV': new Key('KeyV', {
    default: [new HangulKeyValue('ㅗ', 2), new HangulKeyValue('ㄳ', 3)]
  }),
  'KeyB': new Key('KeyB', {
    default: [new HangulKeyValue('ㅜ', 2), new KeyValue('?')]
  }),
  'KeyN': new Key('KeyN', {
    default: [new HangulKeyValue('ㅅ', 1), new KeyValue('-')]
  }),
  'KeyM': new Key('KeyM', {
    default: [new HangulKeyValue('ㅎ', 1), new KeyValue('"')]
  }),
  'Comma': new Key('Comma', {
    default: [new KeyValue(',')]
  }),
  'Period': new Key('Period', {
    default: [new KeyValue('.')]
  }),
  'Slash': new Key('Slash', {
    default: [new HangulKeyValue('ㅗ', 2), new KeyValue('!')]
  }),
}, {
  'ㄱ1ㄱ1': 'ㄲ1',
  'ㄷ1ㄷ1': 'ㄸ1',
  'ㅂ1ㅂ1': 'ㅃ1',
  'ㅅ1ㅅ1': 'ㅆ1',
  'ㅈ1ㅈ1': 'ㅉ1',
  'ㅗ2ㅏ2': 'ㅘ2',
  'ㅗ2ㅐ2': 'ㅙ2',
  'ㅗ2ㅣ2': 'ㅚ2',
  'ㅜ2ㅓ2': 'ㅝ2',
  'ㅜ2ㅔ2': 'ㅞ2',
  'ㅜ2ㅣ2': 'ㅟ2',
});
inputSources.Sebeolsik391 = sebeolsik391;
