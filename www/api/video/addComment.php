<?php
/**
 * Adds a comment to a video
 * 
 * Supported methods: POST
 * 
 * Required parameters:
 * - id, int: The ID of the video
 * - comment, string: The comment to add
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
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Origin");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=utf-8");

ini_set('display_errors', 1);
error_reporting(E_ALL);

$db = new DB();

$res["status"] = "FAILED";

if(isset($_POST["id"])) {
    if(isset($_SESSION['uid'])) {
        $vid = trim($_POST["id"], "/");
        $uid = $_SESSION["uid"];
        $comment = $_POST["comment"];

        $res["vid"] = $vid;
        $res["uid"] = $uid;
        $res["comment"] = $comment;

        if($db->newComment($uid, $vid, $comment)) {
            $res["status"] = "SUCCESS";
        }
    }
}

echo json_encode($res);