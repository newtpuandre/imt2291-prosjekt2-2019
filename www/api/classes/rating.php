<?php
require_once 'db.php';

/**
  *  Class Video. Represents a rating per video.
  */

class Rating
{
/**
     * @function addRating
     * @brief adds one rating to the database
     * @param int $uid
     * @param int $videoid
     * @param int $rating
     * @return bool
     */
    public function addRating($uid, $videoid, $rating){

        $db = new DB();
        
        $res = $db->newRating($uid, $videoid, $rating);
        
        if ($res) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @function updateRating
     * @brief updates the current rating from one user
     * @param int $uid
     * @param int $videoid
     * @param int $rating
     * @return bool
     */

    public function updateRating($uid, $videoid, $rating){

        $db = new DB();
        
        $res = $db->updateRating($uid, $videoid, $rating);
        
        if ($res) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @function getRating
     * @brief returns the rating from one user for one video
     * @param int $uid
     * @param int $videoid
     * @return array|null
     */

    public function getRating($uid, $videoid){
        $db = new DB();
        
        $res = $db->returnRating($uid, $videoid);
        
        if ($res) {
            return $res;
        } else {
            return null;
        }
    }
        
        /**
     * @function getRating
     * @brief returns all ratings for one video
     * @param int $videoid
     * @return array|null
     */
    public function getAllRatings($videoid) {
        $db = new DB();
        
        $res = $db->returnAllRatings($videoid);
        
        if($res) {
            return $res;
        }else {
            return null;
        }
           
    }
    /**
     * @function getTotalRatings
     * @brief returns the count of how many ratings per video
     * @param int $videoid
     * @return array|null
     */
    public function getTotalRatings($videoid){
        $db = new DB();
        
        $res = $db->returnTotalRatings($videoid);
        
        if($res) {
            return $res;
        }else {
            return null;
        }
    }
}


?>