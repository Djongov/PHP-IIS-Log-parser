<?php
// This function will parse the log file
function parseInfoFromFile($file, $correct_lines, $headers) {
        if ($file) {
        while (($line = fgets($file)) !== false) {
            // remove everything starting with #, therefore only real requests
            if (substr($line, 0, 1) !== "#") {
                // save them to the array
                array_push($correct_lines, $line);
            }
            // The opposite logic, let's capture anything that starts with # (headers)
            if (substr($line, 0, 1) == "#") {
                // save them to the array
                array_push($headers, $line);
                // initiate a new array that we will use later
                $results = array();
                // loop through the first array with all the #
                foreach ($headers as $value) {
                    // Search for "Field" in the array
                    if (strpos($value, 'Field') !== false) { 
                        // save whatever found in the new results array
                        $results[] = $value;
                        // and stop the loop
                        break;
                    }
                }
                if (empty($results)) { 
                    continue;
                } else {
                    // convert to string and save it to a new variable
                    $header_string = implode('<br />', $results);
                }
            }
        }
    }
    // Remove '#Fields: ' from the string
    $header_string = str_replace('#Fields: ', '',$header_string);

    // We now have all the headers with spaces between them, explode them into an array and use the space as delimiter. Now are header array is ready!
    $log_columns = explode(" ", $header_string);

    // Start dealing with the other array with the requests
    // Let's implode it with no spaces between
    $correct_lines = implode("", $correct_lines);
    // Let's explode it with a new line
    $correct_lines = explode("\n", $correct_lines);
    // Initiate the new array in which we will save the final result
    $parsed_log = array();
    // loop throug the parsed requests array
    foreach ($correct_lines as $row) {
        // Do the whole magic with assigning the values to the new array
        $split_rows = explode(" ", $row);
        $line = array();
        $count = -1;
        foreach ($log_columns as $column) {
            $count++;
            $line[$column] = $split_rows[$count] ?? null;      
        }
        // Push it to the new array
        array_push($parsed_log, $line);
    }
    return [$parsed_log, $log_columns];
    // Close the file
    fclose($file);
}

// This function will build the html with the parsed info
function buildTheLayout($parsed_log, bool $only_errors) {
    $html = '';
    $html .= '<p><a id="scroll-to-top" href="#">Scroll to Top</a></p>';
    $html .= '<div class="my-12 mx-auto text-gray-700 dark:text-gray-400">';
        $html .= '<div class="flex flex-row items-center justify-center">';
        // Let's experiment with the top uris
        $uris_array = array_column($parsed_log[0], 'cs-uri-stem');
        $uris_array = array_replace($uris_array,array_fill_keys(array_keys($uris_array, null),''));
        $uris_sorted_array = array_count_values($uris_array);
        arsort($uris_sorted_array);
        $top_uris_array = array_slice($uris_sorted_array, 0, 5);
        
        $html .= '<div class="mr-6 border border-black dark:border-slate-300 p-4 text-black dark:text-gray-400 text-center">';
            $html .= '<p><strong>Top 5 URIs</strong></p>';
            foreach ($top_uris_array as $uri=>$count) {
                $html .= '<p>' . $uri . ' - ' . $count . '</p>';
            }
        $html .= '</div>';
        // Let's make a little summary of the request statuses
        // Look for the column sc-status
        $request_statuses = array_column($parsed_log[0], 'sc-status');
        // Remove nulls (required in PHP 8+)
        $request_statuses = array_filter($request_statuses);
        // Filter the array
        $request_statuses = array_filter($request_statuses,'strlen');
        // Count the values of the sc-statues
        $request_statuses = array_count_values($request_statuses);
        // Save the keys to this variable
        $keys = array_keys($request_statuses);
        // Sort the array so from highest values down
        array_multisort($request_statuses, SORT_DESC, SORT_NUMERIC, $keys);
        // combine the the arrays
        $request_statuses = array_combine($keys, $request_statuses);
        // Build the div
        $html .= '<div class="border border-black dark:border-slate-300 p-4 text-black dark:text-gray-400 text-center">';
            // Show total count
            $total_requests = count($parsed_log[0]);
            $html .= '<p><strong>Total Requests: ' . $total_requests . '</strong></p>';
            // Loop through the combined log
            foreach ($request_statuses as $status=>$count) {
                // Play with the backgrounds for certain status codes
                $background = 'transparent';
                $color = 'black';
                if ($status < 200) {$background='red';$color = 'white';}
                if ($status >= 200 && $status < 300) {$background='green';$color = 'white';}
                if ($status >= 300 && $status < 400) {$background='yellow';$color = 'black';}
                if ($status >= 400 && $status < 500) {$background='orange';$color = 'black';}
                if ($status >= 500 && $status <= 600) {$background='red';$color = 'white';}
                $html .= '<p>Status: <span style="background:' . $background . ';color:' . $color . ';">' . $status . '</span> - ' . $count . ' (' . round(($count / $total_requests) * 100, 2) . '%)</p>';
            }
        $html .= '</div>';
    $html .= '</div>';
    // Let's build the table that will hold the requests
    $html .= '<table id="logs-table" class="bg-gray-100 dark:bg-gray-800 buildtable js-dynamitable w-full mt-8 p-8 text-gray-700 dark:text-gray-400 border-collapse border border-slate-400 text-center">';
    $html .= '<thead>';
        $html .= '<tr>';
        // We need this counter so we can match the id_counter so each search field under the headers will have a unique id, that we will use JS to make searchable
        $id_counter = -1;
        // Loop through the log_columns array and echo them as <th>
        foreach ($parsed_log[1] as $column) {
            $id_counter++;
            $html .= '<th scope="col" class="border border-slate-400 max-w-sm">' . $column . ' <span class="js-sorter-desc cursor-pointer">&#8595;</span> <span class="js-sorter-asc cursor-pointer">&#8593;</span> </th>';
        }
        $html .= '</tr>';
        $html .= '<tr>';
        foreach ($parsed_log[1] as $column) {
            $html .= '<th class="border border-slate-400"><input class="js-filter w-4/5 h-6 ml-2 p-1 text-sm text-gray-900 border border-gray-300 rounded bg-gray-50 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" type="search" placeholder="search"></th>';
        }
        $html .= '</tr>';
    $html .= '</thead>';
    $html .= '<tbody>';
    // If you want to skip a statuses between 200 and 399, just display errors, filter the parsed log with this
    $only_errors = true;
    if ($only_errors) {
        foreach ($parsed_log[0] as $request_id=>$request_value) {
            if ($parsed_log[0][$request_id]['sc-status'] >= 200 && $parsed_log[0][$request_id]['sc-status'] <= 399) {
                unset($parsed_log[0][$request_id]);
            }
        }
    }
    $counter = 0;
    // Time for the table body with the requests, loop through the parsed_log array
    foreach ($parsed_log[0] as $request=>$statuses) {
        $counter++;
            // If you want to skip a common user agent for example, this is how
            if ($statuses['cs(User-Agent)'] == '') {
                continue;
            }
            // pub tableindex="0" on the table rows so they can be ::focused
            $html .= '<tr tabindex="' . $counter . '" class="focus:bg-green-500 focus:text-slate-50">';
                // Because $statuses is also an array, loop again
                foreach ($statuses as $column_header=>$value) {
                    if ($column_header === 'sc-status' && $value >= 200 && $value < 300) {
                        $html .= '<td class="p-4 border border-slate-400 focus:text-white max-w-lg bg-green-400">' . htmlentities($value) . '</td>';
                        continue;
                    }
                    if ($column_header === 'sc-status' && $value >= 300 && $value < 400) {
                        $html .= '<td class="p-4 border border-slate-400 focus:text-white max-w-lg bg-orange-200">' . htmlentities($value) . '</td>';
                        continue;
                    }
                    if ($column_header === 'sc-status' && $value >= 400 && $value < 500) {
                        $html .= '<td class="p-4 border border-slate-400 focus:text-white max-w-lg bg-amber-500">' . htmlentities($value) . '</td>';
                        continue;
                    }
                    if ($column_header === 'sc-status' && $value >= 500 && $value < 1000) {
                        $html .= '<td class="p-4 border border-slate-400 focus:text-white max-w-lg bg-red-500">' . htmlentities($value) . '</td>';
                        continue;
                    }
                    // and the rest
                    $html .= '<td class="p-4 border border-slate-400 focus:text-white max-w-lg break-words ' . $background . '">' . htmlentities($value) . '</td>';
            }
            $html .= '</tr>';
    }
    $html .= '</tbody>';
    $html .= '</table>';
    $html .= '</div>';
return $html;
}
?>