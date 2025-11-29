let languageData = {};
let currentLanguage = 'en';

const fetchLanguageData = async (langCode) => {
  const response = await fetch(`https://kangwh.github.io/KeyboardViewer/json/languages/${langCode}.json`);
  return response;
};

const applyLanguageToUI = () => {
  const targets = document.querySelectorAll('[localizationKey]');
  for (let target of targets) {
    const key = target.getAttribute('localizationKey');
    const string = languageData[key];
    if (string !== undefined)
      target.textContent = string;
  }
  document.querySelector('input[type="search"]').setAttribute('placeholder', languageData.search);
  for (let item of document.getElementById('preferences-form').language.children) {
    const langCode = item.value;
    item.textContent = languageData.languages[langCode];
  }
};

(async () => {
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
    // Use english as the fallback language
    const response = await fetchLanguageData('en');
    languageData = await response.json();
  }
  console.log(currentLanguage);
  document.querySelector('select[name="language"]').value = currentLanguage;
  applyLanguageToUI();
})();

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