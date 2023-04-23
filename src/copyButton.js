const button = document.getElementById("copyButton");
button.addEventListener("click", () => {
    console.log("hit");
    // Get the element you want to copy the text from
    const element = document.getElementById("text-content");

    // Create a range object and select the element's text
    const range = document.createRange();
    range.selectNodeContents(element);

    // Create a new selection object and add the range to it
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    // Copy the selected text to the clipboard
    document.execCommand("copy");

    // Clear the selection
    selection.removeAllRanges();
});
