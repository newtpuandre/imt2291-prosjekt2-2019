<?php

//GRABS A PLAYLIST WITH A SPECIFIC ID.


$http_origin = $_SERVER['HTTP_ORIGIN'];

if ($http_origin == "http://www" || $http_origin == "http://localhost:8080") {
    header("Access-Control-Allow-Origin: $http_origin");
}

header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=utf-8");


require_once 'classes/playlist.php';

$id = $_GET['id'];

$playlist = new Playlist();

$playlists = $playlist->returnPlaylist(trim($id, "/"));

echo json_encode($playlists);

