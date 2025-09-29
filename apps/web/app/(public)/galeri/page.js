import { LegacyShell } from '../../../components/legacy/LegacyShell';
import { GalleryGrid } from '../../../components/legacy/GalleryGrid';

export const metadata = {
  title: 'Galeri — Komunitas Chinese Indonesia',
  description: 'Dokumentasi kegiatan Komunitas Chinese Indonesia (KCI).',
};

const NAV_LINKS = [
  { href: '/#beranda', label: 'Beranda' },
  { href: '/#visi-misi', label: 'Visi Misi' },
  { href: '/tentang_kci', label: 'Tentang' },
  { href: '/#acara', label: 'Acara' },
  { href: '/galeri', label: 'Galeri' },
  { href: '/#testimoni', label: 'Testimoni' },
  { href: '/#kontak', label: 'Kontak' },
  { href: '/#sponsor', label: 'Partner' },
];

export default function GaleriPage() {
  return (
    <LegacyShell navLinks={NAV_LINKS} variant="gallery">
      <section className="hero">
        <div className="container hero-content">
          <div className="chinese-border" />
          <h1>Galeri KCI</h1>
          <p className="hero-subtitle">Dokumentasi kegiatan &amp; kebersamaan komunitas</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '40px', paddingBottom: 0 }}>
        <div className="container" style={{ color: 'var(--gray)', fontSize: '0.95rem' }}>
          <span>
            <a className="nav-link" href="/" style={{ padding: 0, fontWeight: 600 }}>
              Beranda
            </a>{' '}
            › Galeri
          </span>
        </div>
      </section>

      <section className="section section-alt" id="dokumentasi">
        <style>{`
          #dokumentasi img { max-width: 100%; height: auto; transform: none !important; }
          #dokumentasi .gallery-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; }
          #dokumentasi .gallery-card { background: var(--white); border: 1px solid var(--border-color); border-radius: 14px; overflow: hidden; box-shadow: var(--shadow); }
          #dokumentasi .gallery-image { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; display: block; background: var(--light-gray); }
          #dokumentasi .gallery-caption { padding: 14px 16px; color: var(--gray); }
          @media (max-width: 520px) {
            #dokumentasi .gallery-grid { gap: 16px; }
          }
        `}</style>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Dokumentasi</h2>
            <div className="chinese-border" />
            <p className="section-subtitle">Kumpulan momen kegiatan Komunitas Chinese Indonesia</p>
          </div>

          <GalleryGrid />
        </div>
      </section>

      <section
        className="section"
        style={{
          background: 'linear-gradient(135deg, var(--primary-red), var(--deep-red))',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <div className="container">
          <h2 style={{ color: 'white', fontSize: '2.2rem', marginBottom: '1rem' }}>Bergabunglah Dengan Kami</h2>
          <div className="chinese-border" style={{ background: 'white', marginBottom: '1.5rem' }} />
          <p style={{ maxWidth: '680px', margin: '0 auto 1.8rem', fontSize: '1.1rem' }}>
            Jadi bagian dari keluarga KCI, tempat bertumbuh, berkarya, dan berbagi.
          </p>
          <a
            href="https://bit.ly/3TwZt9W"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-button"
            style={{ background: 'white', color: 'var(--primary-red)' }}
          >
            Daftar Sekarang
          </a>
        </div>
      </section>

      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Komunitas Chinese Indonesia</h3>
              <p>文化连心，共创未来</p>
            </div>
            <div className="footer-section">
              <h3>Tautan Cepat</h3>
              <p>
                <a href="/#visi-misi">Visi &amp; Misi</a>
              </p>
              <p>
                <a href="/#acara">Acara</a>
              </p>
              <p>
                <a href="/galeri">Galeri</a>
              </p>
              <p>
                <a href="/#kontak">Kontak</a>
              </p>
            </div>
            <div className="footer-section">
              <h3>Hubungi Kami</h3>
              <p>Founder: 0878-8492-4385</p>
              <p>Admin: 0856-4187-7775</p>
              <p>Instagram: @komunitaschineseindonesia</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Komunitas Chinese Indonesia. All rights reserved.</p>
            <p>Unity in Diversity - Bhinneka Tunggal Ika</p>
          </div>
        </div>
      </footer>
    </LegacyShell>
  );
}
