<?php

/*
Changes a specific users subscription status of a playlist
*/

session_start();

$http_origin = $_SERVER['HTTP_ORIGIN'];

if ($http_origin == "http://www" || $http_origin == "http://localhost:8080") {
    header("Access-Control-Allow-Origin: $http_origin");
}

header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=utf-8");


require_once '../classes/playlist.php';

$id = $_GET['id'];
$sub = $_GET['sub']; //1 for subscribe, 0 for unsub.

$res = [];

$playlist = new Playlist();

if($sub) {
    $status = $playlist->subscribeToPlaylist(trim($id, "/"),$_SESSION['uid']);
} else {
    $status = $playlist->unsubscribeToPlaylist(trim($id, "/"),$_SESSION['uid']);
}

if($status) {
    $res['status'] = 'SUCCESSFUL';
} else {
    $res['status'] = 'ERROR';
}



echo json_encode($res);

