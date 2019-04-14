<?php
session_start();

/**
 * Laster opp en ny video
 */

$http_origin = $_SERVER['HTTP_ORIGIN'];

if ($http_origin == "http://www" || $http_origin == "http://localhost:8080") {
    header("Access-Control-Allow-Origin: $http_origin");
}
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=utf-8");

ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once '../classes/DB.php';
$db = DB::getDBConnection();

$res["status"] = "FAILED";

if(isset($_SESSION['uid'])) {
    $title = $_POST["title"];
    $desc = $_POST["desc"];
    $topic = $_POST["topic"];
    $course = $_POST["course"];

    $sql = 'INSERT INTO video (userid, title, description, topic, course, thumbnail_path, video_path) values (?, ?, ?, ?, ?, ?, ?)';
    $sth = $db->prepare($sql);
    $sth->execute(array($_SESSION["uid"], $title, $desc, $topic, $course, "", ""));
    
    if($sth->rowCount() == 1) {
        $res['status'] = 'Uploaded';
        $id = $db->lastInsertId();

        $videoDir = "/shared/httpd/uploadedFiles/thumbnails/";
        $thumbDir = "uploadedFiles/videos/";

        $videoName = $_FILES["video"]["name"];
        $videoFull = $videoDir . $id;
            
        $thumbName = $_FILES["thumbnail"]["name"];
        $thumbFull = $thumbDir . $id;

        /* This fails, needs some permission stuff I don't know how to fix with docker
        // Create the directories if they dont exist
        if(!file_exists($thumbDir)) {
            mkdir($thumbDir, 0777, true);
        }
        if(!file_exists($videoDir)) {
            mkdir($videoDir, 0777, true);
        }

        $videoFile = file_get_contents($_FILES["video"]["tmp_name"]);

        if(move_uploaded_file($_FILES["videoFile"]["tmp_name"], $videoFull)
                && move_uploaded_file($_FILES["thumbNail"]["tmp_name"], $thumbFull)) {
            $res["status"] = "SUCCESS";
        } else { // If the files couldn't be moved, delete the video entry from the database
           // $db->deleteVideo($id);
           $res["status"] = "video needs deletion";
        }
        */
    }
}

echo json_encode($res);