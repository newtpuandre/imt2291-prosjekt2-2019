<?php

/**
 * Returns all videos from a given teacher (ID)
 * 
 * Supported methods:
 * - GET
 * 
 * Required parameters:
 * - id, int: The user ID of the teacher
 * 
 * Returns:
 * - status, string: SUCCESS/FAILED
 * - videos, array: All the uploaded videos from the teacher
 */


require_once "../classes/DB.php";

session_start();


$http_origin = $_SERVER['HTTP_ORIGIN'];

if ($http_origin == "http://www" || $http_origin == "http://localhost:8080") {
    header("Access-Control-Allow-Origin: $http_origin");
}
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Origin");

ini_set('display_errors', 1);
error_reporting(E_ALL);

$db = new DB();

$res["status"] = "FAILED";

if(isset($_GET["id"])) {
    $id = $_GET["id"];

    $res["videos"] = $db->returnVideos($_GET["id"]);
}

echo json_encode($res);