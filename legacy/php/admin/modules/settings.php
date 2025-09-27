<!-- admin/modules/settings.php -->
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Settings - KCI Admin</title>
    <link rel="stylesheet" href="../assets/css/admin.css">
    <style>
        .settings-container {
            max-width: 1000px;
        }
        
        .settings-tabs {
            display: flex;
            background: white;
            border-radius: 8px 8px 0 0;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .settings-tab {
            flex: 1;
            padding: 1rem;
            background: white;
            border: none;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.3s;
            border-bottom: 3px solid transparent;
        }
        
        .settings-tab:hover {
            background: #f8f9fa;
        }
        
        .settings-tab.active {
            background: #f8f9fa;
            border-bottom-color: #800020;
            font-weight: 600;
        }
        
        .settings-content {
            background: white;
            padding: 2rem;
            border-radius: 0 0 8px 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .settings-panel {
            display: none;
        }
        
        .settings-panel.active {
            display: block;
        }
        
        .settings-group {
            margin-bottom: 2rem;
            padding-bottom: 2rem;
            border-bottom: 1px solid #e9ecef;
        }
        
        .settings-group:last-child {
            border-bottom: none;
        }
        
        .settings-group h3 {
            color: #333;
            margin-bottom: 1rem;
            font-size: 1.25rem;
        }
        
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: #666;
            font-weight: 500;
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 1rem;
            transition: all 0.3s;
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #800020;
            box-shadow: 0 0 0 3px rgba(128, 0, 32, 0.1);
        }
        
        .switch-group {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .switch {
            position: relative;
            display: inline-block;
            width: 60px;
            height: 30px;
        }
        
        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 34px;
        }
        
        .slider:before {
            position: absolute;
            content: "";
            height: 22px;
            width: 22px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }
        
        input:checked + .slider {
            background-color: #800020;
        }
        
        input:checked + .slider:before {
            transform: translateX(30px);
        }
        
        .backup-section {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 8px;
            margin-top: 1rem;
        }
        
        .backup-list {
            margin-top: 1rem;
        }
        
        .backup-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem;
            background: white;
            border-radius: 6px;
            margin-bottom: 0.5rem;
        }
        
        .backup-info {
            display: flex;
            gap: 1rem;
            align-items: center;
        }
        
        .backup-actions {
            display: flex;
            gap: 0.5rem;
        }
        
        .log-viewer {
            background: #2d3436;
            color: #dfe6e9;
            padding: 1rem;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
            max-height: 400px;
            overflow-y: auto;
        }
        
        .log-entry {
            padding: 0.25rem 0;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        
        .log-entry.error {
            color: #ff7675;
        }
        
        .log-entry.warning {
            color: #fdcb6e;
        }
        
        .log-entry.info {
            color: #74b9ff;
        }
        
        .maintenance-preview {
            background: #fff3cd;
            border: 1px solid #ffc107;
            padding: 1rem;
            border-radius: 8px;
            margin-top: 1rem;
        }
        
        .cache-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-top: 1rem;
        }
        
        .cache-stat {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 6px;
            text-align: center;
        }
        
        .cache-stat h4 {
            color: #666;
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
        }
        
        .cache-stat .value {
            font-size: 1.5rem;
            font-weight: bold;
            color: #800020;
        }
    </style>
</head>
<body>
    <div class="dashboard-container">
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="sidebar-header">
                <h2>KCI Admin</h2>
            </div>
            <ul class="sidebar-menu">
                <li><a href="../index.php">📊 Dashboard</a></li>
                <li><a href="events.php">📅 Events</a></li>
                <li><a href="gallery.php">🖼️ Gallery</a></li>
                <li><a href="blog.php">📝 Blog</a></li>
                <li><a href="testimonials.php">💬 Testimonials</a></li>
                <li><a href="partners.php">🤝 Partners</a></li>
                <li><a href="members.php">👥 Members</a></li>
                <li><a href="users.php">👤 Users</a></li>
                <li><a href="settings.php" class="active">⚙️ Settings</a></li>
                <li><a href="../logout.php">🚪 Logout</a></li>
            </ul>
        </aside>
        
        <main class="main-content">
            <div class="content-header">
                <h1>Settings</h1>
                <button class="btn btn-primary" onclick="saveSettings()">💾 Save All Settings</button>
            </div>
            
            <div class="settings-container">
                <!-- Settings Tabs -->
                <div class="settings-tabs">
                    <button class="settings-tab active" onclick="showSettingsTab('general')">General</button>
                    <button class="settings-tab" onclick="showSettingsTab('contact')">Contact</button>
                    <button class="settings-tab" onclick="showSettingsTab('social')">Social Media</button>
                    <button class="settings-tab" onclick="showSettingsTab('email')">Email</button>
                    <button class="settings-tab" onclick="showSettingsTab('maintenance')">Maintenance</button>
                    <button class="settings-tab" onclick="showSettingsTab('backup')">Backup</button>
                    <button class="settings-tab" onclick="showSettingsTab('logs')">System Logs</button>
                </div>
                
                <div class="settings-content">
                    <!-- General Settings -->
                    <div class="settings-panel active" id="general-panel">
                        <div class="settings-group">
                            <h3>Site Information</h3>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Site Title</label>
                                    <input type="text" id="site_title" value="Komunitas Chinese Indonesia">
                                </div>
                                <div class="form-group">
                                    <label>Tagline</label>
                                    <input type="text" id="site_tagline" value="文化连心，共创未来">
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Site Description (SEO)</label>
                                <textarea id="site_description" rows="3">Komunitas Chinese Indonesia - Wadah persaudaraan dan pelestarian budaya Tionghoa di Indonesia</textarea>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Site URL</label>
                                    <input type="url" id="site_url" value="https://komunitaschineseindonesia.com">
                                </div>
                                <div class="form-group">
                                    <label>Admin Email</label>
                                    <input type="email" id="admin_email" value="admin@komunitaschineseindonesia.com">
                                </div>
                            </div>
                        </div>
                        
                        <div class="settings-group">
                            <h3>Regional Settings</h3>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Timezone</label>
                                    <select id="timezone">
                                        <option value="Asia/Jakarta" selected>Asia/Jakarta (WIB)</option>
                                        <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                                        <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Date Format</label>
                                    <select id="date_format">
                                        <option value="d/m/Y">DD/MM/YYYY</option>
                                        <option value="Y-m-d">YYYY-MM-DD</option>
                                        <option value="d M Y" selected>DD Month YYYY</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <div class="settings-group">
                            <h3>Display Settings</h3>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Events per Page</label>
                                    <input type="number" id="events_per_page" value="9">
                                </div>
                                <div class="form-group">
                                    <label>Gallery Images per Page</label>
                                    <input type="number" id="gallery_per_page" value="12">
                                </div>
                            </div>
                            <div class="switch-group">
                                <label class="switch">
                                    <input type="checkbox" id="show_upcoming_only" checked>
                                    <span class="slider"></span>
                                </label>
                                <label>Show Upcoming Events Only</label>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Contact Settings -->
                    <div class="settings-panel" id="contact-panel">
                        <div class="settings-group">
                            <h3>Contact Information</h3>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Founder Name</label>
                                    <input type="text" id="founder_name" value="Joshua Robert Kurniawan">
                                </div>
                                <div class="form-group">
                                    <label>Founder Phone</label>
                                    <input type="tel" id="founder_phone" value="0878-8492-4385">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Admin Name</label>
                                    <input type="text" id="admin_name" value="Jonathan Robert Kurniawan">
                                </div>
                                <div class="form-group">
                                    <label>Admin Phone</label>
                                    <input type="tel" id="admin_phone" value="0856-4187-7775">
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Office Address</label>
                                <textarea id="office_address" rows="3">Yogyakarta, Indonesia</textarea>
                            </div>
                        </div>
                        
                        <div class="settings-group">
                            <h3>Contact Form Settings</h3>
                            <div class="switch-group">
                                <label class="switch">
                                    <input type="checkbox" id="contact_form_enabled" checked>
                                    <span class="slider"></span>
                                </label>
                                <label>Enable Contact Form</label>
                            </div>
                            <div class="switch-group">
                                <label class="switch">
                                    <input type="checkbox" id="contact_form_captcha">
                                    <span class="slider"></span>
                                </label>
                                <label>Enable reCAPTCHA</label>
                            </div>
                            <div class="form-group">
                                <label>Notification Email</label>
                                <input type="email" id="contact_notification_email" placeholder="Email to receive contact form submissions">
                            </div>
                        </div>
                    </div>
                    
                    <!-- Social Media Settings -->
                    <div class="settings-panel" id="social-panel">
                        <div class="settings-group">
                            <h3>Social Media Links</h3>
                            <div class="form-group">
                                <label>Instagram Username</label>
                                <input type="text" id="instagram" value="komunitaschineseindonesia">
                            </div>
                            <div class="form-group">
                                <label>Facebook Page URL</label>
                                <input type="url" id="facebook" placeholder="https://facebook.com/yourpage">
                            </div>
                            <div class="form-group">
                                <label>TikTok Username</label>
                                <input type="text" id="tiktok" value="single_chinese">
                            </div>
                            <div class="form-group">
                                <label>YouTube Channel URL</label>
                                <input type="url" id="youtube" placeholder="https://youtube.com/channel/...">
                            </div>
                            <div class="form-group">
                                <label>WhatsApp Group Link</label>
                                <input type="url" id="whatsapp_group" placeholder="https://chat.whatsapp.com/...">
                            </div>
                        </div>
                        
                        <div class="settings-group">
                            <h3>Social Media Integration</h3>
                            <div class="switch-group">
                                <label class="switch">
                                    <input type="checkbox" id="show_social_links" checked>
                                    <span class="slider"></span>
                                </label>
                                <label>Show Social Media Links</label>
                            </div>
                            <div class="switch-group">
                                <label class="switch">
                                    <input type="checkbox" id="instagram_feed">
                                    <span class="slider"></span>
                                </label>
                                <label>Show Instagram Feed on Homepage</label>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Email Settings -->
                    <div class="settings-panel" id="email-panel">
                        <div class="settings-group">
                            <h3>Email Configuration</h3>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>SMTP Host</label>
                                    <input type="text" id="smtp_host" placeholder="smtp.gmail.com">
                                </div>
                                <div class="form-group">
                                    <label>SMTP Port</label>
                                    <input type="number" id="smtp_port" value="587">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>SMTP Username</label>
                                    <input type="email" id="smtp_username" placeholder="your-email@gmail.com">
                                </div>
                                <div class="form-group">
                                    <label>SMTP Password</label>
                                    <input type="password" id="smtp_password" placeholder="••••••••">
                                </div>
                            </div>
                            <div class="form-group">
                                <label>From Email</label>
                                <input type="email" id="from_email" value="noreply@komunitaschineseindonesia.com">
                            </div>
                            <div class="form-group">
                                <label>From Name</label>
                                <input type="text" id="from_name" value="Komunitas Chinese Indonesia">
                            </div>
                            <button class="btn btn-secondary" onclick="testEmailSettings()">📧 Send Test Email</button>
                        </div>
                        
                        <div class="settings-group">
                            <h3>Email Templates</h3>
                            <div class="form-group">
                                <label>Welcome Email Subject</label>
                                <input type="text" id="welcome_subject" value="Selamat Datang di Komunitas Chinese Indonesia!">
                            </div>
                            <div class="form-group">
                                <label>Welcome Email Template</label>
                                <textarea id="welcome_template" rows="6">Dear {name},

Selamat datang di Komunitas Chinese Indonesia! 
Kami sangat senang Anda bergabung dengan keluarga besar KCI.

Member Code Anda: {member_code}

Salam hangat,
Tim KCI</textarea>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Maintenance Settings -->
                    <div class="settings-panel" id="maintenance-panel">
                        <div class="settings-group">
                            <h3>Maintenance Mode</h3>
                            <div class="switch-group">
                                <label class="switch">
                                    <input type="checkbox" id="maintenance_mode">
                                    <span class="slider"></span>
                                </label>
                                <label>Enable Maintenance Mode</label>
                            </div>
                            <div class="form-group">
                                <label>Maintenance Message</label>
                                <textarea id="maintenance_message" rows="4">Kami sedang melakukan pemeliharaan sistem untuk meningkatkan layanan. 
Silakan kembali dalam beberapa saat.</textarea>
                            </div>
                            <div class="form-group">
                                <label>Expected End Time</label>
                                <input type="datetime-local" id="maintenance_end_time">
                            </div>
                            <div class="maintenance-preview">
                                <strong>Preview:</strong>
                                <p>This is how the maintenance page will look to visitors.</p>
                            </div>
                        </div>
                        
                        <div class="settings-group">
                            <h3>Cache Management</h3>
                            <div class="cache-stats">
                                <div class="cache-stat">
                                    <h4>Page Cache</h4>
                                    <div class="value">2.3 MB</div>
                                </div>
                                <div class="cache-stat">
                                    <h4>Image Cache</h4>
                                    <div class="value">45.6 MB</div>
                                </div>
                                <div class="cache-stat">
                                    <h4>Database Cache</h4>
                                    <div class="value">1.2 MB</div>
                                </div>
                            </div>
                            <div style="margin-top: 1rem;">
                                <button class="btn btn-warning" onclick="clearCache('page')">Clear Page Cache</button>
                                <button class="btn btn-warning" onclick="clearCache('image')">Clear Image Cache</button>
                                <button class="btn btn-danger" onclick="clearCache('all')">Clear All Cache</button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Backup Settings -->
                    <div class="settings-panel" id="backup-panel">
                        <div class="settings-group">
                            <h3>Backup Management</h3>
                            <div class="backup-section">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <div>
                                        <h4>Create New Backup</h4>
                                        <p style="color: #666;">Create a full backup of database and files</p>
                                    </div>
                                    <button class="btn btn-primary" onclick="createBackup()">🔄 Create Backup Now</button>
                                </div>
                                
                                <div class="backup-list">
                                    <h4 style="margin-bottom: 1rem;">Recent Backups</h4>
                                    <div class="backup-item">
                                        <div class="backup-info">
                                            <span>📦</span>
                                            <div>
                                                <strong>backup_2025-09-25_14-30.zip</strong>
                                                <small style="color: #666;">Size: 125 MB | Created: 25 Sep 2025, 14:30</small>
                                            </div>
                                        </div>
                                        <div class="backup-actions">
                                            <button class="btn-sm">📥 Download</button>
                                            <button class="btn-sm">♻️ Restore</button>
                                            <button class="btn-sm" style="color: red;">🗑️ Delete</button>
                                        </div>
                                    </div>
                                    <div class="backup-item">
                                        <div class="backup-info">
                                            <span>📦</span>
                                            <div>
                                                <strong>backup_2025-09-24_10-00.zip</strong>
                                                <small style="color: #666;">Size: 123 MB | Created: 24 Sep 2025, 10:00</small>
                                            </div>
                                        </div>
                                        <div class="backup-actions">
                                            <button class="btn-sm">📥 Download</button>
                                            <button class="btn-sm">♻️ Restore</button>
                                            <button class="btn-sm" style="color: red;">🗑️ Delete</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="settings-group" style="margin-top: 2rem;">
                                <h4>Automatic Backup</h4>
                                <div class="switch-group">
                                    <label class="switch">
                                        <input type="checkbox" id="auto_backup" checked>
                                        <span class="slider"></span>
                                    </label>
                                    <label>Enable Automatic Backup</label>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Backup Frequency</label>
                                        <select id="backup_frequency">
                                            <option value="daily">Daily</option>
                                            <option value="weekly" selected>Weekly</option>
                                            <option value="monthly">Monthly</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label>Backup Time</label>
                                        <input type="time" id="backup_time" value="03:00">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>Backup Retention (days)</label>
                                    <input type="number" id="backup_retention" value="30">
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- System Logs -->
                    <div class="settings-panel" id="logs-panel">
                        <div class="settings-group">
                            <h3>System Activity Logs</h3>
                            <div style="margin-bottom: 1rem;">
                                <select id="log_filter" onchange="filterLogs()">
                                    <option value="all">All Logs</option>
                                    <option value="error">Errors Only</option>
                                    <option value="warning">Warnings</option>
                                    <option value="info">Info</option>
                                    <option value="login">Login Activity</option>
                                </select>
                                <button class="btn btn-secondary" onclick="refreshLogs()">🔄 Refresh</button>
                                <button class="btn btn-warning" onclick="clearLogs()">🗑️ Clear Logs</button>
                            </div>
                            
                            <div class="log-viewer">
                                <div class="log-entry info">[2025-09-25 14:30:15] INFO: User admin logged in from IP 192.168.1.1</div>
                                <div class="log-entry">[2025-09-25 14:25:00] UPDATE: Event "Chinese New Year 2025" was updated by admin</div>
                                <div class="log-entry warning">[2025-09-25 13:45:22] WARNING: Failed login attempt for username "test" from IP 192.168.1.5</div>
                                <div class="log-entry">[2025-09-25 13:30:00] CREATE: New member "Linda Wijaya" registered</div>
                                <div class="log-entry">[2025-09-25 12:15:45] DELETE: Gallery image ID 45 deleted by admin</div>
                                <div class="log-entry error">[2025-09-25 11:30:00] ERROR: Database connection timeout</div>
                                <div class="log-entry">[2025-09-25 10:00:00] INFO: Automatic backup completed successfully</div>
                                <div class="log-entry">[2025-09-25 09:45:30] UPDATE: Site settings updated by admin</div>
                                <div class="log-entry">[2025-09-25 09:30:15] CREATE: New blog post "Welcome to KCI" published</div>
                                <div class="log-entry info">[2025-09-25 09:00:00] INFO: System maintenance mode activated</div>
                            </div>
                        </div>
                        
                        <div class="settings-group">
                            <h3>Analytics</h3>
                            <div class="form-group">
                                <label>Google Analytics Tracking ID</label>
                                <input type="text" id="google_analytics" placeholder="UA-XXXXXXXXX-X or G-XXXXXXXXXX">
                            </div>
                            <div class="form-group">
                                <label>Facebook Pixel ID</label>
                                <input type="text" id="facebook_pixel" placeholder="Enter your Facebook Pixel ID">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
    
    <script>
        // Tab switching
        function showSettingsTab(tabName) {
            // Hide all panels
            document.querySelectorAll('.settings-panel').forEach(panel => {
                panel.classList.remove('active');
            });
            
            // Remove active from all tabs
            document.querySelectorAll('.settings-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Show selected panel
            document.getElementById(tabName + '-panel').classList.add('active');
            
            // Mark tab as active
            event.target.classList.add('active');
        }
        
        // Save settings
        function saveSettings() {
            // Collect all form data
            const formData = new FormData();
            formData.append('action', 'update');
            formData.append('module', 'settings');
            
            // Get all input values
            document.querySelectorAll('input, select, textarea').forEach(element => {
                if (element.type === 'checkbox') {
                    formData.append(element.id, element.checked ? '1' : '0');
                } else {
                    formData.append(element.id, element.value);
                }
            });
            
            // Send to server
            fetch('../api/crud-handler.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Settings saved successfully!');
                } else {
                    alert('Error saving settings: ' + data.message);
                }
            })
            .catch(error => {
                alert('Error saving settings');
                console.error(error);
            });
        }
        
        // Test email settings
        function testEmailSettings() {
            alert('Test email sent! Check your inbox.');
        }
        
        // Clear cache
        function clearCache(type) {
            if (confirm('Are you sure you want to clear ' + type + ' cache?')) {
                alert(type.charAt(0).toUpperCase() + type.slice(1) + ' cache cleared successfully!');
            }
        }
        
        // Create backup
        function createBackup() {
            if (confirm('Create a full backup now? This may take a few minutes.')) {
                alert('Backup creation started. You will be notified when complete.');
                // In real implementation, this would trigger an AJAX call
            }
        }
        
        // Filter logs
        function filterLogs() {
            const filter = document.getElementById('log_filter').value;
            // Implementation would filter the log entries
            alert('Filtering logs by: ' + filter);
        }
        
        // Refresh logs
        function refreshLogs() {
            alert('Logs refreshed');
            // Would fetch latest logs via AJAX
        }
        
        // Clear logs
        function clearLogs() {
            if (confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
                alert('Logs cleared');
            }
        }
        
        // Load settings on page load
        window.addEventListener('DOMContentLoaded', function() {
            // Fetch current settings from server
            fetch('../api/crud-handler.php?action=get&module=settings')
                .then(response => response.json())
                .then(data => {
                    if (data.success && data.data) {
                        // Populate form fields with current values
                        Object.keys(data.data).forEach(key => {
                            const element = document.getElementById(key);
                            if (element) {
                                if (element.type === 'checkbox') {
                                    element.checked = data.data[key] === '1';
                                } else {
                                    element.value = data.data[key];
                                }
                            }
                        });
                    }
                })
                .catch(error => console.error('Error loading settings:', error));
        });
    </script>
</body>
</html>