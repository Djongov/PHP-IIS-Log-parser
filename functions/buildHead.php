<?php
function buildHead($title) {
    $html = <<<HTML
        <!DOCTYPE html>
            <html lang="en">
            <head>
                <title>$title</title>
                <link rel="icon" type="image/x-icon" href="/assets/images/icon.png">
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
                <script src="https://cdn.tailwindcss.com"></script>
                <script nonce="1nL1n3JsRuN1192kwoko2k323WKE">
                    tailwind.config = {
                        theme: {
                            extend: {
                                colors: {
                                    clifford: '#da373d',
                                }
                            }
                        },
                        darkMode: 'class',
                    }
                </script>
            </head>
    HTML;
    return $html;
}

function buildHeadDescription($title, $keywords, $description, $thumbimage = '') {
    // Import file with cookie settings, html start, scripts
    $html = '';
    $html .= '<!DOCTYPE html>' . PHP_EOL;
    $html .= '<html lang="en">' . PHP_EOL;
    $html .= '<head>';
    $html .=  PHP_EOL . '<title>' . $title . '</title>' . PHP_EOL;
    $html .= '<link rel="icon" type="image/x-icon" href="/assets/images/icon.png" />' . PHP_EOL;
    //$html .= '<link rel="apple-touch-icon" href="/apple-touch-icon.png" />' . PHP_EOL;
    $html .= '<!-- Meta tags -->' . PHP_EOL;
    //$html .= '<meta name="apple-mobile-web-app-capable" content="yes">' . PHP_EOL;
    //$html .= '<meta name="apple-mobile-web-app-status-bar-style" content="black">' . PHP_EOL;
    $html .= '<meta http-equiv="content-type" content="text/html; charset=UTF-8" />' . PHP_EOL;
    $html .= '<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />' . PHP_EOL;
    $html .= '<meta http-equiv="Content-Language" content="en-US" />' . PHP_EOL;
    $html .= '<meta name="robots" content="index, follow" />' . PHP_EOL;
    $html .= '<meta name="author" content="Dimitar Dzhongov" />' . PHP_EOL;
    $html .= '<meta name="keywords" content="' . implode(",", $keywords) . '" />' . PHP_EOL;
    // Not needed $html .= '<link rel="canonical" href="https://"' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'] . '">' . PHP_EOL;
    $html .= '<meta name="description" content="' . $description . '" />' . PHP_EOL;
    $html .= '<!-- Facebook Meta Tags -->' . PHP_EOL;
    $html .= '<meta property="og:type" content="website" />' . PHP_EOL;
    $html .= '<meta property="og:url" content="https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'] . '" />' . PHP_EOL;
    $html .= '<meta property="og:title" content="' . $title . '" />' . PHP_EOL;
    $html .= '<meta property="og:description" content="' . $description . '" />' . PHP_EOL;
    $html .= '<meta property="og:image" content="' . $thumbimage . '" />' . PHP_EOL;
    //$html .= '<meta property="fb:app_id" content="1061751454210608" />' . PHP_EOL;
    $html .= '<!-- Twitter Meta Tags -->' . PHP_EOL;
    $html .= '<meta property="twitter:card" content="summary_large_image" />' . PHP_EOL;
    $html .= '<meta property="twitter:site" content="@Sunwell_LTD" />' . PHP_EOL;
    $html .= '<meta property="twitter:creator" content="@Djongov" />' . PHP_EOL;
    $html .= '<meta property="twitter:title" content="' . $title . '" />' . PHP_EOL;
    $html .= '<meta property="twitter:description" content="' . $description . '" />' . PHP_EOL;
    $html .= '<meta property="twitter:image" content="' . $thumbimage . '" />' . PHP_EOL;
    $html .= '<meta property="twitter:image:alt" content="' . $title . '" />' . PHP_EOL;
    $html .= '<!-- Stylesheets -->' . PHP_EOL;
    //$html .= '<link rel="stylesheet" href="/assets/css/main.css" type="text/css" />' . PHP_EOL;
    $html .= '<!-- Scripts -->' . PHP_EOL;
    $html .= '<script src="https://cdn.tailwindcss.com"></script>';
    $html .= '<script src="/assets/js/main.js" defer></script>';
    $html .= '<script src="/assets/js/theme-switcher.js" defer></script>';
    $html .= <<< InlineScript
    <script nonce="">
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        clifford: '#da373d',
                    }
                }
            },
            darkMode: 'class',
        }
    </script>
    InlineScript . PHP_EOL;
    $html .= '</head>' . PHP_EOL;
    return $html;
}
?>