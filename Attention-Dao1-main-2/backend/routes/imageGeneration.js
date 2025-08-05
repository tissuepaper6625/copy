import express from "express";
import imageGeneration from "../utils/imageGeneration.js";
import PinataStorageService from "../utils/storage.js";
import Image from "../model/Image.js";
import { privyMiddleware } from "../middleware/privyMiddleware.js";
import { checkUserCanCreate } from "../utils/limits.js";
import multer from 'multer';
import { fetchTweetContext } from '../utils/tweets.js';

const router = express.Router();

const pinataStorageService = new PinataStorageService();
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit
const videoUpload = multer({ limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB limit

/**
 * @route POST /api/ai/generate
 * @desc Generate AI image with viral content
 * @access Private
 */
router.post('/generate', privyMiddleware, async (req, res) => {
    console.log('[HIT /api/ai/generate]', req.body);
    try {
        let { prompt, size = '1024x1024', quality = 'standard', platform = 'twitter', twitterText = '', style = 'classic', tweetUrl = '' } = req.body;
        let userId = req.user.id;

        if (!userId) {
            return res.status(401).json({ error: 'User ID not found in authentication' });
        }

        // Check user limits for AI image generation (part of coin creation flow)
        const limitsCheck = await checkUserCanCreate(userId, req.user.wallet?.address, req.user.twitter?.username);
        console.log('[AI GENERATE] Limits check:', limitsCheck);
        
        // If user cannot create at all, block AI generation
        if (!limitsCheck.canCreate) {
            return res.status(402).json({ 
                error: 'Creation limit reached',
                requiresPayment: limitsCheck.requiresPayment,
                details: `User daily remaining: ${limitsCheck.userDailyRemaining}, Platform remaining: ${limitsCheck.platformRemaining}`
            });
        }
        
        // If user requires payment, return payment requirement info
        if (limitsCheck.requiresPayment) {
            return res.status(402).json({ 
                error: 'Payment required for AI image generation',
                requiresPayment: true,
                paymentAmount: limitsCheck.paymentAmount,
                details: `User free remaining: ${limitsCheck.userRemaining}, Payment required: $${limitsCheck.paymentAmount / 100}`
            });
        }

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        // Map 'high' to 'hd' for generationQuality
        if (quality === 'high') quality = 'hd';
        if (!['standard', 'hd'].includes(quality)) quality = 'standard';

        // --- Context Gathering ---
        let contextSummary = '';
        let contextDebug = {};
        if (tweetUrl) {
            try {
                const { tweet, replies, quotes, trends } = await fetchTweetContext(tweetUrl);
                // Debug logging for context
                console.log('[CONTEXT] Tweet:', tweet);
                console.log('[CONTEXT] Replies:', replies);
                console.log('[CONTEXT] Quotes:', quotes);
                console.log('[CONTEXT] Trends:', trends);
                contextDebug = { tweet, replies, quotes, trends };
                // Compose a context summary for the AI
                const replySnippets = replies.slice(0, 3).map(r => r.text).join(' | ');
                const quoteSnippets = quotes.slice(0, 2).map(q => q.text).join(' | ');
                const trendList = trends.slice(0, 5).join(', ');
                contextSummary = `Tweet by @${tweet.author?.username || ''}: "${tweet.text}". Top replies: ${replySnippets}. Top quotes: ${quoteSnippets}. Related trends: ${trendList}.`;
                // Use tweet text as twitterText if not provided
                if (!twitterText) twitterText = tweet.text;
            } catch (e) {
                console.warn('Failed to fetch tweet context:', e.message);
            }
        }

        // Sanitize context before sending to OpenAI
        contextSummary = sanitizeContext(contextSummary);

        // Validate required tweet text
        if (!twitterText || twitterText.trim() === "") {
            return res.status(400).json({ error: "A tweet or tweet text is required for meme generation." });
        }

        // Use GPT-4 to generate a DALL-E visual prompt
        const visualPrompt = await imageGeneration.generateVisualPrompt({
            caption: prompt, // meme caption
            tweet_text: twitterText, // actual tweet
            tone: style, // classic, serious, trending
            contextSummary
        });
        console.log('[AI GENERATION] Original prompt:', prompt);
        console.log('[AI GENERATION] Visual prompt for DALL-E:', visualPrompt);

        // --- BULLETPROOF text overlay parsing from visualPrompt ---
        let topText = '';
        let bottomText = '';
        
        console.log('[MEME OVERLAY] Starting text overlay parsing...');
        console.log('[MEME OVERLAY] Full visualPrompt:', visualPrompt);
        
        // Enhanced clean helper
        const clean = (str) => {
            if (!str) return '';
            return str
                .replace(/^(TOP:|BOTTOM:|CENTER:)\s*/gi, '') // Remove prefixes
                .replace(/^['"\[\(]+|['"\]\)]+$/g, '') // Remove quotes, brackets, parentheses
                .replace(/\s*\(if any\)/gi, '') // Remove "(if any)" suffix
                .replace(/^[,\s]+|[,\s]+$/g, '') // Remove leading/trailing commas and spaces
                .replace(/\s+/g, ' ') // Normalize whitespace
                .trim();
        };
        
        // Strategy 1: Look for "Text overlay:" section (most common)
        // First try to match both TOP and BOTTOM in a single capture
        let textOverlayMatch = visualPrompt.match(/Text overlay:\s*\n?(TOP:[\s\S]*?BOTTOM:[\s\S]*?)(?=\n[A-Z]|\n\n|$)/i);
        
        if (!textOverlayMatch) {
            // Try to capture everything after "Text overlay:" until a clear section break
            textOverlayMatch = visualPrompt.match(/Text overlay:\s*([\s\S]*?)(?=\n\n|\n[A-Z][a-z]+[^:]*:|$)/i);
        }
        if (!textOverlayMatch) {
            // More permissive: capture everything after "Text overlay:" until we find a clear section break
            textOverlayMatch = visualPrompt.match(/Text overlay:\s*([\s\S]*?)(?=\n[A-Z]{2,}|$)/i);
        }
        if (!textOverlayMatch) {
            // Even more permissive: look for content between "Text overlay:" and any major break
            textOverlayMatch = visualPrompt.match(/Text overlay:\s*([\s\S]*?)(?=\n\w+\s*:|$)/i);
        }
        if (!textOverlayMatch) {
            // Very permissive: capture everything after "Text overlay:" 
            textOverlayMatch = visualPrompt.match(/Text overlay:\s*([\s\S]+?)(?=\n[^\s\n]|$)/i);
        }
        if (!textOverlayMatch) {
            // Last resort: capture everything after "Text overlay:"
            textOverlayMatch = visualPrompt.match(/Text overlay:\s*([\s\S]+)/i);
        }
        
        if (textOverlayMatch) {
            // Extract the overlay section, prioritizing capture group 1 if it exists
            let overlaySection = '';
            if (textOverlayMatch[1]) {
                overlaySection = textOverlayMatch[1].trim();
            } else {
                overlaySection = textOverlayMatch[0].replace(/^Text overlay:\s*/i, '').trim();
            }
            console.log('[MEME OVERLAY] Raw overlaySection:', `"${overlaySection}"`);
            
            // Multi-line parsing: Look for TOP: and BOTTOM: on separate lines
            const lines = overlaySection.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
            
            for (const line of lines) {
                // Enhanced TOP parsing - now only the most permissive pattern
                if (line.match(/^TOP:/i)) {
                    const match = line.match(/TOP:\s*(.+)$/i);
                    if (match && match[1] && match[1].trim()) {
                        topText = clean(match[1]);
                        console.log('[MEME OVERLAY] Found TOP text via permissive pattern:', topText);
                    }
                }
                // Enhanced BOTTOM parsing - now only the most permissive pattern
                if (line.match(/^BOTTOM:/i)) {
                    const match = line.match(/BOTTOM:\s*(.+)$/i);
                    if (match && match[1] && match[1].trim()) {
                        bottomText = clean(match[1]);
                        console.log('[MEME OVERLAY] Found BOTTOM text via permissive pattern:', bottomText);
                    }
                }
            }
            
            // Single-line parsing fallback: "TOP: text, BOTTOM: text"
            if (!topText || !bottomText) {
                const singleLinePatterns = [
                    /TOP:\s*["']([^"']+)["']\s*,?\s*BOTTOM:\s*["']([^"']+)["']/i,
                    /TOP:\s*([^,]+?)\s*,\s*BOTTOM:\s*(.+?)$/i,
                    /["']([^"']+)["']\s*,?\s*["']([^"']+)["']/
                ];
                
                for (const pattern of singleLinePatterns) {
                    const match = overlaySection.match(pattern);
                    if (match && match[1] && match[2]) {
                        if (!topText) topText = clean(match[1]);
                        if (!bottomText) bottomText = clean(match[2]);
                        console.log('[MEME OVERLAY] Single-line pattern matched:', pattern);
                        break;
                    }
                }
            }
        }
        
        // Strategy 2: Direct TOP/BOTTOM extraction fallback
        if (!topText || !bottomText) {
            console.log('[MEME OVERLAY] Trying direct TOP/BOTTOM extraction from full response...');
            
            // Try to find TOP and BOTTOM patterns anywhere in the response
            if (!topText) {
                const match = visualPrompt.match(/TOP:\s*(.+)$/im);
                if (match && match[1] && match[1].trim()) {
                    topText = clean(match[1]);
                    console.log('[MEME OVERLAY] Direct TOP found (permissive):', topText);
                }
            }
            
            if (!bottomText) {
                const match = visualPrompt.match(/BOTTOM:\s*(.+)$/im);
                if (match && match[1] && match[1].trim()) {
                    bottomText = clean(match[1]);
                    console.log('[MEME OVERLAY] Direct BOTTOM found (permissive):', bottomText);
                }
            }
        }
        
        // Strategy 3: Generic quote extraction fallback (when no "Text overlay:" section)
        if (!topText && !bottomText) {
            console.log('[MEME OVERLAY] No Text overlay section found, trying quote extraction...');
            
            // Look for quoted text throughout the entire prompt
            const quotedParts = visualPrompt.match(/"([^"]+)"/g);
            if (quotedParts && quotedParts.length > 0) {
                // Clean up the quotes and get the actual text
                const cleanedQuotes = quotedParts.map(q => clean(q.replace(/"/g, '')));
                
                if (cleanedQuotes.length >= 2) {
                    topText = cleanedQuotes[0];
                    bottomText = cleanedQuotes[1];
                    console.log('[MEME OVERLAY] Quote extraction: TOP:', topText, 'BOTTOM:', bottomText);
                } else if (cleanedQuotes.length === 1) {
                    bottomText = cleanedQuotes[0]; // Use single quote as bottom text
                    console.log('[MEME OVERLAY] Quote extraction: Single quote as BOTTOM:', bottomText);
                }
            }
        }
        
        // Strategy 3: Context-based extraction (last resort)
        if (!topText && !bottomText) {
            console.log('[MEME OVERLAY] Trying context-based extraction...');
            
            // Look for common meme patterns
            const contextPatterns = [
                /When you\s+(.+?)(?:\.|$)/i,
                /But then\s+(.+?)(?:\.|$)/i,
                /Me:\s+(.+?)(?:\.|$)/i,
                /Also me:\s+(.+?)(?:\.|$)/i
            ];
            
            for (const pattern of contextPatterns) {
                const match = visualPrompt.match(pattern);
                if (match && match[1]) {
                    bottomText = clean(match[1]);
                    console.log('[MEME OVERLAY] Context pattern matched:', pattern, '→', bottomText);
                    break;
                }
            }
        }
        
        // Clean up and validate results
        topText = topText ? clean(topText) : '';
        bottomText = bottomText ? clean(bottomText) : '';
        
        // Deduplicate: if topText and bottomText are identical, only show bottomText
        if (topText && bottomText && topText.trim() === bottomText.trim()) {
            console.log('[MEME OVERLAY] Deduplicating identical texts');
            topText = '';
        }
        
        // Ensure we have at least some text
        if (!topText && !bottomText) {
            console.log('[MEME OVERLAY] No text extracted, using fallback based on user prompt');
            bottomText = prompt || 'Epic meme moment';
        }
        
        // Final validation and length limits
        topText = topText.length > 80 ? topText.substring(0, 80) + '...' : topText;
        bottomText = bottomText.length > 80 ? bottomText.substring(0, 80) + '...' : bottomText;
        
        console.log('[MEME OVERLAY] FINAL topText:', topText);
        console.log('[MEME OVERLAY] FINAL bottomText:', bottomText);
        // --- End enhanced overlay parsing ---

        // Send the entire structured GPT-4 output to DALL-E, but only for the image (no overlays)
        // Remove the Text overlay and Branding sections for the image generation prompt
        const imageOnlyPrompt = visualPrompt.replace(/Text overlay:[\s\S]*?(?=Branding:|$)/i, '').replace(/Branding:[\s\S]*?(?=Layout:|$)/i, '');
        const imageResult = await imageGeneration.generateImage(imageOnlyPrompt, size, quality);

        // Upload to Pinata with meme overlays
        const uploadInput = imageResult.url ? imageResult.url : imageResult.b64_json;
        // Pass parsed topText and bottomText
        const uploadResults = await pinataStorageService.uploadAIGeneratedImage(uploadInput, userId, topText, bottomText);

        // Generate viral one-liner
        const viralContent = await imageGeneration.generateViralOneLiner(visualPrompt, platform);

        // Create image record
        const image = new Image({
            title: `AI Generated: ${visualPrompt.substring(0, 50)}...`,
            description: visualPrompt,
            userId,
            ipfsHash: uploadResults.ipfsHash,
            ipfsUrl: uploadResults.url,
            gatewayUrl: uploadResults.gatewayUrl,
            fileName: `ai_${Date.now()}.jpg`,
            fileSize: uploadResults.size,
            contentType: 'image/jpeg',
            width: uploadResults.width,
            height: uploadResults.height,
            format: 'jpeg',
            isAIGenerated: true,
            aiGeneration: {
                prompt: visualPrompt,
                aiModel: 'gpt-4o',
                generationQuality: quality,
                generationSize: size,
                generationTimestamp: new Date()
            },
            oneLiner: viralContent || uploadResults.oneLiner,
            category: 'viral'
        });

        await image.save();

        res.status(201).json({
            openAiImageUrl: imageResult.url,
            ipfsImageUrl: uploadResults.url,
            gatewayUrl: uploadResults.gatewayUrl,
            viralCaption: viralContent || uploadResults.oneLiner,
            image,
            success: true,
            contextDebug // <-- Return context details for debugging
        });

    } catch (error) {
        console.error('AI image generation error:', error);
        res.status(500).json({ 
            error: 'Failed to generate AI image', 
            details: error.message 
        });
    }
});

/**
 * @route POST /api/ai/viral-content
 * @desc Generate viral one-liner for existing image
 * @access Private
 */
router.post('/api/ai/viral-content', privyMiddleware, async (req, res) => {
  try {
    const { imageId } = req.body;
    const userId = req.user.id;

    const image = await Image.findOne({ _id: imageId, userId });
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Generate viral content
    const viralContent = await imageGeneration.generateViralOneLiner(image.description, 'twitter');

    // Update image with viral content
    image.oneLiner = viralContent;

    await image.save();

    res.json({
      success: true,
      viralContent: viralContent,
    });

  } catch (error) {
    console.error('Viral content generation error:', error);
    res.status(500).json({ error: 'Failed to generate viral content', details: error.message });
  }
});

/**
 * @route POST /api/ai/upload-and-caption
 * @desc Upload a file (image/gif/video), generate AI caption, and upload to Pinata
 * @access Private
 */
router.post('/upload-and-caption', privyMiddleware, upload.single('file'), async (req, res) => {
  try {
    const userId = req.user.id;
    const { memeCaption = '', memeStyle = 'classic', twitterText = '' } = req.body;
    const file = req.file;

    console.log('File received:', file);

    if (!userId) {
      return res.status(401).json({ error: 'User ID not found in authentication' });
    }
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Patch: If file.buffer exists, create a new File object for uploadImage
    let fileForUpload = file;
    if (file.buffer && file.originalname) {
      // Node.js does not have a File constructor, so pass the Multer file object as-is
      // uploadImage should be able to handle file.buffer and file.originalname
      fileForUpload = file;
    }

    // Upload file to Pinata
    let pinataRes;
    if (file.buffer) {
      pinataRes = await pinataStorageService.uploadImageBufferDirect(file, userId);
    } else {
      pinataRes = await pinataStorageService.uploadImage(file, userId);
    }

    if (!pinataRes || !pinataRes.url) {
      return res.status(500).json({ error: 'Failed to upload file to Pinata' });
    }

    // Generate AI caption using OpenAI
    const aiCaption = await imageGeneration.generateViralOneLiner(
      `${twitterText}\n${memeCaption}\nStyle: ${memeStyle}`,
      'twitter'
    );

    res.status(201).json({
      pinataUrl: pinataRes.url,
      ipfsHash: pinataRes.ipfsHash,
      aiCaption,
      success: true
    });
  } catch (error) {
    console.error('Upload and AI caption error:', error);
    res.status(500).json({ error: 'Failed to upload and generate caption', details: error.message });
  }
});

/**
 * @route POST /api/upload/file
 * @desc Upload an image/gif file to Pinata (no AI caption generation)
 * @access Private
 */
router.post('/upload/file', privyMiddleware, upload.single('file'), async (req, res) => {
  try {
    const userId = req.user.id;
    const file = req.file;

    if (!userId) {
      return res.status(401).json({ error: 'User ID not found in authentication' });
    }
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    // Only allow image files
    if (!file.mimetype.startsWith('image/')) {
      return res.status(400).json({ error: 'Only image files are allowed.' });
    }

    // Use Pinata's uploadToPinata directly (no image validation)
    const fileName = pinataStorageService.generateFileName(file.originalname, userId, 'file-upload');
    const uploadMetadata = {
      'upload-timestamp': new Date().toISOString(),
      'original-name': file.originalname,
      'user-id': userId,
      'upload-type': 'file',
      'platform': 'twitter'
    };

    const pinataRes = await pinataStorageService.uploadToPinata(file, fileName, uploadMetadata);

    if (!pinataRes || !pinataRes.url) {
      return res.status(500).json({ error: 'Failed to upload file to Pinata' });
    }

    // Check if image already exists with this IPFS hash
    let image = await Image.findOne({ ipfsHash: pinataRes.ipfsHash });
    
    if (!image) {
      // Create new image record only if it doesn't exist
      image = new Image({
        title: file.originalname,
        description: '',
        userId,
        ipfsHash: pinataRes.ipfsHash,
        ipfsUrl: pinataRes.url,
        gatewayUrl: pinataRes.gatewayUrl,
        fileName: file.originalname,
        fileSize: file.size,
        contentType: file.mimetype,
        width: 0,
        height: 0,
        format: file.mimetype.split('/')[1] || 'jpeg',
        isAIGenerated: false
      });
      await image.save();
    }

    res.status(201).json({
      pinataUrl: pinataRes.url,
      ipfsHash: pinataRes.ipfsHash,
      gatewayUrl: pinataRes.gatewayUrl,
      size: pinataRes.size,
      contentType: file.mimetype,
      success: true
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'Failed to upload file', details: error.message });
  }
});

/**
 * @route POST /api/upload/video
 * @desc Upload a video file to Pinata
 * @access Private
 */
router.post('/upload/video', privyMiddleware, videoUpload.single('file'), async (req, res) => {
  try {
    const userId = req.user.id;
    const file = req.file;

    if (!userId) {
      return res.status(401).json({ error: 'User ID not found in authentication' });
    }
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    // Only allow video files
    if (!file.mimetype.startsWith('video/')) {
      return res.status(400).json({ error: 'Only video files are allowed.' });
    }

    // Use Pinata's uploadToPinata directly (no image validation)
    const fileName = pinataStorageService.generateFileName(file.originalname, userId, 'video-upload');
    const uploadMetadata = {
      'upload-timestamp': new Date().toISOString(),
      'original-name': file.originalname,
      'user-id': userId,
      'upload-type': 'video',
      'platform': 'twitter'
    };

    const pinataRes = await pinataStorageService.uploadToPinata(file, fileName, uploadMetadata);

    if (!pinataRes || !pinataRes.url) {
      return res.status(500).json({ error: 'Failed to upload video to Pinata' });
    }

    // Check if image already exists with this IPFS hash
    let image = await Image.findOne({ ipfsHash: pinataRes.ipfsHash });
    
    if (!image) {
      // Create new image record only if it doesn't exist
      image = new Image({
        title: file.originalname,
        description: '',
        userId,
        ipfsHash: pinataRes.ipfsHash,
        ipfsUrl: pinataRes.url,
        gatewayUrl: pinataRes.gatewayUrl,
        fileName: file.originalname,
        fileSize: file.size,
        contentType: file.mimetype,
        width: 0,
        height: 0,
        format: file.mimetype.split('/')[1] || 'mp4',
        isAIGenerated: false
      });
      await image.save();
    }

    res.status(201).json({
      pinataUrl: pinataRes.url,
      ipfsHash: pinataRes.ipfsHash,
      gatewayUrl: pinataRes.gatewayUrl,
      size: pinataRes.size,
      contentType: file.mimetype,
      success: true
    });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({ error: 'Failed to upload video', details: error.message });
  }
});

/**
 * @route POST /api/ai/viral-content
 * @desc Generate viral one-liner for a meme (text only, no file)
 * @access Private
 */
router.post('/api/ai/viral-content', privyMiddleware, async (req, res) => {
  try {
    const { memeCaption = '', memeStyle = 'classic', twitterText = '' } = req.body;
    // Use your existing AI logic to generate a one-liner
    const prompt = `${twitterText}\n${memeCaption}\nStyle: ${memeStyle}`;
    const viralContent = await imageGeneration.generateViralOneLiner(prompt, 'twitter');
    res.json({ success: true, viralContent });
  } catch (error) {
    console.error('Viral content generation error:', error);
    res.status(500).json({ error: 'Failed to generate viral content', details: error.message });
  }
});

/**
 * @route GET /api/ai/user/:userId
 * @desc Get user's AI-generated images
 * @access Public
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const images = await Image.find({ 
      userId, 
      isAIGenerated: true, 
      isPublic: true 
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate('userId', 'username avatar');

    const total = await Image.countDocuments({ 
      userId, 
      isAIGenerated: true, 
      isPublic: true 
    });

    res.json({
      success: true,
      images,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('User AI images error:', error);
    res.status(500).json({ error: 'Failed to fetch user AI images', details: error.message });
  }
});

// Context sanitization utility
function sanitizeContext(context) {
  if (!context) return '';
  return context
    .replace(/kill Jews/gi, '[redacted]')
    .replace(/child f\*cker/gi, '[redacted]')
    .replace(/Hitler/gi, '[controversial figure]')
    .replace(/hate/gi, '[redacted]')
    // Add more as needed
    ;
}

export default router;