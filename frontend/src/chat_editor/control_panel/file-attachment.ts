export {};

const icon = document.getElementById('attach-image-icon');
const input = document.getElementById('file-attachment-input') as HTMLInputElement;

if (icon) {
  icon.addEventListener('click', () => {

    if (input) {
        input.click(); // Open the file dialog
    }
  });
}

if (input) {
  input.addEventListener('change', (event) => {
    const fileListContainer = document.querySelector<HTMLDivElement>('.file-attachment-list');

    if (fileListContainer) {
      fileListContainer.innerHTML = ''; // Clear previous file names

      if (input.files) {
        for (const file of Array.from(input.files)) {
          const div = document.createElement('div');
          div.style.display = 'flex';
          div.style.flexDirection = 'row';
          div.style.gap = '5px';
          div.style.alignItems = 'center';
          div.style.justifyContent = 'space-between';
          div.style.borderBottom = '1px solid rgb(228, 228, 228)';
          div.style.fontSize = '0.8rem';

          div.style.cursor = 'pointer';
          div.addEventListener('mouseenter', () => {
            div.style.backgroundColor = '#f0f0f0';
            deleteFileIcon.style.backgroundColor = '#f0f0f0';
            fileLabel.style.backgroundColor = '#f0f0f0';
          });

          div.addEventListener('mouseleave', () => {
            div.style.backgroundColor = '';
            deleteFileIcon.style.backgroundColor = '';
            fileLabel.style.backgroundColor = '';
          });
          // div.style.overflowY = 'hidden';

          fileListContainer.appendChild(div);

          const fileLabel = document.createElement('label');
          fileLabel.textContent = file.name;
          fileLabel.style.cursor = 'pointer';

          div.appendChild(fileLabel);

          const deleteFileIcon = document.createElement('img');
          deleteFileIcon.id = 'delete-file-icon';
          deleteFileIcon.src = 'images/delete.png';
          // deleteFileIcon.style.overflowY = 'hidden';
          deleteFileIcon.width = 15;
          deleteFileIcon.style.cursor = 'pointer';
          deleteFileIcon.style.marginLeft = '5px';
          deleteFileIcon.style.cursor = 'pointer';
          

          deleteFileIcon.addEventListener('click', () => {
            div.remove();
          });

          div.appendChild(deleteFileIcon);
        }
      }
    }
  });
}