<?php
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

$sql = 'UPDATE users SET privileges=? WHERE id=?';
$sth = $db->prepare ($sql);
$sth->execute(array($_POST['privilege'], $_POST['id']));
if ($sth->rowCount()==1) {
    $res['status'] = 'SUCCESS';
} else {
    $res['status'] = 'ERROR';
}
echo json_encode($res);