<?php
/**
 * KCI CMS Quick Installer Helper
 * Upload this file to your public_html and run it to create all necessary files
 * 
 * INSTRUCTIONS:
 * 1. Save this as "quick-install.php"
 * 2. Upload to your public_html folder
 * 3. Visit: yoursite.com/quick-install.php
 * 4. Follow the prompts
 * 5. DELETE this file after installation!
 */

// Check if running from web
if (php_sapi_name() === 'cli') {
    die("Please run this script from your web browser.\n");
}

$step = $_GET['step'] ?? 1;
$message = '';
$error = '';

// Create directories
if ($step == 2 && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $dirs = [
        'admin',
        'admin/config',
        'admin/modules', 
        'admin/api',
        'admin/assets',
        'admin/assets/css',
        'admin/assets/js',
        'admin/uploads',
        'admin/uploads/gallery',
        'admin/uploads/blog',
        'admin/uploads/events',
        'admin/uploads/members',
        'admin/uploads/partners',
        'admin/includes',
        'api',
        'api/public',
        'includes'
    ];
    
    foreach ($dirs as $dir) {
        if (!file_exists($dir)) {
            if (mkdir($dir, 0755, true)) {
                $message .= "✓ Created directory: $dir<br>";
            } else {
                $error .= "✗ Failed to create: $dir<br>";
            }
        } else {
            $message .= "• Directory exists: $dir<br>";
        }
    }
    
    // Set permissions for uploads
    chmod('admin/uploads', 0777);
    foreach (glob('admin/uploads/*') as $uploadDir) {
        chmod($uploadDir, 0777);
    }
    $message .= "<br>✓ Set permissions for upload directories<br>";
}

// Create database config file
if ($step == 3 && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $dbHost = $_POST['db_host'];
    $dbName = $_POST['db_name'];
    $dbUser = $_POST['db_user'];
    $dbPass = $_POST['db_pass'];
    
    // Test database connection
    try {
        $pdo = new PDO("mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4", $dbUser, $dbPass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // Create database.php
        $databaseConfig = '<?php
// Database configuration
define(\'DB_HOST\', \'' . $dbHost . '\');
define(\'DB_USER\', \'' . $dbUser . '\');
define(\'DB_PASS\', \'' . $dbPass . '\');
define(\'DB_NAME\', \'' . $dbName . '\');

// Site configuration
define(\'SITE_URL\', \'' . $_POST['site_url'] . '\');
define(\'ADMIN_URL\', SITE_URL . \'/admin\');
define(\'UPLOAD_PATH\', __DIR__ . \'/../uploads/\');
define(\'MAX_UPLOAD_SIZE\', 5 * 1024 * 1024);

// Session configuration
ini_set(\'session.cookie_httponly\', 1);
ini_set(\'session.use_only_cookies\', 1);

// Database connection class
class Database {
    private static $instance = null;
    private $conn;
    
    private function __construct() {
        try {
            $this->conn = new PDO(
                "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
                DB_USER,
                DB_PASS,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]
            );
        } catch(PDOException $e) {
            die("Connection failed: " . $e->getMessage());
        }
    }
    
    public static function getInstance() {
        if (self::$instance == null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->conn;
    }
}
?>';
        
        file_put_contents('admin/config/database.php', $databaseConfig);
        $message = "✓ Database configuration created successfully!<br>";
        $message .= "✓ Database connection tested successfully!<br>";
        
        // Create the database tables
        $sql = file_get_contents('database-schema.txt'); // You need to create this file
        if ($sql) {
            $pdo->exec($sql);
            $message .= "✓ Database tables created!<br>";
        }
        
    } catch (Exception $e) {
        $error = "Database connection failed: " . $e->getMessage();
    }
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KCI CMS Quick Installer</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .installer {
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 600px;
            width: 100%;
            overflow: hidden;
        }
        .header {
            background: #800020;
            color: white;
            padding: 2rem;
            text-align: center;
        }
        .header h1 {
            font-size: 1.75rem;
            margin-bottom: 0.5rem;
        }
        .content {
            padding: 2rem;
        }
        .step-indicator {
            display: flex;
            justify-content: space-between;
            margin-bottom: 2rem;
            padding: 0 2rem;
        }
        .step {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: #e0e0e0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: white;
        }
        .step.active {
            background: #800020;
        }
        .step.completed {
            background: #28a745;
        }
        .form-group {
            margin-bottom: 1.5rem;
        }
        label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: #333;
        }
        input, select {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 1rem;
        }
        input:focus {
            outline: none;
            border-color: #800020;
            box-shadow: 0 0 0 3px rgba(128, 0, 32, 0.1);
        }
        .btn {
            padding: 0.875rem 2rem;
            background: #800020;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }
        .btn:hover {
            background: #5D001E;
            transform: translateY(-2px);
        }
        .btn-group {
            display: flex;
            justify-content: space-between;
            margin-top: 2rem;
        }
        .message {
            padding: 1rem;
            border-radius: 6px;
            margin-bottom: 1rem;
        }
        .message.success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .message.error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .file-list {
            max-height: 300px;
            overflow-y: auto;
            padding: 1rem;
            background: #f8f9fa;
            border-radius: 6px;
            margin: 1rem 0;
            font-family: monospace;
            font-size: 0.9rem;
            line-height: 1.6;
        }
        pre {
            background: #f4f4f4;
            padding: 1rem;
            border-radius: 4px;
            overflow-x: auto;
        }
        .warning {
            background: #fff3cd;
            border: 1px solid #ffc107;
            color: #856404;
            padding: 1rem;
            border-radius: 6px;
            margin: 1rem 0;
        }
    </style>
</head>
<body>
    <div class="installer">
        <div class="header">
            <h1>KCI CMS Quick Installer</h1>
            <p>Step <?php echo $step; ?> of 4</p>
        </div>
        
        <div class="step-indicator">
            <div class="step <?php echo $step >= 1 ? 'active' : ''; ?>">1</div>
            <div class="step <?php echo $step >= 2 ? 'active' : ''; ?>">2</div>
            <div class="step <?php echo $step >= 3 ? 'active' : ''; ?>">3</div>
            <div class="step <?php echo $step >= 4 ? 'active' : ''; ?>">4</div>
        </div>
        
        <div class="content">
            <?php if ($message): ?>
                <div class="message success"><?php echo $message; ?></div>
            <?php endif; ?>
            
            <?php if ($error): ?>
                <div class="message error"><?php echo $error; ?></div>
            <?php endif; ?>
            
            <?php if ($step == 1): ?>
                <h2>Welcome to KCI CMS Installer</h2>
                <p>This wizard will help you set up the CMS for your Komunitas Chinese Indonesia website.</p>
                
                <div class="warning">
                    <strong>⚠️ Before you continue, make sure you have:</strong>
                    <ul style="margin-top: 0.5rem;">
                        <li>Created a MySQL database</li>
                        <li>Database username and password</li>
                        <li>Uploaded all artifact files to a temporary folder</li>
                    </ul>
                </div>
                
                <h3 style="margin-top: 1.5rem;">Requirements Check:</h3>
                <div class="file-list">
                    <?php
                    $requirements = [
                        'PHP Version >= 7.4' => version_compare(PHP_VERSION, '7.4.0', '>='),
                        'PDO Extension' => extension_loaded('pdo'),
                        'PDO MySQL' => extension_loaded('pdo_mysql'),
                        'GD Library' => extension_loaded('gd'),
                        'JSON Support' => function_exists('json_encode'),
                        'Session Support' => function_exists('session_start'),
                        'File Upload' => ini_get('file_uploads'),
                        'Writable Directory' => is_writable('.')
                    ];
                    
                    foreach ($requirements as $req => $status) {
                        echo $status ? "✅" : "❌";
                        echo " $req<br>";
                    }
                    ?>
                </div>
                
                <form method="GET">
                    <input type="hidden" name="step" value="2">
                    <div class="btn-group">
                        <span></span>
                        <button type="submit" class="btn">Start Installation</button>
                    </div>
                </form>
                
            <?php elseif ($step == 2): ?>
                <h2>Create Directory Structure</h2>
                <p>Click the button below to create all necessary directories.</p>
                
                <form method="POST" action="?step=2">
                    <button type="submit" class="btn" style="width: 100%;">Create Directories</button>
                </form>
                
                <?php if ($_SERVER['REQUEST_METHOD'] === 'POST'): ?>
                <div class="btn-group" style="margin-top: 2rem;">
                    <a href="?step=1" class="btn" style="background: #6c757d;">Previous</a>
                    <a href="?step=3" class="btn">Next Step</a>
                </div>
                <?php endif; ?>
                
            <?php elseif ($step == 3): ?>
                <h2>Database Configuration</h2>
                <form method="POST" action="?step=3">
                    <div class="form-group">
                        <label>Site URL (without trailing slash)</label>
                        <input type="url" name="site_url" value="https://<?php echo $_SERVER['HTTP_HOST']; ?>" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Database Host</label>
                        <input type="text" name="db_host" value="localhost" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Database Name</label>
                        <input type="text" name="db_name" placeholder="kci_cms" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Database Username</label>
                        <input type="text" name="db_user" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Database Password</label>
                        <input type="password" name="db_pass" required>
                    </div>
                    
                    <button type="submit" class="btn" style="width: 100%;">Test Connection & Create Config</button>
                </form>
                
                <?php if ($_SERVER['REQUEST_METHOD'] === 'POST' && !$error): ?>
                <div class="btn-group" style="margin-top: 2rem;">
                    <a href="?step=2" class="btn" style="background: #6c757d;">Previous</a>
                    <a href="?step=4" class="btn">Next Step</a>
                </div>
                <?php endif; ?>
                
            <?php elseif ($step == 4): ?>
                <h2>Installation Complete!</h2>
                <div class="message success">
                    <strong>✅ Basic setup is complete!</strong>
                </div>
                
                <h3>Next Steps:</h3>
                <ol style="line-height: 2;">
                    <li>Upload all the artifact files to their respective directories</li>
                    <li>Import the database schema using phpMyAdmin</li>
                    <li>Create your admin account</li>
                    <li>Delete this installer file (quick-install.php)</li>
                </ol>
                
                <h3 style="margin-top: 1.5rem;">File Mapping Guide:</h3>
                <div class="file-list">
                    <strong>Copy these files from artifacts:</strong><br><br>
                    kci-login-system → /admin/login.php<br>
                    kci-dashboard-complete → /admin/index.php<br>
                    kci-events-module → /admin/modules/events.php<br>
                    kci-members-module (1st doc) → /admin/modules/members.php<br>
                    kci-members-module (2nd doc) → /member-register.php<br>
                    kci-testimonials-partners (1st) → /admin/modules/testimonials.php<br>
                    kci-testimonials-partners (2nd) → /admin/modules/partners.php<br>
                    kci-settings-module (1st) → /admin/modules/settings.php<br>
                    kci-api-endpoints → /admin/api/crud-handler.php<br>
                    kci-frontend-integration → /index.php<br>
                    kci-security-final → Extract individual files as noted
                </div>
                
                <div class="warning">
                    <strong>⚠️ IMPORTANT:</strong> Delete this installer file immediately after setup!
                </div>
                
                <div class="btn-group">
                    <a href="/admin/" class="btn">Go to Admin Panel</a>
                </div>
                
            <?php endif; ?>
        </div>
    </div>
</body>
</html>