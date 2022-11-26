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
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['path'])) {
        
        // Decide whether to display only errors
        $only_errors = (isset($_POST['only-errors']) and $_POST['only-errors'] === 'yes') ? true : false;
        //$path = filter_var($_POST['path'], FILTER_SANITIZE_ENCODED);
        // Add the trailing slash in case it is forgotten
        $path = rtrim($_POST['path'], '\\') . '\\';
            
        // Inlcude the file with the functions that do the parsing and the html output
        include_once './functions.php';

        // This array will be used for the requests
        $correct_lines = [];
        // This array will be used to get the table headers, essentially the log headers
        $headers = [];

        // Open the file - put the path to your log file here
        //$path = 'G:\logs\W3SVC7\\';

        $files_array = array();
        $dirs_array = array();

        if (is_dir($path)) {
            if (!is_readable($path)) {
                echo '<h3>Access Denied</h3><p>Directory not readable. Make sure that the user under which the web server is running has read access to the directory. In Windows, provide generic Users group with read access should work on home PCs</p><p><a href="/">Go back</a>';
                return;
            }
            $files_and_dirs = scandir($path);
            // Remove the dots from the result
            $files_and_dirs = array_diff($files_and_dirs, array('.', '..'));
            foreach($files_and_dirs as $files) {
                if (is_file($path . $files)){
                    // If it is a file, go to the file array, instead go to the dirs array
                    array_push($files_array, $files);
                } else {
                    array_push($dirs_array, $files);
                }
            }
        } else {
            echo '<a href="/">Star Over</a>';
            echo '<h4>Directory ' . $path . ' does not exist or it\'s not a directory</h4>';
            echo '<p>Exiting script...</p>';
            die();
        }
        echo '<a href="/">Star Over</a>';
        echo '<details>';
        echo '<summary>Log</summary>';
        echo '<p>Analyzing the path <b>' . $path . '</b></p>';
        if (count($dirs_array) > 0) {
            echo '<p>The following are directories and will be ignored:</p>';
            echo '<p>' . implode(", ", $dirs_array) . '</p>';
        }
        if (count($files_array) > 0) {
            // From all the files, we will now need to filter the .log files only
            $sorted_array = array();
            // Loop through the files array
            foreach ($files_array as $file) {
                // If extension is .log, add it to the sorted array
                if (pathinfo($path . $file, PATHINFO_EXTENSION) === 'log') {
                    array_push($sorted_array, $path . $file);
                }
            }
            echo '<p>Log files in the directory:</p>';
            echo '<div style="width: 100%; word-break: break-word;">';
            if ($only_errors) {
                $only_errors_query = 'yes';
            } else {
                $only_errors_query = 'no';
            }
            foreach ($sorted_array as $file) { 
                echo '<p>Log File: <a href="./file.php?path=' . $path . '&file=' . $file . '&only-errors=' . $only_errors_query . '" target="_blank" title="Open ' . $file . ' in a new window to parse it">' . $file . '</a>. File size: ' . filesize($file) / 1000000 . ' MB and File Date: ' . date("d F Y H:i", filemtime($file)). '</p>';
            }
            echo '</div>';
        } else {
            echo '<p>There are no files in the directory</p>';
            echo '<p>Exiting script...</p>';
            die();
        }

        // Only proceed if there are files in the $sorted_array
        if (count($sorted_array) > 0) {
            // Now let's array map the array with the last modified time for each
            $sorted_array = array_combine($sorted_array, @array_map("filemtime", $sorted_array));

            // Sort it by latest
            arsort($sorted_array);

            // The newest file will be the first array key, same as [0]
            $newest_file = key($sorted_array);

            echo '<p>Looking for the latest file in this directory...</p>';
            echo '<p>Latest File is: ' . $newest_file . ' with a file size of ' . filesize($newest_file) / 1000000 . ' MB</p>';

            // Print the file name
            if (is_dir($newest_file)) {
                echo '<p>Error: Latest file in this directory - ' . $newest_file . ' is another directory. Looking for a file</p>';
                echo '<p>Exiting script...</p>';
                die();
            }

            echo '<p>Trying to open it...</p>';

            // Check if it's a proper file
            if (is_file($newest_file)) {
                // Check if it's readable
                if (!is_readable($newest_file)) {
                    echo '<p>File not readable</p>';
                    echo '<p>Exiting script...</p>';
                    die();
                }
                // Check if the file extension is .log (IIS native)
                $ext = pathinfo($newest_file, PATHINFO_EXTENSION);
                if ($ext === 'log') {
                    // Actually open it
                    $opened_file = fopen($newest_file, "r");
                    // Say that we are opening it
                    echo '<p>Opening ' . $newest_file . '</p>';
                    echo '</details>';
                    // Call the functions
                    $parsed_log = parseInfoFromFile($opened_file, $correct_lines, $headers);
                    echo buildTheLayout($parsed_log, $only_errors);
                } else {
                    echo '<p>File ' . $newest_file . ' not with .log extension</p>';
                }  
            } else {
                echo '<p>File ' . $newest_file . ' not readable or does not exist</p>';
            }
        } else {
            echo '<p>There are no files with .log extension in this directory.</p>';
        }
    } else {
        echo '<p>Wrong POST parameter</p>';
    }
// If not POST
} else {
?>

<h1>IIS Log Parser</h1>
<form method="post" action="">
    <label for="path">Provide a directory where the log file/s are located</label>
    <br />
    <input type="text" name="path" placeholder="Path to folder (not file)" />
    <br />
    <label for="path">Do you want to check only for errors?
    <input type="checkbox" name="only-errors" value="yes" /></label>
    <br />
    <input type="submit" value="Parse" />
</form>
<p>Directory path will be analyzed and the latest log file will be opened. If there are more than 1 log file in the directory, expand Log to get more details.</p>
<?php
// Closing the If not POST 
}
?>
            <script src="./parse.js"></script>
        </body>
</html>