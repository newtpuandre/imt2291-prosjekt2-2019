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

error_reporting( E_ALL );
ini_set('display_errors', 1);

require_once 'classes/DB.php';
$db = DB::getDBConnection();
$res['status'] = 'FAILED';
if (isset($_SESSION['uid'])) {
  if (is_uploaded_file($_FILES['file']['tmp_name'])) {
    $content = file_get_contents($_FILES['file']['tmp_name']);
    $scaledContent = scale (imagecreatefromstring($content), 80, 80);
    unset ($content);     // Free up memory from old/unscaled image
    $sql = 'UPDATE user SET avatar=? WHERE id=?';
    $sth = $db->prepare ($sql);
    $sth->execute(array($scaledContent, $_SESSION['uid']));
    if ($sth->rowCount()==1) {
      $res['status'] = 'SUCCESS';
    }
  }
}

echo json_encode($res);

// Fra uke5_forelesning/image_upload_and_scale_to_db
function scale ($img, $new_width, $new_height) {
  $old_x = imageSX($img);
  $old_y = imageSY($img);

  if($old_x > $old_y) {                     // Image is landscape mode
    $thumb_w = $new_width;
    $thumb_h = $old_y*($new_height/$old_x);
  } else if($old_x < $old_y) {              // Image is portrait mode
    $thumb_w = $old_x*($new_width/$old_y);
    $thumb_h = $new_height;
  } if($old_x == $old_y) {                  // Image is square
    $thumb_w = $new_width;
    $thumb_h = $new_height;
  }

  if ($thumb_w>$old_x) {                    // Don't scale images up
    $thumb_w = $old_x;
    $thumb_h = $old_y;
  }

  $dst_img = ImageCreateTrueColor($thumb_w,$thumb_h);
  imagecopyresampled($dst_img,$img,0,0,0,0,$thumb_w,$thumb_h,$old_x,$old_y);

  ob_start();                         // flush/start buffer
  imagepng($dst_img,NULL,9);          // Write image to buffer
  $scaledImage = ob_get_contents();   // Get contents of buffer
  ob_end_clean();                     // Clear buffer
  return $scaledImage;
}
