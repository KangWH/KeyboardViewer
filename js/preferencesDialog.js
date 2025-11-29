document.getElementById('preferences-button').addEventListener('click', (e) => {
  document.getElementById('preferences-dialog').showModal();
});

document.getElementById('preferences-form').close.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('preferences-dialog').close();
});

document.getElementById('preferences-form').addEventListener('change', async (e) => {
  console.log(e.target.type, e.target.name, e.target.value);

  const name = e.target.name;
  const value = e.target.value;

  if (name === 'language') {
    currentLanguage = value;
    const response = await fetchLanguageData(currentLanguage);
    languageData = await response.json();
    applyLanguageToUI();
    return;
  }

  if (e.target.nodeName === 'INPUT' && e.target.type === 'checkbox')
    document.body.classList.toggle(name, e.target.checked);
  else if (e.target.nodeName === 'SELECT') {
    if (value === 'none')
      document.body.removeAttribute(name);
    else
      document.body.setAttribute(name, value);
  }
});