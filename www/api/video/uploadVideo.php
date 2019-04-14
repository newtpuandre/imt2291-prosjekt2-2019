<?php
/**
 * Laster opp en ny video
 */
session_start();

$http_origin = $_SERVER['HTTP_ORIGIN'];

if ($http_origin == "http://www" || $http_origin == "http://localhost:8080") {
    header("Access-Control-Allow-Origin: $http_origin");
}

header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=utf-8");
//header("Content-Type: image/jpeg");
//header("Content-Type: video/mp4");

error_reporting( E_ALL );
ini_set('display_errors', 1);

require_once 'classes/DB.php';
$db = DB::getDBConnection();

$res['status'] = 'FAILED';

if(isset($_SESSION['uid'])) {
    if(is_uploaded_file($_FILES["video"]["tmp_name"])) {
        $title = $_POST["title"];
        $desc = $_POST["desc"];
        $topic = $_POST["topic"];
        $course = $_POST["course"];
        
        $id = $db->newVideo($_SESSION["uid"], $title, $desc, $topic, $course, "", "");
        if($id != -1) {
            $videoDir = "uploadedFiles/thumbnails/";
            $thumbDir = "uploadedFiles/videos/";
            
            // Create the directories if they dont exist
            if(!file_exists($thumbDir)  && !is_dir($thumbDir)) {
                mkdir($thumbDir);
            }

            if(!file_exists($videoDir)  && !is_dir($videoDir)) {
                mkdir($videoDir);
            }

            $videoFile = file_get_contents($_FILES["video"]["tmp_name"]);

            // Get the file extensions and create the final full names
            $videoName = $_FILES["video"]["name"];
            $videoExt = pathinfo($path, PATHINFO_EXTENSION);
            $videoFull = $videoDir . $id . $videoExt;

            $thumbName = $_FILES["thumbnail"]["name"];
            $thumbExt = pathinfo($thumbName, PATHINFO_EXTENSION);
            $thumbFull = $thumbDir . $id . $thumbFull;

            echo json_encode(array($thumbFull, $videoFull));

            if(move_uploaded_file($_FILES["videoFile"]["tmp_name"], $videoFull)
                    && move_uploaded_file($_FILES["thumbNail"]["tmp_name"], $thumbFull)) {
                $res["status"] = "SUCCESS"
            } else { // If the files couldn't be moved, delete the video entry from the database
                $db->deleteVideo($id);
            }
        }
  }
  
  echo json_encode($res);