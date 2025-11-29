let languageData = {};
let currentLanguage = 'en';
(async () => {
  let languageSet = false;
  const userLanguages = navigator.languages;
  for (let language of userLanguages) {
    const langCode = language.split("-")[0];
    const response = await fetch (`https://kangwh.github.io/KeyboardViewer/json/languages/${langCode}.json`);
    if (response.ok) {
      languageSet = true;
      currentLanguage = langCode;
      languageData = await response.json()
      console.log(currentLanguage);
      return
    }
  }
  if (!languageSet) {
    // Use english as the fallback language
    const response = await fetch ('https://kangwh.github.io/KeyboardViewer/json/languages/en.json');
    const languageData = await response.json();
  }
  applyLanguageToUI();
})();

const applyLanguageToUI = () => {
  const targets = document.querySelectorAll('[localizationKey]');
  for (let target in targets) {
    const key = target.getAttribute('localizationKey');
    const string = languageData[key];
    target.textContent = string;
  }
};

(async () => {
  await activeInputSources.addSource('sebeolsik391');
  await activeInputSources.addSource('dubeolsikYethangul');
  await activeInputSources.addSource('qwertyUS');
  activeInputSources.useSource(0);
})();

document.getElementById('keyboardLayoutVendorType').addEventListener('change', (e) => {
  const element = document.getElementById('keyboard');
  ['mac', 'windows', 'alt'].forEach((x) => element.classList.remove(x));
  const value = e.currentTarget.value;
  const vendor = value.replace('Alt', '');
  element.classList.add(vendor);

  const languageType = document.getElementById('keyboardLayoutLanguageType');
  if (vendor === 'mac') {
    if (languageType.value === 'ks')
      languageType.value = 'ansi';
    else if (languageType.value === 'abnt')
      languageType.value = 'iso';
    languageType.querySelector('option[value="ks"]').setAttribute('disabled', '');
    languageType.querySelector('option[value="abnt"]').setAttribute('disabled', '');
    languageType.dispatchEvent(new Event('change'));
  } else {
    languageType.querySelector('option[value="ks"]').removeAttribute('disabled');
    languageType.querySelector('option[value="abnt"]').removeAttribute('disabled');
  }

  if (value.includes('Alt'))
    element.classList.add('alt');
});
document.getElementById('keyboardLayoutLanguageType').addEventListener('change', (e) => {
  const element = document.getElementById('keyboard');
  ['ansi', 'ks', 'iso', 'abnt', 'jis'].forEach((x) => element.classList.remove(x));
  element.classList.add(e.currentTarget.value);
});