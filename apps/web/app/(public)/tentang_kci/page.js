import { LegacyShell } from '../../../components/legacy/LegacyShell';

export const metadata = {
  title: 'Tentang KCI — Komunitas Chinese Indonesia',
  description: 'Tentang KCI: latar belakang, visi, dan komitmen Komunitas Chinese Indonesia (KCI).',
};

const NAV_LINKS = [
  { href: '/', label: 'Beranda' },
  { href: '/#visi-misi', label: 'Visi Misi' },
  { href: '/tentang_kci', label: 'Tentang' },
  { href: '/#acara', label: 'Acara' },
  { href: '/galeri', label: 'Galeri' },
  { href: '/blog', label: 'Blog' },
  { href: '/#testimoni', label: 'Testimoni' },
  { href: '/#kontak', label: 'Kontak' },
  { href: '/#sponsor', label: 'Partner' },
];

export default function TentangPage() {
  return (
    <LegacyShell navLinks={NAV_LINKS} variant="about">
      <section className="hero" id="tentang">
        <div className="container hero-content">
          <div className="chinese-border" />
          <h1>Tentang KCI</h1>
          <p className="hero-subtitle">Latar belakang, identitas, dan komitmen kami</p>
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

      <section className="section" style={{ paddingTop: '40px', paddingBottom: 0 }}>
        <div className="container" style={{ color: 'var(--gray)', fontSize: '0.95rem' }}>
          <span>
            <a className="nav-link" href="/" style={{ padding: 0, fontWeight: 600 }}>
              Beranda
            </a>{' '}
            › Tentang KCI
          </span>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-header" style={{ marginBottom: '30px' }}>
            <h2 className="section-title">Latar Belakang</h2>
            <div className="chinese-border" />
            <p className="section-subtitle">Mengapa KCI hadir dan ke mana kami melangkah</p>
          </div>

          <div className="vm-container" style={{ gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
            <article className="vm-card" style={{ animationDelay: '0s' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p>
                  Komunitas Chinese Indonesia (KCI) resmi berdiri pada 20 Juni 2025. Komunitas ini lahir dari kerinduan para
                  pemuda/i Tionghoa di Indonesia untuk memiliki sebuah rumah bersama, tempat di mana mereka bisa berkumpul,
                  saling mendukung, serta berkontribusi dalam memperkenalkan, melestarikan, dan mengembangkan kebudayaan Tionghoa
                  di tengah masyarakat Indonesia. Kota Yogyakarta dipilih sebagai titik awal perjalanan KCI, karena Yogyakarta
                  dikenal sebagai kota pelajar sekaligus pusat pertemuan beragam budaya, yang memberi ruang luas bagi toleransi
                  dan harmoni.
                </p>
                <p>
                  KCI didirikan oleh <strong>Joshua Robert Kurniawan</strong> sebagai Founder, bersama <strong>Jonathan Robert
                  Kurniawan</strong> sebagai Co-Founder. Joshua sendiri sebelumnya pernah menjabat sebagai Ketua Ikatan Mahasiswa
                  Tionghoa UKDW (IMT UKDW), sebuah pengalaman yang membekalinya dengan wawasan organisasi, kepemimpinan, dan
                  semangat untuk terus menghidupi nilai-nilai kebersamaan. Saat ini, Joshua berfokus penuh pada pengembangan KCI
                  sembari mengelola beberapa bisnis yang ia jalankan. Bersama Jonathan, mereka membawa visi yang jelas:
                  menjadikan KCI sebagai wadah yang inklusif, berdaya, dan bermanfaat bagi komunitas internal maupun masyarakat
                  luas.
                </p>
                <p>
                  Sejak awal berdirinya, KCI memegang misi untuk menghadirkan ruang yang tidak hanya memperkuat identitas budaya
                  Tionghoa, tetapi juga membangun jembatan persaudaraan lintas budaya di Indonesia. Melalui kegiatan sosial,
                  budaya, edukatif, maupun kolaboratif, KCI ingin menghadirkan dampak positif yang nyata—mulai dari lingkup
                  komunitas internal, hingga menjangkau masyarakat luas, khususnya di Yogyakarta dan sekitarnya.
                </p>
                <p>
                  Lebih dari sekadar organisasi, KCI adalah sebuah keluarga besar yang terbuka bagi siapa pun yang memiliki
                  semangat persatuan, toleransi, dan kebersamaan. Kami percaya bahwa kekuatan komunitas dapat tumbuh dari rasa
                  saling menghargai, saling menguatkan, dan bekerja sama demi tujuan bersama.
                </p>
                <p>
                  KCI hadir bukan hanya untuk hari ini, tetapi juga untuk masa depan. Dengan semangat muda dan visi jangka
                  panjang, kami berkomitmen untuk terus menjaga identitas budaya, memperluas jaringan, serta berkontribusi nyata
                  bagi perkembangan masyarakat Indonesia yang majemuk, harmonis, dan penuh keberagaman.
                </p>
              </div>
            </article>

            <aside className="vm-card" style={{ animationDelay: '0.1s' }}>
              <h3>Fakta Singkat</h3>
              <ul>
                <li>
                  <strong>Tanggal Berdiri:</strong> 20 Juni 2025
                </li>
                <li>
                  <strong>Kota Pertama:</strong> Yogyakarta
                </li>
                <li>
                  <strong>Founder:</strong> Joshua Robert Kurniawan
                </li>
                <li>
                  <strong>Co-Founder:</strong> Jonathan Robert Kurniawan
                </li>
              </ul>
              <h3 style={{ marginTop: '1.2rem' }}>Nilai Utama</h3>
              <ul>
                <li>Inklusivitas &amp; kebersamaan</li>
                <li>Pelestarian budaya</li>
                <li>Kolaborasi lintas budaya</li>
                <li>Dampak sosial nyata</li>
              </ul>
            </aside>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Nilai Komunitas</h2>
            <div className="chinese-border" />
            <p className="section-subtitle">Prinsip yang kami pegang dalam setiap aktivitas dan keputusan.</p>
          </div>

          <div className="vm-container" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            <div className="vm-card">
              <h3>Persaudaraan</h3>
              <p>KCI adalah rumah bagi semua anggota yang saling mendukung seperti keluarga.</p>
            </div>
            <div className="vm-card">
              <h3>Kebersamaan</h3>
              <p>Setiap kegiatan berlandaskan kerja sama dan solidaritas.</p>
            </div>
            <div className="vm-card">
              <h3>Toleransi</h3>
              <p>Menghargai perbedaan budaya, agama, dan pandangan hidup.</p>
            </div>
            <div className="vm-card">
              <h3>Kebudayaan</h3>
              <p>Menjaga dan melestarikan warisan budaya Tionghoa sebagai bagian dari kekayaan bangsa.</p>
            </div>
            <div className="vm-card">
              <h3>Kontribusi</h3>
              <p>Hadir untuk memberi dampak positif, baik di internal komunitas maupun masyarakat luas.</p>
            </div>
          </div>
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
            Ikut berperan membangun komunitas yang solid, harmonis, dan berdampak positif bagi Indonesia.
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
                <a href="/">Beranda</a>
              </p>
              <p>
                <a href="/#visi-misi">Visi &amp; Misi</a>
              </p>
              <p>
                <a href="/tentang_kci">Tentang</a>
              </p>
              <p>
                <a href="/blog">Blog</a>
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
