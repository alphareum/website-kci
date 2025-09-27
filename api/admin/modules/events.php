<!-- admin/modules/events.php -->
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Events Management - KCI Admin</title>
    <link rel="stylesheet" href="../assets/css/admin.css">
    <style>
        .event-form-builder {
            background: white;
            border-radius: 8px;
            padding: 2rem;
            margin-top: 2rem;
        }
        
        .form-builder-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid #e3e6f0;
        }
        
        .form-fields {
            display: grid;
            gap: 1.5rem;
        }
        
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
        }
        
        .form-group.full-width {
            grid-column: 1 / -1;
        }
        
        .date-time-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }
        
        .image-upload-area {
            border: 2px dashed #ced4da;
            border-radius: 8px;
            padding: 2rem;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s;
            position: relative;
        }
        
        .image-upload-area:hover {
            border-color: #800020;
            background: rgba(128, 0, 32, 0.05);
        }
        
        .image-preview {
            display: none;
            margin-top: 1rem;
        }
        
        .image-preview.show {
            display: block;
        }
        
        .image-preview img {
            max-width: 100%;
            max-height: 300px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .event-cards {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }
        
        .event-card {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: transform 0.3s;
        }
        
        .event-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 15px rgba(0,0,0,0.15);
        }
        
        .event-card-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
            background: linear-gradient(135deg, #f5f5f5, #e0e0e0);
        }
        
        .event-card-body {
            padding: 1.5rem;
        }
        
        .event-card-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: #333;
            margin-bottom: 0.5rem;
        }
        
        .event-card-meta {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
            font-size: 0.9rem;
            color: #666;
        }
        
        .event-card-meta span {
            display: flex;
            align-items: center;
            gap: 0.25rem;
        }
        
        .event-status {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
        }
        
        .event-status.upcoming {
            background: #d4edda;
            color: #155724;
        }
        
        .event-status.ongoing {
            background: #cce5ff;
            color: #004085;
        }
        
        .event-status.completed {
            background: #e2e3e5;
            color: #383d41;
        }
        
        .event-status.cancelled {
            background: #f8d7da;
            color: #721c24;
        }
        
        .event-card-actions {
            display: flex;
            gap: 0.5rem;
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid #e9ecef;
        }
        
        .btn-icon {
            padding: 0.5rem;
            border: 1px solid #dee2e6;
            background: white;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .btn-icon:hover {
            background: #f8f9fa;
            border-color: #800020;
            color: #800020;
        }
        
        .custom-fields-section {
            margin-top: 2rem;
            padding: 1.5rem;
            background: #f8f9fa;
            border-radius: 8px;
        }
        
        .custom-field-builder {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
        }
        
        .custom-fields-list {
            display: grid;
            gap: 0.75rem;
            margin-top: 1rem;
        }
        
        .custom-field-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem;
            background: white;
            border-radius: 6px;
            border: 1px solid #dee2e6;
        }
        
        .tabs {
            display: flex;
            gap: 1rem;
            border-bottom: 2px solid #e3e6f0;
            margin-bottom: 2rem;
        }
        
        .tab {
            padding: 0.75rem 1.5rem;
            background: none;
            border: none;
            cursor: pointer;
            font-size: 1rem;
            color: #666;
            border-bottom: 3px solid transparent;
            transition: all 0.3s;
        }
        
        .tab.active {
            color: #800020;
            border-bottom-color: #800020;
        }
        
        .tab:hover {
            color: #800020;
        }
        
        .tab-content {
            display: none;
        }
        
        .tab-content.active {
            display: block;
        }
        
        @media (max-width: 768px) {
            .form-row {
                grid-template-columns: 1fr;
            }
            
            .event-cards {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <?php
    // This would normally include PHP logic for database operations
    // For demonstration, showing the HTML structure
    ?>
    
    <div class="dashboard-container">
        <!-- Sidebar Include -->
        <aside class="sidebar">
            <div class="sidebar-header">
                <h2>KCI Admin</h2>
                <p>Management System</p>
            </div>
            <ul class="sidebar-menu">
                <li><a href="../index.php"><i>📊</i> Dashboard</a></li>
                <li><a href="events.php" class="active"><i>📅</i> Events</a></li>
                <li><a href="gallery.php"><i>🖼️</i> Gallery</a></li>
                <li><a href="blog.php"><i>📝</i> Blog</a></li>
                <li><a href="testimonials.php"><i>💬</i> Testimonials</a></li>
                <li><a href="partners.php"><i>🤝</i> Partners</a></li>
                <li><a href="members.php"><i>👥</i> Members</a></li>
                <li><a href="users.php"><i>👤</i> Users</a></li>
                <li><a href="settings.php"><i>⚙️</i> Settings</a></li>
                <li><a href="../logout.php"><i>🚪</i> Logout</a></li>
            </ul>
        </aside>
        
        <main class="main-content">
            <div class="content-header">
                <h1>Events Management</h1>
                <button class="btn btn-primary" onclick="showTab('create')">
                    + Create New Event
                </button>
            </div>
            
            <!-- Tabs -->
            <div class="tabs">
                <button class="tab active" onclick="showTab('list')">All Events</button>
                <button class="tab" onclick="showTab('create')">Create Event</button>
                <button class="tab" onclick="showTab('calendar')">Calendar View</button>
            </div>
            
            <!-- List Tab -->
            <div id="list-tab" class="tab-content active">
                <div class="event-cards">
                    <!-- Event Card 1 -->
                    <div class="event-card">
                        <img src="/uploads/events/sample-event.jpg" alt="Event" class="event-card-image">
                        <div class="event-card-body">
                            <h3 class="event-card-title">Chinese New Year Celebration 2025</h3>
                            <div class="event-card-meta">
                                <span>📅 Feb 10, 2025</span>
                                <span>📍 Yogyakarta</span>
                                <span>👥 150/200</span>
                            </div>
                            <span class="event-status upcoming">Upcoming</span>
                            <div class="event-card-actions">
                                <button class="btn-icon" title="View">👁️</button>
                                <button class="btn-icon" title="Edit">✏️</button>
                                <button class="btn-icon" title="Duplicate">📋</button>
                                <button class="btn-icon" title="Delete">🗑️</button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Event Card 2 -->
                    <div class="event-card">
                        <img src="/uploads/events/sample-event2.jpg" alt="Event" class="event-card-image">
                        <div class="event-card-body">
                            <h3 class="event-card-title">Basketball Tournament</h3>
                            <div class="event-card-meta">
                                <span>📅 Jan 15, 2025</span>
                                <span>📍 GOR UNY</span>
                                <span>👥 80/100</span>
                            </div>
                            <span class="event-status ongoing">Ongoing</span>
                            <div class="event-card-actions">
                                <button class="btn-icon" title="View">👁️</button>
                                <button class="btn-icon" title="Edit">✏️</button>
                                <button class="btn-icon" title="Duplicate">📋</button>
                                <button class="btn-icon" title="Delete">🗑️</button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Event Card 3 -->
                    <div class="event-card">
                        <img src="/uploads/events/sample-event3.jpg" alt="Event" class="event-card-image">
                        <div class="event-card-body">
                            <h3 class="event-card-title">Cultural Workshop</h3>
                            <div class="event-card-meta">
                                <span>📅 Dec 20, 2024</span>
                                <span>📍 KCI Center</span>
                                <span>👥 50/50</span>
                            </div>
                            <span class="event-status completed">Completed</span>
                            <div class="event-card-actions">
                                <button class="btn-icon" title="View">👁️</button>
                                <button class="btn-icon" title="Edit">✏️</button>
                                <button class="btn-icon" title="Duplicate">📋</button>
                                <button class="btn-icon" title="Delete">🗑️</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Create/Edit Tab -->
            <div id="create-tab" class="tab-content">
                <div class="event-form-builder">
                    <div class="form-builder-header">
                        <h2>Create New Event</h2>
                        <div>
                            <button class="btn btn-secondary" onclick="saveDraft()">Save as Draft</button>
                            <button class="btn btn-primary" onclick="publishEvent()">Publish Event</button>
                        </div>
                    </div>
                    
                    <form class="form-fields">
                        <!-- Basic Information -->
                        <div class="form-row">
                            <div class="form-group">
                                <label for="event-title">Event Title *</label>
                                <input type="text" id="event-title" placeholder="Enter event title" required>
                            </div>
                            <div class="form-group">
                                <label for="event-category">Category</label>
                                <select id="event-category">
                                    <option>Cultural</option>
                                    <option>Sports</option>
                                    <option>Education</option>
                                    <option>Social</option>
                                    <option>Business</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-group full-width">
                            <label for="event-description">Description</label>
                            <textarea id="event-description" rows="4" placeholder="Brief description of the event"></textarea>
                        </div>
                        
                        <!-- Date & Time -->
                        <div class="form-row">
                            <div class="form-group">
                                <label for="event-start">Start Date & Time *</label>
                                <input type="datetime-local" id="event-start" required>
                            </div>
                            <div class="form-group">
                                <label for="event-end">End Date & Time</label>
                                <input type="datetime-local" id="event-end">
                            </div>
                        </div>
                        
                        <!-- Location -->
                        <div class="form-row">
                            <div class="form-group">
                                <label for="event-location">Location *</label>
                                <input type="text" id="event-location" placeholder="Event venue" required>
                            </div>
                            <div class="form-group">
                                <label for="event-address">Full Address</label>
                                <input type="text" id="event-address" placeholder="Complete address">
                            </div>
                        </div>
                        
                        <!-- Registration -->
                        <div class="form-row">
                            <div class="form-group">
                                <label for="max-participants">Max Participants</label>
                                <input type="number" id="max-participants" placeholder="Leave empty for unlimited">
                            </div>
                            <div class="form-group">
                                <label for="registration-link">Registration Link</label>
                                <input type="url" id="registration-link" placeholder="https://...">
                            </div>
                        </div>
                        
                        <!-- Featured Image -->
                        <div class="form-group full-width">
                            <label>Featured Image</label>
                            <div class="image-upload-area" onclick="document.getElementById('event-image').click()">
                                <input type="file" id="event-image" accept="image/*" hidden onchange="previewImage(this)">
                                <div class="upload-placeholder">
                                    <p>📸 Click to upload image</p>
                                    <small>Recommended: 1200x600px, max 5MB</small>
                                </div>
                                <div class="image-preview" id="image-preview">
                                    <img src="" alt="Preview">
                                </div>
                            </div>
                        </div>
                        
                        <!-- Rich Content Editor -->
                        <div class="form-group full-width">
                            <label for="event-content">Event Details</label>
                            <textarea id="event-content" class="rich-editor" rows="10" placeholder="Full event details, agenda, etc."></textarea>
                        </div>
                        
                        <!-- Custom Registration Form Fields -->
                        <div class="custom-fields-section">
                            <h3>Registration Form Fields</h3>
                            <p>Add custom fields for your registration form</p>
                            
                            <div class="custom-field-builder">
                                <input type="text" id="field-label" placeholder="Field Label">
                                <select id="field-type">
                                    <option>Text</option>
                                    <option>Email</option>
                                    <option>Phone</option>
                                    <option>Number</option>
                                    <option>Dropdown</option>
                                    <option>Checkbox</option>
                                    <option>Radio</option>
                                    <option>Textarea</option>
                                </select>
                                <label>
                                    <input type="checkbox" id="field-required"> Required
                                </label>
                                <button type="button" class="btn btn-secondary" onclick="addCustomField()">Add Field</button>
                            </div>
                            
                            <div class="custom-fields-list" id="custom-fields-list">
                                <div class="custom-field-item">
                                    <span>Full Name (Text) - Required</span>
                                    <button class="btn-icon" onclick="removeField(this)">✕</button>
                                </div>
                                <div class="custom-field-item">
                                    <span>Email (Email) - Required</span>
                                    <button class="btn-icon" onclick="removeField(this)">✕</button>
                                </div>
                                <div class="custom-field-item">
                                    <span>Phone Number (Phone) - Required</span>
                                    <button class="btn-icon" onclick="removeField(this)">✕</button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Settings -->
                        <div class="form-row">
                            <div class="form-group">
                                <label>
                                    <input type="checkbox" checked> Enable Registration
                                </label>
                            </div>
                            <div class="form-group">
                                <label>
                                    <input type="checkbox"> Featured Event
                                </label>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            
            <!-- Calendar Tab -->
            <div id="calendar-tab" class="tab-content">
                <div style="background: white; padding: 2rem; border-radius: 8px; text-align: center;">
                    <h3>Calendar View</h3>
                    <p>Calendar integration coming soon...</p>
                    <p>This will show a visual calendar with all events marked.</p>
                </div>
            </div>
        </main>
    </div>
    
    <script>
        // Tab switching
        function showTab(tabName) {
            // Hide all tabs
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Show selected tab
            document.getElementById(tabName + '-tab').classList.add('active');
            event.target.classList.add('active');
        }
        
        // Image preview
        function previewImage(input) {
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.getElementById('image-preview');
                    preview.querySelector('img').src = e.target.result;
                    preview.classList.add('show');
                    document.querySelector('.upload-placeholder').style.display = 'none';
                };
                reader.readAsDataURL(input.files[0]);
            }
        }
        
        // Add custom field
        function addCustomField() {
            const label = document.getElementById('field-label').value;
            const type = document.getElementById('field-type').value;
            const required = document.getElementById('field-required').checked;
            
            if (!label) {
                alert('Please enter a field label');
                return;
            }
            
            const fieldsList = document.getElementById('custom-fields-list');
            const fieldItem = document.createElement('div');
            fieldItem.className = 'custom-field-item';
            fieldItem.innerHTML = `
                <span>${label} (${type}) ${required ? '- Required' : ''}</span>
                <button class="btn-icon" onclick="removeField(this)">✕</button>
            `;
            fieldsList.appendChild(fieldItem);
            
            // Clear inputs
            document.getElementById('field-label').value = '';
            document.getElementById('field-required').checked = false;
        }
        
        // Remove custom field
        function removeField(button) {
            button.parentElement.remove();
        }
        
        // Save draft
        function saveDraft() {
            alert('Event saved as draft!');
            // Here you would send the form data to the server
        }
        
        // Publish event
        function publishEvent() {
            if (confirm('Are you sure you want to publish this event?')) {
                alert('Event published successfully!');
                // Here you would send the form data to the server
            }
        }
        
        // Initialize rich text editor (you can use TinyMCE, CKEditor, etc.)
        // This is a placeholder for the actual implementation
    </script>
</body>
</html>