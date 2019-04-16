<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin");
header("Content-Type: application/json; charset=utf-8");


require_once 'classes/playlist.php';

$playlist = new Playlist();

$playlists = $playlist->returnAllPlaylists();

echo json_encode($playlists);