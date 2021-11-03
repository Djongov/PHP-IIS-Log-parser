<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta http-equiv="Content-Language" content="en-US" />
            <meta http-equiv="Cache-Control" content="no-cache, max-age=3600" />
            <link rel="stylesheet" href="./parse.css" type="text/css" />
            <title>IIS Log Parser</title>
        </head>
        <body>
<?php
// This array will be used for the requests
$correct_lines = [];
// This array will be used to get the table headers, essentially the log headers
$headers = [];
if (isset($_GET['path'], $_GET['file'])) {
    $path = filter_var($_GET['path'], FILTER_SANITIZE_STRING);
    $file = filter_var($_GET['file'], FILTER_SANITIZE_STRING);
    echo $file;
    // Check if it's a proper file
    if (is_file($file)) {
        // Check if it's readable
        if (!is_readable($file)) {
            echo '<p>File not readable</p>';
            echo '<p>Exiting script...</p>';
            die();
        }
        // Check if the file extension is .log (IIS native)
        $ext = pathinfo($file, PATHINFO_EXTENSION);
        if ($ext === 'log') {
            // Actually open it
            $opened_file = fopen($file, "r");
            // Say that we are opening it
            echo '<p>Opening ' . $file . '</p>';
            echo '<p>File size: ' . number_format(filesize($file) / 1000000, 2, '.') . ' MB</p>';
            echo '<p>File date: ' . date("d F Y H:i", filemtime($file)). '</p>';
            // Inlcude the file with the functions that do the parsing and the html output
            include_once './functions.php';
            // Call the functions
            $parsed_log = parseInfoFromFile($opened_file, $correct_lines, $headers);
            echo buildTheLayout($parsed_log);
        } else {
            echo '<p>File ' . $opened_file . ' not with .log extension</p>';
        }  
    } else {
        echo '<p>File ' . $opened_file . ' not readable or does not exist</p>';
    }
}
?>
            <script src="./parse.js"></script>
        </body>
</html>