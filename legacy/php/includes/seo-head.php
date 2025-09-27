<?php
$is_home = ($_SERVER['REQUEST_URI'] === '/' || basename($_SERVER['SCRIPT_NAME']) === 'index.php');
?>
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#b71c1c"><!-- optional -->
<meta name="msapplication-TileColor" content="#b71c1c">
<meta name="theme-color" content="#ffffff">

<?php if ($is_home): ?>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Komunitas Chinese Indonesia",
  "url": "https://komunitaschineseindonesia.com",
  "logo": "https://komunitaschineseindonesia.com/android-chrome-512x512.png",
  "sameAs": []
}
</script>
<?php endif; ?>
