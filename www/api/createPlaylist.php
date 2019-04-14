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
$db = DB::getDBConnection();
$res = [];

if (isset($_SESSION['uid'])) {
    $sql = 'INSERT INTO playlists (ownerId, name, description, thumbnail) values (?, ?, ?, ?)';
    $sth = $db->prepare($sql);
    /* Use password_hash to encrypt password : http://php.net/manual/en/function.password-hash.php */
    $sth->execute (array ($_SESSION['uid'], $_POST['name'],$_POST['description'],$_POST['thumbnail']));
    //Create playlist

    if ($sth->rowCount()==1) {
        $res['status'] = 'SUCCESS';
    } else {
        $res['status'] = 'ERROR';
    }
    echo json_encode($res);

}