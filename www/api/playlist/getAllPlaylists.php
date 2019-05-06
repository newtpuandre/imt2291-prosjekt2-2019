<?php

/*
Returns all playlists
*/

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin");
header("Content-Type: application/json; charset=utf-8");


require_once '../classes/playlist.php';

$playlist = new Playlist();

$playlists = $playlist->returnAllPlaylists(); //Returns all playlists

echo json_encode($playlists);