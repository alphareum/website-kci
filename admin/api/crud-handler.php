<?php
// admin/api/crud-handler.php
// Universal CRUD API handler for all modules

require_once '../config/database.php';
require_once '../config/auth.php';

// Check if user is logged in
$auth->requireLogin();

// Get request data
$action = $_POST['action'] ?? $_GET['action'] ?? '';
$module = $_POST['module'] ?? $_GET['module'] ?? '';
$id = $_POST['id'] ?? $_GET['id'] ?? null;

$db = Database::getInstance()->getConnection();
$response = ['success' => false, 'message' => '', 'data' => null];

try {
    switch ($module) {
        case 'events':
            handleEvents($action, $id, $db, $response);
            break;
        case 'gallery':
            handleGallery($action, $id, $db, $response);
            break;
        case 'blog':
            handleBlog($action, $id, $db, $response);
            break;
        case 'members':
            handleMembers($action, $id, $db, $response);
            break;
        case 'testimonials':
            handleTestimonials($action, $id, $db, $response);
            break;
        case 'partners':
            handlePartners($action, $id, $db, $response);
            break;
        case 'settings':
            handleSettings($action, $id, $db, $response);
            break;
        default:
            $response['message'] = 'Invalid module';
    }
} catch (Exception $e) {
    $response['message'] = 'Error: ' . $e->getMessage();
    error_log($e->getMessage());
}

// Return JSON response
header('Content-Type: application/json');
echo json_encode($response);

// Module handlers
function handleEvents($action, $id, $db, &$response) {
    switch ($action) {
        case 'create':
            $stmt = $db->prepare("
                INSERT INTO events (title, slug, description, content, event_date, end_date, 
                                  location, registration_link, max_participants, status, created_by)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            
            $slug = createSlug($_POST['title']);
            $stmt->execute([
                $_POST['title'],
                $slug,
                $_POST['description'],
                $_POST['content'],
                $_POST['event_date'],
                $_POST['end_date'] ?? null,
                $_POST['location'],
                $_POST['registration_link'] ?? null,
                $_POST['max_participants'] ?? null,
                $_POST['status'] ?? 'upcoming',
                $_SESSION['user_id']
            ]);
            
            $response['success'] = true;
            $response['message'] = 'Event created successfully';
            $response['data'] = ['id' => $db->lastInsertId()];
            break;
            
        case 'update':
            $stmt = $db->prepare("
                UPDATE events 
                SET title = ?, description = ?, content = ?, event_date = ?, 
                    end_date = ?, location = ?, registration_link = ?, 
                    max_participants = ?, status = ?
                WHERE id = ?
            ");
            
            $stmt->execute([
                $_POST['title'],
                $_POST['description'],
                $_POST['content'],
                $_POST['event_date'],
                $_POST['end_date'] ?? null,
                $_POST['location'],
                $_POST['registration_link'] ?? null,
                $_POST['max_participants'] ?? null,
                $_POST['status'],
                $id
            ]);
            
            $response['success'] = true;
            $response['message'] = 'Event updated successfully';
            break;
            
        case 'delete':
            $stmt = $db->prepare("DELETE FROM events WHERE id = ?");
            $stmt->execute([$id]);
            
            $response['success'] = true;
            $response['message'] = 'Event deleted successfully';
            break;
            
        case 'list':
            $page = $_GET['page'] ?? 1;
            $limit = $_GET['limit'] ?? 10;
            $offset = ($page - 1) * $limit;
            $status = $_GET['status'] ?? null;
            
            $query = "SELECT e.*, u.full_name as creator_name 
                     FROM events e 
                     LEFT JOIN users u ON e.created_by = u.id";
            
            if ($status) {
                $query .= " WHERE e.status = :status";
            }
            
            $query .= " ORDER BY e.event_date DESC LIMIT :limit OFFSET :offset";
            
            $stmt = $db->prepare($query);
            if ($status) {
                $stmt->bindParam(':status', $status);
            }
            $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();
            
            $response['success'] = true;
            $response['data'] = $stmt->fetchAll();
            break;
    }
}

function handleGallery($action, $id, $db, &$response) {
    switch ($action) {
        case 'upload':
            $uploadDir = UPLOAD_PATH . 'gallery/';
            $uploadedFiles = [];
            
            foreach ($_FILES['images']['tmp_name'] as $key => $tmpName) {
                if ($_FILES['images']['error'][$key] === UPLOAD_ERR_OK) {
                    $fileName = uniqid() . '_' . $_FILES['images']['name'][$key];
                    $targetPath = $uploadDir . $fileName;
                    
                    if (move_uploaded_file($tmpName, $targetPath)) {
                        // Create thumbnail
                        $thumbPath = $uploadDir . 'thumb_' . $fileName;
                        createThumbnail($targetPath, $thumbPath, 300, 300);
                        
                        // Save to database
                        $stmt = $db->prepare("
                            INSERT INTO gallery (title, image_path, thumbnail_path, category, uploaded_by)
                            VALUES (?, ?, ?, ?, ?)
                        ");
                        
                        $stmt->execute([
                            $_POST['titles'][$key] ?? '',
                            '/uploads/gallery/' . $fileName,
                            '/uploads/gallery/thumb_' . $fileName,
                            $_POST['category'] ?? 'general',
                            $_SESSION['user_id']
                        ]);
                        
                        $uploadedFiles[] = [
                            'id' => $db->lastInsertId(),
                            'path' => '/uploads/gallery/' . $fileName
                        ];
                    }
                }
            }
            
            $response['success'] = true;
            $response['message'] = count($uploadedFiles) . ' files uploaded successfully';
            $response['data'] = $uploadedFiles;
            break;
            
        case 'reorder':
            $items = json_decode(file_get_contents('php://input'), true)['items'] ?? [];
            
            foreach ($items as $item) {
                $stmt = $db->prepare("UPDATE gallery SET display_order = ? WHERE id = ?");
                $stmt->execute([$item['order'], $item['id']]);
            }
            
            $response['success'] = true;
            $response['message'] = 'Gallery order updated';
            break;
            
        case 'delete':
            // Get file path first
            $stmt = $db->prepare("SELECT image_path, thumbnail_path FROM gallery WHERE id = ?");
            $stmt->execute([$id]);
            $item = $stmt->fetch();
            
            if ($item) {
                // Delete physical files
                $imagePath = $_SERVER['DOCUMENT_ROOT'] . $item['image_path'];
                $thumbPath = $_SERVER['DOCUMENT_ROOT'] . $item['thumbnail_path'];
                
                if (file_exists($imagePath)) unlink($imagePath);
                if (file_exists($thumbPath)) unlink($thumbPath);
                
                // Delete from database
                $stmt = $db->prepare("DELETE FROM gallery WHERE id = ?");
                $stmt->execute([$id]);
                
                $response['success'] = true;
                $response['message'] = 'Image deleted successfully';
            }
            break;
    }
}

function handleMembers($action, $id, $db, &$response) {
    switch ($action) {
        case 'approve':
            $stmt = $db->prepare("UPDATE members SET member_status = 'active' WHERE id = ?");
            $stmt->execute([$id]);
            
            // Send approval email (implement email function)
            // sendApprovalEmail($id);
            
            $response['success'] = true;
            $response['message'] = 'Member approved successfully';
            break;
            
        case 'reject':
            $stmt = $db->prepare("UPDATE members SET member_status = 'rejected' WHERE id = ?");
            $stmt->execute([$id]);
            
            $response['success'] = true;
            $response['message'] = 'Member rejected';
            break;
            
        case 'export':
            $stmt = $db->query("SELECT * FROM members");
            $members = $stmt->fetchAll();
            
            // Create CSV
            $output = fopen('php://temp', 'w');
            fputcsv($output, array_keys($members[0])); // Headers
            
            foreach ($members as $member) {
                fputcsv($output, $member);
            }
            
            rewind($output);
            $csv = stream_get_contents($output);
            fclose($output);
            
            header('Content-Type: text/csv');
            header('Content-Disposition: attachment; filename="members_' . date('Y-m-d') . '.csv"');
            echo $csv;
            exit;
            
        case 'stats':
            $stats = [
                'total' => $db->query("SELECT COUNT(*) FROM members")->fetchColumn(),
                'active' => $db->query("SELECT COUNT(*) FROM members WHERE member_status = 'active'")->fetchColumn(),
                'pending' => $db->query("SELECT COUNT(*) FROM members WHERE member_status = 'pending'")->fetchColumn(),
                'new_this_month' => $db->query("SELECT COUNT(*) FROM members WHERE MONTH(created_at) = MONTH(NOW())")->fetchColumn()
            ];
            
            $response['success'] = true;
            $response['data'] = $stats;
            break;
    }
}

function handleTestimonials($action, $id, $db, &$response) {
    switch ($action) {
        case 'create':
            $stmt = $db->prepare("
                INSERT INTO testimonials (name, position, company, content, rating, is_featured)
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            
            $stmt->execute([
                $_POST['name'],
                $_POST['position'] ?? null,
                $_POST['company'] ?? null,
                $_POST['content'],
                $_POST['rating'] ?? 5,
                $_POST['is_featured'] ?? 0
            ]);
            
            $response['success'] = true;
            $response['message'] = 'Testimonial added successfully';
            break;
            
        case 'toggle_active':
            $stmt = $db->prepare("UPDATE testimonials SET is_active = NOT is_active WHERE id = ?");
            $stmt->execute([$id]);
            
            $response['success'] = true;
            $response['message'] = 'Testimonial status updated';
            break;
    }
}

function handlePartners($action, $id, $db, &$response) {
    switch ($action) {
        case 'create':
            $logoPath = null;
            
            // Handle logo upload
            if (!empty($_FILES['logo']['tmp_name'])) {
                $uploadDir = UPLOAD_PATH . 'partners/';
                $fileName = uniqid() . '_' . $_FILES['logo']['name'];
                $targetPath = $uploadDir . $fileName;
                
                if (move_uploaded_file($_FILES['logo']['tmp_name'], $targetPath)) {
                    $logoPath = '/uploads/partners/' . $fileName;
                }
            }
            
            $stmt = $db->prepare("
                INSERT INTO partners (name, type, logo, website, instagram, description, display_order)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ");
            
            $stmt->execute([
                $_POST['name'],
                $_POST['type'],
                $logoPath,
                $_POST['website'] ?? null,
                $_POST['instagram'] ?? null,
                $_POST['description'] ?? null,
                $_POST['display_order'] ?? 0
            ]);
            
            $response['success'] = true;
            $response['message'] = 'Partner added successfully';
            break;
            
        case 'reorder':
            $items = json_decode(file_get_contents('php://input'), true)['items'] ?? [];
            
            foreach ($items as $item) {
                $stmt = $db->prepare("UPDATE partners SET display_order = ? WHERE id = ?");
                $stmt->execute([$item['order'], $item['id']]);
            }
            
            $response['success'] = true;
            $response['message'] = 'Partners order updated';
            break;
    }
}

function handleSettings($action, $id, $db, &$response) {
    switch ($action) {
        case 'update':
            foreach ($_POST as $key => $value) {
                if ($key !== 'action' && $key !== 'module') {
                    $stmt = $db->prepare("
                        INSERT INTO site_settings (setting_key, setting_value) 
                        VALUES (?, ?) 
                        ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)
                    ");
                    $stmt->execute([$key, $value]);
                }
            }
            
            $response['success'] = true;
            $response['message'] = 'Settings updated successfully';
            break;
            
        case 'get':
            $stmt = $db->query("SELECT setting_key, setting_value FROM site_settings");
            $settings = [];
            
            while ($row = $stmt->fetch()) {
                $settings[$row['setting_key']] = $row['setting_value'];
            }
            
            $response['success'] = true;
            $response['data'] = $settings;
            break;
    }
}

// Helper functions
function createSlug($string) {
    $string = strtolower(trim($string));
    $string = preg_replace('/[^a-z0-9-]/', '-', $string);
    $string = preg_replace('/-+/', '-', $string);
    return trim($string, '-');
}

function createThumbnail($source, $destination, $width, $height) {
    list($origWidth, $origHeight, $type) = getimagesize($source);
    
    $ratio = min($width / $origWidth, $height / $origHeight);
    $newWidth = round($origWidth * $ratio);
    $newHeight = round($origHeight * $ratio);
    
    $newImage = imagecreatetruecolor($newWidth, $newHeight);
    
    switch ($type) {
        case IMAGETYPE_JPEG:
            $sourceImage = imagecreatefromjpeg($source);
            break;
        case IMAGETYPE_PNG:
            $sourceImage = imagecreatefrompng($source);
            imagealphablending($newImage, false);
            imagesavealpha($newImage, true);
            break;
        case IMAGETYPE_GIF:
            $sourceImage = imagecreatefromgif($source);
            break;
    }
    
    imagecopyresampled($newImage, $sourceImage, 0, 0, 0, 0, 
                      $newWidth, $newHeight, $origWidth, $origHeight);
    
    switch ($type) {
        case IMAGETYPE_JPEG:
            imagejpeg($newImage, $destination, 85);
            break;
        case IMAGETYPE_PNG:
            imagepng($newImage, $destination, 8);
            break;
        case IMAGETYPE_GIF:
            imagegif($newImage, $destination);
            break;
    }
    
    imagedestroy($sourceImage);
    imagedestroy($newImage);
    
    return true;
}

// Public API endpoints (api/public/get-events.php)
// This file doesn't require authentication
/*
<?php
require_once '../../admin/config/database.php';

$db = Database::getInstance()->getConnection();

// Get upcoming events for public display
$stmt = $db->query("
    SELECT title, description, event_date, location, registration_link, image
    FROM events 
    WHERE status = 'upcoming' 
    AND event_date >= NOW()
    ORDER BY event_date ASC
    LIMIT 6
");

$events = $stmt->fetchAll();

header('Content-Type: application/json');
echo json_encode($events);
?>
*/

// Public member registration handler (api/public/register-member.php)
/*
<?php
require_once '../../admin/config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method not allowed');
}

$db = Database::getInstance()->getConnection();

try {
    // Generate member code
    $year = date('Y');
    $stmt = $db->query("SELECT COUNT(*) FROM members WHERE YEAR(created_at) = $year");
    $count = $stmt->fetchColumn() + 1;
    $memberCode = 'KCI-' . $year . '-' . str_pad($count, 3, '0', STR_PAD_LEFT);
    
    // Handle photo upload
    $photoPath = null;
    if (!empty($_FILES['photo']['tmp_name'])) {
        $uploadDir = '../../admin/uploads/members/';
        $fileName = $memberCode . '_' . uniqid() . '.jpg';
        $targetPath = $uploadDir . $fileName;
        
        if (move_uploaded_file($_FILES['photo']['tmp_name'], $targetPath)) {
            $photoPath = '/admin/uploads/members/' . $fileName;
        }
    }
    
    // Insert member
    $stmt = $db->prepare("
        INSERT INTO members (
            member_code, full_name, email, phone, address, city, 
            birth_date, profile_photo, member_status, join_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())
    ");
    
    $fullName = $_POST['firstName'] . ' ' . $_POST['lastName'];
    
    $stmt->execute([
        $memberCode,
        $fullName,
        $_POST['email'],
        $_POST['phone'],
        $_POST['address'],
        $_POST['city'],
        $_POST['birthDate'],
        $photoPath
    ]);
    
    // Send notification email to admin
    $adminEmail = 'admin@komunitaschineseindonesia.com';
    $subject = 'New Member Registration - ' . $fullName;
    $message = "A new member has registered:\n\n";
    $message .= "Name: $fullName\n";
    $message .= "Email: {$_POST['email']}\n";
    $message .= "Phone: {$_POST['phone']}\n";
    $message .= "Member Code: $memberCode\n\n";
    $message .= "Please review the application in the admin panel.";
    
    mail($adminEmail, $subject, $message);
    
    // Send confirmation email to member
    $memberSubject = 'Welcome to KCI - Registration Received';
    $memberMessage = "Dear $fullName,\n\n";
    $memberMessage .= "Thank you for registering with Komunitas Chinese Indonesia.\n";
    $memberMessage .= "Your member code is: $memberCode\n\n";
    $memberMessage .= "We will review your application and notify you once approved.\n\n";
    $memberMessage .= "Best regards,\nKCI Team";
    
    mail($_POST['email'], $memberSubject, $memberMessage);
    
    echo json_encode([
        'success' => true,
        'message' => 'Registration successful! We will review your application.',
        'memberCode' => $memberCode
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Registration failed. Please try again.'
    ]);
}
?>
*/