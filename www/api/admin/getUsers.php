<?php

/*
Returns all users from the database.
*/

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin");
header("Content-Type: application/json; charset=utf-8");

require_once '../classes/admin.php';
$admin = new Admin();

$res = $admin->gatherUsers(); //Returns all users from DB
echo json_encode($res);