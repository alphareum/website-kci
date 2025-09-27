<?php
session_start();
require_once 'database.php';

class Auth {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    public function login($username, $password) {
        $stmt = $this->db->prepare("
            SELECT * FROM users 
            WHERE (username = ? OR email = ?) AND is_active = 1
        ");
        $stmt->execute([$username, $username]);
        $user = $stmt->fetch();
        
        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['role'] = $user['role'];
            $_SESSION['full_name'] = $user['full_name'];
            
            // Update last login
            $updateStmt = $this->db->prepare("
                UPDATE users SET last_login = NOW() WHERE id = ?
            ");
            $updateStmt->execute([$user['id']]);
            
            return true;
        }
        return false;
    }
    
    public function logout() {
        session_destroy();
        return true;
    }
    
    public function isLoggedIn() {
        return isset($_SESSION['user_id']);
    }
    
    public function requireLogin() {
        if (!$this->isLoggedIn()) {
            header('Location: ' . ADMIN_URL . '/login.php');
            exit;
        }
    }
    
    public function hasRole($role) {
        if (!$this->isLoggedIn()) return false;
        
        $roles = ['viewer' => 1, 'editor' => 2, 'admin' => 3];
        $userRole = $_SESSION['role'];
        
        return $roles[$userRole] >= $roles[$role];
    }
}
?>