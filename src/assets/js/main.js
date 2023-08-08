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
        resultDiv.innerHTML = '<p class="text-center text-red-500 font-semibold">This exceeds the file limit of 12MB</p>';
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
        $(document).ready(() => {
            const table = drawDataGrid(`logs-table`);
            buildDataGridFilters(table, `logs-table`, []);
            // On every re-draw, rebuild them
            table.on('draw', () => {
                console.log(`redraw occured`);
                buildDataGridFilters(table, `logs-table`, []);
            });
        });
    })
    .catch(() => { /* Error. Inform the user */ })
}

const drawDataGrid = (id) => {
    const tableWrapper = $('<div style="max-height: 600px; overflow: auto;"></div>'); // Create a wrapper div for the table
    const table = $(`#${id}`).DataTable({
        ordering: false, // Need to make it work so it orders from the 1st row not the 2nd where the filters are
        /*
        scrollY: 600,
        scrollX: 600,
        */
        //scrollCollapse: false,
        paging: true,
        pagingType: 'full_numbers',
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
        //stateSave: true,
        createdRow: function (row, data, dataIndex) {
            $(row).attr('tabindex', dataIndex)
            $(row).addClass('focus:outline-none focus:bg-gray-300 focus:text-gray-900 dark:focus:bg-gray-700 dark:focus:text-amber-500');
        },
        "columnDefs": [{
            "targets": "_all",
            "createdCell": function (td, cellData, rowData, row, col) {
                $(td).addClass('py-4 px-6 border border-slate-400 max-w-md break-words');
            }
        }],
        initComplete: function () {
            $(`#${id}-loading-table`).remove();
            document.getElementById(`${id}`).classList.remove('hidden');
        },
    });
    $(`#${id}`).wrap(tableWrapper); // Wrap the table with the wrapper div
    return table;
}

const buildDataGridFilters = (table, tableId, columnSkipArray, extraColumns) => {
    const isExtraColumns = extraColumns === "1"; // Convert string to boolean

    // Loop through each column of the DataTable
    table.columns().every(function (col) {
        // Check if the current column should be skipped based on conditions
        if ((isExtraColumns && (col === 0 || col === table.columns().indexes().length - 1)) || columnSkipArray.includes(col)) {
            return;
        }
        const column = table.column(this, { search: 'applied' }); // Get the DataTable column object

        // Create a select element and append it to the appropriate table header cell. (1) in this case is the 2nd thead so it doesn't do it on the first where the column names are
        const select = $('<select class="text-center m-1 p-1 text-sm text-gray-900 border border-gray-300 rounded bg-gray-50 focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"><option value="">No filter</option></select>')
            .appendTo($(`#${tableId} thead tr:eq(1) th`).eq(column.index()).empty())
            .on('change', function () {
                const val = $.fn.dataTable.util.escapeRegex(
                    $(this).val()
                );

                // Apply the selected filter value to the column and redraw the table
                column
                    .search(val ? '^' + val + '$' : '', true, false)
                    .draw();
            });

        // Iterate through the unique values in the column, create options for the select element
        column.data().unique().sort().each(function (d, j) {
            if (d !== null) {
                // Truncate long select fields and add a title for hover
                let optionText = d;
                if (optionText.length > 90) {
                    optionText = optionText.substring(0, 90) + '...';
                    // For truncated options, have a title that has the full value so it can be visible
                    select.append(`<option value="${d}" title="${d}">${optionText}</option>`);
                } else {
                    select.append(`<option value="${d}">${optionText}</option>`);
                }
            }
        });

        // Repopulate the select element based on the current search filter
        const currSearch = column.search();
        if (currSearch) {
            const searchValue = currSearch.substring(1, currSearch.length - 1);
            select.val(searchValue);
            select.addClass('border-red-500');
            select.addClass('dark:border-red-500');
        }

    });
};
