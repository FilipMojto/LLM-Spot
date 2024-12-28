// When the user clicks on <div>, open the popup
export function openAccountSettingsWindow() {
    const popup = document.querySelector('.account-settings-popup') as HTMLElement;
    popup.style.display = 'block';
}

(document.getElementById('close-popup') as HTMLElement).addEventListener('click', () => {
    (document.querySelector('.account-settings-popup') as HTMLElement).style.display = 'none';
});

(document.getElementById('save-settings') as HTMLElement).addEventListener('click', () => {
    // Add logic to save settings here
    alert('Settings saved!');
    (document.querySelector('.account-settings-popup') as HTMLElement).style.display = 'none';
});