// =====================================
// admin/modules/users.php - User Management
// =====================================
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Management - KCI Admin</title>
    <link rel="stylesheet" href="../assets/css/admin.css">
    <style>
        .users-table {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .role-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
            display: inline-block;
        }
        
        .role-admin {
            background: #ff6b6b;
            color: white;
        }
        
        .role-editor {
            background: #4ecdc4;
            color: white;
        }
        
        .role-viewer {
            background: #95a5a6;
            color: white;
        }
        
        .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            object-fit: cover;
        }
        
        .user-info {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .status-indicator {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            display: inline-block;
            margin-right: 0.5rem;
        }
        
        .status-active {
            background: #28a745;
        }
        
        .status-inactive {
            background: #dc3545;
        }
        
        .last-login {
            color: #666;
            font-size: 0.85rem;
        }
    </style>
</head>
<body>
    <div class="dashboard-container">
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
                <li><a href="users.php" class="active">👤 Users</a></li>
                <li><a href="settings.php">⚙️ Settings</a></li>
                <li><a href="../logout.php">🚪 Logout</a></li>
            </ul>
        </aside>
        
        <main class="main-content">
            <div class="content-header">
                <h1>User Management</h1>
                <button class="btn btn-primary" onclick="showAddUserModal()">
                    + Add User
                </button>
            </div>
            
            <div class="users-table">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Last Login</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div class="user-info">
                                    <img src="/assets/profile/default-avatar.jpg" alt="Avatar" class="user-avatar">
                                    <div>
                                        <strong>Admin</strong>
                                        <br><small>admin@kci.com</small>
                                    </div>
                                </div>
                            </td>
                            <td><span class="role-badge role-admin">Admin</span></td>
                            <td><span class="status-indicator status-active"></span> Active</td>
                            <td class="last-login">Today, 14:30</td>
                            <td>
                                <button class="btn-sm" onclick="editUser(1)">✏️ Edit</button>
                                <button class="btn-sm" onclick="resetPassword(1)">🔑 Reset</button>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div class="user-info">
                                    <img src="/assets/profile/default-avatar.jpg" alt="Avatar" class="user-avatar">
                                    <div>
                                        <strong>Editor User</strong>
                                        <br><small>editor@kci.com</small>
                                    </div>
                                </div>
                            </td>
                            <td><span class="role-badge role-editor">Editor</span></td>
                            <td><span class="status-indicator status-active"></span> Active</td>
                            <td class="last-login">Yesterday, 10:15</td>
                            <td>
                                <button class="btn-sm" onclick="editUser(2)">✏️ Edit</button>
                                <button class="btn-sm" onclick="toggleUserStatus(2)">🔄 Toggle</button>
                                <button class="btn-sm btn-danger" onclick="deleteUser(2)">🗑️ Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </main>
    </div>
    
    <!-- Add/Edit User Modal -->
    <div id="userModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Add User</h2>
                <button onclick="closeUserModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">×</button>
            </div>
            <div class="modal-body">
                <form id="userForm">
                    <div class="form-group">
                        <label for="username">Username *</label>
                        <input type="text" id="username" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email *</label>
                        <input type="email" id="email" required>
                    </div>
                    <div class="form-group">
                        <label for="full_name">Full Name *</label>
                        <input type="text" id="full_name" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password *</label>
                        <input type="password" id="password" required minlength="8">
                        <small>Minimum 8 characters</small>
                    </div>
                    <div class="form-group">
                        <label for="role">Role *</label>
                        <select id="role" required>
                            <option value="viewer">Viewer (Read Only)</option>
                            <option value="editor">Editor (Create/Edit)</option>
                            <option value="admin">Admin (Full Access)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="is_active" checked> Active
                        </label>
                    </div>
                    <div style="display: flex; gap: 1rem;">
                        <button type="submit" class="btn btn-primary">Save User</button>
                        <button type="button" class="btn btn-secondary" onclick="closeUserModal()">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    
    <script>
        function showAddUserModal() {
            document.getElementById('userModal').classList.add('show');
        }
        
        function closeUserModal() {
            document.getElementById('userModal').classList.remove('show');
        }
        
        function editUser(id) {
            showAddUserModal();
            // Load user data
        }
        
        function resetPassword(id) {
            if (confirm('Reset password for this user?')) {
                alert('Password reset link sent to user email');
            }
        }
        
        function toggleUserStatus(id) {
            if (confirm('Toggle user status?')) {
                // Toggle active/inactive
            }
        }
        
        function deleteUser(id) {
            if (confirm('Are you sure you want to delete this user?')) {
                // Delete user
            }
        }
        
        document.getElementById('userForm').addEventListener('submit', function(e) {
            e.preventDefault();
            // Submit form via AJAX
            alert('User saved!');
            closeUserModal();
        });
    </script>
</body>
</html>

<?php