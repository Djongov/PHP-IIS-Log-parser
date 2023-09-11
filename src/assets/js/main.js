const dropArea = document.getElementById('drop-area');
const dragText = document.getElementById('drag-text');
const uploadForm = document.getElementById('log-upload-form');
const loader = document.getElementById('loader');
const resultDiv = document.getElementById('result');
const chartsContainer = document.getElementById('chart-container');


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
    .then(response => {
        loader.classList.add('hidden');
        if (response.ok) {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return response.json(); // Response is JSON
            } else {
                return response.text(); // Response is plain text
            }
        }
        throw new Error('Network response was not ok.');
    })
    .then(data => {
        if (typeof data === 'string') {
            // Handle plain text response
            resultDiv.innerHTML = data;
        } else if (Array.isArray(data)) {
            // Handle JSON response
            // Charts
            const countsArray = Object.entries(data[1].Counts);
            // Loop through the array to build charts
            countsArray.forEach(([name, array]) => {
                // Draw only if there is anything inside the sub-array
                if (Object.entries(array).length > 0) {
                    // Initiate temporary arrays
                    let labelArray = [];
                    let dataArray = [];
                    // Loop through the Counts sub array
                    Object.entries(array).map(([Name, Count]) => {
                        // Push name to label array and count to data array
                        labelArray.push(Name);
                        dataArray.push(Count);
                    });
                    // Draw the chart and add it to the reports holder div
                    try {
                        createPieChart(name, labelArray, dataArray);
                    } catch (error) {
                        console.log(error);
                    }
                }
            })
            resultDiv.innerHTML += `<p class="my-6 text-xl font-semibold text-center">Total Requests: ${data[1].totalRequests}</p>`;
            resultDiv.innerHTML += `<table id="logs-table" class="w-full bg-gray-100 dark:bg-gray-900 buildtable mt-8 p-8 text-gray-700 dark:text-gray-400 border-collapse border border-slate-400 text-center">
        <thead class="sticky top-0 dark:text-gray-400 border-collapse bg-gray-200 border border-slate-400">
            <tr id="filters">
            </tr>
        </thead>
    </table>`;
            console.log('Fetched JSON:', data);
            loader.classList.add('hidden');
            const table = drawDataGrid(data[0]);
            buildDataGridFilters(table, 'logs-table', []);

            table.on('draw', () => {
                console.log('Redraw occurred');
                buildDataGridFilters(table, 'logs-table', []);
            });
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        console.error('Fetch error details:', error.message);
        loader.classList.add('hidden');
        resultDiv.innerHTML = `<p class="text-center text-red-500">${error.message}</p>`;
    });
}

function uploadFileFromForm() {
    // Clear the divs so existing data is not shown along with the new
    resultDiv.innerHTML = '';
    chartsContainer.innerHTML = '';
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
    .then(response => {
        loader.classList.add('hidden');
        if (response.ok) {
            resultDiv.innerHTML += `<div id="loading-screen" class="fixed inset-0 flex items-center justify-center"><div class="w-80 bg-green-500 p-2 rounded-md shadow-md shadow-gray-500 text-white border border-black dark:border-white"><p class="text-center">Loading Data...</p><p class="text-center">Please wait</p></div></div>`;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return response.json(); // Response is JSON
            } else {
                return response.text(); // Response is plain text
            }
        }
        throw new Error('Network response was not ok.');
    })
    .then(data => {
        if (typeof data === 'string') {
            // Handle plain text response
            resultDiv.innerHTML = data;
        } else if (Array.isArray(data)) {
            // Handle JSON response
            // Charts
            const countsArray = Object.entries(data[1].Counts);
            // Loop through the array to build charts
            countsArray.forEach(([name, array]) => {
                // Draw only if there is anything inside the sub-array
                if (Object.entries(array).length > 0) {
                    // Initiate temporary arrays
                    let labelArray = [];
                    let dataArray = [];
                    // Loop through the Counts sub array
                    Object.entries(array).map(([Name, Count]) => {
                        // Push name to label array and count to data array
                        labelArray.push(Name);
                        dataArray.push(Count);
                    });
                    // Draw the chart and add it to the reports holder div
                    try {
                        createPieChart(name, labelArray, dataArray);
                    } catch (error) {
                        console.log(error);
                    }
                }
            })
            resultDiv.innerHTML += `<p class="my-6 text-xl font-semibold text-center">Total Requests: ${data[1].totalRequests}</p>`;
            resultDiv.innerHTML += `<table id="logs-table" class="w-full bg-gray-100 dark:bg-gray-900 buildtable mt-8 p-8 text-gray-700 dark:text-gray-400 border-collapse border border-slate-400 text-center">
            <thead class="sticky top-0 dark:text-gray-400 border-collapse bg-gray-200 border border-slate-400">
            </thead>
        </table>`;
            //console.log('Fetched JSON:', data);
            loader.classList.add('hidden');
            const table = drawDataGrid(data[0]);
            buildDataGridFilters(table, 'logs-table', []);

            table.on('draw', () => {
                //console.log('Redraw occurred');
                buildDataGridFilters(table, 'logs-table', []);
            });
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        console.error('Fetch error details:', error.message);
        loader.classList.add('hidden');
        resultDiv.innerHTML = `<p class="text-center text-red-500">${error.message}</p>`;
    });
}

const drawDataGrid = (json) => {
    const tableWrapper = $('<div class="overflow-auto max-h-[44rem]"></div>'); // Create a wrapper div for the table
    const tableHeaders = Object.keys(json[0]).map(key => ({ title: key, data: key }));

    const scStatusColumnIndex = tableHeaders.findIndex(header => header.title === 'sc-status'); // Find the index of the 'sc-status' column

    // Create the table and add data
    const table = $('#logs-table').DataTable({
        ordering: true,
        data: json,
        columns: tableHeaders,
        paging: true,
        pagingType: 'full_numbers',
        lengthMenu: [[25, 50, 100, -1], [25, 50, 100, "All"]],
        createdRow: function (row, data, dataIndex) {
            $(row).attr('tabindex', dataIndex);
            $(row).addClass('focus:outline-none focus:bg-gray-300 focus:text-gray-900 dark:focus:bg-gray-700 dark:focus:text-amber-500');
        },
        columnDefs: [
            {
                targets: scStatusColumnIndex, // Use the index of 'sc-status' column
                createdCell: function (td, cellData, rowData, row, col) {
                    const scStatusValue = parseInt(cellData);
                    $(td).addClass('text-white');
                    if (!isNaN(scStatusValue)) {
                        if (scStatusValue >= 0 && scStatusValue <= 100) {
                            $(td).addClass('bg-gray-300');
                        } else if (scStatusValue >= 101 && scStatusValue <= 299) {
                            $(td).addClass('bg-green-500');
                        } else if (scStatusValue >= 300 && scStatusValue <= 399) {
                            $(td).addClass('bg-yellow-500');
                        } else if (scStatusValue >= 400 && scStatusValue <= 499) {
                            $(td).addClass('bg-orange-500');
                        } else if (scStatusValue >= 500 && scStatusValue <= 1000) {
                            $(td).addClass('bg-red-500');
                        }
                    }
                },
                className: 'py-1 px-2 border border-slate-400 max-w-md break-words', // Apply class to all cells
            },
            {
                targets: '_all',
                createdCell: function (td, cellData, rowData, row, col) {
                    const truncationLength = 200;
                    if (cellData.length > truncationLength) {
                        $(td).addClass('truncate');
                        $(td).attr('title', cellData);
                        $(td).text(cellData.substring(0, truncationLength) + '...');
                    }
                },
                className: 'py-1 px-2 border border-slate-400 max-w-md break-words', // Apply class to all cells
            }
        ],
        initComplete: function () {
            document.getElementById('loading-screen').remove();
        },
    });

    // Create filter rows outside of header callback
    const filtersRow = $('<tr></tr>').insertAfter($('#logs-table thead tr'));
    tableHeaders.forEach(header => {
        filtersRow.append(`<th class="py-1 px-2 border border-slate-400 max-w-md break-words"></th>`);
    });

    $(`#logs-table`).wrap(tableWrapper); // Wrap the table with the wrapper div
    return table;
};


const buildDataGridFilters = (table, tableId) => {
    const filtersRow = $(`#${tableId} thead tr:eq(1)`); // Get the second row in the thead

    // Clear existing filters by emptying the filter cells
    filtersRow.find('tr').empty();

    // Loop through each column of the DataTable
    table.columns().every(function (col) {
        const column = table.column(this, { search: 'applied' }); // Get the DataTable column object

        const filterCell = filtersRow.find('th').eq(column.index());
        filterCell.html(''); // Clear existing content

        // Create a select element and set it as the HTML content of the table header cell
        const select = $('<select class="w-full text-center m-1 p-1 text-sm text-gray-900 border border-gray-300 rounded bg-gray-50 focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"><option value="">No filter</option></select>')
            .appendTo(filterCell)
            .on('change', function () {
                const val = $.fn.dataTable.util.escapeRegex(
                    $(this).val()
                );

                // Apply the selected filter value to the column and redraw the table
                column
                    .search(val ? '^' + val + '$' : '', true, false)
                    .draw();
            });

        // Calculate the maximum width for the select options
        const maxOptionWidth = Math.min(
            $(column.header()).outerWidth() || select.width(),
            150
        ); // You can adjust the maximum width as needed

        // Iterate through the unique values in the column, create options for the select element
        column.data().unique().sort().each(function (d, j) {
            if (d !== null) {
                // Truncate long select fields and add a title for hover
                let optionText = d;
                if (optionText.length > maxOptionWidth / 2) {
                    optionText = optionText.substring(0, maxOptionWidth / 2) + '...';
                }
                // Append the option with the selected attribute if necessary
                select.append(`<option value="${d}" title="${d}">${optionText}</option>`);
            }
        });

        // Repopulate the select element based on the current search filter
        const currSearch = column.search();
        if (currSearch) {
            const searchValue = currSearch.substring(1, currSearch.length - 1);
            select.val(searchValue); // Set the selected value

            // Loop through the options and set the 'selected' attribute explicitly for the matched option
            select.find('option').each(function () {
                const optionValue = $(this).val();
                // We need to replace the special characters from searchValue as searchValue comes with escaped special characters from column.search(). We want to apply the selected prop for the currently selected option so it's visible what has been filtered right now
                if (optionValue === searchValue.replace(/\\/g, '')) {
                    $(this).prop('selected', true);
                } else {
                    $(this).prop('selected', false);
                }
            });

            select.addClass('border-red-500');
            select.addClass('dark:border-red-500');
        }
    });
};

const createPieChart = (name, labels, data) => {
    // Create a parent div for the chart
    let chartContainer = document.createElement('div');
    chartContainer.style.width = '300px';
    chartContainer.style.height = '300px';
    // Place it inside the chart-container div
    chartsContainer.appendChild(chartContainer);
    // Create the canvas for the chart
    let canvas = document.createElement('canvas');
    // Give it id (optional)
    canvas.id = `${name}-chart`;
    // Important to size it
    canvas.style.width = '300px';
    canvas.style.height = '300px';
    // Place it inside the chart container
    chartContainer.appendChild(canvas);

    // Now let's deal with the colors
    let backgroundColorArray = [];

    let colorScheme = [];
    labels.forEach(label => {
        var item = colorScheme[Math.floor(Math.random() * colorScheme.length)];
        // For status codes let's do it slightly different. Good status codes - green, redirects - yellow, client errors - orange and server errors - red
        if (name === 'statusCodes') {
            let color = '';
            if (label === "0") {
                color = 'gray';
            } else if (label > 0 && label < 299) {
                color = 'green';
            } else if (label >= 300 && label < 399) {
                color = 'yellow';
            } else if (label >= 400 && label < 499) {
                color = 'orange';
            } else if (label >= 500 && label <= 1000) {
                color = 'red';
            } else {
                color = 'purple';
            }
            backgroundColorArray.push(color);
        // For the rest - push from the this array of colors
        } else {
            backgroundColorArray = [
                'rgba(54, 162, 235, 1)', // blue
                'rgba(75, 192, 192, 1)', // green
                'rgba(255, 99, 132, 1)', // red
                'rgba(255, 159, 64, 1)', // orange
                'rgba(153, 102, 255, 1)', // purple
                'rgba(255, 206, 86, 1)', // yellow
                'rgba(255, 0, 0, 1)', // bright red
                'rgba(0, 255, 255, 1)', // cyan
                'rgba(255, 0, 255, 1)', // magenta
                'rgba(128, 128, 128, 1)' // grey
            ];

        }
        //console.log('Assigning color ' + item + ' to chart ' + name);
        colorScheme = colorScheme.filter(element => element !== item);
    })
    
    // Create the pie chart
    const ctx = canvas.getContext('2d');
    const myPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColorArray
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: `${name}`,
                    fontSize: 24,
                    fontColor: '#333'
                }
            }
        }
    });
}
