<!-- admin/modules/partners.php -->
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Partners Management - KCI Admin</title>
    <link rel="stylesheet" href="../assets/css/admin.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.css">
    <style>
        .partners-section {
            background: white;
            border-radius: 12px;
            padding: 2rem;
            margin-bottom: 2rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .partners-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid #e9ecef;
        }
        
        .partners-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 1.5rem;
        }
        
        .partner-card {
            background: white;
            border: 2px solid #e9ecef;
            border-radius: 12px;
            padding: 1.5rem;
            text-align: center;
            position: relative;
            cursor: move;
            transition: all 0.3s;
        }
        
        .partner-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 15px rgba(0,0,0,0.15);
            border-color: #800020;
        }
        
        .partner-card.dragging {
            opacity: 0.5;
        }
        
        .drag-handle {
            position: absolute;
            top: 10px;
            right: 10px;
            color: #999;
            cursor: grab;
        }
        
        .drag-handle:active {
            cursor: grabbing;
        }
        
        .partner-logo {
            width: 150px;
            height: 100px;
            margin: 0 auto 1rem;
            background: #f8f9fa;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }
        
        .partner-logo img {
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
        }
        
        .partner-name {
            font-weight: 600;
            color: #333;
            margin-bottom: 0.5rem;
        }
        
        .partner-type {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
        }
        
        .partner-type.business {
            background: #e3f2fd;
            color: #1976d2;
        }
        
        .partner-type.community {
            background: #f3e5f5;
            color: #7b1fa2;
        }
        
        .partner-links {
            display: flex;
            justify-content: center;
            gap: 0.5rem;
            margin: 0.5rem 0;
        }
        
        .partner-links a {
            padding: 0.25rem 0.5rem;
            background: #f8f9fa;
            border-radius: 4px;
            text-decoration: none;
            color: #666;
            font-size: 0.85rem;
            transition: all 0.3s;
        }
        
        .partner-links a:hover {
            background: #800020;
            color: white;
        }
        
        .partner-actions {
            display: flex;
            justify-content: center;
            gap: 0.5rem;
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid #e9ecef;
        }
        
        .partner-status {
            position: absolute;
            top: 10px;
            left: 10px;
            width: 12px;
            height: 12px;
            border-radius: 50%;
        }
        
        .partner-status.active {
            background: #28a745;
        }
        
        .partner-status.inactive {
            background: #dc3545;
        }
        
        .add-partner-card {
            border: 2px dashed #dee2e6;
            background: #f8f9fa;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            min-height: 250px;
        }
        
        .add-partner-card:hover {
            border-color: #800020;
            background: rgba(128, 0, 32, 0.05);
        }
        
        .add-partner-card .icon {
            font-size: 3rem;
            color: #999;
            margin-bottom: 1rem;
        }
        
        .filter-tabs {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
        }
        
        .filter-tab {
            padding: 0.75rem 1.5rem;
            background: white;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .filter-tab.active {
            background: #800020;
            color: white;
            border-color: #800020;
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
                <li><a href="partners.php" class="active">🤝 Partners</a></li>
                <li><a href="members.php">👥 Members</a></li>
                <li><a href="users.php">👤 Users</a></li>
                <li><a href="settings.php">⚙️ Settings</a></li>
                <li><a href="../logout.php">🚪 Logout</a></li>
            </ul>
        </aside>
        
        <main class="main-content">
            <div class="content-header">
                <h1>Partners Management</h1>
                <button class="btn btn-primary" onclick="showAddPartnerModal()">
                    + Add Partner
                </button>
            </div>
            
            <!-- Filter Tabs -->
            <div class="filter-tabs">
                <button class="filter-tab active" onclick="filterPartners('all')">All Partners</button>
                <button class="filter-tab" onclick="filterPartners('business')">Business Partners</button>
                <button class="filter-tab" onclick="filterPartners('community')">Community Partners</button>
            </div>
            
            <!-- Business Partners Section -->
            <div class="partners-section" id="business-partners">
                <div class="partners-header">
                    <h2>📚 Business Partners</h2>
                    <button class="btn btn-secondary btn-sm" onclick="saveOrder('business')">💾 Save Order</button>
                </div>
                <div class="partners-grid" id="business-grid">
                    <!-- Partner Card -->
                    <div class="partner-card" data-id="1">
                        <span class="partner-status active" title="Active"></span>
                        <span class="drag-handle">⋮⋮</span>
                        <div class="partner-logo">
                            <img src="/assets/partners/business/kencanaproperty.jpg" alt="Kencana Property">
                        </div>
                        <h3 class="partner-name">KENCANA PROPERTY</h3>
                        <span class="partner-type business">Business</span>
                        <div class="partner-links">
                            <a href="https://instagram.com/kencana_property112" target="_blank">Instagram</a>
                            <a href="#" target="_blank">Website</a>
                        </div>
                        <div class="partner-actions">
                            <button class="btn btn-sm" onclick="editPartner(1)">✏️</button>
                            <button class="btn btn-sm" onclick="togglePartnerStatus(1)">🔄</button>
                            <button class="btn btn-sm btn-danger" onclick="deletePartner(1)">🗑️</button>
                        </div>
                    </div>
                    
                    <!-- Add Partner Card -->
                    <div class="partner-card add-partner-card" onclick="showAddPartnerModal('business')">
                        <div class="icon">+</div>
                        <p>Add Business Partner</p>
                    </div>
                </div>
            </div>
            
            <!-- Community Partners Section -->
            <div class="partners-section" id="community-partners">
                <div class="partners-header">
                    <h2>🤝 Community Partners</h2>
                    <button class="btn btn-secondary btn-sm" onclick="saveOrder('community')">💾 Save Order</button>
                </div>
                <div class="partners-grid" id="community-grid">
                    <!-- Partner Card -->
                    <div class="partner-card" data-id="2">
                        <span class="partner-status active" title="Active"></span>
                        <span class="drag-handle">⋮⋮</span>
                        <div class="partner-logo">
                            <img src="/assets/partners/community/komunitasberbagiyogyakarta.jpg" alt="Komunitas Berbagi">
                        </div>
                        <h3 class="partner-name">KOMUNITAS BERBAGI YOGYAKARTA</h3>
                        <span class="partner-type community">Community</span>
                        <div class="partner-links">
                            <a href="https://instagram.com/komunitasberbagiyogyakarta" target="_blank">Instagram</a>
                        </div>
                        <div class="partner-actions">
                            <button class="btn btn-sm" onclick="editPartner(2)">✏️</button>
                            <button class="btn btn-sm" onclick="togglePartnerStatus(2)">🔄</button>
                            <button class="btn btn-sm btn-danger" onclick="deletePartner(2)">🗑️</button>
                        </div>
                    </div>
                    
                    <!-- Add Partner Card -->
                    <div class="partner-card add-partner-card" onclick="showAddPartnerModal('community')">
                        <div class="icon">+</div>
                        <p>Add Community Partner</p>
                    </div>
                </div>
            </div>
        </main>
    </div>
    
    <!-- Add/Edit Partner Modal -->
    <div id="partnerModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Add Partner</h2>
                <button onclick="closePartnerModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">×</button>
            </div>
            <div class="modal-body">
                <form id="partnerForm">
                    <div class="form-group">
                        <label for="partner_name">Partner Name *</label>
                        <input type="text" id="partner_name" required>
                    </div>
                    <div class="form-group">
                        <label for="partner_type">Partner Type *</label>
                        <select id="partner_type" required>
                            <option value="business">Business Partner</option>
                            <option value="community">Community Partner</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="partner_logo">Logo</label>
                        <input type="file" id="partner_logo" accept="image/*">
                    </div>
                    <div class="form-group">
                        <label for="partner_website">Website URL</label>
                        <input type="url" id="partner_website" placeholder="https://example.com">
                    </div>
                    <div class="form-group">
                        <label for="partner_instagram">Instagram Username</label>
                        <input type="text" id="partner_instagram" placeholder="username_only">
                    </div>
                    <div class="form-group">
                        <label for="partner_description">Description</label>
                        <textarea id="partner_description" rows="3"></textarea>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="partner_active" checked> Active
                        </label>
                    </div>
                    <div style="display: flex; gap: 1rem;">
                        <button type="submit" class="btn btn-primary">Save Partner</button>
                        <button type="button" class="btn btn-secondary" onclick="closePartnerModal()">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js"></script>
    <script>
        // Initialize Sortable for both grids
        new Sortable(document.getElementById('business-grid'), {
            handle: '.drag-handle',
            animation: 150,
            filter: '.add-partner-card',
            onEnd: function(evt) {
                console.log('Business partners reordered');
            }
        });
        
        new Sortable(document.getElementById('community-grid'), {
            handle: '.drag-handle',
            animation: 150,
            filter: '.add-partner-card',
            onEnd: function(evt) {
                console.log('Community partners reordered');
            }
        });
        
        function showAddPartnerModal(type) {
            document.getElementById('partnerModal').classList.add('show');
            if (type) {
                document.getElementById('partner_type').value = type;
            }
        }
        
        function closePartnerModal() {
            document.getElementById('partnerModal').classList.remove('show');
        }
        
        function filterPartners(type) {
            // Update active tab
            document.querySelectorAll('.filter-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            event.target.classList.add('active');
            
            // Show/hide sections based on filter
            if (type === 'all') {
                document.getElementById('business-partners').style.display = 'block';
                document.getElementById('community-partners').style.display = 'block';
            } else if (type === 'business') {
                document.getElementById('business-partners').style.display = 'block';
                document.getElementById('community-partners').style.display = 'none';
            } else if (type === 'community') {
                document.getElementById('business-partners').style.display = 'none';
                document.getElementById('community-partners').style.display = 'block';
            }
        }
        
        function editPartner(id) {
            // Load partner data and show modal
            showAddPartnerModal();
        }
        
        function togglePartnerStatus(id) {
            // Toggle active/inactive status
            const statusEl = document.querySelector(`[data-id="${id}"] .partner-status`);
            statusEl.classList.toggle('active');
            statusEl.classList.toggle('inactive');
        }
        
        function deletePartner(id) {
            if (confirm('Are you sure you want to delete this partner?')) {
                // Remove card from DOM
                document.querySelector(`[data-id="${id}"]`).remove();
            }
        }
        
        function saveOrder(type) {
            // Get all partner IDs in current order
            const grid = type === 'business' ? 'business-grid' : 'community-grid';
            const cards = document.querySelectorAll(`#${grid} .partner-card:not(.add-partner-card)`);
            const order = Array.from(cards).map(card => card.dataset.id);
            
            console.log('Saving order:', order);
            alert('Partner order saved!');
        }
        
        document.getElementById('partnerForm').addEventListener('submit', function(e) {
            e.preventDefault();
            // Submit form via AJAX
            alert('Partner saved!');
            closePartnerModal();
        });
    </script>
</body>
</html>