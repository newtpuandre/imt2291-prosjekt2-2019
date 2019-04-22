<?php

//Updates playlist information

session_start();

$http_origin = $_SERVER['HTTP_ORIGIN'];

if ($http_origin == "http://www" || $http_origin == "http://localhost:8080") {
    header("Access-Control-Allow-Origin: $http_origin");
}

header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=utf-8");


require_once 'classes/playlist.php';

$res = [];

$playlist = new Playlist();

$ret = $playlist->updatePlaylist($_POST['pId'], $_SESSION['uid'], $_POST['pname'], $_POST['pdesc'],$_FILES);
if($ret) {
    if(is_string($ret)){
        $res['status'] = $ret;
    } else {
        $res['status'] = 'SUCCESS';
    }
    
} else {
    $res['status'] = 'ERROR';
}

echo json_encode($res);


//echo json_encode($_GET);
//print_r($_POST);
//print_r($_GET);

