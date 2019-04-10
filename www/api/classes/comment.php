<?php
require_once 'db.php';

/**
  *  class Comment. Represents a comment.
  */
class Comment
{

   /**
     * @function addComment
     * @brief uploads comment to the database
     * @param int $uid
     * @param int $videoid
     * @param string $comment
     * @return bool
     */   
 public function addComment($uid, $videoid, $comment){

    $db = new DB();

    $res = $db->newComment($uid, $videoid, $comment);

    if (!$res) {
        return false;
    }

    return true;
 }

   /**
     * @function getAllComments
     * @brief returns all comments for a specific video
     * @param int $videoid
     * @return array|null
     */
 public function getAllComments($videoid) {
    $db = new DB();

    $res = $db->returnAllComments($videoid);

    if($res) {
        return $res;
    }else {
        return null;
    }
}

  /**
     * @function deleteComment
     * @brief deletes a comment from the DB
     * @param int $commentid
     * @param string $title
     * @param string $description
     * @param string $topic
     * @param string $course
     * @param string $video
     * @param string $thumbnail
     * @return bool
     */
public function deleteComment($commentid){

    $db = new DB();

    $res = $db->deleteComment($commentid);

    if($res) {
        return true;
    }else {
        return false;
    }
}

}

?>