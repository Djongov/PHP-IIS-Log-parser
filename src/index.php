<?php
include_once dirname($_SERVER['DOCUMENT_ROOT']) . '/components/page/header.php';
?>
<div class="max-w-xl mx-auto" id="drop-area">
    <p class="my-4 text-center">.log files only</p>
    <p class="my-4 text-center">log file is immediately gone once uploaded</p>
    <p class="my-4 text-center">12 MB limit</p>
    <label class="flex justify-center w-full h-32 px-4 transition bg-gray-200 border-2 border-gray-300 dark:border-gray-400 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none dark:bg-gray-800">
        <span class="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span id="drag-text" class="font-medium">
                Drop file to upload (.log file)
            </span>
        </span>
    </label>
    <p class="text-center">Or</p>
    <div class="text-center mt-4">
        <form id="log-upload-form" enctype="multipart/form-data">
            <input type="file" id="fileElem" name="file" accept="text/log" />
            <button type="submit" class="ml-2 bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white w-24 h-10 transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg">
                Upload
            </button>
        </form>
    </div>
</div>
<div class="text-center hidden mt-6" id="loader">
    <div role="status">
        <svg aria-hidden="true" class="inline mr-2 w-8 h-8 text-gray-200 dark:text-white animate-spin fill-green-500 dark:fill-green-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
        </svg>
        <span>Processing log...</span>
    </div>
</div>
<!-- Chart Container -->
<div id="chart-container" class="flex justify-center items-center flex-col md:flex-row flex-wrap mt-14">
</div>
<div id="result" class="my-6"></div>
<script src=" https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<script src="/assets/js/dataTables.js"></script>
<script src="/assets/js/dynamitable.jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.3.3/dist/chart.umd.min.js"></script>
</body>

</html>