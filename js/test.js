(async () => {
  await activeInputSources.addSource('qwertyUS');
  activeInputSources.useSource(0);
  // await activeInputSources.addSource('dubeolsik');
  // await activeInputSources.addSource('dubeolsikNorth');
  await activeInputSources.addSource('dubeolsikYethangul');
  // await activeInputSources.addSource('sebeolsik390');
  await activeInputSources.addSource('sebeolsik391');
  // await activeInputSources.addSource('sebeolsikNoshift');
  // await activeInputSources.addSource('sebeolsikYethangul');
  await activeInputSources.addSource('romaja');
})();