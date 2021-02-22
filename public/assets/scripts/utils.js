export function menuHandler(menu, action = null) {
    document.querySelector(menu).classList.toggle(action);
}