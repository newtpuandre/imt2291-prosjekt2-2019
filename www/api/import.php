<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  <form action="import.php" method="post">
    <textarea name="data" rows="8" cols="80"></textarea>
    <input type="submit" name="" value="send">
  </form>
  <?php
    if (isset($_POST['data'])) {
      require_once ('classes/DB.php');

      $db = DB::getDBConnection();

      $data = $_POST['data'];
      $data = explode("\n", $data);

      $stmt = $db->prepare('INSERT INTO students (givenName, lastName, email, studyProgram) VALUES (?, ?, ?, ?)');

      foreach ($data as $student) {
        $stmt->execute (explode("\t", $student));
      }
    }
   ?>
</body>
</html>
