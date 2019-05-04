<?php
/**
 * Edits information about a video
 * 
 * Methods supported: POST
 * 
 * Required parameters:
 * - vid, int: The ID of the video
 * - title, string: The new title of the video
 * - desc, string: The description of the video
 * - topic, string: The topic of the video
 * - course, string: The course of the video
 * 
 * Optional files:
 * - thumbnail
 * - subtitles
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

$res["p"] = $_POST;

if(isset($_SESSION["uid"])) {
    if(isset($_POST["vid"])) {
        $vid = trim($_POST["vid"], "/");

        $uploaderID = $db->returnUploaderID($vid);
        
        // Verify the current user is the uploader
        if($_SESSION["uid"] === $uploaderID) {
            if($db->updateVideo($vid, $_POST["title"], $_POST["desc"], $_POST["topic"], $_POST["course"])) {
                $ok = true;

                // Check for file uploads, change on disk
                $thumbDir = "../../userFiles/" . $_SESSION["uid"] . "/thumbnails";
                $subtitlesDir = "../../userFiles/" . $_SESSION["uid"] . "/subtitles";

                if(!file_exists($thumbDir)) {
                    mkdir($thumbDir, 0777, true);
                }

                if(!file_exists($subtitlesDir)) {
                    mkdir($subtitlesDir, 0777, true);
                }

                $thumbPath = $thumbDir . "/" . $vid;
                $subsPath = $subtitlesDir . "/" . $vid;

                // Remove old files (ignores warning if file doesn't exist)
                @unlink($thumbPath);
                @unlink($subsPath);

                if(@$_FILES["thumbnail"]["error"] === UPLOAD_ERR_OK) {
                    if(!move_uploaded_file($_FILES["thumbnail"]["tmp_name"], $thumbPath)) {
                        $ok = false; 
                    }
                }
                
                if(@$_FILES["subtitles"]["error"] === UPLOAD_ERR_OK) {
                    if(!move_uploaded_file($_FILES["subtitles"]["tmp_name"], $subsPath)) {
                        $ok = false;
                    }
                }

                if($ok) { // Nothing failed
                    $res["status"] = "SUCCESS";
                }
            }
        }
    }
}

echo json_encode($res);