<?php

/*
Returns all the users subscribed playlists
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
require_once '../classes/video.php';

$playlist = new Playlist();
$video = new Video();

$playlists = $playlist->getSubscribedPlaylists($_SESSION['uid']);

$i = 0; //Loop counter
foreach ($playlists as &$value) {
    $vidArray = []; //Array containing all new videos
    $id = $value['id']; //Helper variable
    $ret = $playlist->returnNewestVideos($id); //Get array of videoids

    foreach ($ret as &$vid) { //Loop over videoid array and resolve videos
        $resVideo = $video->getVideo($vid['videoid']);
        $vidArray[] = $resVideo[0]; //Add to array
    }

    $playlists[$i]['videos'] = $vidArray; //Add to specific playlists video array
    $i++;
}

echo json_encode($playlists);

