<?php

/*
Updates a videos position in a playlist
*/

$http_origin = $_SERVER['HTTP_ORIGIN'];

if ($http_origin == "http://www" || $http_origin == "http://localhost:8080") {
    header("Access-Control-Allow-Origin: $http_origin");
}

header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=utf-8");


require_once '../classes/playlist.php';

$res = [];

$playlist = new Playlist();

if($playlist->editPosition(trim($_POST['routeId'], "/"),$_POST['vidId'], $_GET['down'])){
    $res['status'] = 'SUCCESS';
} else {
    $res['status'] = 'ERROR';
}

echo json_encode($res);


//echo json_encode($_GET);
//print_r($_POST);
//print_r($_GET);

