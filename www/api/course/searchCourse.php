<?php

/*
Returns all the videos courses
*/

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin");
header("Content-Type: application/json; charset=utf-8");


require_once '../classes/video.php';

$video = new Video();

$querry = $_GET['q'];

$videos = $video->searchVideoCourse(trim($querry, "/"));

echo json_encode($videos);