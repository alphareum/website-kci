'use client';

import useSWR from 'swr';
import { EventsGrid } from '../../components/legacy/EventsGrid';
import { LegacyShell, useLegacyLinkGroups } from '../../components/legacy/LegacyShell';
import { PartnersGrid } from '../../components/legacy/PartnersGrid';
import { SocialLinks } from '../../components/legacy/SocialLinks';
import { TestimonialsGrid } from '../../components/legacy/TestimonialsGrid';
import { apiGet } from '../../lib/api';

const DEFAULT_PRIMARY_LINKS = [
  { href: '#beranda', label: 'Beranda' },
  { href: '#visi-misi', label: 'Visi Misi' },
  { href: '/tentang_kci', label: 'Tentang' },
  { href: '#acara', label: 'Acara' },
  { href: '/galeri', label: 'Galeri' },
  { href: '/blog', label: 'Blog' },
  { href: '#testimoni', label: 'Testimoni' },
  { href: '#kontak', label: 'Kontak' },
  { href: '#sponsor', label: 'Partner' },
];

const DEFAULT_SECONDARY_LINKS = [
  { href: '#visi-misi', label: 'Visi & Misi' },
  { href: '#acara', label: 'Acara' },
  { href: '/galeri', label: 'Galeri' },
  { href: '/blog', label: 'Blog' },
  { href: '#kontak', label: 'Kontak' },
];

const DEFAULT_CONTACTS = [
  {
    id: 'founder',
    name: 'Founder KCI',
    role: 'Pendiri Komunitas',
    phone: '+62 878-8492-4385',
    whatsapp_url: 'https://wa.me/6287884924385',
    photo_url: '/assets/profile/founder-profile.jpg',
  },
  {
    id: 'admin',
    name: 'Admin KCI',
    role: 'Administrasi & Informasi Kegiatan',
    phone: '+62 856-4187-7775',
    whatsapp_url: 'https://wa.me/6285641877775',
    photo_url: '/assets/profile/admin-kci-profile.jpg',
  },
];

function toTelHref(phone = '') {
  return phone.replace(/[^0-9+]/g, '');
}

function isExternalHref(href = '') {
  return /^https?:/i.test(href);
}

function FooterLink({ href, label }) {
  if (!href || !label) {
    return null;
  }

  if (isExternalHref(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    );
  }

  return <a href={href}>{label}</a>;
}

export function HomePageClient() {
  const { groups } = useLegacyLinkGroups();
  const primaryGroup = groups?.primary ?? [];
  const secondaryGroup = groups?.secondary ?? [];
  const { data: contactsData } = useSWR('/contacts', () => apiGet('/contacts'));
  const contacts = contactsData?.contacts ?? [];
  const contactCards = contacts.length > 0 ? contacts : DEFAULT_CONTACTS;

  const navLinks = primaryGroup.length > 0 ? primaryGroup : DEFAULT_PRIMARY_LINKS;
  const footerLinks = secondaryGroup.length > 0 ? secondaryGroup : DEFAULT_SECONDARY_LINKS;

  return (
    <LegacyShell navLinks={navLinks} variant="home">
      <section className="hero" id="beranda">
        <div className="container hero-content">
          <div className="chinese-border" />
          <h1>Komunitas Chinese Indonesia</h1>
          <p className="hero-subtitle">文化连心，共创未来</p>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSfVtN0rFgoPdWteWijMsZWXXyFtaxdJvavjaPNhC4OZ5kBDeg/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-button"
          >
            Bergabung Bersama Kami
          </a>
        </div>
      </section>

      <section className="section section-alt" id="visi-misi">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Visi &amp; Misi</h2>
            <div className="chinese-border" />
            <p className="section-subtitle">
              Komitmen kami untuk membangun komunitas yang harmonis dan berkontribusi positif bagi Indonesia
            </p>
          </div>

          <div className="vm-container">
            <div className="vm-card">
              <h3>Visi Kami</h3>
              <p>
                Menjadi wadah komunitas Tionghoa-Indonesia yang inklusif, berdaya, dan harmonis dalam menjaga identitas budaya,
                memperkuat persaudaraan, serta berkontribusi positif bagi bangsa.
              </p>
            </div>

            <div className="vm-card">
              <h3>Misi Kami</h3>
              <ul>
                <li>
                  Melestarikan budaya Tionghoa melalui kegiatan seni, tradisi, dan perayaan budaya. Membangun persaudaraan
                  antaranggota komunitas melalui ikatan kekeluargaan yang erat.
                </li>
                <li>
                  Meningkatkan kontribusi sosial dengan aktif terlibat dalam kegiatan kemanusiaan dan pelayanan masyarakat.
                </li>
                <li>
                  Mewujudkan inklusivitas dengan membuka ruang dialog lintas budaya dan agama. Mengembangkan generasi muda
                  melalui program edukasi, kepemimpinan, dan kewirausahaan.
                </li>
                <li>Memfasilitasi kegiatan sosial, ekonomi, dan pendidikan</li>
                <li>Menjadi jembatan komunikasi antar komunitas</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="acara">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Acara &amp; Kegiatan</h2>
            <div className="chinese-border" />
            <p className="section-subtitle">Berbagai kegiatan komunitas yang mempererat persaudaraan</p>
          </div>

          <EventsGrid />
        </div>
      </section>

      <section className="section" id="testimoni">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Testimoni Anggota</h2>
            <div className="chinese-border" />
            <p className="section-subtitle">Cerita dan pengalaman dari anggota komunitas kami</p>
          </div>

          <TestimonialsGrid />
        </div>
      </section>

      <section className="section section-alt" id="kontak">
        <style>{`
          #kontak img { max-width: 100%; height: auto; transform: none !important; display: block; }
          #kontak .contact-avatar { width: 220px; height: 220px; border-radius: 9999px; overflow: hidden; margin: 0 auto 1rem; box-shadow: var(--shadow); }
          #kontak .contact-avatar img { width: 100%; height: 100%; object-fit: cover; }
          @media (max-width: 480px) {
            #kontak .contact-avatar { width: 160px; height: 160px; }
          }
          #kontak .social-links { display: flex; gap: 22px; justify-content: center; align-items: center; margin-top: 14px; }
          #kontak .social-link { width: 54px; height: 54px; border-radius: 9999px; border: 2px solid #e5e5e5; display: inline-flex; align-items: center; justify-content: center; text-decoration: none; color: var(--maroon, #8F1D1D); background: #fff; transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease; }
          #kontak .social-link:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(0, 0, 0, .08); border-color: #d9d9d9; }
          #kontak .social-link svg { width: 24px; height: 24px; display: block; }
        `}</style>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Hubungi Kami</h2>
            <div className="chinese-border" />
            <p className="section-subtitle">Terhubung langsung dengan pengurus komunitas</p>
          </div>

          <div className="contact-grid">
            {contactCards.map((contact) => (
              <div key={contact.id} className="contact-card">
                <div className="contact-avatar">
                  {contact.photo_url ? (
                    <img src={contact.photo_url} alt={contact.name} width={600} height={600} loading="lazy" />
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--gray)' }}>
                      {contact.name?.[0] ?? '?'}
                    </span>
                  )}
                </div>
                <h3>{contact.name}</h3>
                {contact.role ? <p>{contact.role}</p> : null}
                {contact.phone ? (
                  <p>
                    <a href={`tel:${toTelHref(contact.phone)}`}>{contact.phone}</a>
                  </p>
                ) : null}
                {contact.whatsapp_url ? (
                  <a
                    href={contact.whatsapp_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp"
                  >
                    Hubungi via WhatsApp
                  </a>
                ) : null}
              </div>
            ))}
          </div>

          <div className="social-container" style={{ textAlign: 'center', marginTop: '24px' }}>
            <h3 style={{ color: 'var(--black)', marginBottom: '10px' }}>Media Sosial</h3>
            <p style={{ color: 'var(--gray)' }}>Ikuti perkembangan terbaru dari komunitas kami</p>
            <SocialLinks />
          </div>
        </div>
      </section>

      <section className="section" id="sponsor">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Partners</h2>
            <div className="chinese-border" />
            <p className="section-subtitle">Terima kasih kepada mitra yang mendukung komunitas kami</p>
          </div>

          <PartnersGrid />
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
          <h2 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '1rem' }}>Bergabunglah Dengan Kami</h2>
          <div className="chinese-border" style={{ background: 'white', marginBottom: '2rem' }} />
          <p style={{ maxWidth: '600px', margin: '0 auto 2rem', fontSize: '1.2rem' }}>
            Mari bersama membangun komunitas yang solid dan berkontribusi positif untuk kemajuan Indonesia
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
              {footerLinks
                .filter((link) => (link?.label ?? '') && (link?.href ?? link?.url ?? ''))
                .map((link) => (
                  <p key={link.id ?? link.href ?? link.url}>
                    <FooterLink href={link.href ?? link.url} label={link.label} />
                  </p>
                ))}
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
