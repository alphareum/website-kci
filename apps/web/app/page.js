import './marketing.css';
import { EventsSection } from '../components/public/EventsSection';
import { TestimonialsSection } from '../components/public/TestimonialsSection';
import { PartnersSection } from '../components/public/PartnersSection';
import { SocialLinks } from '../components/public/SocialLinks';

export const metadata = {
  title: 'Komunitas Chinese Indonesia',
  description:
    'Komunitas Chinese Indonesia (KCI) menjadi wadah kolaborasi lintas generasi untuk melestarikan budaya Tionghoa-Indonesia dan berkontribusi bagi masyarakat.',
};

export default function HomePage() {
  return (
    <main className="site">
      <header className="site-header">
        <div className="site-container">
          <div className="site-brand">
            <span className="site-brand__title">KCI</span>
            <span className="site-brand__subtitle">Komunitas Chinese Indonesia</span>
          </div>
          <nav className="site-nav">
            <a href="#visi-misi">Visi Misi</a>
            <a href="#acara">Acara</a>
            <a href="#testimoni">Testimoni</a>
            <a href="#hubungi">Kontak</a>
            <a className="site-nav__cta" href="https://bit.ly/3TwZt9W" target="_blank" rel="noopener noreferrer">
              Bergabung
            </a>
          </nav>
        </div>
      </header>

      <section className="site-hero" id="beranda">
        <div className="site-container site-hero__grid">
          <div className="site-hero__content">
            <p className="site-eyebrow">Unity in Diversity</p>
            <h1>Komunitas Chinese Indonesia</h1>
            <p className="site-hero__subtitle">
              Ruang kolaborasi lintas generasi untuk berkarya, melestarikan budaya, dan berdampak bagi masyarakat.
            </p>
            <div className="site-hero__actions">
              <a
                className="site-button"
                href="https://docs.google.com/forms/d/e/1FAIpQLSfVtN0rFgoPdWteWijMsZWXXyFtaxdJvavjaPNhC4OZ5kBDeg/viewform"
                target="_blank"
                rel="noopener noreferrer"
              >
                Daftar Anggota
              </a>
              <a className="site-button site-button--ghost" href="#acara">
                Lihat Kegiatan
              </a>
            </div>
          </div>
          <div className="site-hero__card">
            <div className="site-hero__stat">
              <span className="site-hero__stat-number">50+</span>
              <span className="site-hero__stat-label">Relawan aktif</span>
            </div>
            <div className="site-hero__stat">
              <span className="site-hero__stat-number">12</span>
              <span className="site-hero__stat-label">Kegiatan bulanan</span>
            </div>
            <div className="site-hero__stat">
              <span className="site-hero__stat-number">8</span>
              <span className="site-hero__stat-label">Kota kolaborasi</span>
            </div>
          </div>
        </div>
      </section>

      <section className="site-section site-section--muted" id="visi-misi">
        <div className="site-section__inner">
          <div className="site-section-heading">
            <p className="site-eyebrow">Arah Gerak Komunitas</p>
            <h2>Visi &amp; Misi</h2>
            <p className="site-section-heading__description">
              Membangun komunitas yang harmonis, inklusif, dan berdampak melalui pelestarian budaya, kolaborasi, dan pelayanan.
            </p>
          </div>
          <div className="site-values-grid">
            <article className="site-value-card">
              <h3>Pelestarian Budaya</h3>
              <p>Merawat identitas Tionghoa-Indonesia melalui seni, tradisi, dan perayaan komunitas.</p>
            </article>
            <article className="site-value-card">
              <h3>Pemberdayaan Sosial</h3>
              <p>Berjejaring dengan komunitas dan lembaga sosial untuk menghadirkan program kemanusiaan.</p>
            </article>
            <article className="site-value-card">
              <h3>Pengembangan Generasi Muda</h3>
              <p>Menyediakan ruang belajar, kepemimpinan, dan kewirausahaan bagi generasi penerus.</p>
            </article>
          </div>
        </div>
      </section>

      <EventsSection />
      <TestimonialsSection />
      <PartnersSection />

      <section className="site-section" id="hubungi">
        <div className="site-section__inner site-contact">
          <div className="site-contact__content">
            <div className="site-section-heading">
              <p className="site-eyebrow">Terhubung dengan KCI</p>
              <h2>Hubungi Kami</h2>
              <p className="site-section-heading__description">
                Kami terbuka untuk kolaborasi komunitas, kemitraan bisnis, dan dukungan program sosial.
              </p>
            </div>
            <ul className="site-contact__list">
              <li>
                <span className="site-contact__label">Founder</span>
                <a href="https://wa.me/6287884924385" target="_blank" rel="noopener noreferrer">
                  +62 878-8492-4385
                </a>
              </li>
              <li>
                <span className="site-contact__label">Admin</span>
                <a href="https://wa.me/6285641877775" target="_blank" rel="noopener noreferrer">
                  +62 856-4187-7775
                </a>
              </li>
              <li>
                <span className="site-contact__label">Email</span>
                <a href="mailto:hello@kci.or.id">hello@kci.or.id</a>
              </li>
            </ul>
            <SocialLinks className="site-contact__social" />
          </div>
          <div className="site-contact__card">
            <h3>Siap Berkontribusi?</h3>
            <p>
              Daftar sebagai relawan atau mitra program dan dapatkan pembaruan kegiatan langsung ke email Anda.
            </p>
            <a className="site-button" href="https://bit.ly/3TwZt9W" target="_blank" rel="noopener noreferrer">
              Isi formulir bergabung
            </a>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="site-container site-footer__grid">
          <div>
            <p className="site-brand__title">KCI</p>
            <p className="site-brand__subtitle">Komunitas Chinese Indonesia</p>
          </div>
          <div className="site-footer__links">
            <a href="#visi-misi">Visi Misi</a>
            <a href="#acara">Acara</a>
            <a href="#testimoni">Testimoni</a>
            <a href="#hubungi">Kontak</a>
          </div>
          <p className="site-footer__meta">&copy; {new Date().getFullYear()} Komunitas Chinese Indonesia. Semua hak dilindungi.</p>
        </div>
      </footer>
    </main>
  );
}
