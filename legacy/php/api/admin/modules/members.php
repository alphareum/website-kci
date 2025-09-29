<!-- admin/modules/members.php -->
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Members Management - KCI Admin</title>
    <link rel="stylesheet" href="../assets/css/admin.css">
    <style>
        .members-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }
        
        .stat-box {
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .stat-box h4 {
            color: #666;
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
        }
        
        .stat-box .number {
            font-size: 2rem;
            font-weight: bold;
            color: #800020;
        }
        
        .members-table {
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .table-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            background: #f8f9fa;
            border-bottom: 1px solid #dee2e6;
        }
        
        .search-box {
            display: flex;
            gap: 0.5rem;
        }
        
        .search-box input {
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            width: 300px;
        }
        
        .filter-buttons {
            display: flex;
            gap: 0.5rem;
        }
        
        .filter-btn {
            padding: 0.5rem 1rem;
            border: 1px solid #ddd;
            background: white;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .filter-btn.active {
            background: #800020;
            color: white;
            border-color: #800020;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
        }
        
        thead {
            background: #800020;
            color: white;
        }
        
        th, td {
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid #e9ecef;
        }
        
        tbody tr:hover {
            background: #f8f9fc;
        }
        
        .member-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            object-fit: cover;
        }
        
        .member-info {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .status-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
        }
        
        .status-active {
            background: #d4edda;
            color: #155724;
        }
        
        .status-pending {
            background: #fff3cd;
            color: #856404;
        }
        
        .status-inactive {
            background: #f8d7da;
            color: #721c24;
        }
        
        .action-buttons {
            display: flex;
            gap: 0.5rem;
        }
        
        .btn-sm {
            padding: 0.25rem 0.5rem;
            font-size: 0.875rem;
            border: 1px solid #ddd;
            background: white;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .btn-sm:hover {
            background: #f8f9fa;
            border-color: #800020;
        }
        
        /* Modal for member details */
        .member-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 1000;
        }
        
        .member-modal.show {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-content {
            background: white;
            border-radius: 12px;
            width: 90%;
            max-width: 600px;
            max-height: 90vh;
            overflow-y: auto;
        }
        
        .modal-header {
            padding: 1.5rem;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .modal-body {
            padding: 1.5rem;
        }
        
        .member-details {
            display: grid;
            gap: 1rem;
        }
        
        .detail-row {
            display: grid;
            grid-template-columns: 150px 1fr;
            gap: 1rem;
            padding: 0.75rem 0;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .detail-label {
            font-weight: 600;
            color: #666;
        }
        
        .bulk-actions {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 1rem;
        }
        
        .import-export {
            display: flex;
            gap: 1rem;
        }
    </style>
</head>
<body>
    <div class="dashboard-container">
        <!-- Include Sidebar -->
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
                <li><a href="members.php" class="active">👥 Members</a></li>
                <li><a href="users.php">👤 Users</a></li>
                <li><a href="settings.php">⚙️ Settings</a></li>
                <li><a href="../logout.php">🚪 Logout</a></li>
            </ul>
        </aside>
        
        <main class="main-content">
            <div class="content-header">
                <h1>Members Management</h1>
                <div class="header-actions">
                    <button class="btn btn-secondary" onclick="showImportModal()">
                        📥 Import CSV
                    </button>
                    <button class="btn btn-secondary" onclick="exportMembers()">
                        📤 Export
                    </button>
                    <button class="btn btn-primary" onclick="showAddMemberModal()">
                        + Add Member
                    </button>
                </div>
            </div>
            
            <!-- Statistics -->
            <div class="members-stats">
                <div class="stat-box">
                    <h4>Total Members</h4>
                    <div class="number">486</div>
                </div>
                <div class="stat-box">
                    <h4>Active Members</h4>
                    <div class="number">423</div>
                </div>
                <div class="stat-box">
                    <h4>Pending Approval</h4>
                    <div class="number">12</div>
                </div>
                <div class="stat-box">
                    <h4>New This Month</h4>
                    <div class="number">28</div>
                </div>
            </div>
            
            <!-- Members Table -->
            <div class="members-table">
                <div class="table-actions">
                    <div class="search-box">
                        <input type="text" placeholder="Search members..." id="searchInput">
                        <button class="btn btn-secondary">Search</button>
                    </div>
                    <div class="filter-buttons">
                        <button class="filter-btn active" data-filter="all">All</button>
                        <button class="filter-btn" data-filter="active">Active</button>
                        <button class="filter-btn" data-filter="pending">Pending</button>
                        <button class="filter-btn" data-filter="inactive">Inactive</button>
                    </div>
                </div>
                
                <!-- Bulk Actions -->
                <div class="bulk-actions" style="padding: 1rem;">
                    <input type="checkbox" id="selectAll">
                    <label for="selectAll">Select All</label>
                    <button class="btn-sm">Approve Selected</button>
                    <button class="btn-sm">Send Email</button>
                    <button class="btn-sm">Export Selected</button>
                    <button class="btn-sm" style="color: red;">Delete Selected</button>
                </div>
                
                <table>
                    <thead>
                        <tr>
                            <th width="30"></th>
                            <th>Member</th>
                            <th>Member Code</th>
                            <th>Contact</th>
                            <th>Join Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><input type="checkbox" class="member-select"></td>
                            <td>
                                <div class="member-info">
                                    <img src="/assets/profile/default-avatar.jpg" alt="Avatar" class="member-avatar">
                                    <div>
                                        <strong>Joshua Robert Kurniawan</strong>
                                        <br><small>Founder</small>
                                    </div>
                                </div>
                            </td>
                            <td>KCI-2025-001</td>
                            <td>
                                <small>joshua@kci.com<br>0878-8492-4385</small>
                            </td>
                            <td>20 Jun 2025</td>
                            <td><span class="status-badge status-active">Active</span></td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn-sm" onclick="viewMember(1)">👁️</button>
                                    <button class="btn-sm" onclick="editMember(1)">✏️</button>
                                    <button class="btn-sm" onclick="deleteMember(1)">🗑️</button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td><input type="checkbox" class="member-select"></td>
                            <td>
                                <div class="member-info">
                                    <img src="/assets/profile/default-avatar.jpg" alt="Avatar" class="member-avatar">
                                    <div>
                                        <strong>Jonathan Robert Kurniawan</strong>
                                        <br><small>Co-Founder</small>
                                    </div>
                                </div>
                            </td>
                            <td>KCI-2025-002</td>
                            <td>
                                <small>jonathan@kci.com<br>0856-4187-7775</small>
                            </td>
                            <td>20 Jun 2025</td>
                            <td><span class="status-badge status-active">Active</span></td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn-sm" onclick="viewMember(2)">👁️</button>
                                    <button class="btn-sm" onclick="editMember(2)">✏️</button>
                                    <button class="btn-sm" onclick="deleteMember(2)">🗑️</button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td><input type="checkbox" class="member-select"></td>
                            <td>
                                <div class="member-info">
                                    <img src="/assets/profile/default-avatar.jpg" alt="Avatar" class="member-avatar">
                                    <div>
                                        <strong>Linda Wijaya</strong>
                                        <br><small>Member</small>
                                    </div>
                                </div>
                            </td>
                            <td>KCI-2025-045</td>
                            <td>
                                <small>linda.w@gmail.com<br>0812-3456-7890</small>
                            </td>
                            <td>15 Sep 2025</td>
                            <td><span class="status-badge status-pending">Pending</span></td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn-sm" onclick="viewMember(3)">👁️</button>
                                    <button class="btn-sm" onclick="approveMember(3)">✅</button>
                                    <button class="btn-sm" onclick="rejectMember(3)">❌</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                
                <!-- Pagination -->
                <div style="padding: 1rem; display: flex; justify-content: space-between; align-items: center;">
                    <div>Showing 1-10 of 486 members</div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn-sm">Previous</button>
                        <button class="btn-sm" style="background: #800020; color: white;">1</button>
                        <button class="btn-sm">2</button>
                        <button class="btn-sm">3</button>
                        <button class="btn-sm">...</button>
                        <button class="btn-sm">49</button>
                        <button class="btn-sm">Next</button>
                    </div>
                </div>
            </div>
        </main>
    </div>
    
    <!-- Member Details Modal -->
    <div class="member-modal" id="memberModal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Member Details</h2>
                <button onclick="closeMemberModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">×</button>
            </div>
            <div class="modal-body">
                <div style="text-align: center; margin-bottom: 2rem;">
                    <img src="/assets/profile/default-avatar.jpg" alt="Avatar" style="width: 120px; height: 120px; border-radius: 50%; margin-bottom: 1rem;">
                    <h3>Joshua Robert Kurniawan</h3>
                    <p style="color: #666;">Founder</p>
                    <span class="status-badge status-active">Active</span>
                </div>
                
                <div class="member-details">
                    <div class="detail-row">
                        <div class="detail-label">Member Code</div>
                        <div>KCI-2025-001</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Email</div>
                        <div>joshua@kci.com</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Phone</div>
                        <div>0878-8492-4385</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Address</div>
                        <div>Jl. Kaliurang KM 5, Yogyakarta</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Birth Date</div>
                        <div>15 March 1995</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Join Date</div>
                        <div>20 June 2025</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Events Attended</div>
                        <div>12 events</div>
                    </div>
                </div>
                
                <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: center;">
                    <button class="btn btn-primary">Edit Member</button>
                    <button class="btn btn-secondary">Send Email</button>
                    <button class="btn btn-danger">Deactivate</button>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        // Filter functionality
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                // Filter logic here
            });
        });
        
        // Select all functionality
        document.getElementById('selectAll').addEventListener('change', function() {
            document.querySelectorAll('.member-select').forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
        
        // Modal functions
        function viewMember(id) {
            document.getElementById('memberModal').classList.add('show');
        }
        
        function closeMemberModal() {
            document.getElementById('memberModal').classList.remove('show');
        }
        
        function editMember(id) {
            window.location.href = 'member-edit.php?id=' + id;
        }
        
        function approveMember(id) {
            if (confirm('Approve this member?')) {
                // AJAX call to approve member
                alert('Member approved!');
            }
        }
        
        function rejectMember(id) {
            if (confirm('Reject this member application?')) {
                // AJAX call to reject member
                alert('Member rejected');
            }
        }
        
        function deleteMember(id) {
            if (confirm('Are you sure you want to delete this member?')) {
                // AJAX call to delete member
                alert('Member deleted');
            }
        }
        
        function exportMembers() {
            window.location.href = '../api/export-members.php';
        }
        
        function showImportModal() {
            alert('Import functionality coming soon');
        }
        
        function showAddMemberModal() {
            window.location.href = 'member-add.php';
        }
    </script>
</body>
</html>