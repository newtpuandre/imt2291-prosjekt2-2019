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

if (isset($_SESSION['uid'])) { //User must be logged in.

    //A playlist always needs a name.
    if (($_POST['name'] == "" && $_POST['description'] == "") || $_POST['name'] == "") {
        $res['status'] = 'ERROR';
        echo json_encode($res);
        return;
    }

    $id = $playlist->insertPlaylist($_SESSION['uid'],$_POST['name'],$_POST['description'],$_FILES); //Create playlist

    if ($id != false) { //Was it added successfully?
        $res['status'] = 'SUCCESS';
    } else {
        $res['status'] = 'ERROR';
    }
    
    if($_POST['vidId']){ //Add videos to the playlist
        foreach ($_POST['vidId'] as &$vid) { //Loop throud vidId array
            $playlist->addVideoToPlaylist($id, $vid); //Add single video to playlist
        }
    }
    
    echo json_encode($res);

}