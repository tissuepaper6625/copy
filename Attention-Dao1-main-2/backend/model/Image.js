import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  // Basic image information
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 5000 // Increased from 1000 to support longer structured prompts
  },
  userId: {
    type: mongoose.Schema.Types.Mixed, // Accept both ObjectId and String
    ref: 'User',
    required: false,
    default: null,
  },
  
  // Storage information (Pinata/IPFS)
  ipfsHash: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  ipfsUrl: {
    type: String,
    required: true
  },
  gatewayUrl: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  contentType: {
    type: String,
    required: true,
    default: 'image/jpeg'
  },
  
  // Image metadata for cataloging
  width: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  format: {
    type: String,
    required: true,
    default: 'jpeg'
  },
  hasAlpha: {
    type: Boolean,
    default: false
  },
  hasProfile: {
    type: Boolean,
    default: false
  },
  orientation: {
    type: Number,
    default: 1
  },
  channels: {
    type: Number,
    default: 3
  },
  depth: {
    type: String,
    default: 'uchar'
  },

  // AI Generation metadata
  isAIGenerated: {
    type: Boolean,
    default: false
  },
  aiGeneration: {
    prompt: String,
    aiModel: {
      type: String,
      default: 'dall-e-3'
    },
    generationQuality: {
      type: String,
      enum: ['standard', 'hd'],
      default: 'standard'
    },
    generationSize: {
      type: String,
      default: '1024x1024'
    },
    generationTimestamp: Date
  },

  // Viral one-liner
  oneLiner: {
    type: String,
    default: ''
  },
  
  // Cross-protocol display URLs (Twitter-optimized)
  displayUrls: {
    ipfs: String,
    gateway: String,
    dweb: String
  },
  
  // Twitter-optimized variant
  twitterVariant: {
    ipfsHash: String,
    ipfsUrl: String,
    gatewayUrl: String,
    width: Number,
    height: Number,
    size: Number
  },
  
  // Cataloging metadata
  catalog: {
    version: {
      type: String,
      default: '1.0'
    },
    category: {
      type: String,
      enum: ['general', 'art', 'photography', 'design', 'meme', 'viral', 'business', 'personal', 'other'],
      default: 'general'
    },
    subcategory: String,
    tags: [{
      type: String,
      trim: true
    }],
    keywords: [{
      type: String,
      trim: true
    }],
    uploadType: {
      type: String,
      enum: ['manual', 'url', 'batch', 'ai-generated'],
      default: 'manual'
    },
    sourceUrl: String,
    originalName: String,
    batchIndex: Number,
    platform: {
      type: String,
      default: 'twitter'
    }
  },
  
  // Accessibility and reliability tracking (Twitter-focused)
  accessibility: {
    ipfs: {
      accessible: { type: Boolean, default: true },
      lastChecked: Date,
      status: Number
    },
    gateway: {
      accessible: { type: Boolean, default: true },
      lastChecked: Date,
      status: Number
    },
    dweb: {
      accessible: { type: Boolean, default: true },
      lastChecked: Date,
      status: Number
    }
  },
  
  // Usage and engagement metrics
  usage: {
    views: {
      type: Number,
      default: 0
    },
    downloads: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    },
    lastAccessed: Date
  },
  
  // Privacy and visibility
  isPublic: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  deletedAt: Date
}, {
  timestamps: true
});

// Indexes for better query performance and cataloging
imageSchema.index({ userId: 1, createdAt: -1 });
imageSchema.index({ 'catalog.category': 1, createdAt: -1 });
imageSchema.index({ 'catalog.tags': 1 });
imageSchema.index({ 'catalog.keywords': 1 });
imageSchema.index({ isPublic: 1, createdAt: -1 });
imageSchema.index({ isFeatured: 1, createdAt: -1 });
imageSchema.index({ isDeleted: 1 });
imageSchema.index({ 'usage.views': -1 });
imageSchema.index({ 'accessibility.gateway.accessible': 1 });
imageSchema.index({ 'catalog.platform': 1 });

// Virtual for aspect ratio
imageSchema.virtual('aspectRatio').get(function() {
  return this.width && this.height ? (this.width / this.height).toFixed(2) : null;
});

// Virtual for file size in MB
imageSchema.virtual('fileSizeMB').get(function() {
  return this.fileSize ? (this.fileSize / (1024 * 1024)).toFixed(2) : null;
});

// Virtual for primary display URL (fallback chain)
imageSchema.virtual('primaryUrl').get(function() {
  return this.displayUrls?.gateway || this.displayUrls?.ipfs || this.ipfsUrl;
});

// Pre-save middleware to update timestamps
imageSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Static method to find images by category
imageSchema.statics.findByCategory = function(category, limit = 20) {
  return this.find({ 
    'catalog.category': category, 
    isPublic: true, 
    isDeleted: false 
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('userId', 'username avatar');
};

// Static method to find images by tags
imageSchema.statics.findByTags = function(tags, limit = 20) {
  return this.find({ 
    'catalog.tags': { $in: tags }, 
    isPublic: true, 
    isDeleted: false 
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('userId', 'username avatar');
};

// Static method to find accessible images
imageSchema.statics.findAccessible = function(limit = 20) {
  return this.find({ 
    $or: [
      { 'accessibility.gateway.accessible': true },
      { 'accessibility.ipfs.accessible': true }
    ],
    isPublic: true,
    isDeleted: false
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('userId', 'username avatar');
};

// Static method to find popular images
imageSchema.statics.findPopular = function(limit = 20) {
  return this.find({ 
    isPublic: true, 
    isDeleted: false 
  })
    .sort({ 'usage.views': -1, 'usage.downloads': -1 })
    .limit(limit)
    .populate('userId', 'username avatar');
};

// Static method to search images
imageSchema.statics.search = function(query, limit = 20) {
  return this.find({
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { 'catalog.tags': { $in: [new RegExp(query, 'i')] } },
      { 'catalog.keywords': { $in: [new RegExp(query, 'i')] } }
    ],
    isPublic: true,
    isDeleted: false
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('userId', 'username avatar');
};

// Instance method to increment usage
imageSchema.methods.incrementUsage = function(type) {
  if (this.usage[type] !== undefined) {
    this.usage[type]++;
    this.usage.lastAccessed = new Date();
  }
  return this.save();
};

// Instance method to update accessibility
imageSchema.methods.updateAccessibility = function(protocol, status) {
  if (this.accessibility[protocol]) {
    this.accessibility[protocol].accessible = status.accessible;
    this.accessibility[protocol].lastChecked = new Date();
    this.accessibility[protocol].status = status.status;
  }
  return this.save();
};

// Instance method to add Twitter variant
imageSchema.methods.addTwitterVariant = function(variantData) {
  this.twitterVariant = {
    ipfsHash: variantData.ipfsHash,
    ipfsUrl: variantData.url,
    gatewayUrl: variantData.gatewayUrl,
    width: variantData.width,
    height: variantData.height,
    size: variantData.size
  };
  return this.save();
};

// Instance method to soft delete
imageSchema.methods.softDelete = function() {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save();
};

// Instance method to restore
imageSchema.methods.restore = function() {
  this.isDeleted = false;
  this.deletedAt = undefined;
  return this.save();
};

// Instance method to get catalog entry
imageSchema.methods.getCatalogEntry = function() {
  return {
    id: this._id,
    userId: this.userId,
    ipfsHash: this.ipfsHash,
    fileName: this.fileName,
    urls: this.displayUrls,
    metadata: {
      size: this.fileSize,
      contentType: this.contentType,
      width: this.width,
      height: this.height,
      format: this.format,
      aspectRatio: this.aspectRatio,
      fileSizeMB: this.fileSizeMB,
      uploadTimestamp: this.createdAt,
      catalogVersion: this.catalog.version,
      platform: this.catalog.platform
    },
    catalog: this.catalog,
    accessibility: this.accessibility,
    usage: this.usage,
    twitterVariant: this.twitterVariant,
    createdAt: this.createdAt
  };
};

const Image = mongoose.model('Image', imageSchema);

export default Image; 