#!/bin/bash
# Safe Legacy Admin Cleanup Script
# Run this ONLY AFTER testing the new Next.js CMS at /cms

set -e

echo "🧹 Legacy Admin Cleanup Script"
echo "================================"
echo ""
echo "⚠️  WARNING: This will delete the old PHP admin interface"
echo "Make sure you've tested the new CMS at https://komunitaschineseindonesia.com/cms first!"
echo ""
read -p "Have you tested the new CMS and confirmed it works? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
  echo "❌ Cleanup cancelled. Test the CMS first, then run this script again."
  exit 1
fi

echo ""
echo "📦 Creating backup of legacy admin..."
mkdir -p ~/backups/legacy-cleanup-$(date +%Y%m%d)
cp -r ~/public_html/admin ~/backups/legacy-cleanup-$(date +%Y%m%d)/admin-backup
echo "✅ Backup created at: ~/backups/legacy-cleanup-$(date +%Y%m%d)/admin-backup"

echo ""
echo "🗑️  Deleting legacy admin UI components..."

# Delete old admin interface files (keep config for now)
cd ~/public_html/admin
rm -rf modules/
rm -rf api/
rm -rf includes/
rm -rf uploads/
rm -f login.php logout.php index.php process-login.php .htaccess
rm -rf assets/

echo "✅ Legacy admin UI deleted"

echo ""
echo "🗑️  Deleting duplicate legacy API..."
rm -rf ~/public_html/api/admin/
echo "✅ Duplicate API deleted"

echo ""
echo "🗑️  Cleaning up junk files..."

# Clean public_html
cd ~/public_html
rm -f install.php member-login.php member-register.php quick-install.php
rm -f "tentang_kci - Copy.html" database.sql
rm -f public_html.zip

# Clean root directory
cd ~
rm -f hello.txt hello2.txt smoke.txt smoke3.txt last-upload.json

# Clean old CMS backups (keep only the most recent one)
cd ~/public_html
if [ -d "cms-backup-04-10-2025" ]; then
  echo "Removing old CMS backup: cms-backup-04-10-2025"
  rm -rf cms-backup-04-10-2025
fi

echo "✅ Junk files cleaned"

echo ""
echo "⚠️  Config files still remain at:"
echo "   ~/public_html/admin/config/"
echo ""
echo "   These files contain database credentials and are used by index.php"
echo "   To secure them, you should move them outside public_html later."
echo ""
echo "✅ Cleanup complete!"
echo ""
echo "📋 Summary:"
echo "   - Old admin UI: DELETED"
echo "   - Legacy API: DELETED"
echo "   - Junk files: DELETED"
echo "   - Config files: KEPT (still needed by index.php)"
echo "   - Backup location: ~/backups/legacy-cleanup-$(date +%Y%m%d)/"
echo ""
echo "🎉 Your server is now cleaner and using the new Next.js CMS!"
