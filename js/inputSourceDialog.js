document.getElementById('inputSourceSelector-button').addEventListener('click', (e) => {
  showActiveInputSources();
  document.getElementById('inputSourceSelector-dialog').showModal();
});

const showActiveInputSources = (focusIndex = 0) => {
  const container = document.getElementById('inputSourceSelector-container');
  container.innerHTML = '';

  for (let item of activeInputSources.sources) {
    const li = document.createElement('li');
    li.setAttribute('tabindex', -1);
    li.setAttribute('identifier', item.identifier);
    li.addEventListener('click', selectListItem);
    li.textContent = inputSources[item.identifier].names.en;
    container.append(li);
  }

  container.children[focusIndex].classList.add('active');
};

const selectListItem = (e) => {
  const container = e.currentTarget.parentElement;
  (container.querySelector('li.active') || document.body).classList.remove('active');
  e.currentTarget.classList.add('active');
};

document.getElementById('inputSourceSelector-form').select.addEventListener('click', (e) => {
  e.preventDefault();
  const activeElement = document.getElementById('inputSourceSelector-container').querySelector('li.active');
  if (activeElement) {
    const identifier = activeElement.getAttribute('identifier');
    const index = activeInputSources.sources.findIndex((x) => x.identifier === identifier);
    activeInputSources.useSource(index);
  }
  document.getElementById('inputSourceSelector-dialog').close();
});
document.getElementById('inputSourceSelector-form').add.addEventListener('click', (e) => {
  const query = document.getElementById('addInputSource-form').search.value.trim();
  const groups = showInputSourceGroups(Boolean(query));
  if (query)
    searchInputSources(query);
  else
    showInputSources(groups[0]);

  document.getElementById('addInputSource-dialog').showModal();
});
document.getElementById('inputSourceSelector-form').delete.addEventListener('click', (e) => {
  if (activeInputSources.sources.length < 2) {
    alert('There should be at least one active input source.');
    return;
  }

  const activeElement = document.getElementById('inputSourceSelector-container').querySelector('li.active');
  if (activeElement) {
    const identifier = activeElement.getAttribute('identifier');
    const index = Math.min(activeInputSources.sources.findIndex((x) => x.identifier === identifier), activeInputSources.sources.length - 2);
    activeInputSources.deleteSource(identifier);
    showActiveInputSources(index);
  }
});

const showInputSourceGroups = (searching = false) => {
  const container = document.getElementById('addInputSource-languageContainer');
  container.innerHTML = '';

  if (searching) {
    const li = document.createElement('li');
    li.setAttribute('tabindex', -1);
    li.textContent = 'Search result';
    li.addEventListener('click', selectListItem);
    li.addEventListener('click', (e) => {searchInputSources(document.getElementById('addInputSource-form').search.value.trim())});
    container.append(li);
  }
  
  const languages = new Set();
  for (let id in inputSources)
    languages.add(inputSources[id].directory);

  const groups = [...languages].sort();
  for (let language of groups) {
    const li = document.createElement('li');
    li.setAttribute('tabindex', -1);
    li.setAttribute('value', language);
    li.textContent = language;
    li.addEventListener('click', selectListItem);
    li.addEventListener('click', async (e) => {await showInputSources(e.currentTarget.getAttribute('value'))});
    container.append(li);
  }

  container.firstChild.classList.add('active');

  return groups;
};
const showInputSources = async (group) => {
  const container = document.getElementById('addInputSource-sourceContainer');
  container.innerHTML = '';

  const activeInputSourceIds = activeInputSources.sources.map((source) => source.identifier);

  for (let id in inputSources) {
    if (inputSources[id].directory !== group)
      continue;

    const response = await fetch(`https://kangwh.github.io/KeyboardViewer/json/keyboards/${group}/${id}.json`, {method: "HEAD"});
    if (!response.ok)
      continue;

    const li = document.createElement('li');
    if (activeInputSourceIds.includes(id))
      li.setAttribute('disabled', '');
    else {
      li.setAttribute('tabindex', -1);
      li.addEventListener('click', selectListItem);
    }
    li.setAttribute('value', id);
    li.textContent = inputSources[id].names.en;
    container.append(li);
  }

  container.firstChild.classList.add('active');
};
const searchInputSources = (query) => {
  const container = document.getElementById('addInputSource-sourceContainer');
  container.innerHTML = '';

  for (let id in inputSources) {
    let match = false;
    match ||= id.includes(query);
    match ||= inputSources[id].directory.includes(query);
    match ||= Object.values(inputSources[id].names).some((x) => x.includes(query));
    if (!match)
      continue;

    const li = document.createElement('li');
    li.setAttribute('tabindex', -1);
    li.setAttribute('value', id);
    li.textContent = inputSources[id].names.en;
    li.addEventListener('click', selectListItem);
    container.append(li);
  }

  if (container.firstChild)
    container.firstChild.classList.add('active');
  else
    container.textContent = 'No search result';
}

document.getElementById('addInputSource-form').cancel.addEventListener('click', (e) => {
  document.getElementById('addInputSource-dialog').close();
});
document.getElementById('addInputSource-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const target = document.getElementById('addInputSource-sourceContainer').querySelector('li.active');
  if (target) {
    const identifier = target.getAttribute('value');
    await activeInputSources.addSource(identifier);
    showActiveInputSources();
    document.getElementById('addInputSource-dialog').close();
  }
});

document.getElementById('addInputSource-form').search.addEventListener('keyup', (e) => {
  if (e.isComposing)
    return;

  if (e.code.includes('Enter')) {
    e.preventDefault();
    return;
  }

  const query = e.currentTarget.value.trim();
  const groups = showInputSourceGroups(Boolean(query));
  if (query)
    searchInputSources(query);
  else
    showInputSources(groups[0]);
});