<?php
session_start();

$http_origin = $_SERVER['HTTP_ORIGIN'];

if ($http_origin == "http://www" || $http_origin == "http://localhost:8080") {
    header("Access-Control-Allow-Origin: $http_origin");
}
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=utf-8");

require_once 'classes/DB.php';
require_once 'classes/playlist.php';
$playlist = new Playlist();
$db = DB::getDBConnection();
$res = [];

if (isset($_SESSION['uid'])) {
    /*$sql = 'INSERT INTO playlists (ownerId, name, description, thumbnail) values (?, ?, ?, ?)';
    $sth = $db->prepare($sql);
    $sth->execute (array ($_SESSION['uid'], $_POST['name'],$_POST['description'],$_POST['thumbnail']));
    print_r($_FILES);*/
    //Create playlist
    
    $id = $playlist->insertPlaylist($_SESSION['uid'],$_POST['name'],$_POST['description'],$_FILES);

    if ($id != false) {
        $res['status'] = 'SUCCESS';
    } else {
        $res['status'] = 'ERROR';
    }
    
    
    /*$id = $db->lastInsertId(); 
    print_r($id);*/

    if($_POST['vidId']){
        foreach ($_POST['vidId'] as &$vid) {
            $playlist->addVideoToPlaylist($id, $vid);
        }
    }
    
    /*if ($sth->rowCount()==1) {
        $res['status'] = 'SUCCESS';
    } else {
        $res['status'] = 'ERROR';
    }*/

    echo json_encode($res);

}