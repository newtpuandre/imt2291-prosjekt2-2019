<?php

/*
Returns all videos from the database

*/

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin");
header("Content-Type: application/json; charset=utf-8");


require_once '../classes/video.php';

$video = new Video();

$videos = $video->getAllVideos();

echo json_encode($videos);