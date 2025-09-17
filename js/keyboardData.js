const inputSources = {};

const qwerty = new InputSource('Qwerty', 'Latin', 'English', {
  'IntlBackslash': new Key('IntlBackslash', {
    'win-iso': [new KeyValue('`'), new KeyValue('~')],
    default: [new KeyValue('§'), new KeyValue('±')]
  }),
  'Backquote': new Key('BackQuote', {
    'win-iso': [new KeyValue('§'), new KeyValue('±')],
    default: [new KeyValue('`'), new KeyValue('~')]
  }),
  'Digit1': new Key('Digit1', {
    default: [new KeyValue('1'), new KeyValue('!')]
  }),
  'Digit2': new Key('Digit2', {
    'mac-jis': [new KeyValue('2'), new KeyValue('"')],
    default: [new KeyValue('2'), new KeyValue('@')]
  }),
  'Digit3': new Key('Digit3', {
    default: [new KeyValue('3'), new KeyValue('#')]
  }),
  'Digit4': new Key('Digit4', {
    default: [new KeyValue('4'), new KeyValue('$')]
  }),
  'Digit5': new Key('Digit5', {
    default: [new KeyValue('5'), new KeyValue('%')]
  }),
  'Digit6': new Key('Digit6', {
    'mac-jis': [new KeyValue('6'), new KeyValue('&')],
    default: [new KeyValue('6'), new KeyValue('^')]
  }),
  'Digit7': new Key('Digit7', {
    'mac-jis': [new KeyValue('7'), new KeyValue('\'')],
    default: [new KeyValue('7'), new KeyValue('&')]
  }),
  'Digit8': new Key('Digit8', {
    'mac-jis': [new KeyValue('8'), new KeyValue('(')],
    default: [new KeyValue('8'), new KeyValue('*')]
  }),
  'Digit9': new Key('Digit9', {
    'mac-jis': [new KeyValue('9'), new KeyValue(')')],
    default: [new KeyValue('9'), new KeyValue('(')]
  }),
  'Digit0': new Key('Digit0', {
    'mac-jis': [new KeyValue('0'), new KeyValue('0', '')],
    default: [new KeyValue('0'), new KeyValue(')')]
  }),
  'Minus': new Key('Minus', {
    'mac-jis': [new KeyValue('-'), new KeyValue('=')], 
    default: [new KeyValue('-'), new KeyValue('_')]
  }),
  'Equal': new Key('Equal', {
    'mac-jis': [new KeyValue('^'), new KeyValue('~')],
    default: [new KeyValue('='), new KeyValue('+')]
  }),
  'IntlYen': new Key('IntlYen', {
    default: [new KeyValue('¥'), new KeyValue('|')]
  }),

  'KeyQ': new Key('KeyQ', {
    default: [new KeyValue('q', 'Q'), new KeyValue('Q', null)]
  }),
  'KeyW': new Key('KeyW', {
    default: [new KeyValue('w', 'W'), new KeyValue('W', null)]
  }),
  'KeyE': new Key('KeyE', {
    default: [new KeyValue('e', 'E'), new KeyValue('E', null)]
  }),
  'KeyR': new Key('KeyR', {
    default: [new KeyValue('r', 'R'), new KeyValue('R', null)]
  }),
  'KeyT': new Key('KeyT', {
    default: [new KeyValue('t', 'T'), new KeyValue('T', null)]
  }),
  'KeyY': new Key('KeyY', {
    default: [new KeyValue('y', 'Y'), new KeyValue('Y', null)]
  }),
  'KeyU': new Key('KeyU', {
    default: [new KeyValue('u', 'U'), new KeyValue('U', null)]
  }),
  'KeyI': new Key('KeyI', {
    default: [new KeyValue('i', 'I'), new KeyValue('I', null)]
  }),
  'KeyO': new Key('KeyO', {
    default: [new KeyValue('o', 'O'), new KeyValue('O', null)]
  }),
  'KeyP': new Key('KeyP', {
    default: [new KeyValue('p', 'P'), new KeyValue('P', null)]
  }),
  'BracketLeft': new Key('BracketLeft', {
    'mac-jis': [new KeyValue('@'), new KeyValue('`')],
    default: [new KeyValue('['), new KeyValue('{')]
  }),
  'BracketRight': new Key('BracketRight', {
    'mac-jis': [new KeyValue('['), new KeyValue('{')],
    default: [new KeyValue(']'), new KeyValue('}')]
  }),
  'Backslash': new Key('Backslash', {
    'mac-jis': [new KeyValue(']'), new KeyValue('}')],
    default: [new KeyValue('\\'), new KeyValue('|')]
  }),

  'KeyA': new Key('KeyA', {
    default: [new KeyValue('a', 'A'), new KeyValue('A', null)]
  }),
  'KeyS': new Key('KeyS', {
    default: [new KeyValue('s', 'S'), new KeyValue('S', null)]
  }),
  'KeyD': new Key('KeyD', {
    default: [new KeyValue('d', 'D'), new KeyValue('D', null)]
  }),
  'KeyF': new Key('KeyF', {
    default: [new KeyValue('f', 'F'), new KeyValue('F', null)]
  }),
  'KeyG': new Key('KeyG', {
    default: [new KeyValue('g', 'G'), new KeyValue('G', null)]
  }),
  'KeyH': new Key('KeyH', {
    default: [new KeyValue('h', 'H'), new KeyValue('H', null)]
  }),
  'KeyJ': new Key('KeyJ', {
    default: [new KeyValue('j', 'J'), new KeyValue('J', null)]
  }),
  'KeyK': new Key('KeyK', {
    default: [new KeyValue('k', 'K'), new KeyValue('K', null)]
  }),
  'KeyL': new Key('KeyL', {
    default: [new KeyValue('l', 'L'), new KeyValue('L', null)]
  }),
  'Semicolon': new Key('Semicolon', {
    'mac-jis': [new KeyValue(';'), new KeyValue('+')],
    default: [new KeyValue(';'), new KeyValue(':')]
  }),
  'Quote': new Key('Quote', {
    'mac-jis': [new KeyValue(':'), new KeyValue('*')],
    default: [new KeyValue('\''), new KeyValue('"')]
  }),

  'KeyZ': new Key('KeyZ', {
    default: [new KeyValue('z', 'Z'), new KeyValue('Z', null)]
  }),
  'KeyX': new Key('KeyX', {
    default: [new KeyValue('x', 'X'), new KeyValue('X', null)]
  }),
  'KeyC': new Key('KeyC', {
    default: [new KeyValue('c', 'C'), new KeyValue('C', null)]
  }),
  'KeyV': new Key('KeyV', {
    default: [new KeyValue('v', 'V'), new KeyValue('V', null)]
  }),
  'KeyB': new Key('KeyB', {
    default: [new KeyValue('b', 'B'), new KeyValue('B', null)]
  }),
  'KeyN': new Key('KeyN', {
    default: [new KeyValue('n', 'N'), new KeyValue('N', null)]
  }),
  'KeyM': new Key('KeyM', {
    default: [new KeyValue('m', 'M'), new KeyValue('M', null)]
  }),
  'Comma': new Key('Comma', {
    default: [new KeyValue(','), new KeyValue('<')]
  }),
  'Period': new Key('Period', {
    default: [new KeyValue('.'), new KeyValue('>')]
  }),
  'Slash': new Key('Slash', {
    default: [new KeyValue('/'), new KeyValue('?')]
  }),
  'IntlRo': new Key('IntlRo', {
    default: [new KeyValue('_')]
  }),

  'Space': new Key('Space', {
    default: [new KeyValue(' ')]
  }),
});
inputSources.Qwerty = qwerty;

let beginCaretPosition = 0;
let endCaretPosition = 0;
let caretDirection = 0; // -1 for left, 1 for right
const processedText = [];
let currentInputSource = {};
const fallBackInputSource = qwerty;
const setInputSource = (source) => {
  if (currentInputSource.composer) {
    const str = currentInputSource.composer.endCompose();
    processedText.splice(endCaretPosition, 0, ...str);
    endCaretPosition += str.length;
    beginCaretPosition = endCaretPosition;
  }
  currentInputSource = source;
  fallBackInputSource.load();
  source.load();
}

setInputSource(Object.values(inputSources)[0]);
