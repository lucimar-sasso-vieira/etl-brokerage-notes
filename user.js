document.addEventListener('DOMContentLoaded', () => {
    const uploadBox = document.getElementById('uploadBox');
    const fileInput = document.getElementById('fileInput');
    const fileSelectLink = document.getElementById('selectFile');
    const fileList = document.getElementById('fileList');
    const saveButton = document.getElementById('saveButton');
    const cancelButton = document.getElementById('cancelButton');

    fileSelectLink.addEventListener('click', (e) => {
        e.preventDefault();
        fileInput.click();
    });

    fileInput.addEventListener('change', handleFiles);
    uploadBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadBox.classList.add('dragover');
    });

    uploadBox.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadBox.classList.remove('dragover');
    });

    uploadBox.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadBox.classList.remove('dragover');
        const files = e.dataTransfer.files;
        handleFiles({ target: { files } });
    });

    saveButton.addEventListener('click', () => {
        const formData = new FormData(document.getElementById('uploadForm'));
        for (let i = 0; i < fileInput.files.length; i++) {
            formData.append('files', fileInput.files[i]);
        }
    });

    cancelButton.addEventListener('click', () => {
        fileList.innerHTML = '';
        fileInput.value = '';
    });

    function handleFiles(event) {
        const files = event.target.files;
        for (let i = 0; i < files.length; i++) {
            const li = document.createElement('li');
            li.innerHTML = `<i class='bx bxs-file-pdf'></i> ${files[i].name} <i class="bx bx-x remove-file" data-index="${i}"></i>`;
            fileList.appendChild(li);
        }
        const removeFileButtons = document.querySelectorAll('.remove-file');
        removeFileButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                removeFile(index);
            });
        });
    }

    function removeFile(index) {
        const dt = new DataTransfer();
        const { files } = fileInput;
        for (let i = 0; i < files.length; i++) {
            if (i != index) {
                dt.items.add(files[i]);
            }
        }
        fileInput.files = dt.files;
        handleFiles({ target: { files: dt.files } });
    }
});