<?php

/**
 * Returns the file for the given ID and type
 * Methods supported: GET
 * 
 * Required parameters:
 * - id, int: the ID of the video
 * - type, string: What type of file to get (Values supported: video, thumbnail, subtitle)
 * 
 * Returns the queried file
 */

require_once "../classes/DB.php";

session_start();


$http_origin = $_SERVER['HTTP_ORIGIN'];

if ($http_origin == "http://www" || $http_origin == "http://localhost:8080") {
    header("Access-Control-Allow-Origin: $http_origin");
}
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Origin");

ini_set('display_errors', 1);
error_reporting(E_ALL);

$db = new DB();

if(isset($_GET["id"])) {
    if(isset($_GET["type"])) {
        $id = trim($_GET["id"], "/");

        if(is_numeric($id)) {
            $data = $db->returnVideo($id);
            $uploaderId = $data[0]["userid"];
            $path = "../../userFiles/$uploaderId/";
    
            switch($_GET["type"]) {
                case "video":
                    $path .= "videos/$id";
                    
                    header('Content-type: video/*');
                    header('Accept-Ranges: bytes');
                    header('Content-Length: ' . filesize($path));
                    
                    break;
                case "thumbnail":
                    header('Content-type: image/*');
                    $path .= "thumbnails/$id";
    
                    break;
                case "subtitle":
                    header("Content-Type: text/vtt;charset=utf-8");
                    $path .= "subtitles/$id";
    
                    break;
                default:
                    break;
            }
    
            if(file_exists($path) && !is_dir($path)) {
                readfile($path);
            }
        }
    }
}