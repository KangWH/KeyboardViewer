const dubeolsikNorth = new HangulInputSource('Dubeolsik North Korea', 'Hangul', 'Korean', {
  'KeyQ': new Key('KeyQ', {
    default: [new HangulKeyValue('ㅂ', 4), new HangulKeyValue('ㅃ', 4)]
  }),
  'KeyW': new Key('KeyW', {
    default: [new HangulKeyValue('ㅁ', 4)]
  }),
  'KeyE': new Key('KeyE', {
    default: [new HangulKeyValue('ㄷ', 4), new HangulKeyValue('ㄸ', 4)]
  }),
  'KeyR': new Key('KeyR', {
    default: [new HangulKeyValue('ㄹ', 4)]
  }),
  'KeyT': new Key('KeyT', {
    default: [new HangulKeyValue('ㅎ', 4)]
  }),
  'KeyY': new Key('KeyY', {
    default: [new HangulKeyValue('ㅕ', 2)]
  }),
  'KeyU': new Key('KeyU', {
    default: [new HangulKeyValue('ㅜ', 2)]
  }),
  'KeyI': new Key('KeyI', {
    default: [new HangulKeyValue('ㅓ', 2)]
  }),
  'KeyO': new Key('KeyO', {
    default: [new HangulKeyValue('ㅐ', 2), new HangulKeyValue('ㅒ', 2)]
  }),
  'KeyP': new Key('KeyP', {
    default: [new HangulKeyValue('ㅔ', 2), new HangulKeyValue('ㅖ', 2)]
  }),

  'KeyA': new Key('KeyA', {
    default: [new HangulKeyValue('ㅈ', 4), new HangulKeyValue('ㅉ', 4)]
  }),
  'KeyS': new Key('KeyS', {
    default: [new HangulKeyValue('ㄱ', 4), new HangulKeyValue('ㄲ', 4)]
  }),
  'KeyD': new Key('KeyD', {
    default: [new HangulKeyValue('ㅇ', 4)]
  }),
  'KeyF': new Key('KeyF', {
    default: [new HangulKeyValue('ㄴ', 4)]
  }),
  'KeyG': new Key('KeyG', {
    default: [new HangulKeyValue('ㅅ', 4), new HangulKeyValue('ㅆ', 4)]
  }),
  'KeyH': new Key('KeyH', {
    default: [new HangulKeyValue('ㅗ', 2)]
  }),
  'KeyJ': new Key('KeyJ', {
    default: [new HangulKeyValue('ㅏ', 2)]
  }),
  'KeyK': new Key('KeyK', {
    default: [new HangulKeyValue('ㅣ', 2)]
  }),
  'KeyL': new Key('KeyL', {
    default: [new HangulKeyValue('ㅡ', 2)]
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
    default: [new HangulKeyValue('ㅛ', 2)]
  }),
  'KeyM': new Key('KeyL', {
    default: [new HangulKeyValue('ㅑ', 2)]
  }),
}, {
  'ㄱ4ㅅ4': 'ㄳ3',
  'ㄴ4ㅈ4': 'ㄵ3',
  'ㄴ4ㅎ4': 'ㄶ3',
  'ㄹ4ㄱ4': 'ㄺ3',
  'ㄹ4ㅁ4': 'ㄻ3',
  'ㄹ4ㅂ4': 'ㄼ3',
  'ㄹ4ㅅ4': 'ㄽ3',
  'ㄹ4ㅌ4': 'ㄾ3',
  'ㄹ4ㅍ4': 'ㄿ3',
  'ㄹ4ㅎ4': 'ㅀ3',
  'ㅂ4ㅅ4': 'ㅄ3',
  'ㅗ2ㅏ2': 'ㅘ2',
  'ㅗ2ㅐ2': 'ㅙ2',
  'ㅗ2ㅣ2': 'ㅚ2',
  'ㅜ2ㅓ2': 'ㅝ2',
  'ㅜ2ㅔ2': 'ㅞ2',
  'ㅜ2ㅣ2': 'ㅟ2',
  'ㅡ2ㅣ2': 'ㅢ2',
});
inputSources.DubeolsikNorth = dubeolsikNorth;
