<?php

/**
 * Retrieves all comments for a video
 * 
 * Supported methods: GET
 * 
 * Required parameters:
 * - id, int: The ID of the video
 */

require_once "../classes/DB.php";

session_start();


$http_origin = $_SERVER['HTTP_ORIGIN'];

if ($http_origin == "http://www" || $http_origin == "http://localhost:8080") {
    header("Access-Control-Allow-Origin: $http_origin");
}
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Origin");
header("Content-Type: application/json; charset=utf-8");

$db = new DB();

if(isset($_GET["id"])) {
    $id = trim($_GET["id"], "/");

    echo json_encode($db->returnAllComments($id));
}