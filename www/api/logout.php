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
  session_destroy();
  unset ($_SESSION['uid']);
  $res['status'] = 'SUCCESS';
  $res['uid'] = null;
  $res['uname'] = '';
  $res['utype'] = null;
  $res['hasAvatar'] = 0;
} else {
  $res['status'] = 'FAILED';
  $res['msg'] = 'Not logged in';
}
echo json_encode($res);
