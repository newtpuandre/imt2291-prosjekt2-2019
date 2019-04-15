<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin");
header("Content-Type: application/json; charset=utf-8");

require_once 'classes/admin.php';
$admin = new Admin();

$res = $admin->gatherUsers();
echo json_encode($res);