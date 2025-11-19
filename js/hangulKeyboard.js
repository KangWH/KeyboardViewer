class HangulInputSource extends InputSource {
  constructor (name, script, language, keys, composingRule, noWin = false, noMac = false) {
    super(name, script, language, keys, noWin, noMac);

    this.composer = new HangulComposer(composingRule);
  }
}

class HangulComposer {
  constructor (composingRule, composingUnit = 0) {
    this.composing = false;
    this.composingBuffer = [];
    this.imeMode = 0;
    // 0: 꺼짐, 1: 조합 중, 2: 조합 중이 아님
    this.composingRule = composingRule;
    this.composingUnit = composingUnit;
    // 0: 낱자, 1: 단어

    this.composingMode = 2;
    // 0: KS X 1001 2350자
    // 1: Adobe-KR-0 2780자
    // 2: 현대 한글 11172자
    // 3: 현대 한글 + 제주 PUA
    // 4: 현대 한글 + 한양 PUA
    // 5: 현대 한글 + 한양 PUA + 첫가끝 옛한글
    // 6: 현대 한글 + 첫가끝 옛한글
    // 7: 현대 한글도 첫가끝 자모로
  }

  buildSyllable (l, v, t = null, m = null, HPUA = false, JPUA = false) {
    const result = [];

    // 초중종 모두 현대 한글 낱자인지 판단
    let choseongIndex = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'].indexOf(l);
    let jungseongIndex = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'].indexOf(v);
    let jongseongIndex = [null, 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'].indexOf(t);
    if (choseongIndex >= 0 && jungseongIndex >= 0 && jongseongIndex >= 0) {
      let syllableUnicode = 44032 + choseongIndex * 21 * 28 + jungseongIndex * 28 + jongseongIndex;
      return [String.fromCodePoint(syllableUnicode) + (m ? m : '')];
    }
    if (this.composingMode < 3) {
      if (choseongIndex >= 0 && jungseongIndex >= 0) {
        let syllableUnicode = 44032 + choseongIndex * 21 * 28 + jungseongIndex * 28;
        return [String.fromCodePoint(syllableUnicode), t];
      } else
        return [l, v, t];
    }

    // 초성, 중성, 종성 중 하나라도 옛한글 낱자이거나, 초성/중성 중 하나 이상 없을 때
    let choseongUnicode = 0;
    if (choseongIndex >= 0)
      choseongUnicode = 4352 + choseongIndex;
    else if (l === null)
      choseongUnicode = 4447;
    else {
      switch (l) {
        case 'ㅥ':
          choseongUnicode = 4372; break;
        case 'ㅦ':
          choseongUnicode = 4373; break;
        case 'ㅧ':
          choseongUnicode = 4443; break;
        case 'ㅪ':
          choseongUnicode = 0xA966; break;
        case 'ㄻ':
          choseongUnicode = 0xA968; break;
        case 'ㄼ':
          choseongUnicode = 0xA969; break;
        case 'ㅮ':
          choseongUnicode = 0x111C; break;
        case 'ㅯ':
          choseongUnicode = 0xA971; break;
        case 'ㅱ':
          choseongUnicode = 0x111D; break;
        case 'ㅲ':
          choseongUnicode = 0x111E; break;
        case 'ㅳ':
          choseongUnicode = 0x1120; break;
        case 'ㅄ':
          choseongUnicode = 0x1121; break;
        case 'ㅴ':
          choseongUnicode = 0x1122; break;
        case 'ㅵ':
          choseongUnicode = 0x1123; break;
        case 'ㅶ':
          choseongUnicode = 0x1127; break;
        case 'ㅷ':
          choseongUnicode = 0x1129; break;
        case 'ㅸ':
          choseongUnicode = 0x112B; break;
        case 'ㅹ':
          choseongUnicode = 0x112C; break;
        case 'ㅺ':
          choseongUnicode = 0x112D; break;
        case 'ㅻ':
          choseongUnicode = 0x112E; break;
        case 'ㅼ':
          choseongUnicode = 0x112F; break;
        case 'ㅽ':
          choseongUnicode = 0x1132; break;
        case 'ㅾ':
          choseongUnicode = 0x1136; break;
        case 'ㅿ':
          choseongUnicode = 0x1140; break;
        case 'ㆀ':
          choseongUnicode = 0x1147; break;
        case 'ㆁ':
          choseongUnicode = 0x114C; break;
        case 'ㆄ':
          choseongUnicode = 0x1157; break;
        case 'ㆅ':
          choseongUnicode = 0x1158; break;
        case 'ㆆ':
          choseongUnicode = 0x1159; break;
      }
    }

    let jungseongUnicode = 0;
    if (jungseongIndex >= 0)
      jungseongUnicode = 4449 + jungseongIndex;
    else if (v === null)
      jungseongUnicode = 4448;
    else {
      switch (v) {
        case 'ㆇ':
          jungseongUnicode = 0x1184; break;
        case 'ㆈ':
          jungseongUnicode = 0x1185; break;
        case 'ㆉ':
          jungseongUnicode = 0x1188; break;
        case 'ㆊ':
          jungseongUnicode = 0x1191; break;
        case 'ㆋ':
          jungseongUnicode = 0x1192; break;
        case 'ㆌ':
          jungseongUnicode = 0x1194; break;
        case 'ㆍ':
          jungseongUnicode = 0x119E; break;
        case 'ㆎ':
          jungseongUnicode = 0x11A1; break;
      }
    }

    let jongseongUnicode = 0;
    if (jongseongIndex > 0)
      jongseongUnicode = 4519 + jongseongIndex;
    else if (jongseongIndex === 0)
      // No jongseong
      jongseongUnicode = -1;
    else {
      switch (t) {
        case 'ᄓ':
          jongseongUnicode = 0x11C5; break;
        case 'ㅥ':
          jongseongUnicode = 0x11FF; break;
        case 'ㅦ':
          jongseongUnicode = 0x11C6; break;
        case 'ㅧ':
          jongseongUnicode = 0x11C7; break;
        case 'ㅨ':
          jongseongUnicode = 0x11C8; break;
        case 'ᄗ':
          jongseongUnicode = 0x11CA; break;
        case 'ㄸ':
          jongseongUnicode = 0xD7CD; break;
        case 'ᅞ':
          jongseongUnicode = 0x11CB; break;
        case 'ꥡ':
          jongseongUnicode = 0xD7CF; break;
        case 'ꥢ':
          jongseongUnicode = 0xD7D0; break;
        case 'ꥣ':
          jongseongUnicode = 0xD7D2; break;
        case 'ꥥ':
          jongseongUnicode = 0xD7D5; break;
        case 'ㅩ':
          jongseongUnicode = 0x11CC; break;
        case 'ᄘ':
          jongseongUnicode = 0x11CD; break;
        case 'ㅪ':
          jongseongUnicode = 0x11CE; break;
        case 'ᄙ':
          jongseongUnicode = 0x11D0; break;
        case 'ꥫ':
          jongseongUnicode = 0x11D5; break;
        case 'ꥮ':
          jongseongUnicode = 0x11D8; break;
        case 'ㅭ':
          jongseongUnicode = 0x11D9; break;
        case 'ᄛ':
          jongseongUnicode = 0xD7DD; break;
        case 'ꥯ':
          jongseongUnicode = 0x11DA; break;
        case 'ㅮ':
          jongseongUnicode = 0x11DC; break;
        case 'ㅯ':
          jongseongUnicode = 0x11DD; break;
        case 'ㅱ':
          jongseongUnicode = 0x11E2; break;
        case 'ㅳ':
          jongseongUnicode = 0xD7E3; break;
        case 'ㅃ':
          jongseongUnicode = 0xD7E6; break;
        case 'ㅵ':
          jongseongUnicode = 0xD7E7; break;
        case 'ㅶ':
          jongseongUnicode = 0xD7E8; break;
        case 'ᄨ':
          jongseongUnicode = 0xD7E9; break;
        case 'ᄪ':
          jongseongUnicode = 0x11E4; break;
        case 'ꥴ':
          jongseongUnicode = 0x11E5; break;
        case 'ㅸ':
          jongseongUnicode = 0x11E6; break;
        case 'ㅺ':
          jongseongUnicode = 0x11E7; break;
        case 'ㅼ':
          jongseongUnicode = 0x11E8; break;
        case 'ᄰ':
          jongseongUnicode = 0x11E9; break;
        case 'ᄱ':
          jongseongUnicode = 0xD7EA; break;
        case 'ㅽ':
          jongseongUnicode = 0x11EA; break;
        case 'ㅾ':
          jongseongUnicode = 0xD7EF; break;
        case 'ᄷ':
          jongseongUnicode = 0xD7F0; break;
        case 'ᄹ':
          jongseongUnicode = 0xD7F1; break;
        case 'ᄻ':
          jongseongUnicode = 0xD7F2; break;
        case 'ㅿ':
          jongseongUnicode = 0x11EB; break;
        case 'ㆁ':
          jongseongUnicode = 0x11F0; break;
        case 'ㅉ':
          jongseongUnicode = 0xD7F9; break;
        case 'ᅖ':
          jongseongUnicode = 0x11F3; break;
        case 'ㆄ':
          jongseongUnicode = 0x11F4; break;
        case 'ㆆ':
          jongseongUnicode = 0x11F9; break;
      }
    }

    if (choseongUnicode === 0 && l.codePointAt(0) >= 12593 && l.codePointAt(0) <= 12678) {
      // 첫가끝 자모로 변환되지 못한 경우 --- 호환용 자모는 별개의 글자로 출력하고, 본래 글자는 초성을 없앰
      result.push(l);
      choseongUnicode = 4447;
    }

    if (jongseongUnicode === 0 && t.codePointAt(0) >= 12593 && t.codePointAt(0) <= 12678)
      // 첫가끝 자모로 변환되지 못한 경우 --- 호환용 자모는 별개의 글자로 출력하고, 본래 글자는 종성을 없앰
      jongseongUnicode = -1;

    const choseong = choseongUnicode ? String.fromCodePoint(choseongUnicode) : l;
    const jungseong = jungseongUnicode ? String.fromCharCode(jungseongUnicode) : v;
    const jongseong = jongseongUnicode ? jongseongUnicode < 0 ? '' : String.fromCharCode(jongseongUnicode) : t;
    const bangjeom = m ? m : '';
    const syllable = choseong + jungseong + jongseong + bangjeom;
    result.push(syllable);

    if (jongseongUnicode === -1 && typeof t === 'string')
      result.push(t);

    return result;
  }

  composeNoVowelBuffer (buffer) {
    const result = [];
    while (buffer.length > 0) {
      let composeLength = 1;
      let finalResult = buffer[0].value;
      while (composeLength < buffer.length) {
        const testChar = buffer.slice(0, composeLength + 1).map((x) => x.value + x.position).join('');
        const composingResult = this.composingRule[testChar];
        if (composingResult) {
          finalResult = composingResult[0];
          composeLength++;
        } else
          break;
      }
      result.push(finalResult);
      buffer.splice(0, composeLength);
    }
    return result;
  }

  // 버퍼에 있는 텍스트를 읽을 수 있는 한글 문자열로 변환합니다.
  compose () {
    const buffer = this.composingBuffer.slice();
    const result = [];

    // 조합 구현 과정:
    // 버퍼의 가장 마지막 중성 위치 파악 (vowelIndex)
    // 그전 중성의 위치 파악 (preVowelIndex)
    // 중성 뒷부분(postVowel): 종성으로 사용 후 남은 글자는 낱자로
    // 중성 앞부분: 마지막 글자를 초성으로 사용
    
    // 버퍼에서 맨 마지막 중성의 인덱스를 찾습니다.
    let vowelIndex = buffer.length - 1;
    while (vowelIndex >= 0 && buffer[vowelIndex].position !== 2)
      vowelIndex--;

    // 중성이 없는 경우: 자음만 결합하고 종료
    if (vowelIndex < 0)
      return this.composeNoVowelBuffer(buffer);

    while (buffer.length > 0) {
      // 중성이 여러 자 이어진 경우, 맨 첫 번째 중성으로 인덱스 이동
      while (vowelIndex > 0 && buffer[vowelIndex - 1].position === 2)
        vowelIndex--;

      // 중성 조합 찾기
      let jungseongLength = 1;
      let jungseong = buffer[vowelIndex].value;
      while (true) {
        const testChars = buffer.slice(vowelIndex, vowelIndex + jungseongLength + 1);
        if (testChars.length < jungseongLength + 1 || testChars[testChars.length - 1].position !== 2)
          break;
        const testChar = testChars.map((x) => `${x.value}${x.position}`).join('');
        const compResult = this.composingRule[testChar];
        if (compResult)
          jungseong = compResult[0];
        else
          break;
        jungseongLength++;
      }

      let preVowelIndex = vowelIndex - 1;
      while (preVowelIndex >= 0 && buffer[preVowelIndex].position !== 2)
        preVowelIndex--;

      const jaso = {choseong: undefined, jungseong: undefined, jongseong: undefined, bangjeom: null};
      jaso.jungseong = jungseong;

      // 종성 찾기
      const jongseongIndex = vowelIndex + jungseongLength;
      let jongseongLength = 0; // 초깃값: 종성이 없음
      let jongseong = null;
      // 첫 번째 종성 테스트
      const testChar = buffer[jongseongIndex];
      if (testChar && [3, 4].includes(testChar.position)) {
        jongseongLength = 1;
        jongseong = testChar.value;
        while (true) {
          // 조합 규칙을 바탕으로 버퍼에서 가능한 최장 종성 조합을 찾음
          const testChars = buffer.slice(jongseongIndex, jongseongIndex + jongseongLength + 1);
          if (testChars.length < jongseongLength + 1 || ![3, 4].includes(testChars[jongseongLength - 1].position))
            break;
          const testChar = testChars.map((x) => `${x.value}${x.position}`).join('');
          const compResult = this.composingRule[testChar];
          if (compResult && compResult.includes('3'))
            jongseong = compResult[0];
          else
            break;
          jongseongLength++;
        }
      }
      jaso.jongseong = jongseong;


      // 종성 뒷부분의 버퍼에 남은 글자들
      const leftovers = buffer.splice(jongseongIndex + jongseongLength);
      if (leftovers.length > 0 && leftovers[0].position === 5) { // 방점
        const bangjeom = leftovers.splice(0, 1)[0].value;
        jaso.bangjeom = bangjeom;
      }
      result.splice(0, 0, ...this.composeNoVowelBuffer(leftovers));
      buffer.splice(buffer.length - jongseongLength);

      // 초성 구하기
      const preVowel = buffer.slice(preVowelIndex + 1, vowelIndex);
      const isAllJaeum = preVowel.map((x) => x.position === 4).reduce((x, y) => x && y, true);
      let choseongLength = 1;
      if (preVowelIndex >= 0 && isAllJaeum) {
        // 두 중성 사이에 자음(position 4)만 연속된 경우: 앞 글자의 종성을 조합해본 후, 남는 글자들로 초성을 조합
        // 단, 자음들 중 맨 마지막 것은 남겨야 함 (두벌식에서 초성 없는 글자 방지)
        let preJongseongLength = 0;
        while (preJongseongLength + 1 < preVowel.length) {
          const testChars = preVowel.slice(0, preJongseongLength + 1);
          const testChar = testChars.map((x) => x.value + x.position).join('');
          const compResult = this.composingRule[testChar];
          if (testChars.length > 1 && !compResult)
            break;
          preJongseongLength++;
        }
        preVowel.splice(0, preJongseongLength);
      } else {
        // 자음이 아닌 글자가 껴 있는 경우: 그 글자의 뒷부분만 검사
        const choseong = preVowel[preVowel.length - 1];
        if (choseong) {
          if (choseong.position !== 1 && choseong.position !== 4)
            // 중성 앞에 있는 낱자가 초성도 자음이 아닌 경우, 초성 없는 글자
            jaso.choseong = null;
          else {
            let beginPosition = preVowel.length - 1;
            while (beginPosition > 0 && preVowel[beginPosition - 1].position === choseong.position)
              beginPosition--;
            preVowel.splice(0, beginPosition);
          }
        } else
          jaso.choseong = null;
      }
      if (jaso.choseong === undefined) {
        choseongLength = preVowel.length;
        while (choseongLength > 1) {
          const testChar = preVowel.slice(preVowel.length - choseongLength).map((x) => `${x.value}${x.position}`).join('');
          const compResult = this.composingRule[testChar];
          if (compResult && compResult.includes('1')) {
            const choseong = compResult[0];
            jaso.choseong = choseong;
            break;
          }
          choseongLength--;
        }
        if (choseongLength === 1) {
          jaso.choseong = preVowel[preVowel.length - 1].value;
        } else if (choseongLength === 0) {
          jaso.choseong = null;
        }
      }

      // 초성, 중성, 종성을 모두 구한 경우, 낱자 만들기
      const syllable = this.buildSyllable(jaso.choseong, jaso.jungseong, jaso.jongseong, jaso.bangjeom);
      result.splice(0, 0, ...syllable);

      // 초성 앞부분부터 위의 과정 반복
      buffer.splice(vowelIndex);
      if (jaso.choseong)
        buffer.splice(buffer.length - choseongLength);
      vowelIndex = preVowelIndex;

      // 단, 남은 중성이 더 없는 경우, 버퍼에 남은 글자들을 그대로 문자열에 추가
      if (preVowelIndex < 0) {
        result.splice(0, 0, ...buffer.map((x) => x.value));
        break;
      }

    }

    return result;
  }

  endCompose () {
    const composingResult = this.compose();
    this.composing = false;
    this.composingBuffer = [];
    return composingResult;
  }
}

class HangulKeyValue extends KeyValue {
  constructor (value, position, label = undefined, type = 2) {
    super(value, label, type);
    this.position = position;
    // 0: Normal, 1: Choseong, 2: Jungseong/Moeum, 3: Jongseong, 4: Jaeum, 5: Bangjeom, 6: Ignore
  }
}
