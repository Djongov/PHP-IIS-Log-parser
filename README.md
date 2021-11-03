# PHP-IIS-Log-parser
A working PHP IIS Log Parser. Just point it a directory where Log files are located and everything else will happen automatically
## Setup
Place the files in the same directory on a web server.
## Use
The parser accepts a path to a directory where the log file/files located. You need to submit it and the parser will do the rest. Directory path will be analyzed and the latest log file will be opened automatically. If there are more than 1 log file in the directory, expand Log to see all log files with some info such as size/date and a link to open them individually. The parser filters out successful requests (http status code 200-399) by default. If you want to remove this filter, take a look at the next section.
## Considerations
* Users Group will need Read access to the log file. By default this is not the case. You need to explicitly grant that.

![alt text](https://github.com/Djongov/PHP-IIS-Log-parser/blob/main/IIS-Log-permissions.png?raw=true)

* IIS Log files can easily grow large. Sometimes you might get a PHP warning that you've hit memory consumption limits. Just refresh the page. If that does not help, you might need to increase your memory_limit in php.ini to a bigger number
* Because of this the parser by default will filter out 200-399 status code requests. If you want to remove this filter and see all requests, or add/change to the filter, go to functions.php at line 130 and edit/comment out the filter there.
Here is the code that is filtering http status codes 200-399:
```html
// If you want to skip a statuses between 200 and 399, just display errors, filter the parsed log with this
foreach ($parsed_log[0] as $request_id=>$request_value) {
    if ($parsed_log[0][$request_id]['sc-status'] >= 200 && $parsed_log[0][$request_id]['sc-status'] <= 399) {
        unset($parsed_log[0][$request_id]);
    }
}
```
## Features of the Parser
* Can read individual log files
* Automatically reads what header fields are on the log file
* Makes status codes stand out by coloring them
* Uses native Javascript to allow for searching the log
* Selecting a row in the table highlights it for easier tracking
* Does a summary of top URLs and breakdown of request statuses
## Licensing
MIT - See License file
