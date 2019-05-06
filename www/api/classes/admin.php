<?php

require_once 'DB.php';

/**
  *  Class Admin. Represents the admin role of the system.
  */

class Admin
{
    private $db = null;
    private $dbh = null;

    /*Constructor*/
    function __construct() {
        $this->db = new DB();
    }

    function __destruct() {}

    /**
     * @function gatherUsers
     * @brief returns an array of all users
     * @return array
     */
    public function gatherUsers(){
        return $this->db->gatherUsers();
    }

     /**
     * @function updatePrivileges
     * @brief updates a specific users privilege
     * @param string $m_id
     * @param string $m_privlevel 
     * @return bool
     */
    public function updatePrivileges($m_id, $m_privlevel){ 
        return ($this->db->updatePrivileges($m_id,$m_privlevel));
    }

     /**
     * @function countIAmTeacher
     * @brief returns the count of how many users are teachers
     * @return array
     */
    public function countIAmTeacher(){
        return $this->db->countIAmTeacher();
    }

     /**
     * @function removeIAmTeacher
     * @param int $m_id
     * @brief removes teacher privilege from a user
     * @return bool 
     */
    public function removeIAmTeacher($m_id){
        return $this->db->removeIAmTeacher($m_id);
    }
}

?>