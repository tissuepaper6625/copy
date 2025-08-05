import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import path from 'path';
import axios from 'axios';
import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;
const PINATA_GATEWAY = process.env.PINATA_GATEWAY || 'https://gateway.pinata.cloud';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const TWITTER_CONFIG = {
  width: 1200,
  height: 675,
  format: 'jpeg',
  quality: 90
};

// Helper to wrap and draw text
function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, baseline = 'top') {
    const words = text.split(' ');
    let line = '';
    let lines = [];
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            lines.push(line);
            line = words[n] + ' ';
        } else {
            line = testLine;
        }
    }
    lines.push(line);
    // Adjust y for bottom baseline
    if (baseline === 'bottom') {
        y = y - (lines.length - 1) * lineHeight;
    }
    for (let i = 0; i < lines.length; i++) {
        ctx.strokeText(lines[i].trim(), x, y + i * lineHeight);
        ctx.fillText(lines[i].trim(), x, y + i * lineHeight);
    }
}

// Enhanced helper to draw text with background and safe zone
function drawMemeTextWithBg(ctx, text, y, maxWidth, fontSize, isTop, safeZonePadding, imageHeight, logoHeight, logoPadding) {
    if (!text) return;
    ctx.font = `bold ${fontSize}px Anton, Impact, Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.lineWidth = Math.max(6, Math.floor(fontSize / 7));
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'white';
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 8;
    ctx.textBaseline = isTop ? 'top' : 'bottom';
    // Word wrap
    const words = text.split(' ');
    let line = '';
    let lines = [];
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
            lines.push(line);
            line = words[n] + ' ';
        } else {
            line = testLine;
        }
    }
    lines.push(line);
    // Calculate total text block height
    const lineHeight = fontSize * 1.15;
    const blockHeight = lines.length * lineHeight;
    // Calculate y position for safe zone
    let baseY = y;
    if (isTop) {
        baseY = Math.max(safeZonePadding, y);
    } else {
        // Ensure text does not overlap logo
        const bottomSafe = imageHeight - safeZonePadding - (logoHeight + logoPadding + 10);
        baseY = Math.min(bottomSafe, y);
    }
    // Draw background for each line
    for (let i = 0; i < lines.length; i++) {
        const textLine = lines[i].trim();
        const metrics = ctx.measureText(textLine);
        const bgWidth = metrics.width + fontSize * 0.8;
        const bgHeight = lineHeight * 1.05;
        const bgX = ctx.canvas.width / 2 - bgWidth / 2;
        const bgY = isTop
            ? baseY + i * lineHeight - fontSize * 0.2
            : baseY - (lines.length - 1 - i) * lineHeight - fontSize * 0.8;
        // Draw semi-transparent rounded rectangle
        ctx.save();
        ctx.globalAlpha = 0.55;
        ctx.fillStyle = '#111';
        ctx.beginPath();
        const radius = fontSize * 0.35;
        ctx.moveTo(bgX + radius, bgY);
        ctx.lineTo(bgX + bgWidth - radius, bgY);
        ctx.quadraticCurveTo(bgX + bgWidth, bgY, bgX + bgWidth, bgY + radius);
        ctx.lineTo(bgX + bgWidth, bgY + bgHeight - radius);
        ctx.quadraticCurveTo(bgX + bgWidth, bgY + bgHeight, bgX + bgWidth - radius, bgY + bgHeight);
        ctx.lineTo(bgX + radius, bgY + bgHeight);
        ctx.quadraticCurveTo(bgX, bgY + bgHeight, bgX, bgY + bgHeight - radius);
        ctx.lineTo(bgX, bgY + radius);
        ctx.quadraticCurveTo(bgX, bgY, bgX + radius, bgY);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.restore();
        // Draw text
        ctx.strokeText(textLine, ctx.canvas.width / 2, isTop ? bgY + fontSize * 0.15 : bgY + bgHeight - fontSize * 0.15);
        ctx.fillText(textLine, ctx.canvas.width / 2, isTop ? bgY + fontSize * 0.15 : bgY + bgHeight - fontSize * 0.15);
    }
    ctx.shadowBlur = 0;
}

/**
 * Helper to overlay meme text and logo on an image buffer
 * @param {Buffer} imageBuffer - The original image buffer
 * @param {string} caption - Top meme text
 * @param {string} subtext - Bottom meme text
 * @param {string} logoPath - Path to logo PNG
 * @returns {Promise<Buffer>} - Processed image buffer
 */
async function processMemeImageWithTextAndLogo(imageBuffer, caption, subtext, logoPath) {
    const image = sharp(imageBuffer);
    const metadata = await image.metadata();
    const width = metadata.width;
    const height = metadata.height;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);
    // Draw base image
    const img = await loadImage(imageBuffer);
    ctx.drawImage(img, 0, 0, width, height);
    // --- Enhanced text overlay ---
    const safeZonePadding = Math.floor(height * 0.08);
    // Dynamic font size based on text length
    const topFontSize = caption && caption.length > 40 ? Math.floor(width * 0.065) : Math.floor(width * 0.085);
    const bottomFontSize = subtext && subtext.length > 40 ? Math.floor(width * 0.055) : Math.floor(width * 0.075);
    const maxTextWidth = width * 0.92;
    // Logo size and padding
    const logoWidth = Math.floor(width * 0.16);
    const logoHeight = Math.floor(logoWidth * 0.33);
    const logoPadding = Math.floor(width * 0.045);
    // Top text
    if (caption) {
        drawMemeTextWithBg(ctx, caption, safeZonePadding, maxTextWidth, topFontSize, true, safeZonePadding, height, logoHeight, logoPadding);
    }
    // Bottom text
    if (subtext) {
        drawMemeTextWithBg(ctx, subtext, height - safeZonePadding, maxTextWidth, bottomFontSize, false, safeZonePadding, height, logoHeight, logoPadding);
    }
    // --- Minimalistic text watermark only (no logo image) ---
    const watermarkText = 'attention.ad';
    const fontSize = Math.floor(width * 0.045);
    const padding = Math.floor(width * 0.03);
    ctx.save();
    ctx.font = `600 ${fontSize}px Inter, Arial, sans-serif`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 6;
    ctx.fillStyle = 'white';
    ctx.globalAlpha = 0.92;
    ctx.fillText(watermarkText, width - padding, height - padding);
    ctx.globalAlpha = 1.0;
    ctx.shadowBlur = 0;
    ctx.restore();
    // Save composited image to buffer
    const compositedBuffer = canvas.toBuffer('image/jpeg');
    fs.writeFileSync('output-debug.jpg', compositedBuffer);
    console.log('[DEBUG] Saved composited meme as output-debug.jpg');
    return compositedBuffer;
}

class PinataStorageService {
  constructor() {
    this.apiKey = PINATA_API_KEY;
    this.secretKey = PINATA_SECRET_API_KEY;
    this.gateway = PINATA_GATEWAY;
  }

  /**
   * Validate image file
   */
  validateImage(file) {
    if (!file) {
      throw new Error('No file provided');
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      throw new Error(`Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`);
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }

    return true;
  }

  /**
   * Generate unique filename with cataloging structure
   */
  generateFileName(originalName, userId, type = 'upload', category = 'general') {
    const timestamp = Date.now();
    const randomId = uuidv4().substring(0, 8);
    const extension = path.extname(originalName) || '.jpg';
    const baseName = path.basename(originalName, extension);
    const sanitizedName = baseName.replace(/[^a-zA-Z0-9]/g, '_');
    // Flat filename: timestamp_randomId_sanitizedName.extension
    return `${timestamp}_${randomId}_${sanitizedName}${extension}`;
  }

  /**
   * Download image from URL (for cross-protocol compatibility)
   */
  async downloadImageFromUrl(imageUrl, maxRetries = 3) {
    let lastError;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await axios.get(imageUrl, {
          responseType: 'arraybuffer',
          timeout: 60000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; ImageDownloader/1.0)'
          }
        });
        return Buffer.from(response.data);
      } catch (error) {
        lastError = error;
        console.warn(`Download attempt ${attempt} failed: ${error.message}`);
        if (attempt < maxRetries) await new Promise(res => setTimeout(res, 1000));
      }
    }
    throw new Error(`Failed to download image from URL after ${maxRetries} attempts: ${lastError.message}`);
  }

  /**
   * Process image for Twitter optimization
   */
  async processImageForTwitter(imageBuffer) {
    try {
      const processedBuffer = await sharp(imageBuffer)
        .resize(TWITTER_CONFIG.width, TWITTER_CONFIG.height, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ 
          quality: TWITTER_CONFIG.quality, 
          progressive: true,
          mozjpeg: true
        })
        .toBuffer();
      
      return {
        buffer: processedBuffer,
        width: TWITTER_CONFIG.width,
        height: TWITTER_CONFIG.height,
        format: TWITTER_CONFIG.format,
        size: processedBuffer.length,
        platform: 'twitter'
      };
    } catch (error) {
      throw new Error(`Failed to process image for Twitter: ${error.message}`);
    }
  }

  /**
   * Upload file to Pinata IPFS with metadata cataloging
   */
  async uploadToPinata(file, fileName, metadata = {}) {
    try {
      const formData = new FormData();
      // Patch: If file is a Multer memory file (buffer), use correct FormData signature
      if (file.buffer && file.originalname) {
        formData.append('file', file.buffer, {
          filename: file.originalname,
          contentType: file.mimetype,
          knownLength: file.size
        });
      } else {
        formData.append('file', file, fileName);
      }

      // Enhanced metadata for cataloging
      let keyvalues = {
          'upload-timestamp': new Date().toISOString(),
          'content-type': file.type || file.mimetype || 'image/jpeg',
          'file-size': file.size ? file.size.toString() : '',
          'catalog-version': '1.0',
          'platform': 'twitter',
          ...metadata
      };
      // Remove buffer-size if present
      if ('buffer-size' in keyvalues) delete keyvalues['buffer-size'];
      // Strictly filter Pinata metadata: remove null/undefined, convert all values to string/number, and only keep the first 10 key-value pairs
      let entries = Object.entries(keyvalues)
        .filter(([k, v]) => v !== undefined && v !== null); // Remove null/undefined
      // Convert all values to strings or numbers
      entries = entries.map(([k, v]) => [k, typeof v === 'string' || typeof v === 'number' ? v : String(v)]);
      // Only keep the first 10
      if (entries.length > 10) {
        console.warn(`Pinata metadata has ${entries.length} keys, trimming to 10. Trimmed keys:`, entries.slice(10).map(([k]) => k));
        entries = entries.slice(0, 10);
      }
      keyvalues = Object.fromEntries(entries);
      console.log('Final Pinata keyvalues:', keyvalues);
      const pinataMetadata = {
        name: (file.originalname || path.basename(fileName)),
        keyvalues
      };
      // Log for debugging
      console.log('Pinata upload metadata:', pinataMetadata);
      console.log('Pinata API Key:', this.apiKey ? 'SET' : 'MISSING');
      console.log('Pinata Secret Key:', this.secretKey ? 'SET' : 'MISSING');
      
      formData.append('pinataMetadata', JSON.stringify(pinataMetadata));

      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'pinata_api_key': this.apiKey,
          'pinata_secret_api_key': this.secretKey,
          ...formData.getHeaders && formData.getHeaders()
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Pinata upload failed:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      return {
        ipfsHash: result.IpfsHash,
        url: `https://ipfs.io/ipfs/${result.IpfsHash}`,
        gatewayUrl: `${this.gateway}/ipfs/${result.IpfsHash}`,
        size: file.size,
        metadata: pinataMetadata.keyvalues
      };
    } catch (error) {
      throw new Error(`Pinata upload failed: ${error.message}`);
    }
  }

  /**
   * Upload image buffer to Pinata with cataloging
   */
  async uploadImageBuffer(imageBuffer, fileName, contentType = 'image/jpeg', metadata = {}) {
    try {
      const formData = new FormData();
      formData.append('file', imageBuffer, {
        filename: fileName,
        contentType: contentType,
        knownLength: imageBuffer.length
      });

      let keyvalues = {
        'upload-timestamp': new Date().toISOString(),
        'content-type': contentType,
        'file-size': imageBuffer.length.toString(),
        'catalog-version': '1.0',
        'platform': 'twitter',
        ...metadata
      };
      const pinataMetadata = {
        name: fileName,
        keyvalues
      };
      formData.append('pinataMetadata', JSON.stringify(pinataMetadata));

      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'pinata_api_key': this.apiKey,
          'pinata_secret_api_key': this.secretKey,
          ...formData.getHeaders()
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      return {
        ipfsHash: result.IpfsHash,
        url: `https://ipfs.io/ipfs/${result.IpfsHash}`,
        gatewayUrl: `${this.gateway}/ipfs/${result.IpfsHash}`,
        size: imageBuffer.length,
        metadata: pinataMetadata.keyvalues
      };
    } catch (error) {
      throw new Error(`Failed to upload image buffer: ${error.message}`);
    }
  }

  /**
   * Upload regular image file with cataloging
   */
  async uploadImage(file, userId, metadata = {}) {
    try {
      this.validateImage(file);
      
      const fileName = this.generateFileName(file.name, userId, 'upload');
      const uploadMetadata = {
        'upload-timestamp': new Date().toISOString(),
        'original-name': file.name,
        'user-id': userId,
        'upload-type': 'manual',
        'platform': 'twitter',
        ...metadata
      };
      
      return await this.uploadToPinata(file, fileName, uploadMetadata);
    } catch (error) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }

  /**
   * Upload AI-generated image with platform variants
   * Accepts either imageUrl (string) or imageBase64 (string, base64-encoded), plus topText and bottomText for overlays
   */
  async uploadAIGeneratedImage(imageUrlOrBase64, userId, topText, bottomText) {
    try {
      let imageBuffer;
      if (imageUrlOrBase64 && typeof imageUrlOrBase64 === 'string' && imageUrlOrBase64.startsWith('http')) {
        // URL path
        console.log('[PINATA UPLOAD] Downloading image from URL');
        imageBuffer = await this.downloadImageFromUrl(imageUrlOrBase64);
      } else if (imageUrlOrBase64 && typeof imageUrlOrBase64 === 'string') {
        // base64 path
        console.log('[PINATA UPLOAD] Decoding image from base64');
        imageBuffer = Buffer.from(imageUrlOrBase64, 'base64');
      } else {
        throw new Error('No valid image URL or base64 string provided');
      }

      // Optionally resize to 1024x1024 square (AI output is usually square already)
      const standardWidth = 1024;
      const standardHeight = 1024;
      const resizedBuffer = await sharp(imageBuffer)
        .resize(standardWidth, standardHeight, { fit: 'cover' })
        .toBuffer();

      // Draw meme text and logo using canvas
      const { createCanvas, loadImage, registerFont } = await import('canvas');
      const path = (await import('path')).default;
      const fs = (await import('fs')).default;
      // Register meme font (user must add Anton.ttf to assets/fonts)
      const fontPath = path.join(process.cwd(), 'assets', 'fonts', 'Anton.ttf');
      if (!fs.existsSync(fontPath)) {
        console.warn('Meme font not found at', fontPath);
        console.warn('Please add Anton.ttf to assets/fonts for proper meme rendering.');
      } else {
        registerFont(fontPath, { family: 'Anton' });
      }
      const canvas = createCanvas(standardWidth, standardHeight);
      const ctx = canvas.getContext('2d');
      // Draw base image
      const img = await loadImage(resizedBuffer);
      ctx.drawImage(img, 0, 0, standardWidth, standardHeight);

      // --- Draw meme text with wrapping, outline, and shadow ---
      function drawMemeText(ctx, text, y, maxWidth, fontSize, isTop) {
        ctx.font = `bold ${fontSize}px Anton, Impact, Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.lineWidth = 8;
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'white';
        ctx.shadowColor = 'rgba(0,0,0,0.7)';
        ctx.shadowBlur = 8;
        ctx.textBaseline = isTop ? 'top' : 'bottom';
        // Word wrap
        const words = text.split(' ');
        let line = '';
        let lines = [];
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && n > 0) {
            lines.push(line);
            line = words[n] + ' ';
          } else {
            line = testLine;
          }
        }
        lines.push(line);
        // Draw each line
        for (let i = 0; i < lines.length; i++) {
          const lineY = isTop
            ? y + i * fontSize * 1.1
            : y - (lines.length - 1 - i) * fontSize * 1.1;
          ctx.strokeText(lines[i].trim(), standardWidth / 2, lineY);
          ctx.fillText(lines[i].trim(), standardWidth / 2, lineY);
        }
        // Remove shadow for other elements
        ctx.shadowBlur = 0;
      }
      // Top text (with generous padding)
      if (topText) {
        drawMemeText(ctx, topText, 70, standardWidth - 120, 72, true);
      }
      // Bottom text (with generous padding)
      if (bottomText) {
        drawMemeText(ctx, bottomText, standardHeight - 70, standardWidth - 120, 72, false);
      }

      // --- Minimalistic text watermark only (no logo image) ---
      const watermarkText = 'attention.ad';
      const fontSize = Math.floor(standardWidth * 0.045);
      const padding = Math.floor(standardWidth * 0.03);
      ctx.save();
      ctx.font = `600 ${fontSize}px Inter, Arial, sans-serif`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.shadowColor = 'rgba(0,0,0,0.7)';
      ctx.shadowBlur = 6;
      ctx.fillStyle = 'white';
      ctx.globalAlpha = 0.92;
      ctx.fillText(watermarkText, standardWidth - padding, standardHeight - padding);
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;
      ctx.restore();

      // Save composited image to buffer
      const compositedBuffer = canvas.toBuffer('image/jpeg');
      fs.writeFileSync('output-debug.jpg', compositedBuffer);
      console.log('[DEBUG] Saved composited meme as output-debug.jpg');
      const fileName = this.generateFileName(`ai_Twitter.jpg`, userId, 'ai-generated');
      const metadata = {
        'ai-generated': 'true',
        'prompt': `${topText}\n${bottomText}`,
        'platform': 'twitter',
        'width': standardWidth.toString(),
        'height': standardHeight.toString()
      };
      const result = await this.uploadImageBuffer(
        compositedBuffer,
        fileName,
        'image/jpeg',
        metadata
      );
      const uploadResult = {
        ...result,
        width: standardWidth,
        height: standardHeight
      };
      return uploadResult;
    } catch (error) {
      throw new Error(`Failed to upload AI-generated image: ${error.message}`);
    }
  }

  /**
   * Upload image from URL with cataloging
   */
  async uploadImageFromUrl(url, userId, metadata = {}) {
    try {
      const imageBuffer = await this.downloadImageFromUrl(url);
      const fileName = this.generateFileName('image.jpg', userId, 'url-upload');
      
      return await this.uploadImageBuffer(imageBuffer, fileName, 'image/jpeg', {
        'source-url': url,
        'user-id': userId,
        'upload-type': 'url',
        'platform': 'twitter',
        ...metadata
      });
    } catch (error) {
      throw new Error(`Failed to upload image from URL: ${error.message}`);
    }
  }

  /**
   * Upload image buffer directly to Pinata (for Multer memory files)
   */
  async uploadImageBufferDirect(file, userId, metadata = {}) {
    // file: Multer file object with buffer, originalname, mimetype, size
    try {
      const fileName = this.generateFileName(file.originalname, userId, 'upload');
      const formData = new FormData();
      formData.append('file', file.buffer, {
        filename: fileName,
        contentType: file.mimetype,
        knownLength: file.size
      });

      let keyvalues = {
        'upload-timestamp': new Date().toISOString(),
        'content-type': file.mimetype,
        'file-size': file.size.toString(),
        'catalog-version': '1.0',
        'platform': 'twitter',
        ...metadata
      };
      const pinataMetadata = {
        name: fileName,
        keyvalues
      };
      formData.append('pinataMetadata', JSON.stringify(pinataMetadata));

      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'pinata_api_key': this.apiKey,
          'pinata_secret_api_key': this.secretKey,
          ...formData.getHeaders()
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      return {
        ipfsHash: result.IpfsHash,
        url: `https://ipfs.io/ipfs/${result.IpfsHash}`,
        gatewayUrl: `${this.gateway}/ipfs/${result.IpfsHash}`,
        size: file.size,
        metadata: pinataMetadata.keyvalues
      };
    } catch (error) {
      throw new Error(`Pinata upload failed: ${error.message}`);
    }
  }

  /**
   * Get image URL from IPFS hash (cross-protocol display for Twitter)
   */
  getImageUrl(ipfsHash, protocol = 'gateway') {
    const protocols = {
      ipfs: `https://ipfs.io/ipfs/${ipfsHash}`,
      gateway: `${this.gateway}/ipfs/${ipfsHash}`,
      dweb: `https://dweb.link/ipfs/${ipfsHash}`
    };
    
    return protocols[protocol] || protocols.gateway;
  }

  /**
   * Get all available URLs for cross-protocol display (Twitter-optimized)
   */
  getAllImageUrls(ipfsHash) {
    return {
      ipfs: this.getImageUrl(ipfsHash, 'ipfs'),
      gateway: this.getImageUrl(ipfsHash, 'gateway'),
      dweb: this.getImageUrl(ipfsHash, 'dweb')
    };
  }

  /**
   * Delete image from Pinata (unpin)
   */
  async deleteImage(ipfsHash) {
    try {
      const response = await fetch(`https://api.pinata.cloud/pinning/unpin/${ipfsHash}`, {
        method: 'DELETE',
        headers: {
          'pinata_api_key': this.apiKey,
          'pinata_secret_api_key': this.secretKey,
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete image from Pinata: ${response.status} - ${errorText}`);
      }
      return { success: true, ipfsHash };
    } catch (error) {
      throw new Error(`Failed to delete image from Pinata: ${error.message}`);
    }
  }
}

export default PinataStorageService;