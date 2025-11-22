document.getElementById('hotkeys-button').addEventListener('click', (e) => {
  document.getElementById('hotkeys-dialog').showModal();
});

document.getElementById('hotkeys-form').close.addEventListener('click', (e) => {
  document.getElementById('hotkeys-dialog').close();
});