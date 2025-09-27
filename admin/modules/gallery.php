<!-- admin/modules/gallery.php -->
<?php
require_once '../config/auth.php';
$auth->requireRole('editor');

$db = Database::getInstance()->getConnection();
$action = $_GET['action'] ?? 'list';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'upload') {
    // Handle file upload
    $uploadedFiles = [];
    $uploadDir = UPLOAD_PATH . 'gallery/';
    
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }
    
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
                    INSERT INTO gallery (title, image_path, thumbnail_path, uploaded_by)
                    VALUES (?, ?, ?, ?)
                ");
                $stmt->execute([
                    $_POST['title'][$key] ?? '',
                    '/uploads/gallery/' . $fileName,
                    '/uploads/gallery/thumb_' . $fileName,
                    $_SESSION['user_id']
                ]);
                
                $uploadedFiles[] = $fileName;
            }
        }
    }
    
    header('Location: gallery.php?success=1');
    exit;
}

$pageTitle = 'Gallery Management';
include '../includes/header.php';
?>

<div class="dashboard-container">
    <?php include '../includes/sidebar.php'; ?>
    
    <main class="main-content">
        <div class="content-header">
            <h1>Gallery Management</h1>
            <button onclick="showUploadModal()" class="btn btn-primary">
                <i class="icon-upload"></i> Upload Photos
            </button>
        </div>
        
        <?php if ($action === 'list'): ?>
        <div class="gallery-grid" id="galleryGrid">
            <?php
            $stmt = $db->query("
                SELECT * FROM gallery 
                WHERE is_active = 1 
                ORDER BY display_order ASC, created_at DESC
            ");
            while ($item = $stmt->fetch()):
            ?>
            <div class="gallery-item" data-id="<?php echo $item['id']; ?>">
                <img src="<?php echo $item['thumbnail_path']; ?>" alt="<?php echo htmlspecialchars($item['title']); ?>">
                <div class="gallery-item-overlay">
                    <h4><?php echo htmlspecialchars($item['title']); ?></h4>
                    <div class="gallery-actions">
                        <button onclick="editGalleryItem(<?php echo $item['id']; ?>)" class="btn-icon">
                            <i class="icon-edit"></i>
                        </button>
                        <button onclick="deleteGalleryItem(<?php echo $item['id']; ?>)" class="btn-icon btn-danger">
                            <i class="icon-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="drag-handle">⋮⋮</div>
            </div>
            <?php endwhile; ?>
        </div>
        <?php endif; ?>
    </main>
</div>

<!-- Upload Modal -->
<div id="uploadModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h2>Upload Photos</h2>
            <button onclick="closeUploadModal()" class="close">&times;</button>
        </div>
        <form action="gallery.php?action=upload" method="POST" enctype="multipart/form-data">
            <div class="dropzone" id="dropzone">
                <p>Drag & drop photos here or click to browse</p>
                <input type="file" name="images[]" id="fileInput" multiple accept="image/*" hidden>
            </div>
            <div id="preview-container"></div>
            <button type="submit" class="btn btn-primary">Upload All</button>
        </form>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js"></script>
<script>
// Drag and drop reordering
const galleryGrid = document.getElementById('galleryGrid');
if (galleryGrid) {
    new Sortable(galleryGrid, {
        animation: 150,
        handle: '.drag-handle',
        onEnd: function(evt) {
            const items = Array.from(galleryGrid.children).map((item, index) => ({
                id: item.dataset.id,
                order: index
            }));
            
            fetch('../api/gallery-reorder.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({items})
            });
        }
    });
}

// Dropzone functionality
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const previewContainer = document.getElementById('preview-container');

dropzone.addEventListener('click', () => fileInput.click());
dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
});
dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
});
dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
});

fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

function handleFiles(files) {
    Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = document.createElement('div');
                preview.className = 'preview-item';
                preview.innerHTML = `
                    <img src="${e.target.result}" alt="">
                    <input type="text" name="title[]" placeholder="Title (optional)">
                    <button type="button" onclick="this.parentElement.remove()">Remove</button>
                `;
                previewContainer.appendChild(preview);
            };
            reader.readAsDataURL(file);
        }
    });
}
</script>

<?php include '../includes/footer.php'; ?>