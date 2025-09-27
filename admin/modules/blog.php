<?php
require_once '../config/auth.php';
$auth->requireRole('editor');

$db = Database::getInstance()->getConnection();
$action = $_GET['action'] ?? 'list';
$id = $_GET['id'] ?? null;

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'];
    $slug = createSlug($_POST['slug'] ?: $title);
    $content = $_POST['content'];
    $excerpt = $_POST['excerpt'];
    $status = $_POST['status'];
    $category = $_POST['category'];
    $tags = json_encode(explode(',', $_POST['tags']));
    
    if ($action === 'add') {
        $stmt = $db->prepare("
            INSERT INTO blog_posts (title, slug, excerpt, content, category, tags, status, author_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([$title, $slug, $excerpt, $content, $category, $tags, $status, $_SESSION['user_id']]);
    } elseif ($action === 'edit' && $id) {
        $stmt = $db->prepare("
            UPDATE blog_posts 
            SET title = ?, slug = ?, excerpt = ?, content = ?, 
                category = ?, tags = ?, status = ?
            WHERE id = ?
        ");
        $stmt->execute([$title, $slug, $excerpt, $content, $category, $tags, $status, $id]);
    }
    
    header('Location: blog.php?success=1');
    exit;
}

function createSlug($string) {
    return strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $string), '-'));
}

$pageTitle = 'Blog Management';
include '../includes/header.php';
?>

<div class="dashboard-container">
    <?php include '../includes/sidebar.php'; ?>
    
    <main class="main-content">
        <?php if ($action === 'list'): ?>
        <div class="content-header">
            <h1>Blog Posts</h1>
            <a href="blog.php?action=add" class="btn btn-primary">
                <i class="icon-plus"></i> New Post
            </a>
        </div>
        
        <div class="data-table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Author</th>
                        <th>Status</th>
                        <th>Views</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $stmt = $db->query("
                        SELECT p.*, u.full_name as author_name
                        FROM blog_posts p
                        LEFT JOIN users u ON p.author_id = u.id
                        ORDER BY p.created_at DESC
                    ");
                    while ($post = $stmt->fetch()):
                    ?>
                    <tr>
                        <td><?php echo htmlspecialchars($post['title']); ?></td>
                        <td><?php echo htmlspecialchars($post['category']); ?></td>
                        <td><?php echo htmlspecialchars($post['author_name']); ?></td>
                        <td>
                            <span class="badge badge-<?php echo $post['status']; ?>">
                                <?php echo ucfirst($post['status']); ?>
                            </span>
                        </td>
                        <td><?php echo $post['views']; ?></td>
                        <td><?php echo date('Y-m-d', strtotime($post['created_at'])); ?></td>
                        <td>
                            <a href="blog.php?action=edit&id=<?php echo $post['id']; ?>" class="btn-icon">
                                <i class="icon-edit"></i>
                            </a>
                            <button onclick="deletePost(<?php echo $post['id']; ?>)" class="btn-icon btn-danger">
                                <i class="icon-trash"></i>
                            </button>
                        </td>
                    </tr>
                    <?php endwhile; ?>
                </tbody>
            </table>
        </div>
        
        <?php elseif ($action === 'add' || $action === 'edit'): ?>
        <?php
        $post = null;
        if ($action === 'edit' && $id) {
            $stmt = $db->prepare("SELECT * FROM blog_posts WHERE id = ?");
            $stmt->execute([$id]);
            $post = $stmt->fetch();
        }
        ?>
        
        <div class="content-header">
            <h1><?php echo $action === 'add' ? 'New Blog Post' : 'Edit Blog Post'; ?></h1>
        </div>
        
        <form method="POST" enctype="multipart/form-data" class="content-form">
            <div class="form-grid">
                <div class="form-main">
                    <div class="form-group">
                        <label for="title">Title *</label>
                        <input type="text" id="title" name="title" 
                               value="<?php echo $post ? htmlspecialchars($post['title']) : ''; ?>" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="slug">Slug (URL)</label>
                        <input type="text" id="slug" name="slug" 
                               value="<?php echo $post ? htmlspecialchars($post['slug']) : ''; ?>"
                               placeholder="auto-generated-from-title">
                    </div>
                    
                    <div class="form-group">
                        <label for="excerpt">Excerpt</label>
                        <textarea id="excerpt" name="excerpt" rows="3"><?php echo $post ? htmlspecialchars($post['excerpt']) : ''; ?></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="content">Content *</label>
                        <textarea id="content" name="content" class="tinymce-editor"><?php echo $post ? htmlspecialchars($post['content']) : ''; ?></textarea>
                    </div>
                </div>
                
                <div class="form-sidebar">
                    <div class="form-group">
                        <label for="status">Status</label>
                        <select id="status" name="status">
                            <option value="draft" <?php echo $post && $post['status'] === 'draft' ? 'selected' : ''; ?>>Draft</option>
                            <option value="published" <?php echo $post && $post['status'] === 'published' ? 'selected' : ''; ?>>Published</option>
                            <option value="archived" <?php echo $post && $post['status'] === 'archived' ? 'selected' : ''; ?>>Archived</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="category">Category</label>
                        <select id="category" name="category">
                            <option value="news">News</option>
                            <option value="events">Events</option>
                            <option value="culture">Culture</option>
                            <option value="community">Community</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="tags">Tags (comma-separated)</label>
                        <input type="text" id="tags" name="tags" 
                               value="<?php echo $post && $post['tags'] ? implode(',', json_decode($post['tags'])) : ''; ?>"
                               placeholder="tag1, tag2, tag3">
                    </div>
                    
                    <div class="form-group">
                        <label for="featured_image">Featured Image</label>
                        <input type="file" id="featured_image" name="featured_image" accept="image/*">
                        <?php if ($post && $post['featured_image']): ?>
                        <img src="<?php echo $post['featured_image']; ?>" alt="" class="current-image">
                        <?php endif; ?>
                    </div>
                </div>
            </div>
            
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">
                    <?php echo $action === 'add' ? 'Publish Post' : 'Update Post'; ?>
                </button>
                <a href="blog.php" class="btn btn-secondary">Cancel</a>
            </div>
        </form>
        <?php endif; ?>
    </main>
</div>

<script src="https://cdn.tiny.cloud/1/YOUR_API_KEY/tinymce/6/tinymce.min.js"></script>
<script>
tinymce.init({
    selector: '.tinymce-editor',
    height: 500,
    plugins: [
        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
        'insertdatetime', 'media', 'table', 'help', 'wordcount'
    ],
    toolbar: 'undo redo | blocks | bold italic backcolor | alignleft aligncenter ' +
             'alignright alignjustify | bullist numlist outdent indent | removeformat | help',
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'
});
</script>

<?php include '../includes/footer.php'; ?>