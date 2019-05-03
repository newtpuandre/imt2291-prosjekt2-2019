<?php

/**
 * Deletes a video
 * 
 * Supported methods:
 * - GET
 * 
 * Required parameters:
 * - id, int: The ID of the video to delete
 * 
 * Returns:
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

ini_set('display_errors', 1);
error_reporting(E_ALL);

$db = new DB();

$res["status"] = "FAILED";

if(isset($_SESSION["uid"])) {
    if(isset($_GET["id"])) {
        $vid = $_GET["id"];
        $uid = $_SESSION["uid"];

        // Verify the current user is the uploader
        if($db->returnUploaderID($vid) == $uid) {
            if($db->deleteVideo($vid)) {
                $res["status"] = "SUCCESS";
                // Delete all files from disk
                
                // Remove all the local files
                $fileTypes = array("videos", "thumbnails", "subtitles");
                $res["kk"] = $fileTypes;

                $basePath = "../../userFiles/$uid/";

                foreach($fileTypes as $fileType) {
                    $path = $basePath . $fileType . "/$vid";

                    // If a file doesn't exist (eg. no subtitles) unlink gives a warning
                    // which messes with JS fetch, so ignore warnings/errors
                    @unlink($path);
                }
            } else {
                $res["msg"] = "Error deleting";
            }
        } else {
            $res["msg"] = "Authentication error";
        }
    } else {
        $res["msg"] = "No parameter sent";
    }
} else {
    $res["msg"] = "Not logged on";
}

echo json_encode($res);