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

  if (textNode.nodeType === Node.TEXT_NODE) {
    dragging = true;
    const processedTextElement = document.getElementById('processedText');
    console.log(processedTextElement.contains(textNode), textNode);
    if (processedTextElement.contains(textNode)) {
      if (textNode.parentNode === processedTextElement.childNodes[1])
        offset += Math.min(textBuffer.beginCaretPosition, textBuffer.endCaretPosition);
      if (textNode.parentNode === processedTextElement.childNodes[2])
        offset += Math.max(textBuffer.beginCaretPosition, textBuffer.endCaretPosition);
      textBuffer.beginCaretPosition = offset;
      textBuffer.endCaretPosition = offset;
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

  if (textNode.nodeType === Node.TEXT_NODE) {
    const processedTextElement = document.getElementById('processedText');
    if (processedTextElement.contains(textNode)) {
      if (textNode.parentNode === processedTextElement.childNodes[1])
        offset += Math.min(textBuffer.beginCaretPosition, textBuffer.endCaretPosition);
      if (textNode.parentNode === processedTextElement.childNodes[2])
        offset += Math.max(textBuffer.beginCaretPosition, textBuffer.endCaretPosition);
      textBuffer.endCaretPosition = offset;
      textBuffer.renderText();
    }
  }
});
document.addEventListener('mouseup', (e) => {
  if (dragging)
    document.getElementById('processedText').focus();
  dragging = false;
});