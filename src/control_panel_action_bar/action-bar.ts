export {};

document.addEventListener('DOMContentLoaded', () => {
    const resizer = document.querySelector('.resizer') as HTMLElement;
    const actionBar = document.querySelector('.panel-action-bar') as HTMLElement;
    let startY: number;
    let startHeight: number;

    resizer.addEventListener('mousedown', initResize);

    function initResize(e: { clientY: number; }) {
        startY = e.clientY;
        startHeight = parseInt(getComputedStyle(actionBar).height);
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
    }

    function resize(e: { clientY: number; }) {
        const diff = startY - e.clientY;
        actionBar.style.height = `${startHeight + diff}px`;
    }

    function stopResize() {
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
    }
});