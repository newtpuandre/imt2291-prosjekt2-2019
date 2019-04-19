<?php

/**
 * Returns the videofile for the given ID
 * Methods supported: GET
 * 
 * Required parameters:
 * - id, int: the ID of the video
 * 
 * Returns the videofile
 */

require_once "../classes/DB.php";

session_start();


$http_origin = $_SERVER['HTTP_ORIGIN'];

if ($http_origin == "http://www" || $http_origin == "http://localhost:8080") {
    header("Access-Control-Allow-Origin: $http_origin");
}
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Origin");
header('Content-type: video');

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

    $path = "../../userFiles/$uploaderId/videos/$id";
    if(file_exists($path)) {
        readfile($path);
    }
}