<?php

/**
 * Returns the newest videos from DB.
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin");
header("Content-Type: application/json; charset=utf-8");


require_once '../classes/video.php';

$video = new Video();

$videos = $video->getNewVideos();  //Get newest videos from db.

echo json_encode($videos);