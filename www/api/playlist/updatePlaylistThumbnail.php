<?php

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

if($_SESSION['uid'] == "") {
    return;
}

$uid = $_SESSION['uid'];
$playlistidUnTrim = $_GET['p'];
$playlistid = trim($_GET['p'], "/");
$videoid = $_GET['v'];

$playlist = new Playlist();

$res = [];

$ret = $playlist->updatePlaylistThumbnail($videoid, $playlistid, $uid);

if ($ret) {
    $res['status'] = "SUCCESS";
} else {
    $res['status'] = "ERROR";
}

echo json_encode($res);