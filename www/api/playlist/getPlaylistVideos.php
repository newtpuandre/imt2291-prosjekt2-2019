<?php


/*
Returns videos from a playlist with a specific id
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

$id = $_GET['id']; //playlist id

$playlist = new Playlist();

$playlists = $playlist->returnPlaylistVideos(trim($id, "/")); //Returns all video ids in a playlist
$resolvedVideo = $playlist->resolveVideos(trim($id, "/")); //Convert from video id to actual video objects
if(count($resolvedVideo) > 0){ //There were videos resolved
    echo json_encode(array_intersect( $resolvedVideo, $playlists)); //Add them to the return json
} else { //No videos to return
    echo json_encode(null);
}

