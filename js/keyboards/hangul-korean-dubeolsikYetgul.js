const dubeolsikYetgul = new HangulInputSource('Dubeolsik Yetgul', 'Hangul', 'Korean', {
  'KeyQ': new Key('KeyQ', {
    default: [new HangulKeyValue('ㅂ', 4), new HangulKeyValue('ㅃ', 4)]
  }),
  'KeyW': new Key('KeyW', {
    default: [new HangulKeyValue('ㅈ', 4), new HangulKeyValue('ㅉ', 4)]
  }),
  'KeyE': new Key('KeyE', {
    default: [new HangulKeyValue('ㄷ', 4), new HangulKeyValue('ㄸ', 4)]
  }),
  'KeyR': new Key('KeyR', {
    default: [new HangulKeyValue('ㄱ', 4), new HangulKeyValue('ㄲ', 4)]
  }),
  'KeyT': new Key('KeyT', {
    default: [new HangulKeyValue('ㅅ', 4), new HangulKeyValue('ㅆ', 4)]
  }),
  'KeyY': new Key('KeyY', {
    default: [new HangulKeyValue('ㅛ', 2), new HangulKeyValue(String.fromCharCode(12335), 5)] // 거성 방점
  }),
  'KeyU': new Key('KeyU', {
    default: [new HangulKeyValue('ㅕ', 2), new HangulKeyValue(String.fromCharCode(12334), 5)] // 상성 방점
  }),
  'KeyI': new Key('KeyI', {
    default: [new HangulKeyValue('ㅑ', 2), new HangulKeyValue('', 5)] // 평성 방점 (조합 중지 역할)
  }),
  'KeyO': new Key('KeyO', {
    default: [new HangulKeyValue('ㅐ', 2), new HangulKeyValue('ㅒ', 2)]
  }),
  'KeyP': new Key('KeyP', {
    default: [new HangulKeyValue('ㅔ', 2), new HangulKeyValue('ㅖ', 2)]
  }),

  'KeyA': new Key('KeyA', {
    default: [new HangulKeyValue('ㅁ', 4), new HangulKeyValue('ㅿ', 4)]
  }),
  'KeyS': new Key('KeyS', {
    default: [new HangulKeyValue('ㄴ', 4)]
  }),
  'KeyD': new Key('KeyD', {
    default: [new HangulKeyValue('ㅇ', 4), new HangulKeyValue('ㆁ', 4)]
  }),
  'KeyF': new Key('KeyF', {
    default: [new HangulKeyValue('ㄹ', 4)]
  }),
  'KeyG': new Key('KeyG', {
    default: [new HangulKeyValue('ㅎ', 4), new HangulKeyValue('ㆆ', 4)]
  }),
  'KeyH': new Key('KeyH', {
    default: [new HangulKeyValue('ㅗ', 2)]
  }),
  'KeyJ': new Key('KeyJ', {
    default: [new HangulKeyValue('ㅓ', 2)]
  }),
  'KeyK': new Key('KeyK', {
    default: [new HangulKeyValue('ㅏ', 2), new HangulKeyValue('ㆍ', 2)]
  }),
  'KeyL': new Key('KeyL', {
    default: [new HangulKeyValue('ㅣ', 2)]
  }),

  'KeyZ': new Key('KeyZ', {
    default: [new HangulKeyValue('ㅋ', 4)]
  }),
  'KeyX': new Key('KeyX', {
    default: [new HangulKeyValue('ㅌ', 4)]
  }),
  'KeyC': new Key('KeyC', {
    default: [new HangulKeyValue('ㅊ', 4)]
  }),
  'KeyV': new Key('KeyV', {
    default: [new HangulKeyValue('ㅍ', 4)]
  }),
  'KeyB': new Key('KeyL', {
    default: [new HangulKeyValue('ㅠ', 2)]
  }),
  'KeyN': new Key('KeyL', {
    default: [new HangulKeyValue('ㅜ', 2)]
  }),
  'KeyM': new Key('KeyL', {
    default: [new HangulKeyValue('ㅡ', 2)]
  }),
}, {
  'ㄱ4ㄱ4': 'ㄲ13',
  'ㄱ4ㅅ4': 'ㄳ13',
  'ㄴ4ㅈ4': 'ㄵ13',
  'ㄴ4ㅎ4': 'ㄶ13',
  'ㄷ4ㄷ4': 'ㄸ13',
  'ㄹ4ㄱ4': 'ㄺ13',
  'ㄹ4ㄱ4ㅅ4': 'ㅩ13',
  'ㄹ4ㅁ4': 'ㄻ13',
  'ㄹ4ㅂ4': 'ㄼ13',
  'ㄹ4ㅅ4': 'ㄽ13',
  'ㄹ4ㅌ4': 'ㄾ13',
  'ㄹ4ㅍ4': 'ㄿ13',
  'ㄹ4ㅎ4': 'ㅀ13',
  'ㄹ4ㆆ4': 'ㅭ3',
  'ㅂ4ㄷ4': 'ㅳ13',
  'ㅂ4ㅂ4': 'ㅃ13',
  'ㅂ4ㅂ4ㅇ4': 'ㅹ1',
  'ㅂ4ㅇ4': 'ㅸ13',
  'ㅃ4ㅇ4': 'ㅹ1',
  'ㅂ4ㅅ4': 'ㅄ13',
  'ㅅ4ㄷ4': 'ㅼ13',
  'ㅅ4ㅅ4': 'ㅆ13',
  'ㅇ4ㅇ4': 'ㆀ1',
  'ㅈ4ㅈ4': 'ㅉ13',
  'ㅏ2ㅏ2': 'ㆍ2',
  'ㅏ2ㅏ2ㅣ2': 'ㆎ2',
  'ㅗ2ㅏ2': 'ㅘ2',
  'ㅗ2ㅐ2': 'ㅙ2',
  'ㅗ2ㅣ2': 'ㅚ2',
  'ㅜ2ㅓ2': 'ㅝ2',
  'ㅜ2ㅔ2': 'ㅞ2',
  'ㅜ2ㅣ2': 'ㅟ2',
  'ㅡ2ㅣ2': 'ㅢ2',
  'ㅣ2ㅣ2': 'ퟄ2',
  'ㆍ2ㅣ2': 'ㆎ2',
});
dubeolsikYetgul.composer.composingMode = 6;
inputSources.DubeolsikYetgul = dubeolsikYetgul;
