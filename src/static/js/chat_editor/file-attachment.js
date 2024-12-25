document.getElementById('attach-image-icon').addEventListener('click', () => {
    const input = document.getElementById('file-attachment-input');
    input.click(); // Open the file dialog
});

document.getElementById('file-attachment-input').addEventListener('change', (event) => {
    const input = event.target;
    const fileListContainer = document.querySelector('.file-attachment-list');
    fileListContainer.innerHTML = ''; // Clear previous file names

    if (input.files && input.files.length > 0) {
        Array.from(input.files).forEach(file => {
            const div = document.createElement('div');
            div.style.display = 'flex';
            div.style.flexDirection = 'row';
            div.gap = 5;
            div.style.alignItems = 'center';
            div.style.justifyContent = 'space-between';

            fileListContainer.appendChild(div);

            const fileLabel = document.createElement('label');
            fileLabel.textContent = file.name;

			// fileLabel.style.color = 'black';
            div.appendChild(fileLabel);
            const deleteFileIcon = document.createElement('img');
            deleteFileIcon.id = 'delete-file-icon';
            deleteFileIcon.addEventListener('click', () => {
                div.remove();
            });

            deleteFileIcon.src = '../static/images/delete.png';
            deleteFileIcon.width = 15;
            deleteFileIcon.style.cursor = 'pointer';
            deleteFileIcon.style.marginLeft = '5px';

            div.appendChild(deleteFileIcon);
        });
    }
});

