<?php

/*
Creates a playlist
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

require_once '../classes/playlist.php';
$playlist = new Playlist();
$res = [];

if (isset($_SESSION['uid'])) {

    if (($_POST['name'] == "" && $_POST['description'] == "") || $_POST['name'] == "") {
        $res['status'] = 'ERROR';
        echo json_encode($res);
        return;
    }

    $id = $playlist->insertPlaylist($_SESSION['uid'],$_POST['name'],$_POST['description'],$_FILES);

    if ($id != false) {
        $res['status'] = 'SUCCESS';
    } else {
        $res['status'] = 'ERROR';
    }
    
    if($_POST['vidId']){
        foreach ($_POST['vidId'] as &$vid) {
            $playlist->addVideoToPlaylist($id, $vid);
        }
    }
    
    echo json_encode($res);

}