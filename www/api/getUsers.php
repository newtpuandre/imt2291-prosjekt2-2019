<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin");
header("Content-Type: application/json; charset=utf-8");

require_once 'classes/DB.php';
$db = DB::getDBConnection();

$stmt = $db->prepare('SELECT name, email, privileges, isTeacher FROM users');

$stmt->execute(array());

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
