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

if($_SESSION['uid'] == "") { //User must be logged in.
    return;
}

$uid = $_SESSION['uid']; //User id
$playlistidUnTrim = $_GET['p']; //Playlist ID
$playlistid = trim($_GET['p'], "/"); //playlist ID without /
$videoid = $_GET['v']; //Video id

$playlist = new Playlist();

$res = [];

$ret = $playlist->updatePlaylistThumbnail($videoid, $playlistid, $uid); //Update playlist thumbnail

if (!$ret) {
    $res['status'] = "ERROR";
} else {//If all went well, return the playlist thumbnail
    $res['status'] = $ret; 
}

echo json_encode($res);