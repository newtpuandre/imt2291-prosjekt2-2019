<?php
session_start();

$http_origin = $_SERVER['HTTP_ORIGIN'];

if ($http_origin == "http://www" || $http_origin == "http://localhost:8080") {
    header("Access-Control-Allow-Origin: $http_origin");
}
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: image/png");

require_once 'classes/DB.php';
$db = DB::getDBConnection();

if ($_SESSION['uid']) {
  $stmt = $db->prepare('SELECT avatar FROM user WHERE id=?');
  $stmt->execute(array($_SESSION['uid']));
  $res = $stmt->fetch(PDO::FETCH_ASSOC);
  if ($res) {
    echo $res['avatar'];
  }
}
