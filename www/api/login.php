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
$res['status'] = 'FAILED';

// Try log in with old md5 password
$sql = 'SELECT password, id, !ISNULL(NULLIF(avatar,"")) as hasAvatar FROM users WHERE email=:email';
      $sth = $db->prepare ($sql);
      $sth->bindParam(':email', $_POST['email']);
      $sth->execute();
      if ($row = $sth->fetch()) { /* get id and hashed password for given user */
          /* Use password_verify to check given password : http://php.net/manual/en/function.password-verify.php */

        if (password_verify($_POST['pwd'], $row['password'])) {  
          $res['status'] = 'SUCCESS';
          $res['uid'] = $row['id'];
          $res['uname'] = $_POST['email'];
          switch($row['privileges']){
            case 0: $res['utype'] = "student"; break;
            case 1: $res['utype'] = "teacher"; break;
            case 2: $res['utype'] = "admin"; break;
            default: $res['utype'] = "student"; break;
          }
          $res['hasAvatar'] = $row['hasAvatar'];
          $_SESSION['uid'] = $row['id'];

        } else {
          $res['msg'] = 'Wrong password.';
        }
      } else {
        $res['msg'] = "Unable to find user.";
      }
echo json_encode($res);
