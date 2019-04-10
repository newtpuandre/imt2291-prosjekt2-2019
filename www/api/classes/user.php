<?php
require_once 'db.php';

/**
  *  Class Video. Represents a single user.
  */

class User
{

    static private $target_dir = "uploads/";

    private $id;
    private $email;
    private $privileges;
    private $name;
    private $picture;

    private $db = null;

    /* Constructor */
    public function __construct($m_email) {
        /* Initalize a new database connection */
        $this->db = new DB();

        /* Find user in DB and store info in class variables */
        $userArray = $this->db->findUser($m_email);
        $this->id = $userArray['id'];
        $this->email = $userArray['email'];
        $this->privileges = $userArray['privileges'];
        $this->name = $userArray['name'];
        $this->picture = $userArray['picture_path'];
    }

    /* Destructor */
    function __destruct() {}

    /**
     * @function updateUser
     * @brief updates information about the current user in DB
     * @param int $uid
     * @param string $name
     * @param string $username
     * @param string $password
     * @param string $profilepic - a path
     * @param string $video
     * @param string $thumbnail
     * @return bool
     */
    public function updateUser($uid, $name, $username, $password, $profilepic){

        /* If there is a password to update */
        if ($password != null){
            /* Hash it */
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        } else {
            $hashed_password = null;
        }

        /* Delete old picture if it is not the default picture and there is a new profile picture */
        $old_picture = $this->returnPicture();
        if($old_picture && ($profilepic != null)) {
            /* If the old picture is not the standard picture */
            if ($old_picture != 'https://propertymarketersllc.com/wp-content/uploads/2018/05/profile-picture-placeholder.png') {
                unlink($old_picture);
            }
        }
    
        /* Upload new image if provided */
        $db = new DB();
        if ($profilepic != null) {

            $picture_file_type = strtolower(pathinfo(User::$target_dir . basename($profilepic["name"]), PATHINFO_EXTENSION));
            $picture_path = User::$target_dir . uniqid() . "." . $picture_file_type;
            
            /* If correct filetype */
            if($picture_file_type != "jpg" && $picture_file_type != "png" && $picture_file_type != "jpeg" && $picture_file_type != "gif") {
                return false;
            }
           
            /* Resize profile picture */
            $this->pictureResize($profilepic, 180, 180, $picture_path);

            /* If the file wasn't uploaded */
            if(!(move_uploaded_file($profilepic["tmp_name"], $picture_path))){
                return false;
            }
            
            /* Update user */
            $db->updateUser($uid, $name, $username, $hashed_password, $picture_path);
            header("Location: profile.php");

        } else {

            $db->updateUser($uid, $name, $username, $hashed_password, $old_picture);
            header("Location: profile.php");

        }
    }

    
     /**
     * @function returnEmail
     * @brief returns the users email
     * @return $email
     */

    public function returnEmail(){ 
        return $this->email;
    }

    /**
     * @function getPrivileges
     * @brief get the users privileges
     * @return $privileges
     */
    public function getPrivileges(){ 
        return $this->privileges;
    }

    /**
     * @function returnId
     * @brief returns the users ID
     * @return $id
     */
    public function returnId(){
        return $this->id;
    }

    /**
     * @function returnName
     * @brief returns the users name
     * @return $name
     */
    public function returnName(){
        return $this->name;
    }

    /**
     * @function returnPicture
     * @brief returns the path of the users profile picture
     * @return $picture
     */
    public function returnPicture(){
        return $this->picture;
    }

    
     /**
     * @function pictureResize
     * @brief scales the thumbnail to a new size
     * @param $thumbnail
     * @param $new_width
     * @param $new_height
     * @param $output_path
     */

    public function pictureResize($picture, $new_width, $new_height, $output_path){
        $content = file_get_contents($picture["tmp_name"]);
        
        list($old_width, $old_height, $type, $attr) = getimagesize($picture["tmp_name"]);
        
        $src_img = imagecreatefromstring(file_get_contents($picture["tmp_name"]));
        $dst_img = imagecreatetruecolor($new_width, $new_height);
        
        /* Copy and store */
        imagecopyresampled($dst_img, $src_img, 0, 0, 0, 0, $new_width, $new_height, $old_width, $old_height);
        imagepng($dst_img, $output_path);

        /* Clean up */
        imagedestroy($src_img);
        imagedestroy($dst_img);        
    }
}


?>