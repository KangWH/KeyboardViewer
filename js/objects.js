/* Constants */
const KeyType = {
  char: 'char',
  dead: 'dead',
  composeChar: 'composeChar',
  composeMod: 'composeMod',
  move: 'move',
  select: 'select',
  delete: 'delete',
};
Object.freeze(KeyType);
const HangulKeySubtype = {
  ja: 'ja', // 초성과 종성을 구분하지 않는 자음
  mo: 'mo', // 로마자 한글 입력기에서, 호환용 자모 입력을 위함
  cho: 'cho',
  jung: 'jung',
  jong: 'jong',
  bang: 'bang',
};
Object.freeze(HangulKeySubtype);
const RangeSubtype = {
  character: 'character',
  word: 'word',
  line: 'line',
  paragraph: 'paragraph',
  page: 'page',
  end: 'end',
};
Object.freeze(RangeSubtype);
const Composers = {
  kana: (keyValue) => {
    if (keyValue) {
      switch (keyValue.subtype) {
      case 'select':
        if (activeInputSource.composing)
          activeInputSource.endComposition();
        else
          textBuffer.addCharacter('\n');
        return [];
      }
    }
    const step0 = activeInputSource.composingBuffer.slice();
    const step1 = [];
    for (let i = 0; i < step0.length; i++) {
      const composed = activeInputSource.data.composingRules.getRule(step0.slice(i));
      if (composed) {
        composed[1].forEach((x) => step1.push(x));
        i += (composed[0].length - 1);
      } else
        step1.push(step0[i]);
    }
    return step1.map((x) => x.character);
  },
  modernHangul: () => {
    const choseongs = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
    const jungseongs = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
    const jongseongs = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

    const step0 = activeInputSource.composingBuffer.slice();
    
    /* 1단계: 낱자끼리 조합 가능한 경우를 찾습니다. */
    /* 단, 중성 앞에 있는 자음 한 개는 조합하지 않습니다. */
    const step1 = [];
    for (let i = 0; i < step0.length; i++) {
      const nextJungIndex = step0.slice(i + 1).findIndex((x) => x.subtype === HangulKeySubtype.jung);
      const sliceIndex = nextJungIndex < 0 || step0[i].subtype === HangulKeySubtype.jung || step0[i + nextJungIndex].subtype !== HangulKeySubtype.ja ? step0.length : nextJungIndex < 0 ? step0.length : (i + nextJungIndex);
      const composition = activeInputSource.data.composingRules.getRule(step0.slice(i, sliceIndex));
      if (composition) {
        composition[1].forEach((x) => step1.push(x));
        i += composition[0].length - 1;
      } else
        step1.push(step0[i]);
    }

    /* 2단계: 완성자를 구성합니다. */
    const step2 = [];
    for (let i = 0; i < step1.length; i++) {
      if (step1[i].subtype === HangulKeySubtype.jung || step1[i].subtype === HangulKeySubtype.jong) {
        // 중성/종성으로 시작할 때
        step2.push(step1[i].character);
        continue;
      }

      if (i + 1 >= step1.length) {
        // 마지막 글자일 때
        step2.push(step1[i].character);
        continue;
      }

      if (!choseongs.includes(step1[i].character)) {
        // 적절하지 않은 글자가 초성에 있을 때
        step2.push(step1[i].character);
        continue;
      }

      if (step1[i + 1].subtype !== HangulKeySubtype.jung) {
        // 자음 + 자음일 때
        step2.push(step1[i].character);
        continue;
      }

      const cho = step1[i].character;
      const jung = step1[i+1].character;
      let jong = '';
      if (i + 2 < step1.length && step1[i+2].subtype === HangulKeySubtype.jong) {
        jong = step1[i+2].character;
        i++;
      } else if (
        (i + 2 < step1.length && [HangulKeySubtype.ja, HangulKeySubtype.jong].includes(step1[i+2].subtype))
        && (i + 3 >= step1.length || step1[i+3].subtype !== HangulKeySubtype.jung)
      ) {
        jong = step1[i+2].character;
        i++;
      }

      const choseongIndex = choseongs.indexOf(cho);
      const jungseongIndex = jungseongs.indexOf(jung);
      const jongseongIndex = jongseongs.indexOf(jong);

      const syllableUnicode = 0xAC00 + choseongIndex * 21 * 28 + jungseongIndex * 28 + jongseongIndex;
      step2.push(String.fromCharCode(syllableUnicode));

      i++;
    }
    return step2;
  },
  oldHangul: () => {
    const choseongs = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
    const jungseongs = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
    const jongseongs = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

    const step0 = activeInputSource.composingBuffer.slice();
    
    /* 1단계: 낱자끼리 조합 가능한 경우를 찾습니다. */
    /* 단, 중성과 중성 사이에 있는 첫 자음일 때, */
    /* 중성 앞에 있는 자음 한 개는 조합하지 않습니다. */
    const step1 = [];
    for (let i = 0; i < step0.length; i++) {
      const nextJungIndex = step0.slice(i + 1).findIndex((x) => x.subtype === HangulKeySubtype.jung);
      const sliceIndex = i === 0 || step0[i-1].subtype !== HangulKeySubtype.jung || nextJungIndex < 0 || step0[i].subtype === HangulKeySubtype.jung || step0[i + nextJungIndex].subtype !== HangulKeySubtype.ja ? step0.length : nextJungIndex < 0 ? step0.length : (i + nextJungIndex);
      const composition = activeInputSource.data.composingRules.getRule(step0.slice(i, sliceIndex));
      if (composition) {
        const compSubtype = composition[1][0].subtype;
        const lastSubtype = step1.length ? step1[step1.length - 1].subtype : HangulKeySubtype.jong;
        if (
          (lastSubtype !== HangulKeySubtype.jung && compSubtype === HangulKeySubtype.jong) // 초성이 와야 하는 자리
          || (lastSubtype === HangulKeySubtype.jung && composition[0][0].subtype === HangulKeySubtype.ja && compSubtype === HangulKeySubtype.cho) // 종성이 와야 하는 자리 (두벌식)
        ) {
          const shorterComposition = activeInputSource.data.composingRules.getRule(step0.slice(i, i + composition[0].length - 1));
          if (shorterComposition) {
            const compSubtype = shorterComposition[1].subtype;
            if (
              (lastSubtype !== HangulKeySubtype.jung && compSubtype === HangulKeySubtype.jong) // 초성이 와야 하는 자리
              || (lastSubtype === HangulKeySubtype.jung && composition[0][0].subtype === HangulKeySubtype.ja && compSubtype === HangulKeySubtype.cho) // 종성이 와야 하는 자리 (두벌식)
            )
              step1.push(step0[i]);
            else {
              shorterComposition[1].forEach((x) => step1.push(x));
              i += shorterComposition[0].length - 1;
            }
          } else
            step1.push(step0[i]);
        } else {
          composition[1].forEach((x) => step1.push(x));
          i += composition[0].length - 1;
        }
      } else
        step1.push(step0[i]);
    }

    /* 2단계: 완성자를 구성합니다. */
    const step2 = [];
    for (let i = 0; i < step1.length; i++) {
      if (![HangulKeySubtype.ja, HangulKeySubtype.cho].includes(step1[i].subtype)) {
        // 중성/종성/방점으로 시작할 때
        step2.push(step1[i].character);
        continue;
      }

      if (i + 1 >= step1.length) {
        // 마지막 글자일 때
        step2.push(step1[i].character);
        continue;
      }

      if (step1[i + 1].subtype !== HangulKeySubtype.jung) {
        // 자음 + 자음일 때
        step2.push(step1[i].character);
        continue;
      }

      let cho = step1[i].character;
      let jung = step1[i+1].character;
      let jong = '';
      if (i + 2 < step1.length && step1[i+2].subtype === HangulKeySubtype.jong) {
        jong = step1[i+2].character;
        i++;
      } else if (
        (i + 2 < step1.length && [HangulKeySubtype.ja, HangulKeySubtype.jong].includes(step1[i+2].subtype))
        && (i + 3 >= step1.length || step1[i+3].subtype !== HangulKeySubtype.jung)
      ) {
        jong = step1[i+2].character;
        i++;
      }
      let bang = '';
      if (
        i + 2 < step1.length && step1[i + 2].subtype === HangulKeySubtype.bang
      ) {
        bang = step1[i + 2].character;
        i++;
      }

      const choseongIndex = choseongs.indexOf(cho);
      const jungseongIndex = jungseongs.indexOf(jung);
      const jongseongIndex = jongseongs.indexOf(jong);

      if (choseongIndex >= 0 && jungseongIndex >= 0 && jongseongIndex >= 0) {
        // 현대 한글
        const syllableUnicode = 0xAC00 + choseongIndex * 21 * 28 + jungseongIndex * 28 + jongseongIndex;
        step2.push(String.fromCharCode(syllableUnicode) + bang);
      } else {
        cho = {
          'ㄱ': 'ᄀ',
          'ㄲ': 'ᄁ',
          'ㄴ': 'ᄂ',
          'ㅥ': 'ᄔ',
          'ㅦ': 'ᄕ',
          'ㅧ': 'ᅛ',
          'ㄵ': 'ᅜ',
          'ㄶ': 'ᅝ',
          'ㄷ': 'ᄃ',
          'ㄸ': 'ᄄ',
          'ㄹ': 'ᄅ',
          'ㄺ': 'ꥤ',
          'ㅪ': 'ꥦ',
          'ㄻ': 'ꥨ',
          'ㄼ': 'ꥩ',
          'ㄽ': 'ꥬ',
          'ㅀ': 'ᄚ',
          'ㅁ': 'ᄆ',
          'ㅮ': 'ᄜ',
          'ㅯ': 'ꥱ',
          'ㅱ': 'ᄝ',
          'ㅂ': 'ᄇ',
          'ㅲ': 'ᄞ',
          'ㅳ': 'ᄠ',
          'ㅃ': 'ᄈ',
          'ㅄ': 'ᄡ',
          'ㅴ': 'ᄢ',
          'ㅵ': 'ᄣ',
          'ㅶ': 'ᄧ',
          'ㅷ': 'ᄩ',
          'ㅸ': 'ᄫ',
          'ㅹ': 'ᄬ',
          'ㅅ': 'ᄉ',
          'ㅺ': 'ᄭ',
          'ㅻ': 'ᄮ',
          'ㅼ': 'ᄯ',
          'ㅽ': 'ᄲ',
          'ㅆ': 'ᄊ',
          'ㅾ': 'ᄶ',
          'ㅿ': 'ᅀ',
          'ㅇ': 'ᄋ',
          'ㆀ': 'ᅇ',
          'ㆁ': 'ᅌ',
          'ㅈ': 'ᄌ',
          'ㅉ': 'ᄍ',
          'ㅊ': 'ᄎ',
          'ㅋ': 'ᄏ',
          'ㅌ': 'ᄐ',
          'ㅍ': 'ᄑ',
          'ㆄ': 'ᅗ',
          'ㅎ': 'ᄒ',
          'ㆅ': 'ᅘ',
          'ㆆ': 'ᅙ',
        }[cho] || cho;
        jung = {
          'ㅏ': 'ᅡ',
          'ㅐ': 'ᅢ',
          'ㅑ': 'ᅣ',
          'ㅒ': 'ᅤ',
          'ㅓ': 'ᅥ',
          'ㅔ': 'ᅦ',
          'ㅕ': 'ᅧ',
          'ㅖ': 'ᅨ',
          'ㅗ': 'ᅩ',
          'ㅘ': 'ᅪ',
          'ㅙ': 'ᅫ',
          'ㅚ': 'ᅬ',
          'ㅛ': 'ᅭ',
          'ㆇ': 'ᆄ',
          'ㆈ': 'ᆅ',
          'ㆉ': 'ᆈ',
          'ㅜ': 'ᅮ',
          'ㅝ': 'ᅯ',
          'ㅞ': 'ᅰ',
          'ㅟ': 'ᅱ',
          'ㅠ': 'ᅲ',
          'ㆊ': 'ᆑ',
          'ㆋ': 'ᆒ',
          'ㆌ': 'ᆔ',
          'ㅡ': 'ᅳ',
          'ㅢ': 'ᅴ',
          'ㅣ': 'ᅵ',
          'ㆍ': 'ᆞ',
          'ㆎ': 'ᆡ',
        }[jung] || jung;
        jong = {
          'ㄱ': 'ᆨ',
          'ㄲ': 'ᆩ',
          'ㄳ': 'ᆪ',
          'ㄴ': 'ᆫ',
          'ᄓ': 'ᇅ',
          'ㅥ': 'ᇿ',
          'ㅦ': 'ᇆ',
          'ㅧ': 'ᇇ',
          'ㅨ': 'ᇈ',
          'ㄵ': 'ᆬ',
          'ㄶ': 'ᆭ',
          'ㄷ': 'ᆮ',
          'ᄗ': 'ᇊ',
          'ㄸ': 'ퟍ',
          'ᅞ': 'ᇋ',
          'ꥡ': 'ퟏ',
          'ꥢ': 'ퟐ',
          'ꥣ': 'ퟒ',
          'ㄹ': 'ᆯ',
          'ㄺ': 'ᆰ',
          'ꥥ': 'ퟕ',
          'ᄘ': 'ᇍ',
          'ㅪ': 'ᇎ',
          'ᄙ': 'ᇐ',
          'ㄻ': 'ᆱ',
          'ㄼ': 'ᆲ',
          'ꥫ': 'ᇕ',
          'ㄽ': 'ᆳ',
          'ㅬ': 'ᇗ',
          'ꥮ': 'ᇘ',
          'ㄾ': 'ᆴ',
          'ㄿ': 'ᆵ',
          'ㅀ': 'ᆶ',
          'ㅭ': 'ᇙ',
          'ᄛ': 'ퟝ',
          'ㅁ': 'ᆷ',
          'ꥯ': 'ᇚ',
          'ㅮ': 'ᇜ',
          'ㅯ': 'ᇝ',
          'ㅰ': 'ᇟ',
          'ㅱ': 'ᇢ',
          'ㅂ': 'ᆸ',
          'ㅳ': 'ퟣ',
          'ㅃ': 'ퟦ',
          'ㅄ': 'ᆹ',
          'ㅵ': 'ퟧ',
          'ㅶ': 'ퟨ',
          'ᄨ': 'ퟩ',
          'ᄪ': 'ᇤ',
          'ꥴ': 'ᇥ',
          'ㅸ': 'ᇦ',
          'ㅅ': 'ᆺ',
          'ㅺ': 'ᇧ',
          'ㅼ': 'ᇨ',
          'ᄰ': 'ᇩ',
          'ᄱ': 'ퟪ',
          'ㅽ': 'ᇪ',
          'ㅆ': 'ᆻ',
          'ㅾ': 'ퟯ',
          'ᄷ': 'ퟰ',
          'ᄹ': 'ퟱ',
          'ᄻ': 'ퟲ',
          'ㅿ': 'ᇫ',
          'ㅇ': 'ᆼ',
          'ㆁ': 'ᇰ',
          'ㆂ': 'ᇱ',
          'ㆃ': 'ᇲ',
          'ㅈ': 'ᆽ',
          'ㅉ': 'ퟹ',
          'ㅊ': 'ᆾ',
          'ㅋ': 'ᆿ',
          'ㅌ': 'ᇀ',
          'ㅍ': 'ᇁ',
          'ᅖ': 'ᇳ',
          'ㆄ': 'ᇴ',
          'ㅎ': 'ᇂ',
          'ㆆ': 'ᇹ',
        }[jong] || jong;
        step2.push(cho + jung + jong + bang);
      }

      i++;
    }
    return step2;
  },
  romajaHangul: () => {
    const choseongs = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
    const jungseongs = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
    const jongseongs = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

    const step0 = activeInputSource.composingBuffer.slice();
    
    /* 1단계: 낱자끼리 조합 가능한 경우를 찾습니다. */
    const step1 = [];
    for (let i = 0; i < step0.length; i++) {
      const composition = activeInputSource.data.composingRules.getRule(step0.slice(i));
      if (composition) {
        composition[1].forEach((x) => step1.push(x));
        i += composition[0].length - 1;
      } else
        step1.push(step0[i]);
    }

    /* 2단계: 완성자를 구성합니다. */
    const step2 = [];
    for (let i = 0; i < step1.length; i++) {
      if ([HangulKeySubtype.jong, undefined].includes(step1[i].subtype)) {
        // 종성으로 시작할 때, 조합할 수 없는 영문일 때
        step2.push(step1[i].character);
        continue;
      }

      if (i + 1 >= step1.length && step1[i].subtype !== HangulKeySubtype.jung) {
        // 자음인데 마지막 글자일 때
        step2.push(step1[i].character);
        continue;
      }

      if (step1[i].subtype !== HangulKeySubtype.jung && step1[i + 1].subtype !== HangulKeySubtype.jung) {
        // 자음 + 자음일 때
        step2.push(step1[i].character);
        continue;
      }

      let cho = step1[i].character;
      if (step1[i].subtype === HangulKeySubtype.jung) {
        cho = 'ㅇ';
        i--;
      }
      const jung = step1[i+1].character;
      let jong = '';
      if (i + 2 < step1.length && step1[i+2].subtype === HangulKeySubtype.jong) {
        jong = step1[i+2].character;
        i++;
      } else if (
        (i + 2 < step1.length && [HangulKeySubtype.ja, HangulKeySubtype.jong].includes(step1[i+2].subtype))
        && (i + 3 >= step1.length || step1[i+3].subtype !== HangulKeySubtype.jung)
      ) {
        jong = step1[i+2].character;
        i++;
      }

      const choseongIndex = choseongs.indexOf(cho);
      const jungseongIndex = jungseongs.indexOf(jung);
      const jongseongIndex = jongseongs.indexOf(jong);

      const syllableUnicode = 0xAC00 + choseongIndex * 21 * 28 + jungseongIndex * 28 + jongseongIndex;
      step2.push(String.fromCharCode(syllableUnicode));

      i++;
    }
    return step2;
  },
};
Object.freeze(Composers);

/* Objects */
const ComposingRulePresets = {};
const getComposingRulePreset = async (identifier) => {
  try {
    const response = await fetch(`https://kangwh.github.io/KeyboardViewer/js/composingRules/${identifier}.json`);
    const array = await response.json();
    ComposingRulePresets[identifier] = array;
  } catch (err) {
    console.error(err);
    throw new Error(`Composing Rule Preset '${identifier}' does not exist.`);
  }
}
const inputSources = {
  qwertzDE: {
    names: {
      de: 'QWERTZ (Deutschland)',
      en: 'QWERTZ (German)',
      ja: 'QWERTZ（ドイツ）',
      ko: 'QWERTZ (독일)',
    },
    directory: 'de'
  },
  qwertyUK: {
    names: {
      en: 'QWERTY (UK)',
      ja: 'QWERTY（イギリス）',
      ko: 'QWERTY (영국)',
    },
    directory: 'en'
  },
  qwertyUS: {
    names: {
      en: 'QWERTY (US)',
      ja: 'QWERTY（アメリカ）',
      ko: 'QWERTY (미국)',
    },
    directory: 'en'
  },
  qwertyUSInternational: {
    names: {
      en: 'QWERTY (US International)',
      ja: 'QWERTY（アメリカ多言語）',
      ko: 'QWERTY (미국 다국어)',
    },
    directory: 'en'
  },
  spanish: {
    names: {
      en: 'Spanish',
      es: 'Español',
      ja: 'スペイン語',
      ko: '스페인어',
    },
    directory: 'es'
  },
  spanishLatin: {
    names: {
      es: 'Español (América Latina)',
      en: 'Spanish (Latin America)',
      ja: 'スペイン語（ラテンアメリカ）',
      ko: '스페인어 (라틴 아메리카)'
    },
    directory: 'es'
  },
  azertyFR: {
    names: {
      fr: 'AZERTY (Français)',
      en: 'AZERTY (French)',
      ja: 'AZERTY（スペイン）',
      ko: 'AZERTY (프랑스)'
    },
    directory: 'fr'
  },
  azertyFRStd: {
    names: {
      fr: 'AZERTY (norme française)',
      en: 'AZERTY (French standard)',
      ja: 'AZERTY（スペイン標準）',
      ko: 'AZERTY (프랑스 표준)'
    },
    directory: 'fr'
  },
  kana: {
    names: {
      en: 'Kana',
      ja: 'かな',
      ko: '가나'
    },
    directory: 'ja'
  },
  kanaNonJIS: {
    names: {
      en: 'Kana (Non-JIS keyboard)',
      ja: 'かな（非JISキーボード）',
      ko: '가나 (비 JIS 키보드)'
    },
    directory: 'ja'
  },
  // romaji: {
  //   names: {
  //     en: 'Romaji',
  //     ja: 'ローマ字',
  //     ko: '로마지'
  //   },
  //   directory: 'ja'
  // },
  dubeolsik: {
    names: {
      en: 'Dubeolsik',
      ja: '２ボル式',
      ko: '두벌식',
    },
    directory: 'ko'
  },
  dubeolsikNorth: {
    names: {
      en: 'Dubeolsik (North Korea)',
      ja: '２ボル式（北朝鮮）',
      ko: '두벌식 (북한)',
    },
    directory: 'ko'
  },
  dubeolsikYethangul: {
    names: {
      en: 'Dubeolsik Old Hangul',
      ja: '２ボル式古いハングル',
      ko: '두벌식 옛한글',
    },
    directory: 'ko'
  },
  sebeolsik390: {
    names: {
      en: 'Sebeolsik 3-90',
      ja: '３ボル式3-90',
      ko: '세벌식 3-90',
    },
    directory: 'ko'
  },
  sebeolsik391: {
    names: {
      en: 'Sebeolsik 3-91',
      ja: '３ボル式3-91',
      ko: '세벌식 3-91',
    },
    directory: 'ko'
  },
  sebeolsikNoshift: {
    names: {
      en: 'Sebeolsik No-shift',
      ja: '３ボル式純下',
      ko: '세벌식 순아래',
    },
    directory: 'ko'
  },
  sebeolsikYethangul: {
    names: {
      en: 'Sebeolsik Old Hangul',
      ja: '３ボル式古いハングル',
      ko: '세벌식 옛한글',
    },
    directory: 'ko'
  },
  romaja: {
    names: {
      en: 'Latin Hangul Input',
      ja: 'ローマ字ハングル入力',
      ko: '로마자 한글 입력',
    },
    directory: 'ko'
  },
  turkishF: {
    names: {
      en: 'Turkish F',
      ja: 'トルコＦキーボード',
      ko: '튀르키예 F',
    },
    directory: 'tr'
  },
};
const activeInputSources = {
  sources: [],

  addSource: async function (identifier) {
    if (this.sources.some((x) => x.identifier === identifier))
      throw new Error(`Input source ${identifier} is already active.`);

    const sourceInfo = inputSources[identifier];
    if (!sourceInfo)
      throw new Error(`Input source ${identifier} does not exist.`);

    try {
      const response = await fetch(`https://kangwh.github.io/KeyboardViewer/js/keyboards/${sourceInfo.directory}/${identifier}.json`);
      const obj = await response.json();
      const source = new InputSource(obj);
      this.sources.unshift(source);
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  },
  deleteSource: function (identifier) {
    const index = this.sources.findIndex((x) => x.identifier === identifier);
    if (index < 0)
      throw new Error(`Input source ${identifier} is already inactive.`);
    this.sources.splice(index, 1);
  },
  useSource: function (index) {
    const target = this.sources.splice(Math.min(index, this.sources.length - 1), 1)[0];
    this.sources.unshift(target);

    const nameData = inputSources[target.identifier].names;
    console.log(`Current input source is changed to ${nameData.en}.`);
    target.showLayout();
    activeInputSource.data = target;
    activeInputSource.init();
  }
};
const activeInputSource = {
  data: undefined,

  deadKey: null,
  inhibitComposition: false,
  composing: false,
  composingBuffer: [],
  compositionResult: [],

  layer: 0,
  capsLock: false,
  shiftLock: false,

  init: function () {
    this.deadKey = null;
    this.inhibitComposition = false;
    this.composing = false;
    this.composingBuffer = [];
    this.compositionResult = [];

    this.layer = 0;
    this.capsLock = false;
    this.shiftLock = false;
  },

  getKeyValues: function (code) {
    if (this.data === undefined || this.data.keys[code] === undefined)
      return this.fallback.keys[code];
    return this.data.keys[code];
  },
  getKeyValue: function (code, layer) {
    const keyValues = this.getKeyValues(code);
    if (keyValues)
      return keyValues[layer];
    return undefined;
  },

  setDeadKey: function (keyValue) {
    this.deadKey = keyValue;
  },
  endDeadKey: function () {
    if (this.deadKey)
      textBuffer.addCharacter(this.deadKey.character);
    this.deadKey = null;
  },

  addComposeChar: function (keyValue) {
    this.composing = true;
    this.composingBuffer.push(keyValue);
    this.compositionResult = this.data.composer();
  },
  deleteComposeChar: function () {
    this.composingBuffer.pop();
    this.compositionResult = this.data.composer();
    if (this.composingBuffer.length < 1)
      this.composing = false;
  },
  endComposition: function () {
    this.composing = false;
    this.composingBuffer = [];
    this.compositionResult.forEach((character) => {
      textBuffer.addCharacter(character);
    });
    this.compositionResult = [];
  },
  flush: function () {
    this.endDeadKey();
    this.endComposition();
  },
};
(async () => {
  const fallbackInputSourceData = await fetch('https://kangwh.github.io/KeyboardViewer/js/keyboards/fallback.json');
  const fallbackInputSource = await fallbackInputSourceData.json();
  activeInputSource.fallback = new InputSource(fallbackInputSource);
})();
const textBuffer = {
  text: [],
  beginCaretPosition: 0,
  endCaretPosition: 0,

  renderText: function () {
    const bufferElement = document.getElementById('processedText');
    bufferElement.innerHTML = '';

    const preText = document.createElement('span');
    const selected = document.createElement('span');
    selected.classList.add('caret');
    if (this.beginCaretPosition < this.endCaretPosition)
      selected.classList.add('toRight');
    else if (this.beginCaretPosition > this.endCaretPosition)
      selected.classList.add('toLeft');
    const postText = document.createElement('span');

    const composingText = document.createElement('span');
    composingText.classList.add('composing');
    if (activeInputSource.composing)
      composingText.textContent = activeInputSource.compositionResult.join('');
    else if (activeInputSource.deadKey)
      composingText.textContent = activeInputSource.deadKey.character;

    let target = preText;
    const leftIndex = Math.min(this.beginCaretPosition, this.endCaretPosition);
    const rightIndex = Math.max(this.beginCaretPosition, this.endCaretPosition);
    for (let indexStr in this.text) {
      const index = Number(indexStr);

      if (index === leftIndex) {
        bufferElement.append(preText);
        target = selected;
        if (activeInputSource.composing || activeInputSource.deadKey)
          bufferElement.append(composingText);
      } if (index === rightIndex) {
        bufferElement.append(selected);
        target = postText;
      }

      const character = this.text[index];
      target.textContent += character;
    }
    if (leftIndex === this.text.length)
      bufferElement.append(preText);
    if (rightIndex === this.text.length) {
      if (activeInputSource.composing || activeInputSource.deadKey)
        bufferElement.append(composingText);
      bufferElement.append(selected);
    }
    bufferElement.append(postText);
  },
  deleteCharacters: function (direction, range) {
    if (direction > 0) {
      // 커서 오른쪽 삭제
      switch (range) {
      case RangeSubtype.character:
        this.text.splice(this.beginCaretPosition, 1);
        break;
      case RangeSubtype.word:
        const afterCaret = this.text.slice(this.beginCaretPosition);
        const afterCaretTrimmed = afterCaret.slice();
        while (/^\s+$/.test(afterCaretTrimmed[0]))
          afterCaretTrimmed.splice(0, 1);
        const firstSpaceIndex = afterCaretTrimmed.findIndex((x) => /^\s+$/.test(x));
        if (firstSpaceIndex < 0)
          this.text.splice(this.beginCaretPosition, afterCaret.length);
        else
          this.text.splice(this.beginCaretPosition, afterCaret.length - afterCaretTrimmed.length + firstSpaceIndex);
        break;
      }
    } else if (direction < 0) {
      // 커서 왼쪽 삭제
      switch (range) {
      case RangeSubtype.character:
        if (this.beginCaretPosition > 0) {
          this.text.splice(this.beginCaretPosition - 1, 1);
          this.beginCaretPosition--;
          this.endCaretPosition--;
        }
        break;
      case RangeSubtype.word:
        const beforeCaret = this.text.slice(0, this.beginCaretPosition);
        const beforeCaretTrimmed = beforeCaret.slice();
        while (/^\s+$/.test(beforeCaretTrimmed[beforeCaretTrimmed.length - 1]))
          beforeCaretTrimmed.pop();
        const finalSpaceIndex = beforeCaretTrimmed.findLastIndex((x) => /^\s+$/.test(x));
        if (finalSpaceIndex < 0) {
          this.text.splice(this.beginCaretPosition - beforeCaret.length, beforeCaret.length);
          this.beginCaretPosition = 0;
        } else {
          this.text.splice(this.beginCaretPosition - (beforeCaret.length - finalSpaceIndex - 1), beforeCaret.length - finalSpaceIndex - 1);
          this.beginCaretPosition -= (beforeCaret.length - finalSpaceIndex - 1);
        }
        this.endCaretPosition = this.beginCaretPosition;
        break;
      }
    } else {
      // 커서 포함 삭제
    }
    this.renderText();
  },
  deleteSelection: function () {
    const beginIndex = Math.min(this.beginCaretPosition, this.endCaretPosition);
    const length = Math.abs(this.beginCaretPosition - this.endCaretPosition);
    this.text.splice(beginIndex, length);
    this.beginCaretPosition = beginIndex;
    this.endCaretPosition = this.beginCaretPosition;
    this.renderText();
  },
  addCharacter: function (character) {
    this.deleteSelection();
    this.text.splice(this.beginCaretPosition, 0, character);
    this.beginCaretPosition++;
    this.endCaretPosition++;
    this.renderText();
  },
};