let dragging = false;
document.addEventListener('mousedown', (e) => {
  // TODO: 키보드나 입력기 창을 클릭한 경우에는 return

  activeInputSource.flush();

  if (textBuffer.text.length < 1) {
    textBuffer.beginCaretPosition = 0;
    textBuffer.endCaretPosition = 0;
    textBuffer.renderText();
    return;
  }

  const x = e.clientX;
  const y = e.clientY;
  let textNode, offset;
  if (document.caretPositionFromPoint) {
    const caretPosition = document.caretPositionFromPoint(x, y);
    if (!caretPosition)
      return;
    textNode = caretPosition.offsetNode;
    offset = caretPosition.offset;
  } else {
    // for Safari compatibility
    const caretPosition = document.caretRangeFromPoint(x, y);
    if (!caretPosition)
      return;
    textNode = caretPosition.startContainer;
    offset = caretPosition.startOffset;
  }

  const processedTextElement = document.getElementById('processedText');

  let chars = 0;
  let index = textNode.parentNode === processedTextElement.firstChild ? 0 : textBuffer.beginCaretPosition;
  for (; index < textBuffer.text.length; index++) {
    chars += textBuffer.text[index].length;
    if (chars > offset)
      break;
  }
  index -= (textNode.parentNode === processedTextElement.firstChild ? 0 : textBuffer.beginCaretPosition);

  if (textNode.nodeType === Node.TEXT_NODE) {
    dragging = true;
    if (processedTextElement.contains(textNode)) {
      if (textNode.parentNode === processedTextElement.childNodes[1])
        index += Math.min(textBuffer.beginCaretPosition, textBuffer.endCaretPosition);
      if (textNode.parentNode === processedTextElement.childNodes[2])
        index += Math.max(textBuffer.beginCaretPosition, textBuffer.endCaretPosition);
      textBuffer.beginCaretPosition = index;
      textBuffer.endCaretPosition = index;
      textBuffer.renderText();
    }
  }
});
document.addEventListener('mousemove', (e) => {
  if (!dragging)
    return;

  const x = e.clientX;
  const y = e.clientY;

  let textNode, offset;
  if (document.caretPositionFromPoint) {
    const caretPosition = document.caretPositionFromPoint(x, y);
    if (!caretPosition)
      return;
    textNode = caretPosition.offsetNode;
    offset = caretPosition.offset;
  } else {
    const caretPosition = document.caretRangeFromPoint(x, y);
    if (!caretPosition)
      return;
    textNode = caretPosition.startContainer;
    offset = caretPosition.startOffset;
  }

  const processedTextElement = document.getElementById('processedText');

  let chars = 0;
  let index = textNode.parentNode === processedTextElement.firstChild ? 0 : textBuffer.beginCaretPosition;
  for (; index < textBuffer.text.length; index++) {
    chars += textBuffer.text[index].length;
    if (chars > offset)
      break;
  }
  index -= (textNode.parentNode === processedTextElement.firstChild ? 0 : textBuffer.beginCaretPosition);

  if (textNode.nodeType === Node.TEXT_NODE) {
    if (processedTextElement.contains(textNode)) {
      if (textNode.parentNode === processedTextElement.childNodes[1])
        index += Math.min(textBuffer.beginCaretPosition, textBuffer.endCaretPosition);
      if (textNode.parentNode === processedTextElement.childNodes[2])
        index += Math.max(textBuffer.beginCaretPosition, textBuffer.endCaretPosition);
      textBuffer.endCaretPosition = index;
      textBuffer.renderText();
    }
  }
});
document.addEventListener('mouseup', (e) => {
  if (dragging)
    document.getElementById('processedText').focus();
  dragging = false;
});