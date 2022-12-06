<?php
function writeToLogFile($message) {
    $file = dirname($_SERVER['DOCUMENT_ROOT']) . '/action.log';
    $date = date('d/m/Y H:i:s', time());
    $user_agent = $_SERVER['HTTP_USER_AGENT'];
    $client_ip = (isset($_SERVER["HTTP_CF_CONNECTING_IP"])) ? $_SERVER["HTTP_CF_CONNECTING_IP"] : $_SERVER["REMOTE_ADDR"];
    $write_to_log = PHP_EOL . $date . ' | ' . $client_ip . ' | ' . $user_agent . ' | ' . $message;
    if (is_writable($file)) {
        file_put_contents($file, $write_to_log, FILE_APPEND | LOCK_EX);
    }
}
?>