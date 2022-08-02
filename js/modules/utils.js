export function generateRandomID() {
    return Math.floor(Math.random() * new Date().getTime());
}

export function createElementWithOptions(tagName, options) {
    const element = document.createElement(tagName);
    return Object.assign(element, options);
}

export function addClassesToElement(element, classes) {
    return element.classList.add(...classes);
}