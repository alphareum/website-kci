<!-- admin/modules/testimonials.php -->
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Testimonials Management - KCI Admin</title>
    <link rel="stylesheet" href="../assets/css/admin.css">
    <style>
        .testimonials-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }
        
        .testimonial-card {
            background: white;
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            position: relative;
            transition: all 0.3s;
        }
        
        .testimonial-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 15px rgba(0,0,0,0.15);
        }
        
        .testimonial-featured {
            border: 2px solid #800020;
        }
        
        .featured-badge {
            position: absolute;
            top: 10px;
            right: 10px;
            background: #800020;
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
        }
        
        .testimonial-content {
            color: #666;
            font-style: italic;
            line-height: 1.6;
            margin-bottom: 1rem;
            position: relative;
            padding-left: 2rem;
        }
        
        .testimonial-content::before {
            content: '"';
            position: absolute;
            left: 0;
            top: -10px;
            font-size: 3rem;
            color: #800020;
            opacity: 0.3;
        }
        
        .testimonial-author {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid #e9ecef;
        }
        
        .author-photo {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            object-fit: cover;
            background: #f0f0f0;
        }
        
        .author-info h4 {
            margin: 0;
            color: #333;
            font-size: 1rem;
        }
        
        .author-info p {
            margin: 0;
            color: #999;
            font-size: 0.85rem;
        }
        
        .testimonial-rating {
            display: flex;
            gap: 0.25rem;
            margin-top: 0.5rem;
        }
        
        .star {
            color: #ffc107;
            font-size: 1rem;
        }
        
        .testimonial-actions {
            display: flex;
            gap: 0.5rem;
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid #e9ecef;
        }
        
        .testimonial-status {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 1rem;
        }
        
        .status-toggle {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 24px;
        }
        
        .status-toggle input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        
        .status-slider {
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
        
        .status-slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }
        
        input:checked + .status-slider {
            background-color: #28a745;
        }
        
        input:checked + .status-slider:before {
            transform: translateX(26px);
        }
        
        /* Add/Edit Form Modal */
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
        }
        
        .modal.show {
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
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: #333;
        }
        
        .form-group input,
        .form-group textarea,
        .form-group select {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 1rem;
        }
        
        .form-group textarea {
            resize: vertical;
        }
        
        .rating-input {
            display: flex;
            gap: 0.5rem;
        }
        
        .rating-input .star-btn {
            background: none;
            border: none;
            font-size: 1.5rem;
            color: #ddd;
            cursor: pointer;
            transition: color 0.3s;
        }
        
        .rating-input .star-btn:hover,
        .rating-input .star-btn.active {
            color: #ffc107;
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
                <li><a href="testimonials.php" class="active">💬 Testimonials</a></li>
                <li><a href="partners.php">🤝 Partners</a></li>
                <li><a href="members.php">👥 Members</a></li>
                <li><a href="users.php">👤 Users</a></li>
                <li><a href="settings.php">⚙️ Settings</a></li>
                <li><a href="../logout.php">🚪 Logout</a></li>
            </ul>
        </aside>
        
        <main class="main-content">
            <div class="content-header">
                <h1>Testimonials Management</h1>
                <button class="btn btn-primary" onclick="showAddModal()">
                    + Add Testimonial
                </button>
            </div>
            
            <div class="testimonials-grid">
                <!-- Testimonial Card 1 -->
                <div class="testimonial-card testimonial-featured">
                    <span class="featured-badge">Featured</span>
                    <div class="testimonial-status">
                        <label class="status-toggle">
                            <input type="checkbox" checked onchange="toggleStatus(1)">
                            <span class="status-slider"></span>
                        </label>
                        <span>Active</span>
                    </div>
                    <div class="testimonial-content">
                        KCI telah menjadi rumah kedua bagi saya. Komunitas yang hangat dan penuh dukungan membuat saya merasa benar-benar menjadi bagian dari keluarga besar.
                    </div>
                    <div class="testimonial-rating">
                        <span class="star">⭐</span>
                        <span class="star">⭐</span>
                        <span class="star">⭐</span>
                        <span class="star">⭐</span>
                        <span class="star">⭐</span>
                    </div>
                    <div class="testimonial-author">
                        <img src="/assets/profile/default-avatar.jpg" alt="Author" class="author-photo">
                        <div class="author-info">
                            <h4>Linda Wijaya</h4>
                            <p>Member since 2024</p>
                        </div>
                    </div>
                    <div class="testimonial-actions">
                        <button class="btn btn-sm" onclick="editTestimonial(1)">✏️ Edit</button>
                        <button class="btn btn-sm" onclick="toggleFeatured(1)">⭐ Featured</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteTestimonial(1)">🗑️ Delete</button>
                    </div>
                </div>
                
                <!-- Testimonial Card 2 -->
                <div class="testimonial-card">
                    <div class="testimonial-status">
                        <label class="status-toggle">
                            <input type="checkbox" checked onchange="toggleStatus(2)">
                            <span class="status-slider"></span>
                        </label>
                        <span>Active</span>
                    </div>
                    <div class="testimonial-content">
                        Bergabung dengan KCI memberikan saya kesempatan untuk melestarikan budaya leluhur sambil berkontribusi untuk masyarakat Indonesia.
                    </div>
                    <div class="testimonial-rating">
                        <span class="star">⭐</span>
                        <span class="star">⭐</span>
                        <span class="star">⭐</span>
                        <span class="star">⭐</span>
                        <span class="star">⭐</span>
                    </div>
                    <div class="testimonial-author">
                        <img src="/assets/profile/default-avatar.jpg" alt="Author" class="author-photo">
                        <div class="author-info">
                            <h4>David Chen</h4>
                            <p>Business Owner</p>
                        </div>
                    </div>
                    <div class="testimonial-actions">
                        <button class="btn btn-sm" onclick="editTestimonial(2)">✏️ Edit</button>
                        <button class="btn btn-sm" onclick="toggleFeatured(2)">⭐ Feature</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteTestimonial(2)">🗑️ Delete</button>
                    </div>
                </div>
                
                <!-- Add more testimonial cards as needed -->
            </div>
        </main>
    </div>
    
    <!-- Add/Edit Testimonial Modal -->
    <div id="testimonialModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Add Testimonial</h2>
                <button onclick="closeModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">×</button>
            </div>
            <div class="modal-body">
                <form id="testimonialForm">
                    <div class="form-group">
                        <label for="name">Name *</label>
                        <input type="text" id="name" required>
                    </div>
                    <div class="form-group">
                        <label for="position">Position/Title</label>
                        <input type="text" id="position" placeholder="e.g., Business Owner, Member since 2024">
                    </div>
                    <div class="form-group">
                        <label for="content">Testimonial Content *</label>
                        <textarea id="content" rows="4" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Rating</label>
                        <div class="rating-input">
                            <button type="button" class="star-btn" onclick="setRating(1)">⭐</button>
                            <button type="button" class="star-btn" onclick="setRating(2)">⭐</button>
                            <button type="button" class="star-btn" onclick="setRating(3)">⭐</button>
                            <button type="button" class="star-btn" onclick="setRating(4)">⭐</button>
                            <button type="button" class="star-btn" onclick="setRating(5)">⭐</button>
                        </div>
                        <input type="hidden" id="rating" value="5">
                    </div>
                    <div class="form-group">
                        <label for="photo">Photo</label>
                        <input type="file" id="photo" accept="image/*">
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="is_featured"> Feature this testimonial
                        </label>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="is_active" checked> Active
                        </label>
                    </div>
                    <div style="display: flex; gap: 1rem;">
                        <button type="submit" class="btn btn-primary">Save Testimonial</button>
                        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    
    <script>
        let currentRating = 5;
        
        function showAddModal() {
            document.getElementById('testimonialModal').classList.add('show');
        }
        
        function closeModal() {
            document.getElementById('testimonialModal').classList.remove('show');
        }
        
        function setRating(rating) {
            currentRating = rating;
            document.getElementById('rating').value = rating;
            
            const stars = document.querySelectorAll('.star-btn');
            stars.forEach((star, index) => {
                if (index < rating) {
                    star.classList.add('active');
                } else {
                    star.classList.remove('active');
                }
            });
        }
        
        function toggleStatus(id) {
            // AJAX call to toggle status
            console.log('Toggling status for testimonial ' + id);
        }
        
        function editTestimonial(id) {
            // Load testimonial data and show modal
            showAddModal();
        }
        
        function toggleFeatured(id) {
            if (confirm('Toggle featured status for this testimonial?')) {
                // AJAX call to toggle featured
                console.log('Toggling featured for testimonial ' + id);
            }
        }
        
        function deleteTestimonial(id) {
            if (confirm('Are you sure you want to delete this testimonial?')) {
                // AJAX call to delete
                console.log('Deleting testimonial ' + id);
            }
        }
        
        document.getElementById('testimonialForm').addEventListener('submit', function(e) {
            e.preventDefault();
            // Submit form via AJAX
            alert('Testimonial saved!');
            closeModal();
        });
        
        // Initialize rating display
        setRating(5);
    </script>
</body>
</html>