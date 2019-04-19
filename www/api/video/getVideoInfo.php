<?php

/**
 * Returns information about a given video
 * Methods supported: GET
 * 
 * Required parameters:
 * - ID: an int, the ID of the video
 * 
 * Return values:
 * 
 * On success:
 * - status: SUCCESS
 * - video:
 *  - rating: The average rating
 *  - title: The title of the video
 *  - description: The description of the video
 *  - topic: The topic of the video
 *  - course: The course of the video
 *  - uploader: The name of the teacher who uploaded the video
 *  - time: The time the video was uploaded
 * If user is logged in:
 * - userRating: The users rating on the video
 * 
 * On failure:
 * - status: FAILED
 */

require_once '../classes/DB.php';

session_start();


$http_origin = $_SERVER['HTTP_ORIGIN'];

if ($http_origin == "http://www" || $http_origin == "http://localhost:8080") {
    header("Access-Control-Allow-Origin: $http_origin");
}
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Origin");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=utf-8");

ini_set('display_errors', 1);
error_reporting(E_ALL);

$db = new DB();

$res["status"] = "FAILED";

if(isset($_GET["id"])) {
    // TODO: Check if numeric id
    $id = trim($_GET["id"], "/");
    $res["id"] = $id;

    $data = $db->returnVideo($id);
    $uploaderId = $data[0]["userid"];

    $video = array();
    $video["title"] = $data[0]["title"];
    $video["description"] = $data[0]["description"];
    $video["topic"] = $data[0]["topic"];
    $video["course"] = $data[0]["course"];
    $video["uploader"] = $data[0]["userid"];
    $video["time"] = $data[0]["time"];
    // TODO: Retrieve user info of teacher who uploaded
    // TODO: Retrieve rating

    $res["video"] = $video;
    $res["status"] = "SUCCESS";
}

echo json_encode($res);