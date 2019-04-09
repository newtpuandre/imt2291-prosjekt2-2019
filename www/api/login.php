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

// Try log in with old md5 password
$stmt = $db->prepare('SELECT id, pwd, type, !ISNULL(NULLIF(avatar,"")) as hasAvatar FROM user WHERE uname=? and pwd=?');
$stmt->execute(array($_POST['uname'], md5($_POST['pwd'])));
$result = $stmt->fetch(PDO::FETCH_ASSOC);
$res = [];
$res['status'] = 'FAILED';
if ($result) {  // User found with old md5 password
  $stmt = $db->prepare('UPDATE user SET pwd=? where id=?');
  $stmt->execute(array($result['id'], password_hash($result['pwd'],PASSWORD_DEFAULT)));  // Convert md5 password to password_hash password
  $res['status'] = 'SUCCESS';
  $res['uid'] = $result['id'];
  $res['uname'] = $_POST['uname'];
  $res['utype'] = $result['type'];
  $res['hasAvatar'] = $result['hasAvatar'];
  $_SESSION['uid'] = $result['id'];
} else {
  $stmt = $db->prepare('SELECT id, type, pwd, !ISNULL(NULLIF(avatar,"")) as hasAvatar FROM user WHERE uname=?');
  $stmt->execute(array($_POST['uname']));
  $result = $stmt->fetch(PDO::FETCH_ASSOC);
  if ($result) {  // User found, now check password
    if (password_verify($_POST['pwd'], $result['pwd'])) { // Password matches
      $res['status'] = 'SUCCESS';
      $res['uid'] = $result['id'];
      $res['uname'] = $_POST['uname'];
      $res['utype'] = $result['type'];
      $res['hasAvatar'] = $result['hasAvatar'];
      $_SESSION['uid'] = $result['id'];
    } else if (password_verify(md5($_POST['pwd']), $result['pwd'])) { // Password matches, old md5 pwd
      $res['status'] = 'SUCCESS';
      $res['uid'] = $result['id'];
      $res['uname'] = $_POST['uname'];
      $res['utype'] = $result['type'];
      $res['hasAvatar'] = $result['hasAvatar'];
      $_SESSION['uid'] = $result['id'];
    } else {
      $res['msg'] = 'Wrong password.';
    }
  } else { // User not found
    $res['msg'] = "Unable to find user.";
  }
}
echo json_encode($res);
