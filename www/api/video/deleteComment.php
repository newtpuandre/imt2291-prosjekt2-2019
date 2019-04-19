<?php

/**
 * Deletes a comment from a video
 * 
 * Supported methods: GET
 * 
 * Required parameters:
 * - cid, int: The ID of the comment to delete
 * 
 * Return:
 * - status, string: SUCCESS/FAILED
 */

require_once "../classes/DB.php";

session_start();


$http_origin = $_SERVER['HTTP_ORIGIN'];

if ($http_origin == "http://www" || $http_origin == "http://localhost:8080") {
    header("Access-Control-Allow-Origin: $http_origin");
}
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Origin");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=utf-8");

$db = new DB();

$res["status"] = "FAILED";

if(isset($_GET["cid"])) {
    if($db->deleteComment($_GET["cid"])) {
        $res["status"] = "SUCCESS";
    }
}

echo json_encode($res);