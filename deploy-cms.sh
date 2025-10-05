#!/bin/bash
set -e

echo "Deploying CMS frontend..."

# Navigate to web app
cd ~/kci-repo/apps/web

# Pull latest from GitHub
cd ~/kci-repo
git pull origin main

# Build the static site
cd ~/kci-repo/apps/web
npm install
npm run build

# Backup current CMS
if [ -d ~/public_html/cms/_next ]; then
  echo "Backing up current deployment..."
  rm -rf ~/public_html/cms-backup-previous
  mv ~/public_html/cms ~/public_html/cms-backup-previous
fi

# Deploy new build
echo "Copying new build..."
mkdir -p ~/public_html/cms
cp -r out/* ~/public_html/cms/

echo "CMS deployed successfully!"