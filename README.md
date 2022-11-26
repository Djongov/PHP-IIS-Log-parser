# PHP-IIS-Log-parser
A working PHP IIS Log Parser. Just point it a directory where Log files are located and everything else will happen automatically
## Setup
Place the files from this repo on a web server.
## Use
The parser accepts a path to a directory where the log file/files located. You need to submit it and the parser will do the rest. Directory path will be analyzed and the latest log file will be opened automatically. If there are more than 1 log file in the directory, expand Log to see all log files with some info such as size/date and a link to open them individually. If you are interested in only errors - there is a checkbox to filter out 200-399 status codes from the log read.
## Considerations
* The ```IUSR``` user or ```Users``` Group will need Read access to the log file. By default this is not the case. You need to explicitly grant that.

![IIS Permissions required](https://github.com/Djongov/PHP-IIS-Log-parser/blob/main/IIS-Log-permissions.png?raw=true)

## Features of the Parser
* Can read individual log files
* Automatically reads what header fields are on the log file
* Makes status codes stand out by coloring them
* Uses native Javascript to allow for searching the log
* Selecting a row in the table highlights it for easier tracking
* Does a summary of top URLs and breakdown of request statuses
## Licensing
MIT - See License file
