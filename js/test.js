(async () => {
  await activeInputSources.addSource('qwertyUS');
  await activeInputSources.addSource('dubeolsikYethangul');
  await activeInputSources.addSource('sebeolsik391');
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