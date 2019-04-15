<?php
$http_origin = $_SERVER['HTTP_ORIGIN'];

if ($http_origin == "http://www" || $http_origin == "http://localhost:8080") {
    header("Access-Control-Allow-Origin: $http_origin");
}

header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=utf-8");

require_once 'classes/admin.php';
$admin = new Admin();

$res = [];
if($admin->updatePrivileges($_POST['id'], $_POST['privilege'])){
    $res['status'] = 'SUCCESS';
} else {
    $res['status'] = 'ERROR';
}

echo json_encode($res);