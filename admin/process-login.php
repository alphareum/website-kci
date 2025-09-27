<?php
// admin/process-login.php
session_start();
require_once 'config/database.php';
require_once 'config/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: login.php');
    exit;
}

$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';
$remember = isset($_POST['remember']);

if (empty($username) || empty($password)) {
    header('Location: login.php?error=invalid');
    exit;
}

$auth = new Auth();

if ($auth->login($username, $password)) {
    // Set remember me cookie if requested
    if ($remember) {
        $token = bin2hex(random_bytes(32));
        setcookie('remember_token', $token, time() + (30 * 24 * 60 * 60), '/', '', true, true);
        
        // Store token in database
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("UPDATE users SET remember_token = ? WHERE id = ?");
        $stmt->execute([$token, $_SESSION['user_id']]);
    }
    
    // Redirect to dashboard or return URL
    $returnUrl = $_SESSION['return_url'] ?? 'index.php';
    unset($_SESSION['return_url']);
    header('Location: ' . $returnUrl);
} else {
    header('Location: login.php?error=invalid');
}
exit;