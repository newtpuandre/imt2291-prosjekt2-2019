<?php

require_once 'db.php';

/**
  *  Class Video. Represents a single video.
  */

class Video
{
    static private $target_dir = "uploads/";

    function __construct() { }

    /**
     * @function upload
     * @brief uploads video/thumbnail files and adds information to DB
     * @param $uid
     * @param string $title
     * @param string $description
     * @param string $topic
     * @param string $course
     * @param string $video
     * @param string $thumbnail
     * @return bool
     */

    public function upload($uid, $title, $description, $topic, $course, $video, $thumbnail) {
        
        /*Get file types*/
        $video_file_type = strtolower(pathinfo(Video::$target_dir . basename($video["name"]), PATHINFO_EXTENSION));
        $thumb_file_type = strtolower(pathinfo(Video::$target_dir . basename($thumbnail["name"]), PATHINFO_EXTENSION));

        /* Set video and thumbnail filepath */
        $video_path = Video::$target_dir . uniqid() . "." . $video_file_type;
        $thumb_path = Video::$target_dir . uniqid() . "." . $thumb_file_type;

        /* Should never happen with uniqid() */
        if (file_exists($video_path) || file_exists($thumb_path)) { 
            return false;
        }

        /* Check for correct thumbnail file format */
        if ($thumb_file_type != "jpg" && $thumb_file_type != "png" && $thumb_file_type != "jpeg" && $thumb_file_type != "gif") {
            return false;
        }

        /* Check for correct video file format */
        if ($video_file_type != "mp4") {
            return false;
        }

        /* Resize Thumbnail to 320x180 */
        $this->thumbnailResize($thumbnail, 320, 180, $thumb_path);

        /* If the file uploaded successfully */
        if(move_uploaded_file($video["tmp_name"], $video_path)) {
          
            /* Insert into database */
            $db = new DB();
            $res = $db->newVideo($uid, $title, $description, $topic, $course, $thumb_path, $video_path);

            if ($res) {
                return true;
            } else {
                /*Make sure we delete uploaded files if database could not be updated! */
                unlink($video_path);
                unlink($thumb_path);
                return false;
            }
        } else {
            /* If files didnt upload successfully */
            return false;
        }        
    }   

    /**
     * @function updateVideo
     * @brief updates information about video in db
     * @param $videoid
     * @param string $title
     * @param string $description
     * @param string $topic
     * @param string $course
     * @param string $video
     * @param string $thumbnail
     * @return bool
     */
    
    public function updateVideo($videoid, $title, $description, $topic, $course, $thumbnail){
        /* If there is no thumbnail to update */
        if(!$thumbnail['name']){

            $db = new DB();
            $res = $db->updateVideo($videoid, $title, $description, $topic, $course);

            if ($res) {
                return true;
            } else {
                return false;
            }

        }

        else {
        /* Get the original thumbnail */
        $old_thumb = $this->getVideo($videoid);

        if($old_thumb){
            /* Delete original thumbnail */
            unlink($old_thumb[0]['thumbnail_path']);
        }

        $thumb_file_type = strtolower(pathinfo(Video::$target_dir . basename($thumbnail["name"]), PATHINFO_EXTENSION));

        /* Set video and thumbnail filepath */
        $thumb_path = Video::$target_dir . uniqid() . "." . $thumb_file_type;

       /* Check thumbnail filetype */
        if ($thumb_file_type != "jpg" && $thumb_file_type != "png" && $thumb_file_type != "jpeg" && $thumb_file_type != "gif") {
            return false;
        }
    
           
        /* Resize thumbnail */
        $this->thumbnailResize($thumbnail, 320, 180, $thumb_path);
        
        $db = new DB();

        /* Update */
        $res = $db->updateVideo($videoid, $title, $description, $topic, $course);
        $thumbres = $db->updateThumbnail($videoid, $thumb_path);
    
        /* If unsuccessful */
        if (!($res && $thumbres)){
            return false;
        }

        return true;
        } 
    }  

 
    /**
     * @function getAllUserVideos
     * @brief returns all videos uploaded by one specific user
     * @param $uid
     * @return array|null
     */

    public function getAllUserVideos($uid) {
        $db = new DB();

        $res = $db->returnVideos($uid);

        if($res) {
            return $res;
        }else {
            return null;
        }
    }

    /**
     * @function getAllVideos
     * @brief returns all videos in database
     * @return array|null
     */

    public function getAllVideos() {
        $db = new DB();

        $res = $db->returnAllVideos();

        if($res) {
            return $res;
        }else {
            return null;
        }       
    }

     /**
     * @function getAllVideosWithLecturers
     * @brief returns all videos in database with lecture names
     * @return array|null
     */

    public function getAllVideosWithLecturers() {
        $db = new DB();

        $res = $db->returnAllVideosWithLecturers();
        if($res) {
            return $res;
        }else {
            return null;
        }    
    }

       /**
     * @function getVideo
     * @brief returns one specific video
     * @param $id
     * @return array|null
     */

    public function getVideo($id){
        $db = new DB();

        $res = $db->returnVideo($id);

        if($res) {
            return $res;
        }else {
            return null;
        }
    }

    /**
     * @function getVideoLecturer
     * @brief returns the lecturer of one video
     * @param $id
     * @return array|null
     */

    public function getVideoLecturer($id){
        $db = new DB();

        $res = $db->returnLecturerName($id);

        if($res) {
            return $res;
        }else {
            return null;
        }
    }

   /**
     * @function deleteVideo
     * @brief deletes specific video from db and disk
     * @param $videoid
     * @return bool
     */
    public function deleteVideo($videoid){
        $db = new DB();
        
        /* Delete files */
        $video = $this->getVideo($videoid);

        unlink($video[0]['video_path']);
        unlink($video[0]['thumbnail_path']);

        /* Delete DB Entry */
        $res = $db->deleteVideo($videoid);

        if($res) {
            return true;
        }else {
            return false;
        }
    }

     /**
     * @function thumbnailResize
     * @brief scales the thumbnail to a new size
     * @param $thumbnail
     * @param $new_width
     * @param $new_height
     * @param $output_path
     */

    public function thumbnailResize($thumbnail, $new_width, $new_height, $output_path){
        $content = file_get_contents($thumbnail["tmp_name"]);
        
        list($old_width, $old_height, $type, $attr) = getimagesize($thumbnail["tmp_name"]);
        
        $src_img = imagecreatefromstring(file_get_contents($thumbnail["tmp_name"]));
        $dst_img = imagecreatetruecolor($new_width, $new_height);
        
        /* Copy and store */
        imagecopyresampled($dst_img, $src_img, 0, 0, 0, 0, $new_width, $new_height, $old_width, $old_height);
        imagepng($dst_img, $output_path);

        /* Clean up */
        imagedestroy($src_img);
        imagedestroy($dst_img);        
    }

    /**
     * @function search
     * @brief returns all videos where a column matches the prompt
     * @param string $prompt
     * @return array|null
     */
    public function search($prompt){
        $db = new DB();

        $res = $db->searchVideo($prompt);

        if($res) {
            return $res;
        }else {
            return null; 
        }
    }

    /**
     * @function getAllVideoCourses
     * @brief returns the count and information of all courses
     * @param $uid
     * @return array|null
     */
    public function getAllVideoCourses(){
        $db = new DB();

        $res = $db->returnAllCourses();

        if($res) {
            return $res;
        }else {
            return null; 
        }
    }

   /**
     * @function getNewVideos
     * @brief returns the 8 newest videos uploaded
     * @return array|null
     */
    public function getNewVideos(){
        $db = new DB();

        $res = $db->getNewVideos();

        if ($res) {
            return $res;
        } else {
            return null;
        }
    }

     /**
     * @function searchVideoCourse
     * @brief returns video where the course matches the prompt
     * @return array|null
     */
    public function searchVideoCourse($prompt){
        $db = new DB();

        $res = $db->searchVideoCourse($prompt);

        if ($res) {
            return $res;
        } else {
            return null;
        }
    }
}

?>