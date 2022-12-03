const dropArea = document.getElementById('drop-area');
const dragText = document.getElementById('drag-text');
const uploadForm = document.getElementById('log-upload-form');
const loader = document.getElementById('loader');
const resultDiv = document.getElementById('result');


['dragover', 'drop', 'submit'].forEach(eventName => {
    dropArea.addEventListener(eventName, (event) => {
    resultDiv.innerHTML = '';
    event.preventDefault();
    })
}, false);

['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false)
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false)
});

function highlight(e) {
    dragText.classList.remove('text-gray-600');
    dragText.classList.add('text-green-500');
}

function unhighlight(e) {
    dragText.classList.add('text-gray-600');
    dragText.classList.remove('text-green-500');
}

dropArea.addEventListener('drop', handleDrop, false);
uploadForm.addEventListener('submit', uploadFileFromForm, false);

function handleSubmit(e) {
    uploadFileFromForm();
}

function handleDrop(e) {
  let dt = e.dataTransfer
  let files = dt.files

  handleFiles(files)
}

function handleFiles(files) {
  ([...files]).forEach(uploadFile)
}

function uploadFile(file) {
    if (file.size > 12582912) {
        resultDiv.innerHTML = '<p class="text-center text-red-500 font-semibold">This exceeds the file limit of 10MB</p>';
        return;
    }
    loader.classList.remove('hidden');
    let formData = new FormData(uploadForm);
    formData.append('file', file);
    fetch('./process-logfile', {
        method: 'POST',
        body: formData
    })
    .then((response) => response.text())
    .then (text => {
        loader.classList.add('hidden');
        resultDiv.innerHTML = text;
    })
    .catch(() => { /* Error. Inform the user */ })
}

function uploadFileFromForm() {
    let file = document.getElementById('fileElem').files[0];
    if (file.size > 12582912) {
        resultDiv.innerHTML = '<p class="text-center text-red-500 font-semibold">This exceeds the file limit of 12MB</p>';
        return;
    }
    loader.classList.remove('hidden');
    let formData = new FormData();
    formData.append('file', file);
    fetch('./process-logfile', {
        method: 'POST',
        body: formData
    })
    .then((response) => response.text())
    .then (text => {
        loader.classList.add('hidden');
        resultDiv.innerHTML = text;
        $(document).find(`#logs-table`).each(function() {
            $(this).dynamitable()
                .addFilter('.js-filter')
                .addSorter('.js-sorter-asc', 'asc')
                .addSorter('.js-sorter-desc', 'desc')
            ;
        });
    })
    .catch(() => { /* Error. Inform the user */ })
}