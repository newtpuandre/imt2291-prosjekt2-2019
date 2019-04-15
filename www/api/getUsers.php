<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin");
header("Content-Type: application/json; charset=utf-8");

require_once 'classes/admin.php';
//$db = DB::getDBConnection();
$admin = new Admin();

//$stmt = $db->prepare('SELECT id, name, email, privileges, isTeacher FROM users');

//$stmt->execute(array());
$res = $admin->gatherUsers();
echo json_encode($res);
//echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
