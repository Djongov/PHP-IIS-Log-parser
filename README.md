# PHP-IIS-Log-parser
A working PHP IIS Log Parser. Just point it to the log file and everything else will happen automatically
## Setup
Place the files in the same directory on a web server. Open parse.php and go to line 189 and 191 and choose the path and name of the log file. That's it!
## Considerations
* Users Group will need Read access to the log file. By default this is not the case. You need to explicitly grant that.
* IIS Log files can easily grow large. Sometimes you might get a PHP warning that you've hit memory consumption limits. Just refresh the page. If that does not help you might need to increase your memory_limit in php.ini to a bigger number
* You can also reduce the loaded data by doing some filtering. For example if you are not interested in 200 and 300 requests but only want to look for problems go to parse.php at line 141 and modify the filter there. Example for filtering only http status codes 200-399

```html
if ($statuses['sc-status'] >= 200 && $statuses['sc-status'] <= 399) {
    continue;
}
```
## Features of the Parser
* Automatically reads what header fields are on the log file
* Makes status codes stand out by coloring them
* Uses native Javascript to allow for searching the log
* Selecting a row in the table highlights it for easier tracking
* Does a summary of top URLs and breakdown of request statuses
