<?php
class DB {
  private static $db=null;
  private $dsn = 'mysql:dbname=myDb;host=db';
  private $user = 'user';
  private $password = 'test';
  private $dbh = null;

  public function __construct() {
    try {
        $this->dbh = new PDO($this->dsn, $this->user, $this->password);
    } catch (PDOException $e) {
        // NOTE IKKE BRUK DETTE I PRODUKSJON
        echo 'Connection failed: ' . $e->getMessage();
    }
  }

  public static function getDBConnection() {
      if (DB::$db==null) {
        DB::$db = new self();
      }
      return DB::$db->dbh;
  }

    /**
     * @function findUser
     * @brief returns user information based on username
     * @param string $m_email 
     * @return array|null
     */
    public function findUser($m_email){
      $sql = 'SELECT id, name, email, picture_path, privileges FROM users WHERE email=:email';
      $sth = $this->dbh->prepare ($sql);
      $sth->bindParam(':email', $m_email);
      $sth->execute();
      if ($row = $sth->fetch()) {
          return $row;
          
      } else {
          return null;
      }
  }

    /**
   * @function registerUser
   * @brief registers a user
   * @param $uid
   * @param string $m_name
   * @param string $m_email
   * @param string $m_password
   * @param int $m_isTeacher
   * @return bool
   */
  public function registerUser($m_name, $m_email,$m_password, $m_isTeacher) {

      $sql = 'INSERT INTO users (name, email, password, isTeacher) values (?, ?, ?, ?)';
      $sth = $this->dbh->prepare($sql);
      /* Use password_hash to encrypt password : http://php.net/manual/en/function.password-hash.php */
      $sth->execute (array ($m_name, $m_email,
                        password_hash($m_password, PASSWORD_DEFAULT),$m_isTeacher));
      if ($sth->rowCount()==1) {
          return true;
      } else {
          return false;
      }
  }

  /**
   * @function updateUser
   * @brief updates information about the user
   * @param int $m_id
   * @param string $m_name
   * @param string $m_email
   * @param string $m_password
   * @param string $m_picture
   * @return bool
   */
  public function updateUser($m_id, $m_name, $m_email, $m_password, $m_picture){

      /* If the password is to update */
      if ($m_password != null) {
          $sql = 'UPDATE users SET name=:name, email=:email, password=:password, picture_path=:picture WHERE id=:id';
      } else {
          $sql = 'UPDATE users SET name=:name, email=:email, picture_path=:picture WHERE id=:id';
      }
     
      $sth = $this->dbh->prepare ($sql);
      $sth->bindParam(':id', $m_id);
      $sth->bindParam(':name', $m_name);
      $sth->bindParam(':email', $m_email);
      $sth->bindParam(':picture', $m_picture);
      if ($m_password != null) {
          $sth->bindParam(':password', $m_password);
      }
      $sth->execute();
      if ($row = $sth->fetch()) {
          return true;
      } else {
          return false;
      }
  }

    /**
   * @function removeIAmTeacher
   * @brief removes teacher privileges from a user
   * @param int $m_id
   * @return bool
   */
  public function removeIAmTeacher($m_id) {
      $sql = 'UPDATE users SET isTeacher=0 WHERE id=:id';
      $sth = $this->dbh->prepare($sql);
      $sth->bindParam('id', $m_id);
      $sth->execute();
      if ($row = $sth->fetch()) {
          return true;
      } else {
          return false;
      }
  }

    /**
   * @function countIAmTeacher
   * @brief returns count of how many users are teachers
   * @return array|null
   */
  public function countIAmTeacher(){
      $sql = 'SELECT COUNT(*) AS num FROM users WHERE isTeacher=1';
      $sth = $this->dbh->prepare ($sql);
      $sth->execute();
      if ($row = $sth->fetch()){
          return $row;
      } else {
          return null;
      }
  }

  /**
   * @function loginUser
   * @brief logs user in to system
   * @param string $m_email
   * @param string $m_password
   * @return bool
   */
  public function loginUser($m_email,$m_password){
      $sql = 'SELECT password, id FROM users WHERE email=:email';
      $sth = $this->dbh->prepare ($sql);
      $sth->bindParam(':email', $m_email);
      $sth->execute();
      if ($row = $sth->fetch()) { /* get id and hashed password for given user */
          /* Use password_verify to check given password : http://php.net/manual/en/function.password-verify.php */
          if (password_verify($m_password, $row['password'])) {
              return true;
          } else {
              return false;
          }
      } else {
          return false;
      }
  }

  /**
   * @function gatherUsers
   * @brief returns information about all users
   * @return array|null
   */
  public function gatherUsers(){
      $sql = 'SELECT id, name, email, privileges, isTeacher FROM users ORDER BY id DESC ';
      $sth = $this->dbh->prepare ($sql);
      $sth->execute();
      if ($rows = $sth->fetchAll()) {
          return $rows;            
      } else {
          return null;
      }
  }

    /**
   * @function newVideo
   * @brief uploads video/thumbnail files to DB
   * @param $user
   * @param string $title
   * @param string $desc
   * @param string $topic
   * @param string $course
   * @param string $thumb_path
   * @param string $video_path
   * @return int The ID of the new video, or -1 on fail
   */
  public function newVideo($user, $title, $desc, $topic, $course, $thumb_path, $video_path) {
      $sql = 'INSERT INTO video (userid, title, description, topic, course, thumbnail_path, video_path) values (?, ?, ?, ?, ?, ?, ?)';
      $sth = $this->dbh->prepare($sql);
      $sth->execute(array($user, $title, $desc, $topic, $course, $thumb_path, $video_path));

      if ($sth->rowCount()==1) {
        return $this->dbh->lastInsertId();
      } else {
        return -1;
      }
  }

  /**
   * @function returnVideos
   * @brief returns all videos a user "owns". Can limit with $start and $end.
   * @param int $m_userid
   * @param int $m_startnum
   * @param int $m_endnum
   * @return array|null
   */
  public function returnVideos($m_userid, $m_startnum = "" ,$m_endnum = ""){ 
      $sql = 'SELECT id, userid, title, description, topic, course, time, thumbnail_path, video_path FROM video WHERE userid=:userid ORDER BY time DESC';

      if( $m_startnum != "" && $m_endnum != "") {
          $sql .= ' LIMIT :start, :end';
      } 

      $sth = $this->dbh->prepare ($sql);
      $sth->bindParam(':userid', $m_userid);

      if($m_startnum != "" && $m_endnum != "") {
          $sth->bindParam(':start', $m_startnum);
          $sth->bindParam(':end', $m_endnum);
      }

      $sth->execute();
      if ($rows = $sth->fetchAll()) {
          return $rows;
      } else {
          return null;
      }
  }

   /**
   * @function returnVideo
   * @brief returns information about a specific video
   * @param int $m_videoid
   * @return array|null
   */
  public function returnVideo($m_videoid){
      $sql = 'SELECT * FROM video WHERE id=:id';

      $sth = $this->dbh->prepare($sql);
      $sth->bindParam(':id', $m_videoid);

      $sth->execute();

      if ($row = $sth->fetchAll()) {
          return $row;
      } else {
          return null;
      }
  }

  /**
   * @function returnAllVideos
   * @brief returns all videos in the database. The most recent appears first
   * @return array|null
   */
  public function returnAllVideos(){
      $sql = 'SELECT * FROM video ORDER BY time DESC';
      $sth = $this->dbh->prepare ($sql);

      $sth->execute();
      if ($rows = $sth->fetchAll()) {
          return $rows;
      } else {
          return null;
      }
  }

  /**
   * @function deleteVideo
   * @brief deletes a specific video
   * @param $m_videoid
   * @return boolean true if the video was deleted
   */
  public function deleteVideo($m_videoid){
      $sql = 'DELETE FROM video WHERE id=:videoid';
      $sth = $this->dbh->prepare($sql);

      $sth->bindParam(':videoid', $m_videoid);
      $sth->execute();

      if ($sth->rowCount()==1) {
          return true;
      } else {
          return false;
      }
  }
  
  /**
   * @function updateVideo
   * @brief updates information about a specific video
   * @param int $m_videoid 
   * @param string $m_title
   * @param string $m_description
   * @param string $m_topic
   * @param string $m_course
   * @return bool
   */
  public function updateVideo($m_videoid, $m_title, $m_description, $m_topic, $m_course){

      $sql = 'UPDATE video SET title =:title, description=:description, topic=:topic, course=:course WHERE id=:videoid';
      $sth = $this->dbh->prepare ($sql);
      $sth->bindParam(':title', $m_title);
      $sth->bindParam(':videoid', $m_videoid);
      $sth->bindParam(':description', $m_description);
      $sth->bindParam(':topic', $m_topic);
      $sth->bindParam(':course', $m_course);

      $sth->execute();
      if ($sth->rowCount() == 1) {
          return true;
      } else {
          return false;
      }
  }

  /**
   * @function searchVideo
   * @brief returns all videos where anything matches a prompt
   * @param string $m_prompt - what is being searched for 
   * @return array|null
   */

  public function searchVideo($m_prompt){
      $sql = 'SELECT video.*, users.name FROM video JOIN users ON video.userid = users.id WHERE users.name LIKE :prompt OR video.title LIKE :prompt OR video.description LIKE :prompt OR video.topic LIKE :prompt OR video.course LIKE :prompt';
      $sth = $this->dbh->prepare ($sql);
      $param = "%" . $m_prompt . "%";
      $sth->bindParam(':prompt', $param);

      $sth->execute();

      if ($rows = $sth->fetchAll()) {
          return $rows;
      } else {
          return null;
      }
  }

  /**
   * @function searchVideoCourse
   * @brief returns the count and information about a course that is being searched for
   * @param string $m_prompt
   * @return array|null
   */
  public function searchVideoCourse($m_prompt){
      $sql = 'SELECT course, id, topic, time, title, description, thumbnail_path FROM video WHERE course LIKE :prompt';
      $sth = $this->dbh->prepare ($sql);
      $param = "%" . $m_prompt . "%";
      $sth->bindParam(':prompt', $param);

      $sth->execute();

      if ($rows = $sth->fetchAll()) {
          return $rows;
      } else {
          return null;
      }
  }

  /**
   * @function searchVideoCourse
   * @brief returns the playlist(s) that is being searched for
   * @param string $m_search
   * @return array|null
   */
  public function searchForPlaylists($m_search){
      $sql = 'SELECT id, name, description, thumbnail FROM playlists WHERE name LIKE :prompt OR description LIKE :prompt';
      $sth = $this->dbh->prepare ($sql);
      $param = "%" . $m_search . "%";
      $sth->bindParam(':prompt', $param);

      $sth->execute();

      if ($rows = $sth->fetchAll()) {
          return $rows;
      } else {
          return null;
      }
  }

  /**
   * @function returnAllCourses
   * @brief returns the count and information about all courses in the database
   * @return array|null
   */
  public function returnAllCourses(){
      $sql = 'SELECT COUNT(*) AS count, course,id, topic, time FROM video GROUP BY course';
      $sth = $this->dbh->prepare($sql);
      $sth->execute();

      if ($rows = $sth->fetchAll()) {
          return $rows;
      } else {
          return null;
      }
  }
  /**
   * @function updateThumbnail
   * @brief updates the thumbnail path for one video
   * @param int $m_videoid
   * @param string $m_thumb_path
   * @return array|null
   */
  public function updateThumbnail($m_videoid, $m_thumb_path){

      $sql = 'UPDATE video SET thumbnail_path=:thumbnail_path WHERE id=:videoid';
      $sth = $this->dbh->prepare ($sql);
      $sth->bindParam(':thumbnail_path', $m_thumb_path);
      $sth->bindParam(':videoid', $m_videoid);
      $sth->execute();
      if ($row = $sth->fetch()) {
          return true;
      } else {
          return false;
      }
        
  }
  
  /**
   * @function updatePrivileges
   * @brief updates the privileges for one user
   * @param string $m_id
   * @param string $m_privilevel
   * @return bool
   */
  public function updatePrivileges($m_id, $m_privilevel) {
      //echo $this->dbh->;
      $sql = 'UPDATE users SET privileges = :privileges WHERE id=:id';
      $sth = $this->dbh->prepare ($sql);
      $sth->bindParam(':privileges',$m_privilevel);
      $sth->bindParam(':id', $m_id);
      $sth->execute();
      if ($sth->rowCount() > 0) {
          return true;
      } else {
          return false;
      }
  }

   /**
   * @function returnPlaylist
   * @brief Returns ALL playlists from one person
   * @param int $m_id
   * @return array|null
   */
  public function returnPlaylists($m_id){ 
      $sql = 'SELECT id, name, description, thumbnail, date FROM playlists WHERE ownerId=:id';
      $sth = $this->dbh->prepare ($sql);
      $sth->bindParam(':id', $m_id);
      $sth->execute();
      if ($rows = $sth->fetchAll()) {
          return $rows;
      } else {
          return null;
      }
  }

   /**
   * @function insertPlaylist
   * @brief adds a new playlist to db
   * @param int $m_ownerID
   * @param string $m_name
   * @param string $m_description
   * @param string $m_thumbnail
   * @return int of inserted playlist
   */
  public function insertPlaylist($m_ownerId,$m_name,$m_description, $m_thumbnail){
      $sql = 'INSERT INTO playlists (ownerId , name, description, thumbnail) values (?, ?, ?, ?)';
      $sth = $this->dbh->prepare($sql);
      
      $sth->execute (array ($m_ownerId, $m_name, $m_description, $m_thumbnail));

      $id = $this->dbh->lastInsertId();

      if ($sth->rowCount()==1) {
        return $id;
      } else {
        return false;
      }
  }

  /**
   * @function insertPlaylist
   * @brief Returns a single playlist with a specific id
   * @param int $m_id
   * @return array|null
   */
  public function returnPlaylist($m_id){
      $sql = 'SELECT users.name AS lectname, playlists.id, ownerId, playlists.name, description, date, thumbnail FROM playlists JOIN users ON users.id = ownerid WHERE playlists.id=:id';
      $sth = $this->dbh->prepare ($sql);
      $sth->bindParam(':id', $m_id);
      $sth->execute();
      if ($row = $sth->fetch()) {
          return $row;
      } else {
          return null;
      }
  }

   /**
   * @function updatePlaylist
   * @brief updates the information about one specific playlist
   * @param int $m_id
   * @param int $m_ownerId
   * @param string $m_name
   * @param string $m_description
   * @param string $m_thumbnail
   * @return bool
   */
  public function updatePlaylist($m_id, $m_ownerId, $m_name, $m_description, $m_thumbnail = null){
      /* If the thumbnail is to be updated */
      if ($m_thumbnail) {
          $sql = 'UPDATE playlists SET name = :name, description= :description, thumbnail=:thumbnail WHERE ownerId=:ownerId AND id=:id';
      } else {
          $sql = 'UPDATE playlists SET name = :name, description= :description WHERE ownerId=:ownerId AND id=:id';
      }


      $sth = $this->dbh->prepare ($sql);
      $sth->bindParam(':name',$m_name);
      $sth->bindParam(':description', $m_description);
      $sth->bindParam(':ownerId', $m_ownerId);
      $sth->bindParam(':id', $m_id);

      if ($m_thumbnail){
          $sth->bindParam(':thumbnail', $m_thumbnail);
      }

      $sth->execute();
      if ($sth->rowCount()==1) {
          if($m_thumbnail != null) {
            return $m_thumbnail;
          } else {
              return true;
          }
      } else {
          return false;
      }
  }

  /**
   * @function getNewVideosInPlaylist
   * @brief get the newest videos in the playlist
   * @param int $m_playlistid
   * @return array|bool
   */
  public function getNewVideosInPlaylist($m_playlistid) {
    $sql = 'SELECT videoid FROM playlistvideos WHERE playlistid=:playlistid ORDER BY id ASC LIMIT 3';
    $sth = $this->dbh->prepare($sql);

    $sth->bindParam(':playlistid', $m_playlistid);
    $sth->execute();

    if ($row = $sth->fetchAll(PDO::FETCH_ASSOC)) {
        return $row;
    } else {
        return false;
    }
  }

  /**
   * @function updatePlaylistThumbnail
   * @brief updates playlist thumbnail
   * @param $m_playlistId
   * @param $m_thumb_path
   * @return bool
   */
  public function updatePlaylistThumbnail($m_playlistId, $m_thumb_path){
        $sql = 'UPDATE playlists SET thumbnail=:thumbnail WHERE id=:id';

        $sth = $this->dbh->prepare ($sql);
        $sth->bindParam(':thumbnail',$m_thumb_path);
        $sth->bindParam(':id', $m_playlistId);
        $sth->execute();

        if ($sth->rowCount()==1) {
            return true;
        } else {
            return false;
        }
  }

  /**
   * @function deletePlaylist
   * @brief deletes a playlist from the db
   * @param int $m_playlistId
   * @param int $m_ownerId
   * @return bool
   */
  public function deletePlaylist($m_playlistId,$m_ownerId){

      $sql = 'DELETE FROM playlists WHERE id=:id AND ownerId=:ownerId';
      $sth = $this->dbh->prepare($sql);

      $sth->bindParam(':id', $m_playlistId);
      $sth->bindParam(':ownerId', $m_ownerId);
      $sth->execute();

      if ($sth->rowCount()==1) {
          return true;
      } else {
          return false;
      }

  }

 /**
   * @function countSubscribers
   * @brief returns the number of subscribers for a playlist
   * @param int $m_playlistId
   * @return array|null
   */
  public function countSubscribers($m_playlistId){
      $sql = 'SELECT count(*) AS numSubs FROM subscriptions WHERE playlistid=:playlistid';
      $sth = $this->dbh->prepare($sql);

      $sth->bindParam(':playlistid', $m_playlistId);
      $sth->execute();

      if ($row = $sth->fetch()) {
          return $row;
      } else {
          return null;
      }

  }

  /**
   * @function returnSubscriptionStatus
   * @brief returns whether the user is subscribed or not
   * @param int $m_playlistId
   * @param int $m_userid
   * @return array|null
   */
  public function returnSubscriptionStatus($m_playlistid, $m_userid){
      $sql = 'SELECT userid FROM subscriptions WHERE playlistid=:playlistid AND userid=:userid';
      $sth = $this->dbh->prepare($sql);

      $sth->bindParam(':playlistid', $m_playlistid);
      $sth->bindParam(':userid', $m_userid);
      $sth->execute();

      if ($row = $sth->fetch(PDO::FETCH_ASSOC)) {
          return $row;
      } else {
          return false;
      }
  }

  /**
   * @function getSubscribedPlaylist
   * @brief returns the playlist a user subscribed to
   * @param int $m_userid
   * @return array|null
   */
  public function getSubscribedPlaylists($m_userid) {
      $sql = 'SELECT id, userid, playlistid FROM subscriptions WHERE userid=:userid';
      $sth = $this->dbh->prepare ($sql);
      $sth->bindParam(':userid', $m_userid);
      $sth->execute();
      if ($rows = $sth->fetchAll()) {
          return $rows;
      } else {
          return null;
      }
  }

   /**
   * @function subscribeToPlaylist
   * @brief subscribes a user to a playlist
   * @param int $m_playlistid
   * @param int $m_userid
   * @return bool
   */
  public function subscribeToPlaylist($m_playlistid, $m_userid){
      $sql = 'INSERT INTO subscriptions (playlistid , userid) values (?, ?)';
      $sth = $this->dbh->prepare($sql);
      $sth->execute (array ($m_playlistid, $m_userid));
      if ($sth->rowCount()==1) {
          return true;
      } else {
          return false;
      }
  }

   /**
   * @function subscribeToPlaylist
   * @brief unsubscribes a user from a playlist
   * @param int $m_playlistid
   * @param int $m_userid
   * @return bool
   */
  public function unsubscribeToPlaylist($m_playlistid, $m_userid) {
      $sql = 'DELETE FROM subscriptions WHERE playlistid=:playlistid AND userid=:userid';
      $sth = $this->dbh->prepare($sql);

      $sth->bindParam(':playlistid', $m_playlistid);
      $sth->bindParam(':userid', $m_userid);
      $sth->execute();

      if ($sth->rowCount()==1) {
          return true;
      } else {
          return false;
      } 
  }

   /**
   * @function deleteVideoFromPlaylist
   * @brief deletes a video from a playlist
   * @param int $m_playlistId
   * @param int $m_videoId
   * @return bool
   */
  public function deleteVideoFromPlaylist ($m_playlistId, $m_videoId){

      $sql = 'DELETE FROM playlistvideos WHERE videoid=:videoId AND playlistid=:playlistId';
      $sth = $this->dbh->prepare($sql);

      $sth->bindParam(':playlistId', $m_playlistId);
      $sth->bindParam(':videoId', $m_videoId);
      $sth->execute();

      if ($sth->rowCount()==1) {
          return true;
      } else {
          return false;
      }
  }

  
   /**
   * @function addVideoToPlaylist
   * @brief adds a video to a playlist
   * @param int $m_playlistId
   * @param int $m_videoId
   * @param int $m_position
   * @return bool
   */
  public function addVideoToPlaylist($m_playlistid, $m_videoid, $m_position)
  {
      $sql = 'INSERT INTO playlistvideos (videoid, playlistid, position) values (?, ?, ?)';
      $sth = $this->dbh->prepare($sql);
      $sth->execute(array($m_videoid,$m_playlistid,$m_position));

      if ($sth->rowCount()==1) {
          return true;
      } else {
          return false;
      }
  }

  /**
   * @function returnPlaylistVideos
   * @brief returns the videos in a playlist
   * @param int $m_playlistId
   * @return array|null
   */
  public function returnPlaylistVideos($m_playlistId) {
      $sql = 'SELECT id, videoid, position FROM playlistvideos WHERE playlistid=:playlistid ORDER BY position ASC';
      $sth = $this->dbh->prepare ($sql);
      $sth->bindParam(':playlistid', $m_playlistId);
      $sth->execute();
      if ($rows = $sth->fetchAll(PDO::FETCH_ASSOC)) {
          return $rows;
      } else {
          return null;
      }
  }

  /**
   * @function returnPlaylistVideo
   * @brief returns ONE video from the playlist
   * @param int $m_playlistId
   * @param int $m_videod
   * @param int $m_position
   * @return array|null
   */
  public function returnPlaylistVideo($m_playlistId, $m_videoid) { 
      $sql = 'SELECT id, videoid, position FROM playlistvideos WHERE playlistid=:playlistid AND videoid=:videoid';
      $sth = $this->dbh->prepare ($sql);
      $sth->bindParam(':playlistid', $m_playlistId);
      $sth->bindParam(':videoid', $m_videoid);
      $sth->execute();
      if ($row = $sth->fetch(PDO::FETCH_ASSOC)) {
          return $row;
      } else {
          return null;
      }
  }

  /**
   * @function returnAllPlaylists
   * @brief returns all playlists
   * @return array|null
   */
  public function returnAllPlaylists(){
      $sql = 'SELECT users.name AS lectname, playlists.id, ownerid, playlists.name, description, thumbnail, date FROM playlists JOIN users ON users.id = ownerid';
      $sth = $this->dbh->prepare($sql);
      $sth->execute();
      if ($rows = $sth->fetchAll()) {
          return $rows;
      } else {
          return null;
      }
  }

  /**
   * @function returnNewestPlaylistVideos
   * @brief returns all the newest videos from a playlist
   * @param int $m_playlistId
   * @return array|null
   */
  public function returnNewestPlaylistVideo($m_playlistId) {
      $sql = 'SELECT id, videoid, position FROM playlistvideos WHERE playlistid=:playlistid ORDER BY position DESC';
      $sth = $this->dbh->prepare ($sql);
      $sth->bindParam(':playlistid', $m_playlistId);
      $sth->execute();
      if ($row = $sth->fetch(PDO::FETCH_ASSOC)) {
          return $row;
      } else {
          return null;
      }
  }

  /**
   * @function editPositionPlaylistVideo
   * @brief updates the position of a video in a playlist
   * @param int $m_playlistId
   * @param int $m_videoId
   * @param int $m_position
   * @return bool
   */
  public function editPositionPlaylistVideo($m_playlistId, $m_videoId, $m_position) {
      $sql = 'UPDATE playlistvideos SET position = :position WHERE videoid=:videoid AND playlistid=:playlistid';
      $sth = $this->dbh->prepare ($sql);
      $sth->bindParam(':position', $m_position);
      $sth->bindParam(':videoid', $m_videoId);
      $sth->bindParam(':playlistid', $m_playlistId);
      $sth->execute();
      if ($row = $sth->fetch()) {
          return true;
      } else {
          return false;
      }
  }

  /**
   * @function newComment
   * @brief adds a new comment to the db
   * @param int $m_user
   * @param int $m_video
   * @param string $m_comment
   * @return int The ID of the added comment, or -1 on failure
   */
  public function newComment($m_user, $m_video, $m_comment) {
      $sql = 'INSERT INTO comment (userid, videoid, comment) values (?, ?, ?)';
      $sth = $this->dbh->prepare($sql);
      $sth->execute(array($m_user, $m_video, $m_comment));

      if ($sth->rowCount()==1) {
          return $this->dbh->lastInsertId();
      } else {
          return -1;
      }
  }

  /**
   * @brief Returns a comment
   * @param int $m_cid The ID of the comment
   * @return array|null An associative array or null
   */
  public function returnComment($m_cid) {
    $sql = 'SELECT comment.userid, users.email, users.name, comment.id, comment.comment FROM comment 
    JOIN users ON comment.userid = users.id WHERE comment.id=?';
    $sth = $this->dbh->prepare($sql);
    $sth->execute(array($m_cid));

    $row = $sth->fetch(PDO::FETCH_ASSOC);

    if($sth->rowCount() == 1) {
      return $row;
    } else {
      return null;
    }
  }

  /**
   * @function returnAllComments
   * @brief return all comments for a video
   * @param int $m_videoid
   * @return array|null
   */
  public function returnAllComments($m_videoid){
    
      $sql = 'SELECT comment.userid, users.email, users.name, comment.id, comment.comment FROM comment 
      JOIN users ON comment.userid = users.id WHERE videoid=:videoid ORDER BY comment.id DESC';
      $sth = $this->dbh->prepare($sql);
      $sth->bindParam(':videoid', $m_videoid);

      $sth->execute();
      if ($rows = $sth->fetchAll()) {
          return $rows;
      } else {
          return null;
      }
  }

  /**
   * @function deleteComment
   * @brief deletes a specific comment
   * @param int $m_commentid
   * @return bool
   */
  public function deleteComment($m_commentid){

      $sql = 'DELETE FROM comment WHERE id=:id';
      $sth = $this->dbh->prepare($sql);

      $sth->bindParam(':id', $m_commentid);
      $sth->execute();

      if ($sth->rowCount()==1) {
          return true;
      } else {
          return false;
      }
  }

  /**
   * @function newRating
   * @brief adds a new rating to the db
   * @param int $m_user
   * @param int $m_video
   * @param int $m_rating
   * @return bool
   */

  public function newRating($m_user, $m_video, $m_rating) {
      $sql = 'INSERT INTO rating (userid, videoid, rating) values ( ?, ?, ?)';
      $sth = $this->dbh->prepare($sql);
      $sth->execute(array($m_user, $m_video, $m_rating));

      if ($sth->rowCount()==1) {
          return true;
      } else {
          return false;
      }
  }

  /**
   * @function updateRating
   * @brief updates the value of a rating in the db
   * @param int $m_uid
   * @param int $m_videoid
   * @param int $m_rating
   * @return bool
   */
  public function updateRating($m_uid, $m_videoid, $m_rating){
      $sql = 'UPDATE rating SET rating=:rating WHERE userid=:userid AND videoid=:videoid';
      $sth = $this->dbh->prepare($sql);

      $sth->bindParam(':userid', $m_uid);
      $sth->bindParam(':videoid', $m_videoid);
      $sth->bindParam(':rating', $m_rating);

      $sth->execute();
      if ($sth->rowcount() == 1) {
          return true;
      } else {
          return false;
      }
  }

  /**
   * @function returnRating
   * @brief returns the rating for one user, for one video
   * @param int $m_uid
   * @param int $m_videoid
   * @param int $m_rating
   * @return array|null
   */
  public function returnRating($m_uid, $m_videoid){
      $sql = 'SELECT rating FROM rating WHERE userid=:userid AND videoid=:videoid ORDER BY id ASC';
      
      $sth = $this->dbh->prepare($sql);

      $sth->bindParam(':userid', $m_uid);
      $sth->bindParam(':videoid', $m_videoid);
      $sth->execute();
      if ($row = $sth->fetch()) {
          return $row;
      } else {
          return null;
      }
  }

  /**
   * @function returnAllRatings
   * @brief returns all ratings for one video
   * @param int $m_videoid
   * @return array|null
   */
  public function returnAllRatings($m_videoid){
      $sql = 'SELECT rating FROM rating WHERE videoid=:videoid';
      $sth = $this->dbh->prepare($sql);
      $sth->bindParam(':videoid', $m_videoid);

      $sth->execute();
      if ($rows = $sth->fetchAll()) {
          return $rows;
      } else {
          return null;
      }
  }

  /**
   * @function returnTotalRatings
   * @brief returns the total number of ratings for a video
   * @param int $m_videoid
   * @return array|null
   */
  public function returnTotalRatings($m_videoid){
      $sql = 'SELECT COUNT(*) FROM rating WHERE videoid=:videoid';
      $sth = $this->dbh->prepare($sql);
      $sth->bindParam(':videoid', $m_videoid);

      $sth->execute();
      if ($rows = $sth->fetchAll()) {
          return $rows;
      } else {
          return null;
      }
  }

  /**
   * Returns the summed rating for a video
   * @param m_videoid The ID of the video
   * @return int The total summed rating for the video
   */
  public function returnSumRatings($m_videoid) {
      $sql = "SELECT SUM(rating) FROM rating WHERE videoid=?";
      $sth = $this->dbh->prepare($sql);

      $sth->execute(array($m_videoid));
      if($sth->rowCount() == 1) {
          return $sth->fetch(PDO::FETCH_ASSOC)["SUM(rating)"];
      } else {
          return 0;
      }
  }

  public function insertOrUpdateRating($m_uid, $m_videoid, $m_rating) {
    $sql = "SELECT rating FROM rating WHERE userid=:uid AND videoid=:vid";
    $sth = $this->dbh->prepare($sql);

    $sth->bindParam(":uid", $m_uid);
    $sth->bindParam(":vid", $m_videoid);
    $sth->execute();

    // Already cast a rating, update
    if($sth->rowCount() >= 1) {
        return $this->updateRating($m_uid, $m_videoid, $m_rating);
    } else { // Insert new rating
        return $this->newRating($m_uid, $m_videoid, $m_rating);
    }
  }

   /**
   * @function getNewVideos
   * @brief returns the nine newest videos
   * @return array|null
   */
  public function getNewVideos(){
      $sql = 'SELECT id, title, description, topic, course, thumbnail_path FROM video ORDER BY id DESC LIMIT 9';
      $sth = $this->dbh->prepare($sql);

      $sth->execute();
      if ($rows = $sth->fetchAll()) {
          return $rows;
      } else {
          return null;
      }
  }

   /**
   * @function returnLecturerName
   * @brief returns the name of the lecturer (uploader) and videoinfo for a video
   * @param int $m_id
   * @return array|null
   */
  public function returnLecturerName($m_id){
      $sql = 'SELECT users.name FROM users JOIN video on video.userid = users.id WHERE video.id =:id;';
      $sth = $this->dbh->prepare($sql);
      $sth->bindParam(':id', $m_id);

      $sth->execute();
      if ($rows = $sth->fetchAll()) {
          return $rows;
      } else {
          return null;
      }
  }

   /**
   * @function returnAllVideosWithLecturer
   * @brief returns the name of the lecturer (uploader) and videoinfo for all videos
   * @param int $m_id
   * @return array|null
   */
  public function returnAllVideosWithLecturers() {
      $sql = 'SELECT users.name, video.id, video.title, video.description, video.topic, video.course, video.thumbnail_path, video.video_path, video.time
      FROM users JOIN video on video.userid = users.id;';
      
      $sth = $this->dbh->prepare($sql);
      $sth->execute();
      if ($rows = $sth->fetchAll()) {
          return $rows;
      } else {
          return null;
      }
  }

  /**
   * Returns the ID of the user who uploaded a video
   * @param $videoID The ID of the video
   * @return int The user ID of the uploader, or -1 on failure
   */
  public function returnUploaderID($videoID) {
    $sql = "SELECT userid FROM video WHERE id=:videoID";
    $sth = $this->dbh->prepare($sql);

    $sth->bindParam(":videoID", $videoID);
    $sth->execute();

    if($row = $sth->fetch(PDO::FETCH_ASSOC)) {
        return $row["userid"];
    } else {
        return -1;
    }
  }
}
