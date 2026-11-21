const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function createCampaignVisual() {
  const width = 1200;
  const height = 900;

  // Load the official 3D logo
  const logoPath = path.join(__dirname, '../../public/assets/nueva_era_logo_full.png');
  const logo = sharp(logoPath);
  const logoMeta = await logo.metadata();

  // Resize logo to fit prominently (e.g. width 1000px)
  const targetW = 1000;
  const targetH = Math.round((logoMeta.height / logoMeta.width) * targetW); // ~361px
  const resizedLogo = await logo
    .resize(targetW, targetH, { fit: 'contain' })
    .toBuffer();

  // Create an elegant studio background with subtle warm lighting
  // SVG background with radial gradient, subtle architectural pedestal, and floor shadow
  const bgSvg = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Studio Radial Backdrop -->
        <radialGradient id="studioLight" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.9"/>
          <stop offset="40%" stop-color="#FAF6EE" stop-opacity="0.8"/>
          <stop offset="80%" stop-color="#F2EAD8" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="#E9DFCA" stop-opacity="1"/>
        </radialGradient>

        <!-- Golden Amber Ambient Aura -->
        <radialGradient id="goldAura" cx="50%" cy="45%" r="40%">
          <stop offset="0%" stop-color="#E6A916" stop-opacity="0.22"/>
          <stop offset="60%" stop-color="#A91F35" stop-opacity="0.08"/>
          <stop offset="100%" stop-color="#A91F35" stop-opacity="0"/>
        </radialGradient>

        <!-- Elegant Cast Floor Shadow -->
        <radialGradient id="floorShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#3A1C0E" stop-opacity="0.35"/>
          <stop offset="40%" stop-color="#5C2413" stop-opacity="0.18"/>
          <stop offset="70%" stop-color="#5C2413" stop-opacity="0.06"/>
          <stop offset="100%" stop-color="#5C2413" stop-opacity="0"/>
        </radialGradient>

        <!-- Studio Dais / Pedestal Top Gradient -->
        <linearGradient id="daisTop" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#FAF6EE"/>
          <stop offset="100%" stop-color="#E8DEC8"/>
        </linearGradient>

        <!-- Studio Dais Rim Light -->
        <linearGradient id="daisRim" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#A91F35" stop-opacity="0.4"/>
          <stop offset="30%" stop-color="#E6A916" stop-opacity="0.7"/>
          <stop offset="70%" stop-color="#E6A916" stop-opacity="0.7"/>
          <stop offset="100%" stop-color="#A91F35" stop-opacity="0.4"/>
        </linearGradient>
      </defs>

      <!-- Main Studio Base -->
      <rect width="${width}" height="${height}" rx="32" fill="url(#studioLight)"/>

      <!-- Ambient Glow Behind 3D Logo -->
      <circle cx="600" cy="420" r="420" fill="url(#goldAura)"/>

      <!-- Architectural Stage Dais Steps (Subtle, Refined, Grounded) -->
      <!-- Lower step -->
      <ellipse cx="600" cy="720" rx="480" ry="60" fill="#E4D8C0" opacity="0.6"/>
      <ellipse cx="600" cy="710" rx="460" ry="52" fill="#EDE4D2" opacity="0.8"/>
      <!-- Main step with golden rim -->
      <ellipse cx="600" cy="690" rx="420" ry="46" fill="#F5EFE2"/>
      <ellipse cx="600" cy="690" rx="420" ry="46" fill="none" stroke="url(#daisRim)" stroke-width="3" opacity="0.7"/>

      <!-- Contact Floor Shadow directly below the 3D typography and hourglass -->
      <ellipse cx="600" cy="640" rx="440" ry="40" fill="url(#floorShadow)"/>
    </svg>
  `);

  const output = path.join(__dirname, '../../public/assets/nueva_era_3d_campaign.png');

  // Composite background with the 3D logo
  const logoTop = Math.round((height - targetH) / 2) - 30; // slightly above shadow
  const logoLeft = Math.round((width - targetW) / 2);

  await sharp(bgSvg)
    .composite([
      {
        input: resizedLogo,
        top: logoTop,
        left: logoLeft
      }
    ])
    .png()
    .toFile(output);

  console.log('Generated campaign visual at', output);
}

createCampaignVisual();
