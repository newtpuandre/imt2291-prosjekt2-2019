<?php

/**
 * Updates a videos thumbnail
 * 
 * Supported methods: POST
 * 
 * Required parameters:
 * - vid, int: The ID of video
 * - thumbnail, string: Base64 representation of the image
 * 
 * Returns:
 * - status: SUCCESS/FAILED
 */

require_once '../classes/DB.php';

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

if(isset($_SESSION["uid"])) {
    if(isset($_POST["vid"]) && isset($_POST["thumbnail"])) {
        $vid = trim($_POST["vid"], "/");

        $uploaderID = $db->returnUploaderID($vid);
        
        // Verify the current user is the uploader
        if($_SESSION["uid"] == $uploaderID) {
            $thumbDir = "../../userFiles/" . $_SESSION["uid"] . "/thumbnails";
            if(!file_exists($thumbDir)) {
                mkdir($thumbDir, 0777, true);
            }
    
            $filePath = $thumbDir . "/$vid";
    
            // Remove old thumbnail
            @unlink($filePath);

            // Open (create) a file for writing
            $file = fopen($filePath, "w");

            if(fwrite($file, base64_decode($_POST["thumbnail"]))) {
                $res["status"] = "SUCCESS";
            }
        }
    }
}

echo json_encode($res);