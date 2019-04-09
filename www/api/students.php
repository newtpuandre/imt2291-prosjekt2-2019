<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin");
header("Content-Type: application/json; charset=utf-8");

require_once 'classes/DB.php';
$db = DB::getDBConnection();

$stmt = $db->prepare('SELECT givenName, lastName, email, studyProgram FROM students');

$stmt->execute(array());

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
