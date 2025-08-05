import express from 'express';
import multer from 'multer';
import pinataStorageService from '../utils/storage.js';
import Image from '../model/Image.js';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.'), false);
    }
  },
});

/**
 * @route POST /api/images/upload
 * @desc Upload image to Pinata IPFS with Twitter optimization
 * @access Public
 */
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const userId = req.body.privyId && req.body.privyId !== 'anonymous' ? req.body.privyId : null;
    const { 
      title, 
      description, 
      category = 'general',
      subcategory,
      tags,
      keywords,
      isPublic = true 
    } = req.body;

    // Validate image
    pinataStorageService.validateImage(req.file);

    // Extract image metadata for cataloging
    const imageInfo = await pinataStorageService.extractImageInfo(req.file.buffer);

    // Upload to Pinata with cataloging metadata
    const uploadResult = await pinataStorageService.uploadImage(req.file, userId, {
      'original-name': req.file.originalname,
      'upload-type': 'manual',
      'category': category,
      'subcategory': subcategory
    });

    // Get all display URLs for cross-protocol display
    const displayUrls = pinataStorageService.getAllImageUrls(uploadResult.ipfsHash);

    // Create image record with cataloging
    const image = new Image({
      title: title || req.file.originalname,
      description: description || '',
      userId,
      ipfsHash: uploadResult.ipfsHash,
      ipfsUrl: uploadResult.url,
      gatewayUrl: uploadResult.gatewayUrl,
      fileName: uploadResult.ipfsHash,
      fileSize: uploadResult.size,
      width: imageInfo.width,
      height: imageInfo.height,
      format: imageInfo.format,
      contentType: req.file.mimetype,
      hasAlpha: imageInfo.hasAlpha,
      hasProfile: imageInfo.hasProfile,
      orientation: imageInfo.orientation,
      channels: imageInfo.channels,
      depth: imageInfo.depth,
      displayUrls,
      catalog: {
        category,
        subcategory,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        keywords: keywords ? keywords.split(',').map(keyword => keyword.trim()) : [],
        uploadType: 'manual',
        originalName: req.file.originalname,
        platform: 'twitter'
      },
      isPublic: isPublic === 'true' || isPublic === true
    });

    await image.save();

    // Check accessibility across protocols
    const accessibility = await pinataStorageService.checkImageAccessibility(uploadResult.ipfsHash);
    await image.updateAccessibility('ipfs', accessibility.ipfs);
    await image.updateAccessibility('gateway', accessibility.gateway);
    await image.updateAccessibility('dweb', accessibility.dweb);

    res.status(201).json({
      success: true,
      image: image.getCatalogEntry(),
      uploadResult,
      accessibility
    });

  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: 'Failed to upload image', details: error.message });
  }
});

/**
 * @route POST /api/images/upload-url
 * @desc Upload image from URL to Pinata IPFS with Twitter optimization
 * @access Public
 */
router.post('/upload-url', async (req, res) => {
  try {
    const { 
      imageUrl, 
      title, 
      description, 
      category = 'general',
      subcategory,
      tags,
      keywords,
      isPublic = true,
      userId = null
    } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    // Upload from URL with cataloging
    const uploadResult = await pinataStorageService.uploadImageFromUrl(imageUrl, userId, {
      'source-url': imageUrl,
      'upload-type': 'url',
      'category': category,
      'subcategory': subcategory
    });

    // Get image info for cataloging
    const imageBuffer = await pinataStorageService.downloadImageFromUrl(uploadResult.url);
    const imageInfo = await pinataStorageService.extractImageInfo(imageBuffer);

    // Get all display URLs for cross-protocol display
    const displayUrls = pinataStorageService.getAllImageUrls(uploadResult.ipfsHash);

    // Create image record with cataloging
    const image = new Image({
      title: title || 'Uploaded from URL',
      description: description || '',
      userId,
      ipfsHash: uploadResult.ipfsHash,
      ipfsUrl: uploadResult.url,
      gatewayUrl: uploadResult.gatewayUrl,
      fileName: uploadResult.ipfsHash,
      fileSize: uploadResult.size,
      width: imageInfo.width,
      height: imageInfo.height,
      format: imageInfo.format,
      contentType: 'image/jpeg',
      hasAlpha: imageInfo.hasAlpha,
      hasProfile: imageInfo.hasProfile,
      orientation: imageInfo.orientation,
      channels: imageInfo.channels,
      depth: imageInfo.depth,
      displayUrls,
      catalog: {
        category,
        subcategory,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        keywords: keywords ? keywords.split(',').map(keyword => keyword.trim()) : [],
        uploadType: 'url',
        sourceUrl: imageUrl,
        platform: 'twitter'
      },
      isPublic: isPublic === 'true' || isPublic === true
    });

    await image.save();

    // Check accessibility across protocols
    const accessibility = await pinataStorageService.checkImageAccessibility(uploadResult.ipfsHash);
    await image.updateAccessibility('ipfs', accessibility.ipfs);
    await image.updateAccessibility('gateway', accessibility.gateway);
    await image.updateAccessibility('dweb', accessibility.dweb);

    res.status(201).json({
      success: true,
      image: image.getCatalogEntry(),
      uploadResult,
      accessibility
    });

  } catch (error) {
    console.error('URL upload error:', error);
    res.status(500).json({ error: 'Failed to upload image from URL', details: error.message });
  }
});

/**
 * @route GET /api/images/:imageId
 * @desc Get image by ID with cross-protocol display support
 * @access Public
 */
router.get('/:imageId', async (req, res) => {
  try {
    const { imageId } = req.params;
    const { protocol = 'gateway' } = req.query;

    const image = await Image.findById(imageId).populate('userId', 'username avatar');
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    if (!image.isPublic || image.isDeleted) {
      return res.status(403).json({ error: 'Image is not accessible' });
    }

    // Increment view count
    await image.incrementUsage('views');

    // Get the requested protocol URL
    const displayUrl = image.displayUrls[protocol] || image.primaryUrl;

    // Check accessibility if not recently checked
    const now = new Date();
    const lastChecked = image.accessibility[protocol]?.lastChecked;
    if (!lastChecked || (now - lastChecked) > 24 * 60 * 60 * 1000) { // 24 hours
      const accessibility = await pinataStorageService.checkImageAccessibility(image.ipfsHash);
      await image.updateAccessibility(protocol, accessibility[protocol]);
    }

    res.json({
      success: true,
      image: image.getCatalogEntry(),
      displayUrl,
      allUrls: image.displayUrls
    });

  } catch (error) {
    console.error('Get image error:', error);
    res.status(500).json({ error: 'Failed to fetch image', details: error.message });
  }
});

/**
 * @route GET /api/images
 * @desc Get all public images with cataloging filters and cross-protocol support
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      subcategory,
      tags, 
      keywords,
      userId,
      accessible = true,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (page - 1) * limit;
    const query = { isPublic: true, isDeleted: false };

    // Apply cataloging filters
    if (category) query['catalog.category'] = category;
    if (subcategory) query['catalog.subcategory'] = subcategory;
    if (userId) query.userId = userId;
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query['catalog.tags'] = { $in: tagArray };
    }
    if (keywords) {
      const keywordArray = keywords.split(',').map(keyword => keyword.trim());
      query['catalog.keywords'] = { $in: keywordArray };
    }

    // Filter for accessible images if requested
    if (accessible === 'true') {
      query.$or = [
        { 'accessibility.gateway.accessible': true },
        { 'accessibility.ipfs.accessible': true }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const images = await Image.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'username avatar');

    const total = await Image.countDocuments(query);

    // Get catalog entries for all images
    const catalogEntries = images.map(image => image.getCatalogEntry());

    res.json({
      success: true,
      images: catalogEntries,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get images error:', error);
    res.status(500).json({ error: 'Failed to fetch images', details: error.message });
  }
});

/**
 * @route POST /api/images/search
 * @desc Search images with cataloging support
 * @access Public
 */
router.post('/search', async (req, res) => {
  try {
    const { 
      query, 
      page = 1, 
      limit = 20, 
      category,
      subcategory,
      tags,
      keywords,
      accessible = true,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.body;

    const skip = (page - 1) * limit;
    const searchQuery = { isPublic: true, isDeleted: false };

    // Text search across catalog fields
    if (query) {
      searchQuery.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { 'catalog.tags': { $in: [new RegExp(query, 'i')] } },
        { 'catalog.keywords': { $in: [new RegExp(query, 'i')] } }
      ];
    }

    // Apply cataloging filters
    if (category) searchQuery['catalog.category'] = category;
    if (subcategory) searchQuery['catalog.subcategory'] = subcategory;
    if (tags && tags.length > 0) {
      searchQuery['catalog.tags'] = { $in: tags };
    }
    if (keywords && keywords.length > 0) {
      searchQuery['catalog.keywords'] = { $in: keywords };
    }

    // Filter for accessible images if requested
    if (accessible === true) {
      searchQuery.$or = [
        { 'accessibility.gateway.accessible': true },
        { 'accessibility.ipfs.accessible': true }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const images = await Image.find(searchQuery)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'username avatar');

    const total = await Image.countDocuments(searchQuery);

    // Get catalog entries for all images
    const catalogEntries = images.map(image => image.getCatalogEntry());

    res.json({
      success: true,
      images: catalogEntries,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Search images error:', error);
    res.status(500).json({ error: 'Failed to search images', details: error.message });
  }
});

/**
 * @route GET /api/images/catalog/categories
 * @desc Get all image categories for cataloging
 * @access Public
 */
router.get('/catalog/categories', async (req, res) => {
  try {
    const categories = await Image.distinct('catalog.category', { isPublic: true, isDeleted: false });
    
    res.json({
      success: true,
      categories
    });

  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories', details: error.message });
  }
});

/**
 * @route GET /api/images/catalog/tags
 * @desc Get all image tags for cataloging
 * @access Public
 */
router.get('/catalog/tags', async (req, res) => {
  try {
    const tags = await Image.distinct('catalog.tags', { isPublic: true, isDeleted: false });
    
    res.json({
      success: true,
      tags: tags.filter(tag => tag && tag.trim() !== '')
    });

  } catch (error) {
    console.error('Tags error:', error);
    res.status(500).json({ error: 'Failed to fetch tags', details: error.message });
  }
});

/**
 * @route GET /api/images/catalog/keywords
 * @desc Get all image keywords for cataloging
 * @access Public
 */
router.get('/catalog/keywords', async (req, res) => {
  try {
    const keywords = await Image.distinct('catalog.keywords', { isPublic: true, isDeleted: false });
    
    res.json({
      success: true,
      keywords: keywords.filter(keyword => keyword && keyword.trim() !== '')
    });

  } catch (error) {
    console.error('Keywords error:', error);
    res.status(500).json({ error: 'Failed to fetch keywords', details: error.message });
  }
});

/**
 * @route GET /api/images/accessible
 * @desc Get accessible images across protocols
 * @access Public
 */
router.get('/accessible', async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const images = await Image.findAccessible(parseInt(limit));
    const total = await Image.countDocuments({ 
      $or: [
        { 'accessibility.gateway.accessible': true },
        { 'accessibility.ipfs.accessible': true }
      ],
      isPublic: true,
      isDeleted: false
    });

    const catalogEntries = images.map(image => image.getCatalogEntry());

    res.json({
      success: true,
      images: catalogEntries,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Accessible images error:', error);
    res.status(500).json({ error: 'Failed to fetch accessible images', details: error.message });
  }
});

/**
 * @route POST /api/images/batch-upload
 * @desc Upload multiple images with cataloging
 * @access Public
 */
router.post('/batch-upload', upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images provided' });
    }

    const userId = req.body.privyId || 'anonymous';
    const { 
      category = 'general',
      subcategory,
      tags,
      keywords 
    } = req.body;

    const results = [];

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      try {
        // Validate image
        pinataStorageService.validateImage(file);

        // Extract image metadata for cataloging
        const imageInfo = await pinataStorageService.extractImageInfo(file.buffer);

        // Upload to Pinata with cataloging metadata
        const uploadResult = await pinataStorageService.uploadImage(file, userId, {
          'original-name': file.originalname,
          'upload-type': 'batch',
          'batch-index': i.toString(),
          'category': category,
          'subcategory': subcategory
        });

        // Get all display URLs for cross-protocol display
        const displayUrls = pinataStorageService.getAllImageUrls(uploadResult.ipfsHash);

        // Create image record with cataloging
        const image = new Image({
          title: file.originalname,
          description: '',
          userId,
          ipfsHash: uploadResult.ipfsHash,
          ipfsUrl: uploadResult.url,
          gatewayUrl: uploadResult.gatewayUrl,
          fileName: uploadResult.ipfsHash,
          fileSize: uploadResult.size,
          width: imageInfo.width,
          height: imageInfo.height,
          format: imageInfo.format,
          contentType: file.mimetype,
          hasAlpha: imageInfo.hasAlpha,
          hasProfile: imageInfo.hasProfile,
          orientation: imageInfo.orientation,
          channels: imageInfo.channels,
          depth: imageInfo.depth,
          displayUrls,
          catalog: {
            category,
            subcategory,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            keywords: keywords ? keywords.split(',').map(keyword => keyword.trim()) : [],
            uploadType: 'batch',
            originalName: file.originalname,
            batchIndex: i,
            platform: 'twitter'
          },
          isPublic: true
        });

        await image.save();
        results.push({ success: true, image: image.getCatalogEntry(), uploadResult });

      } catch (error) {
        results.push({ 
          success: false, 
          fileName: file.originalname, 
          error: error.message 
        });
      }
    }

    res.status(201).json({
      success: true,
      results,
      total: req.files.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length
    });

  } catch (error) {
    console.error('Batch upload error:', error);
    res.status(500).json({ error: 'Failed to upload images', details: error.message });
  }
});

/**
 * @route DELETE /api/images/:imageId
 * @desc Delete image (soft delete with Pinata unpin)
 * @access Public
 */
router.delete('/:imageId', async (req, res) => {
  try {
    const { imageId } = req.params;
    const { userId } = req.body;

    const image = await Image.findOne({ _id: imageId, userId });
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Soft delete the image
    await image.softDelete();

    // Unpin from Pinata (but don't fail if it doesn't work)
    try {
      await pinataStorageService.deleteImage(image.ipfsHash);
      
      // Unpin Twitter variant if exists
      if (image.twitterVariant?.ipfsHash) {
        await pinataStorageService.deleteImage(image.twitterVariant.ipfsHash);
      }
    } catch (pinataError) {
      console.error('Pinata deletion error:', pinataError);
    }

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });

  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ error: 'Failed to delete image', details: error.message });
  }
});

export default router; 