const tabHandler = (e) => {
  const tabButton = e.currentTarget;
  const tabList = tabButton.parentElement;
  const container = tabList.parentElement;
  const targetPanelId = tabButton.getAttribute('aria-controls');
  Array.from(container.querySelectorAll('[role=tabpanel]')).forEach((x) => {
    x.setAttribute('hidden', '');
  });
  Array.from(tabList.querySelectorAll('[role="tab"]')).forEach((x) => {
    x.classList.remove('active');
  });
  try {
    document.getElementById(targetPanelId).removeAttribute('hidden');
  } catch (err) {
    console.log('Tab button with no associated tabpanel clicked.');
  }
  tabButton.classList.add('active');
};
Array.from(document.querySelectorAll('[role=tablist]')).forEach((x) => {
  const container = x.parentElement;
  const tabList = Array.from(x.children);
  tabList.forEach((tab) => {
    tab.addEventListener('click', tabHandler);
  });
  tabList[0].click();
});