function start_spinner(element) {
    element.textContent = '';
    element.setAttribute('uk-spinner', 'ratio: 0.75');
    element.setAttribute('disabled', 'true');
}

function stop_spinner(element, content) {
    element.textContent = content;
    element.removeAttribute('uk-spinner');
    element.removeAttribute('disabled');
}

export { start_spinner, stop_spinner };
