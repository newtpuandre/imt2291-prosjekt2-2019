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

$sql = 'INSERT INTO users (name, email, password, isTeacher) values (?, ?, ?, ?)';
$sth = $db->prepare($sql);
/* Use password_hash to encrypt password : http://php.net/manual/en/function.password-hash.php */
$sth->execute (array ($_POST['name'], $_POST['email'],
                  password_hash($_POST['pwd'], PASSWORD_DEFAULT),$_POST['isTeacher']));
if ($sth->rowCount()==1) {
    session_start();
    $res['status'] = 'SUCCESS';
    $res['uid'] = $db->lastInsertId();
    $res['uname'] = $_POST['email'];
    $res['utype'] = "student";
    $res['hasAvatar'] = 0;
    $_SESSION['uid'] = $db->lastInsertId();
    echo json_encode($res);

} else {
    return false;
}
