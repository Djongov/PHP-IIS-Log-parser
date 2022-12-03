<?php
$error_class = 'text-center text-red-500 font-semibold';
do {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo '<p class="' . $error_class . '">Incorrect Method</p>';
        break 1;
    }
    if (!isset($_SERVER['CONTENT_LENGTH'])) {
        echo '<p class="' . $error_class . '">Incorrect Content Length</p>';
        break 1;
    }

    if (empty($_FILES) or !isset($_FILES['file'])) {
        echo '<p class="' . $error_class . '">File exceeds the upload limit of 10MB!</p>';
        break 1;
    }
    
    if (!isset($_FILES["file"])) {
        die("There is no file to upload.");
    }

    $extension = pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);

    if ($extension !== 'log') {
        echo '<p class="' . $error_class . '">Incorrect file extension. Needs .log</p>';
        break 1;
    }

    $filepath = $_FILES['file']['tmp_name'];
    $fileSize = filesize($filepath);
    $fileSize_in_KBs = $fileSize / 1000;
    echo '<p class="text-center">File size: ' . $fileSize_in_KBs . ' KB</p>';
    $fileinfo = finfo_open(FILEINFO_MIME_TYPE);
    $filetype = finfo_file($fileinfo, $filepath);

    if ($fileSize === 0) {
        die("The file is empty.");
    }

    if ($fileSize > 12582912) { // 12 MB (1 byte * 1024 * 1024 * 12 (for 12 MB))
        die("The file is too large");
    }

    $allowedTypes = [
        'text/plain' => 'log'
    ];

    if (!in_array($filetype, array_keys($allowedTypes))) {
        die("File type not allowed.");
    }
    
    $filename = basename($filepath); // I'm using the original name here, but you can also change the name of the file here

    $targetDirectory = __DIR__ . '/uploadsx'; // __DIR__ is the directory of the current PHP file

    $newFilepath = $targetDirectory . "/" . $filename . "." . $extension;

    if (!copy($filepath, $newFilepath)) { // Copy the file, returns false if failed
        die("Can't move file.");
    }
    unlink($filepath); // Delete the temp file

    //echo "File uploaded successfully as $newFilepath:)";
    include_once dirname($_SERVER['DOCUMENT_ROOT']) . '/functions/logParsers.php';
    // This array will be used for the requests
    $correct_lines = [];
    // This array will be used to get the table headers, essentially the log headers
    $headers = [];
    $opened_file = fopen($newFilepath, "r");
    $parsed_log = parseInfoFromFile($opened_file, $correct_lines, $headers);
    echo buildTheLayout($parsed_log, false);
    fclose($opened_file);
    unlink($newFilepath);
    //return var_dump($_FILES);
} while (0);
?>