<?php
// index.php - Main homepage converted to dynamic PHP
require_once 'admin/config/database.php';
$db = Database::getInstance()->getConnection();

// Fetch dynamic content
$events = $db->query("
    SELECT * FROM events 
    WHERE status = 'upcoming' AND event_date >= NOW() 
    ORDER BY event_date ASC LIMIT 3
")->fetchAll();

$gallery = $db->query("
    SELECT * FROM gallery 
    WHERE is_active = 1 
    ORDER BY display_order ASC, created_at DESC LIMIT 6
")->fetchAll();

$testimonials = $db->query("
    SELECT * FROM testimonials 
    WHERE is_active = 1 AND is_featured = 1 
    ORDER BY created_at DESC LIMIT 3
")->fetchAll();

$businessPartners = $db->query("
    SELECT * FROM partners 
    WHERE type = 'business' AND is_active = 1 
    ORDER BY display_order ASC
")->fetchAll();

$communityPartners = $db->query("
    SELECT * FROM partners 
    WHERE type = 'community' AND is_active = 1 
    ORDER BY display_order ASC
")->fetchAll();

// Get site settings
$settings = [];
$stmt = $db->query("SELECT setting_key, setting_value FROM site_settings");
while ($row = $stmt->fetch()) {
    $settings[$row['setting_key']] = $row['setting_value'];
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($settings['site_title'] ?? 'Komunitas Chinese Indonesia'); ?> - Unity in Diversity</title>
    <meta name="description" content="<?php echo htmlspecialchars($settings['site_description'] ?? 'Komunitas Chinese Indonesia - Wadah persaudaraan dan pelestarian budaya Tionghoa di Indonesia'); ?>">
    <link rel="stylesheet" href="style.css">
    <?php if (!empty($settings['google_analytics'])): ?>
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=<?php echo $settings['google_analytics']; ?>"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '<?php echo $settings['google_analytics']; ?>');
    </script>
    <?php endif; ?>
</head>
<body>
    <!-- Pattern Overlay -->
    <div class="pattern-overlay"></div>

    <!-- Loading Screen -->
    <div class="loader" id="loader">
        <div class="loader-spinner"></div>
    </div>

    <!-- Header -->
    <header id="header">
        <nav class="container nav-container">
            <div class="logo-section">
                <div class="logo-text">
                    <span class="logo-main">KCI</span>
                    <span class="logo-sub">Komunitas Chinese Indonesia</span>
                </div>
            </div>

            <ul class="nav-menu" id="navMenu">
                <li><a href="#beranda" class="nav-link">Beranda</a></li>
                <li><a href="#visi-misi" class="nav-link">Visi Misi</a></li>
                <li><a href="tentang_kci.php" class="nav-link">Tentang</a></li>
                <li><a href="#acara" class="nav-link">Acara</a></li>
                <li><a href="galeri.php" class="nav-link">Galeri</a></li>
                <li><a href="#testimoni" class="nav-link">Testimoni</a></li>
                <li><a href="#kontak" class="nav-link">Kontak</a></li>
                <li><a href="#sponsor" class="nav-link">Partner</a></li>
                <li><a href="/blog/" class="nav-link">Artikel</a></li>
                <li><a href="member-login.php" class="nav-link">Member Area</a></li>
                <li><button class="theme-toggle" id="themeToggle">🌓</button></li>
            </ul>

            <div class="menu-toggle" id="menuToggle">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </nav>
    </header>

    <!-- Hero Section -->
    <section class="hero" id="beranda">
        <div class="container hero-content">
            <div class="chinese-border"></div>
            <h1>Komunitas Chinese Indonesia</h1>
            <p class="hero-subtitle"><?php echo htmlspecialchars($settings['site_tagline'] ?? '文化连心，共创未来'); ?></p>
            <a href="member-register.php" class="cta-button">Bergabung Bersama Kami</a>
        </div>
    </section>

    <!-- Events Section -->
    <section class="section" id="acara">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Acara & Kegiatan</h2>
                <div class="chinese-border"></div>
                <p class="section-subtitle">Berbagai kegiatan komunitas yang mempererat persaudaraan</p>
            </div>

            <?php if (empty($events)): ?>
            <div class="events-placeholder">
                <p>Acara dan kegiatan akan segera diperbarui</p>
                <p>Pantau terus perkembangan terbaru dari komunitas kami</p>
            </div>
            <?php else: ?>
            <div class="events-grid">
                <?php foreach ($events as $event): ?>
                <div class="event-card">
                    <?php if ($event['image']): ?>
                    <img src="<?php echo htmlspecialchars($event['image']); ?>" 
                         alt="<?php echo htmlspecialchars($event['title']); ?>"
                         loading="lazy">
                    <?php endif; ?>
                    <div class="event-content">
                        <h3><?php echo htmlspecialchars($event['title']); ?></h3>
                        <p><?php echo htmlspecialchars($event['description']); ?></p>
                        <div class="event-meta">
                            <span>📅 <?php echo date('d M Y', strtotime($event['event_date'])); ?></span>
                            <span>📍 <?php echo htmlspecialchars($event['location']); ?></span>
                            <?php if ($event['max_participants']): ?>
                            <span>👥 <?php echo $event['current_participants'] . '/' . $event['max_participants']; ?></span>
                            <?php endif; ?>
                        </div>
                        <?php if ($event['registration_link']): ?>
                        <a href="<?php echo htmlspecialchars($event['registration_link']); ?>" 
                           class="btn-register" target="_blank">Daftar Sekarang</a>
                        <?php endif; ?>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
            <div style="text-align: center; margin-top: 2rem;">
                <a href="events.php" class="btn btn-secondary">Lihat Semua Acara</a>
            </div>
            <?php endif; ?>
        </div>
    </section>

    <!-- Gallery Section -->
    <?php if (!empty($gallery)): ?>
    <section class="section section-alt" id="galeri-preview">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Galeri Komunitas</h2>
                <div class="chinese-border"></div>
                <p class="section-subtitle">Momen-momen berharga dalam perjalanan komunitas kami</p>
            </div>

            <div class="gallery-grid-preview">
                <?php foreach ($gallery as $item): ?>
                <div class="gallery-item" data-title="<?php echo htmlspecialchars($item['title']); ?>">
                    <img src="<?php echo htmlspecialchars($item['thumbnail_path'] ?: $item['image_path']); ?>" 
                         alt="<?php echo htmlspecialchars($item['title']); ?>"
                         loading="lazy"
                         onclick="openLightbox('<?php echo htmlspecialchars($item['image_path']); ?>')">
                    <?php if ($item['title']): ?>
                    <div class="gallery-overlay">
                        <p><?php echo htmlspecialchars($item['title']); ?></p>
                    </div>
                    <?php endif; ?>
                </div>
                <?php endforeach; ?>
            </div>
            
            <div style="text-align: center; margin-top: 2rem;">
                <a href="galeri.php" class="btn btn-primary">Lihat Semua Foto</a>
            </div>
        </div>
    </section>
    <?php endif; ?>

    <!-- Testimonials Section -->
    <?php if (!empty($testimonials)): ?>
    <section class="section" id="testimoni">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Testimoni Anggota</h2>
                <div class="chinese-border"></div>
                <p class="section-subtitle">Cerita dan pengalaman dari anggota komunitas kami</p>
            </div>

            <div class="testimonials-grid">
                <?php foreach ($testimonials as $testimonial): ?>
                <div class="testimonial-card">
                    <div class="testimonial-content">
                        <div class="quote-icon">"</div>
                        <p><?php echo htmlspecialchars($testimonial['content']); ?></p>
                    </div>
                    <div class="testimonial-author">
                        <?php if ($testimonial['photo']): ?>
                        <img src="<?php echo htmlspecialchars($testimonial['photo']); ?>" 
                             alt="<?php echo htmlspecialchars($testimonial['name']); ?>"
                             class="author-photo">
                        <?php endif; ?>
                        <div>
                            <h4><?php echo htmlspecialchars($testimonial['name']); ?></h4>
                            <?php if ($testimonial['position']): ?>
                            <p><?php echo htmlspecialchars($testimonial['position']); ?></p>
                            <?php endif; ?>
                            <?php if ($testimonial['rating']): ?>
                            <div class="rating">
                                <?php for ($i = 0; $i < $testimonial['rating']; $i++): ?>
                                ⭐
                                <?php endfor; ?>
                            </div>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
    <?php else: ?>
    <section class="section" id="testimoni">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Testimoni Anggota</h2>
                <div class="chinese-border"></div>
                <p class="section-subtitle">Cerita dan pengalaman dari anggota komunitas kami</p>
            </div>
            <div class="testimonials-placeholder">
                <p>Testimoni dari anggota akan segera ditampilkan</p>
                <p>Bagikan pengalaman Anda bersama KCI</p>
            </div>
        </div>
    </section>
    <?php endif; ?>

    <!-- Partners Section -->
    <section class="section" id="sponsor">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Partners</h2>
                <div class="chinese-border"></div>
                <p class="section-subtitle">Terima kasih kepada mitra yang mendukung komunitas kami</p>
            </div>

            <!-- Business Partners -->
            <?php if (!empty($businessPartners)): ?>
            <div class="sponsor-section">
                <h3 class="sponsor-category-title">📚 Business Partners</h3>
                <div class="sponsor-carousel-container">
                    <button class="carousel-btn carousel-btn-left" id="businessLeft">‹</button>
                    <div class="sponsor-carousel" id="businessCarousel">
                        <div class="sponsor-track">
                            <?php foreach ($businessPartners as $partner): ?>
                            <a class="sponsor-card" 
                               <?php if ($partner['website']): ?>href="<?php echo htmlspecialchars($partner['website']); ?>"<?php endif; ?>
                               <?php if ($partner['instagram']): ?>href="https://instagram.com/<?php echo htmlspecialchars($partner['instagram']); ?>"<?php endif; ?>
                               target="_blank" rel="noopener noreferrer">
                                <div class="sponsor-logo">
                                    <?php if ($partner['logo']): ?>
                                    <img src="<?php echo htmlspecialchars($partner['logo']); ?>" 
                                         alt="<?php echo htmlspecialchars($partner['name']); ?>" 
                                         loading="lazy">
                                    <?php endif; ?>
                                </div>
                                <h4 class="sponsor-name"><?php echo htmlspecialchars($partner['name']); ?></h4>
                            </a>
                            <?php endforeach; ?>
                        </div>
                    </div>
                    <button class="carousel-btn carousel-btn-right" id="businessRight">›</button>
                </div>
            </div>
            <?php endif; ?>

            <!-- Community Partners -->
            <?php if (!empty($communityPartners)): ?>
            <div class="sponsor-section">
                <h3 class="sponsor-category-title">🤝 Community Partners</h3>
                <div class="sponsor-carousel-container">
                    <button class="carousel-btn carousel-btn-left" id="communityLeft">‹</button>
                    <div class="sponsor-carousel" id="communityCarousel">
                        <div class="sponsor-track">
                            <?php foreach ($communityPartners as $partner): ?>
                            <a class="sponsor-card" 
                               <?php if ($partner['website']): ?>href="<?php echo htmlspecialchars($partner['website']); ?>"<?php endif; ?>
                               <?php if ($partner['instagram']): ?>href="https://instagram.com/<?php echo htmlspecialchars($partner['instagram']); ?>"<?php endif; ?>
                               target="_blank" rel="noopener noreferrer">
                                <div class="sponsor-logo">
                                    <?php if ($partner['logo']): ?>
                                    <img src="<?php echo htmlspecialchars($partner['logo']); ?>" 
                                         alt="<?php echo htmlspecialchars($partner['name']); ?>" 
                                         loading="lazy">
                                    <?php endif; ?>
                                </div>
                                <h4 class="sponsor-name"><?php echo htmlspecialchars($partner['name']); ?></h4>
                            </a>
                            <?php endforeach; ?>
                        </div>
                    </div>
                    <button class="carousel-btn carousel-btn-right" id="communityRight">›</button>
                </div>
            </div>
            <?php endif; ?>
        </div>
    </section>

    <!-- Contact Section -->
    <section class="section section-alt" id="kontak">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Hubungi Kami</h2>
                <div class="chinese-border"></div>
                <p class="section-subtitle">Terhubung langsung dengan pengurus komunitas</p>
            </div>

            <div class="contact-grid">
                <div class="contact-card">
                    <div class="contact-avatar">
                        <img src="/assets/profile/founder-profile.jpg" alt="Founder KCI" loading="lazy">
                    </div>
                    <h3>Founder KCI</h3>
                    <p>Hubungi pendiri komunitas untuk informasi lebih lanjut tentang visi dan misi KCI</p>
                    <a href="https://wa.me/62<?php echo preg_replace('/[^0-9]/', '', $settings['founder_phone'] ?? '87884924385'); ?>" 
                       target="_blank" class="btn-whatsapp">Hubungi via WhatsApp</a>
                </div>

                <div class="contact-card">
                    <div class="contact-avatar">
                        <img src="/assets/profile/admin-kci-profile.jpg" alt="Admin KCI" loading="lazy">
                    </div>
                    <h3>Admin KCI</h3>
                    <p>Kontak admin untuk keperluan administrasi, pendaftaran, dan informasi kegiatan</p>
                    <a href="https://wa.me/62<?php echo preg_replace('/[^0-9]/', '', $settings['admin_phone'] ?? '85641877775'); ?>" 
                       target="_blank" class="btn-whatsapp">Hubungi via WhatsApp</a>
                </div>
            </div>

            <!-- Contact Form -->
            <div class="contact-form-section" style="margin-top: 3rem;">
                <h3 style="text-align: center; margin-bottom: 2rem;">Atau Kirim Pesan</h3>
                <form id="contactForm" class="contact-form" style="max-width: 600px; margin: 0 auto;">
                    <div class="form-group">
                        <input type="text" name="name" placeholder="Nama Lengkap" required>
                    </div>
                    <div class="form-group">
                        <input type="email" name="email" placeholder="Email" required>
                    </div>
                    <div class="form-group">
                        <input type="tel" name="phone" placeholder="Nomor Telepon">
                    </div>
                    <div class="form-group">
                        <input type="text" name="subject" placeholder="Subjek" required>
                    </div>
                    <div class="form-group">
                        <textarea name="message" rows="5" placeholder="Pesan Anda" required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Kirim Pesan</button>
                </form>
            </div>
        </div>
    </section>

    <!-- Registration CTA -->
    <section class="section" style="background: linear-gradient(135deg, var(--primary-red), var(--deep-red)); color: white; text-align: center;">
        <div class="container">
            <h2 style="color: white; font-size: 2.5rem; margin-bottom: 1rem;">Bergabunglah Dengan Kami</h2>
            <div class="chinese-border" style="background: white; margin-bottom: 2rem;"></div>
            <p style="max-width: 600px; margin: 0 auto 2rem; font-size: 1.2rem;">
                Mari bersama membangun komunitas yang solid dan berkontribusi positif untuk kemajuan Indonesia
            </p>
            <a href="member-register.php" class="cta-button" style="background: white; color: var(--primary-red);">
                Daftar Sekarang
            </a>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>Komunitas Chinese Indonesia</h3>
                    <p><?php echo htmlspecialchars($settings['site_tagline'] ?? '文化连心，共创未来'); ?></p>
                </div>

                <div class="footer-section">
                    <h3>Tautan Cepat</h3>
                    <p><a href="#visi-misi">Visi & Misi</a></p>
                    <p><a href="#acara">Acara</a></p>
                    <p><a href="galeri.php">Galeri</a></p>
                    <p><a href="#kontak">Kontak</a></p>
                </div>

                <div class="footer-section">
                    <h3>Hubungi Kami</h3>
                    <p>Founder: <?php echo htmlspecialchars($settings['founder_phone'] ?? '0878-8492-4385'); ?></p>
                    <p>Admin: <?php echo htmlspecialchars($settings['admin_phone'] ?? '0856-4187-7775'); ?></p>
                    <p>Instagram: @<?php echo htmlspecialchars($settings['instagram'] ?? 'komunitaschineseindonesia'); ?></p>
                </div>
            </div>

            <div class="footer-bottom">
                <p>&copy; <?php echo date('Y'); ?> Komunitas Chinese Indonesia. All rights reserved.</p>
                <p>Unity in Diversity - Bhinneka Tunggal Ika</p>
            </div>
        </div>
    </footer>

    <!-- Scroll to Top Button -->
    <button class="scroll-top" id="scrollTop">↑</button>

    <!-- Lightbox for Gallery -->
    <div id="lightbox" class="lightbox" onclick="closeLightbox()">
        <img src="" alt="" id="lightboxImage">
        <span class="lightbox-close">&times;</span>
    </div>

    <script src="script.js"></script>
    <script>
        // Contact form handler
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            
            fetch('api/public/contact-submit.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Pesan Anda telah terkirim. Terima kasih!');
                    this.reset();
                } else {
                    alert('Terjadi kesalahan. Silakan coba lagi.');
                }
            })
            .catch(error => {
                alert('Terjadi kesalahan. Silakan coba lagi.');
            });
        });
        
        // Lightbox functions
        function openLightbox(imageSrc) {
            document.getElementById('lightbox').style.display = 'block';
            document.getElementById('lightboxImage').src = imageSrc;
        }
        
        function closeLightbox() {
            document.getElementById('lightbox').style.display = 'none';
        }
    </script>
</body>
</html>