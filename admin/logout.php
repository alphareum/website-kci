
// =====================================
// admin/logout.php
// =====================================
session_start();
require_once 'config/database.php';

// Clear remember token if exists
if (isset($_COOKIE['remember_token'])) {
    $db = Database::getInstance()->getConnection();
    $stmt = $db->prepare("UPDATE users SET remember_token = NULL WHERE id = ?");
    $stmt->execute([$_SESSION['user_id'] ?? 0]);
    
    setcookie('remember_token', '', time() - 3600, '/');
}

// Destroy session
session_destroy();

// Redirect to login
header('Location: login.php?success=1');
exit;