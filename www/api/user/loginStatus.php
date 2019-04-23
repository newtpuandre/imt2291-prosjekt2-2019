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

error_reporting( E_ALL );
ini_set('display_errors', 1);

require_once '../classes/DB.php';
$db = DB::getDBConnection();
$res = [];
$res['loggedIn'] = false;
if (isset($_SESSION['uid'])) {
  //$stmt = $db->prepare('SELECT id, pwd, email, privileges, !ISNULL(NULLIF(avatar,"")) as hasAvatar FROM user WHERE id=?');
  $stmt = $db->prepare('SELECT id, email, privileges, !ISNULL(NULLIF(avatar,"")) as hasAvatar FROM users WHERE id=?');
  $stmt->execute(array($_SESSION['uid']));
  $result = $stmt->fetch(PDO::FETCH_ASSOC);
  $res['loggedIn'] = true;
  if ($result) {
    $res['status'] = 'SUCCESS';
    $res['uid'] = $result['id'];
    $res['uname'] = $result['email'];

    switch($result['privileges']){
      case 0: $res['utype'] = "student"; break;
      case 1: $res['utype'] = "teacher"; break;
      case 2: $res['utype'] = "admin"; break;
      default: $res['utype'] = "student"; break;
    }
    
    $res['hasAvatar'] = $result['hasAvatar'];
  }
}

echo json_encode($res);
