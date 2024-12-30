
export async function addResizer(resizer: HTMLElement, target: HTMLElement): Promise<void> {
    return new Promise((resolve, reject) => {
        let startY: number;
        let startHeight: number;

        resizer.addEventListener('mousedown', initResize);

        function initResize(e: { clientY: number; }) {
            try {
                startY = e.clientY;
                startHeight = parseInt(getComputedStyle(target).height);
                document.addEventListener('mousemove', resize);
                document.addEventListener('mouseup', stopResize);
            } catch (error) {
                reject(error);
            }
        }

        function resize(e: { clientY: number; }) {
            try {
                const diff = startY - e.clientY;
                target.style.height = `${startHeight + diff}px`;
            } catch (error) {
                reject(error);
            }
        }

        function stopResize() {
            try {
                document.removeEventListener('mousemove', resize);
                document.removeEventListener('mouseup', stopResize);
                resolve(); // Resolve the promise when resizing is complete
            } catch (error) {
                reject(error);
            }
        }
    });
}