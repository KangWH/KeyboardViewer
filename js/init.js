let dataSourceURL = 'https://kangwh.github.io/KeyboardViewer';
let languageData = {};
let currentLanguage = 'en';
let inputSources;
(async () => {
  // Set UI language
  let languageSet = false;
  const userLanguages = navigator.languages;
  for (let language of userLanguages) {
    const langCode = language.split("-")[0];
    const response = await fetchLanguageData(langCode);
    if (response.ok) {
      languageSet = true;
      currentLanguage = langCode;
      languageData = await response.json()
      break
    }
  }
  if (!languageSet) {
    // Use English as the fallback language
    const response = await fetchLanguageData('en');
    languageData = await response.json();
  }
  console.log(`Current UI language code is set to ${currentLanguage}.`);
  document.querySelector('select[name="language"]').value = currentLanguage;
  applyLanguageToUI();

  // Load list of all keyboard layouts
  const keyboardListRes = await fetch(dataSourceURL + '/json/keyboards/keyboards.json');
  inputSources = await keyboardListRes.json();
  Object.freeze(inputSources);

  // Set fallback layout
  const fallbackInputSourceData = await fetch(dataSourceURL + '/json/keyboards/fallback.json');
  const fallbackInputSource = await fallbackInputSourceData.json();
  activeInputSource.fallback = new InputSource(fallbackInputSource);

  // Set initial keyboards
  await activeInputSources.addSource('sebeolsik391');
  await activeInputSources.addSource('dubeolsikYethangul');
  await activeInputSources.addSource('qwertyUS');
  activeInputSources.useSource(0);

  return
})();