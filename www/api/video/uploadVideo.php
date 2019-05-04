<?php
/**
 * Uploads a new video
 * Methods supported: POST
 * Parameters required: title, desc, topic, course
 * Required files: video
 * Optional files: thumbnail, subtitles
 * 
 * Returns:
 * - id, int: The ID of the uploaded video
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

if(isset($_SESSION['uid'])) {
    $title = $_POST["title"];
    $desc = $_POST["desc"];
    $topic = $_POST["topic"];
    $course = $_POST["course"];

    $id = $db->newVideo($_SESSION["uid"], $title, $desc, $topic, $course, "", "");

    if($id != -1) {
        $res["id"] = $id;

        // Every user has their own folder, and in that folder there are
        // subfolders for videos, thumbnails and subtitles
        // The current folder is "www/api/video", the "userFiles" folder
        // is located at "/www/userfiles"
        $videoDir = "../../userFiles/" . $_SESSION["uid"] . "/videos";
        $thumbDir = "../../userFiles/" . $_SESSION["uid"] . "/thumbnails";
        $subtitlesDir = "../../userFiles/" . $_SESSION["uid"] . "/subtitles";

        if(!file_exists($videoDir)) {
            mkdir($videoDir, 0777, true);
        }

        if(!file_exists($thumbDir)) {
            mkdir($thumbDir, 0777, true);
        }

        if(!file_exists($subtitlesDir)) {
            mkdir($subtitlesDir, 0777, true);
        }

        if(@$_FILES["thumbnail"]["error"] === UPLOAD_ERR_OK) {
            if(move_uploaded_file($_FILES["thumbnail"]["tmp_name"], $thumbDir . "/" . $id)) {
                $res["status"] = "SUCCESS";
            }
        }
        
        if(@$_FILES["subtitles"]["error"] === UPLOAD_ERR_OK) {
            if(move_uploaded_file($_FILES["subtitles"]["tmp_name"], $subtitlesDir . "/" . $id)) {
                $res["subs"] = "uploaded";
                $res["status"] = "SUCCESS";
            }
        } else {
            $res["subs"] = "not found";
        }

        if(move_uploaded_file($_FILES["video"]["tmp_name"], $videoDir . "/"  . $id)) {
            $res["status"] = "SUCCESS";
        }

        // Something failed, remove the database entry and delete the files from disk
        if($res["status"] == "FAILED") {
            $db->deleteVideo($id);

            unlink($videoDir . "/" . $id);

            if(file_exists($thumbDir . "/" . $id)) {
                unlink($thumbDir . "/" . $id);
            }

            if(file_exists($subtitlesDir . "/" . $id)) {
                unlink($subtitlesDir . "/" . $id);
            }
        }
    }
}

echo json_encode($res);