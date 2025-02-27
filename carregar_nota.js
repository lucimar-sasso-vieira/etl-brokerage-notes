document.getElementById('file-upload').addEventListener('change', function(event) {
    const files = event.target.files;
    const fileList = document.getElementById('file-list');
    fileList.innerHTML = '';
    for (let i = 0; i < files.length; i++) {
        const li = document.createElement('li');
        li.textContent = files[i].name;
        fileList.appendChild(li);
    }
});

function handleDrop(event) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    document.getElementById('file-upload').files = files;

    const fileList = document.getElementById('file-list');
    fileList.innerHTML = '';
    for (let i = 0; i < files.length; i++) {
        const li = document.createElement('li');
        li.textContent = files[i].name;
        fileList.appendChild(li);
    }
}