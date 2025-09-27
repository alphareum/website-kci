// =====================================
// api/public/contact-submit.php
// =====================================
require_once '../../admin/config/database.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$db = Database::getInstance()->getConnection();

try {
    $stmt = $db->prepare("
        INSERT INTO contact_submissions (name, email, phone, subject, message, submitted_at)
        VALUES (?, ?, ?, ?, ?, NOW())
    ");
    
    $stmt->execute([
        $_POST['name'],
        $_POST['email'],
        $_POST['phone'] ?? null,
        $_POST['subject'],
        $_POST['message']
    ]);
    
    // Send email notification
    $to = 'admin@komunitaschineseindonesia.com';
    $subject = 'New Contact Form Submission - ' . $_POST['subject'];
    $message = "New contact form submission:\n\n";
    $message .= "Name: {$_POST['name']}\n";
    $message .= "Email: {$_POST['email']}\n";
    $message .= "Phone: {$_POST['phone']}\n";
    $message .= "Subject: {$_POST['subject']}\n\n";
    $message .= "Message:\n{$_POST['message']}";
    
    mail($to, $subject, $message);
    
    echo json_encode(['success' => true, 'message' => 'Message sent successfully']);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error submitting form']);
}
