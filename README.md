# PHP-IIS-Log-parser
A working PHP IIS Log Parser. Just point it a directory where Log files are located and everything else will happen automatically
## Setup
Place the files in the same directory on a web server.
## Use
The parser accepts a path to a directory where the log file/files located. You need to submit it and the parser will do the rest. Directory path will be analyzed and the latest log file will be opened automatically. If there are more than 1 log file in the directory, expand Log to see all log files with some info such as size/date and a link to open them individually.
## Considerations
* Users Group will need Read access to the log file. By default this is not the case. You need to explicitly grant that.

![alt text](https://github.com/Djongov/PHP-IIS-Log-parser/blob/main/IIS-Log-permissions.png?raw=true)

* IIS Log files can easily grow large. Sometimes you might get a PHP warning that you've hit memory consumption limits. Just refresh the page. If that does not help, you might need to increase your memory_limit in php.ini to a bigger number
* You can also reduce the loaded data by doing some filtering. For example if you are not interested in 200 and 300 requests but only want to look for problems go to functions.php at line 130 and edit/comment out the filter there. Example for filtering only http status codes 200-399

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
MIT
Copyright 2021 Dimitar Dzhongov

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.