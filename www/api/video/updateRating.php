<?php

/**
 * Updates the users rating
 * 
 * Methods supported: POST
 * 
 * Required parameters:
 * - rating, int: The rating (0-5)
 * - vid, int: The ID of the video
 */

require_once "../classes/DB.php";

session_start();


$http_origin = $_SERVER['HTTP_ORIGIN'];

if ($http_origin == "http://www" || $http_origin == "http://localhost:8080") {
    header("Access-Control-Allow-Origin: $http_origin");
}
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Origin");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=utf-8");

$db = new DB();

$res["status"] = "FAILED";

if(isset($_SESSION["uid"])) {
    $vid = trim($_POST["vid"], "/");

    if($db->insertOrUpdateRating($_SESSION["uid"], $vid, $_POST["rating"])) {
        $res["status"] = "SUCCESS";
    }
}

echo json_encode($res);