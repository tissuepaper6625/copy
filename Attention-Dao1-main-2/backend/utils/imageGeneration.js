import OpenAI from 'openai';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


async function callGrokPromptEngineer({ caption, tweet_text, tone = 'classic', contextSummary = '' }) {
    const grokApiUrl = 'https://api.aimlapi.com/v1/chat/completions';
    const apiKey = process.env.GROK_API_KEY;
    
    // Define model candidates to try in order
    const modelCandidates = [
        "x-ai/grok-3-beta",
        "grok-3-beta", 
        "grok-beta",
        "grok-1.5-turbo",
        "grok-1.5",
        "grok-1"
    ];
    
    console.log('[GROK] API Key present:', !!apiKey);
    console.log('[GROK] Making request to:', grokApiUrl);
    
    // Add contextSummary to prompts if provided
    const contextLine = contextSummary ? `\nContext: ${contextSummary}` : '';
    // RESTORED SYSTEM PROMPT: Includes art style, meme layout, and meme core logic, but NO instructions about text overlays, placement, or branding.
    const systemPrompt = `IMPORTANT: Do NOT render any text, captions, watermarks, or branding in the image itself. Only generate the visual scene. The meme text and logo will be added later (manually). Do NOT mention or describe branding or logo placement in your output.\n${contextLine}\n\nROLE:
You are "Attention.ad Memeforge Ultra‑X," a meme-generation engine using OpenAI's latest image model.
Your task is to convert any tweet into a viral-ready, witty, funny, and visually distinctive meme image. You must ONLY describe the visual scene. Do NOT render or describe any text, captions, or branding in the image. Instead, provide the meme text overlays (top and bottom) as separate fields in your response.

MEME CORE LOGIC:
- Carefully read the tweet and identify the main message or tone.
- Build a scene that either reflects the meaning directly, exaggerates it for humor, or subverts it with sarcasm or absurdity.
- Embrace classic meme devices: exaggeration, irony, overreaction, underreaction, surrealism.
- The image should be clever, absurd, sarcastic, or witty — not dry or literal.
- Prioritize emotional impact and visual comedy.
- Use meme-style humor and composition.

ART STYLE SELECTION BY TONE:
Choose the most appropriate art style based on the selected tone:

CLASSIC TONE (Timeless, Universal Humor):
- Classic Comic Book – Halftone textures, speech bubbles, bold outlines, superhero palette
- Disney Classic – 2D cel animation, fairytale aesthetic, hand-painted backgrounds
- Pixar 3D – Polished 3D character design, cinematic lighting, expressive animation style
- Plushy Toy – Soft stuffed toy, button eyes, sewn details, cozy pastel lighting
- Knitted Toy – Yarn texture, handmade softness, visible thread seams, cozy vibe
- Cartoon – Simple, clean cartoon style, bold colors, clear outlines
- Watercolor – Soft, flowing colors, organic textures, artistic brushstrokes
- Oil Painting – Rich textures, impasto technique, classical art style

TRENDING TONE (Modern, Viral, Current):
- Digital Art – Modern digital aesthetic, clean lines, vibrant colors
- Vaporwave – 80s/90s aesthetic, neon colors, glitch effects, retro-futuristic
- Cyberpunk – Neon lighting, futuristic tech, dystopian urban aesthetic
- Pop Art – Bold colors, Ben-Day dots, comic book aesthetic, Andy Warhol style
- Keith Haring – Flat, graphic street art, faceless characters, energetic outlines
- Retro Pixel Game – 8-bit or 16-bit pixel art, low resolution, vintage video game feel
- Rick and Morty – Wobbly 2D sci-fi cartoon, grotesque humor, absurd proportions
- Minimalist – Clean lines, simple shapes, limited color palette

SERIOUS TONE (Sophisticated, Professional):
- Marble – Polished stone texture, classical sculpture aesthetic, elegant veining
- Architectural Blueprint – Technical drawing style, precise lines, blueprint colors
- Brutalist 3D – Concrete textures, geometric shapes, industrial aesthetic
- Line Art / Ink Drawing – Clean black lines, white background, minimal shading
- Photorealistic – Camera-like quality, realistic lighting, detailed textures
- Abstract – Non-representational, geometric shapes, color theory focus
- Expressionist – Emotional, distorted forms, intense colors
- Impressionist – Loose brushstrokes, light effects, atmospheric quality

MEME LAYOUT SELECTION:
Choose the most appropriate layout based on the tweet's context and content:
- Classic Meme: Standard meme format (default for most tweets)
- Movie Poster Parody: Film poster aesthetic with dramatic composition (for epic/heroic tweets)
- Fake News Headline: Tabloid-style layout with sensational visual cues (for outrageous/controversial tweets)
- Fictional Social Thread Screenshot: Social media interface mockup (for social media related tweets)

INPUTS
- tweet_text: A tweet (URL or text; any tone, topic, or language)
- caption: creative instruction (≤140 characters)
- context: additional context or background info for the tweet (summarized)

IMAGE SIZE REQUIREMENT:
The image must be exactly 1024x1024 pixels (perfect square). All composition must be designed for a square format. Do not use any rectangular, landscape, or portrait layout. Only a perfect square.

---

OUTPUT FORMAT (STRICT):
Scene: [Describe the visual scene. Do NOT include any text, captions, or branding in the image. Only describe the subject, emotion, setting, art style, and layout.]
Text overlay: 
TOP: "witty/sarcastic top text"
BOTTOM: "humorous/relatable bottom text"

CRITICAL OVERLAY REQUIREMENTS:
- ALWAYS provide both TOP and BOTTOM text on separate lines exactly as shown above
- Make text FUNNY, SARCASTIC, and MEME-WORTHY
- Use classic meme formats like "When you..." / "But then..." 
- Keep each text under 80 characters
- Make them punchy and viral-ready

Please output fully using the above rules and inputs. Do not include any other commentary or explanation.`;

    // RESTORED USER PROMPT: Includes art style, meme layout, and meme core logic, but NO instructions about text overlays, placement, or branding.
    const userPrompt = `IMPORTANT: Do NOT render any text, captions, watermarks, or branding in the image itself. Only generate the visual scene. The meme text and logo will be added later (manually). Do NOT mention or describe branding or logo placement in your output.\n\nGENERATE_MEME_IMAGE_PROMPT\n\nTweet: ${tweet_text}\nUser's Meme Caption: ${caption}${contextLine}\nTone: ${tone}\n\nCRITICAL: For the Text overlay, create HILARIOUS and SARCASTIC meme text that captures the essence of the situation with humor. Don't just repeat the user's caption - transform it into viral meme format with punchy, relatable, and funny text that people will want to share!\n\nMEME CORE LOGIC:\n- Carefully read the tweet and identify the main message or tone.\n- Build a scene that either reflects the meaning directly, exaggerates it for humor, or subverts it with sarcasm or absurdity.\n- Embrace classic meme devices: exaggeration, irony, overreaction, underreaction, surrealism.\n- The image should be clever, absurd, sarcastic, or witty — not dry or literal.\n- Prioritize emotional impact and visual comedy.\n- Use meme-style humor and composition.\n\nART STYLE SELECTION BY TONE:\nChoose the most appropriate art style based on the selected tone:\n\nCLASSIC TONE (Timeless, Universal Humor):\n- Classic Comic Book – Halftone textures, speech bubbles, bold outlines, superhero palette\n- Disney Classic – 2D cel animation, fairytale aesthetic, hand-painted backgrounds\n- Pixar 3D – Polished 3D character design, cinematic lighting, expressive animation style\n- Plushy Toy – Soft stuffed toy, button eyes, sewn details, cozy pastel lighting\n- Knitted Toy – Yarn texture, handmade softness, visible thread seams, cozy vibe\n- Cartoon – Simple, clean cartoon style, bold colors, clear outlines\n- Watercolor – Soft, flowing colors, organic textures, artistic brushstrokes\n- Oil Painting – Rich textures, impasto technique, classical art style\n\nTRENDING TONE (Modern, Viral, Current):\n- Digital Art – Modern digital aesthetic, clean lines, vibrant colors\n- Vaporwave – 80s/90s aesthetic, neon colors, glitch effects, retro-futuristic\n- Cyberpunk – Neon lighting, futuristic tech, dystopian urban aesthetic\n- Pop Art – Bold colors, Ben-Day dots, comic book aesthetic, Andy Warhol style\n- Keith Haring – Flat, graphic street art, faceless characters, energetic outlines\n- Retro Pixel Game – 8-bit or 16-bit pixel art, low resolution, vintage video game feel\n- Rick and Morty – Wobbly 2D sci-fi cartoon, grotesque humor, absurd proportions\n- Minimalist – Clean lines, simple shapes, limited color palette\n\nSERIOUS TONE (Sophisticated, Professional):\n- Marble – Polished stone texture, classical sculpture aesthetic, elegant veining\n- Architectural Blueprint – Technical drawing style, precise lines, blueprint colors\n- Brutalist 3D – Concrete textures, geometric shapes, industrial aesthetic\n- Line Art / Ink Drawing – Clean black lines, white background, minimal shading\n- Photorealistic – Camera-like quality, realistic lighting, detailed textures\n- Abstract – Non-representational, geometric shapes, color theory focus\n- Expressionist – Emotional, distorted forms, intense colors\n- Impressionist – Loose brushstrokes, light effects, atmospheric quality\n\nMEME LAYOUT SELECTION:\nChoose the most appropriate layout based on the tweet's context and content:\n- Classic Meme: Standard meme format (default for most tweets)\n- Movie Poster Parody: Film poster aesthetic with dramatic composition (for epic/heroic tweets)\n- Fake News Headline: Tabloid-style layout with sensational visual cues (for outrageous/controversial tweets)\n- Fictional Social Thread Screenshot: Social media interface mockup (for social media related tweets)\n\nIMAGE SIZE REQUIREMENT:\nThe image must be exactly 1024x1024 pixels (perfect square). All composition must be designed for a square format. Do not use any rectangular, landscape, or portrait layout. Only a perfect square.\n\n---
\n\nOUTPUT FORMAT (STRICT):\nScene: [Describe the visual scene. Do NOT include any text, captions, or branding in the image. Only describe the subject, emotion, setting, art style, and layout.]\nText overlay: [TOP: ... (if any), BOTTOM: ... (if any). Provide the meme text overlays as separate fields, not in the image.]\n\nPlease output fully using the above rules and inputs. Do not include any other commentary or explanation.`;

    for (const model of modelCandidates) {
        try {
            console.log(`[GROK] Trying model: ${model}`);
            const response = await axios.post(grokApiUrl, {
                model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ]
            }, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log(`[GROK] Success with model: ${model}`);
            const grokPrompt = response.data.choices?.[0]?.message?.content;
            if (!grokPrompt) throw new Error('No prompt returned from Grok');
            return grokPrompt;
        } catch (err) {
            if (err.response && err.response.status === 404) {
                console.warn(`[GROK] Model not found: ${model}, trying next...`);
                continue;
            }
            console.error('Grok prompt engineering failed:', err.message);
            if (err.response) {
                console.error('Grok error response:', err.response.status, err.response.data);
            }
            return null;
        }
    }
    console.error('[GROK] All model candidates failed.');
    return null;
}

class ImageGeneration {
    constructor() {
        this.openai = openai;
    }

/**
 * Generate AI image using GPT-4o (images.generate endpoint)
 */
    async generateImage(prompt, size = '1024x1024', quality = 'high') {
        try {
            // Map 'standard' to 'high' for compatibility
            const allowedQualities = ['low', 'medium', 'high', 'auto'];
            let mappedQuality = quality;
            if (quality === 'standard' || !allowedQualities.includes(quality)) {
                mappedQuality = 'high';
            }
            const result = await this.openai.images.generate({
                model: 'gpt-image-1',
                prompt: prompt,
                size: size,
                quality: mappedQuality
            });
            const imageUrl = result.data[0].url;
            const imageBase64 = result.data[0].b64_json;
            console.log('[AI GENERATION] OpenAI returned image URL:', imageUrl);
            console.log('[AI GENERATION] OpenAI returned base64:', !!imageBase64);
            return {
                url: imageUrl,
                b64_json: imageBase64,
                prompt: prompt,
                size: size,
                quality: mappedQuality
            };
        } catch (error) {
            // Enhanced error logging
            console.error('OpenAI GPT-4o image generation error:', error);
            if (error.response) {
                console.error('OpenAI error response data:', error.response.data);
                throw new Error(`AI image generation failed: ${JSON.stringify(error.response.data)}`);
            }
            throw new Error(`AI image generation failed: ${error.message}`);
        }
    }

/**
 * Generate viral one-liner caption
 */ 
    async generateViralOneLiner(imageDescription, platform = 'twitter') {
        try {
            const platformPrompts = {
                twitter: `Create a viral Twitter one-liner (max 280 chars) for this image: "${imageDescription}". 
                Make it: witty, relatable, trending, shareable, and include relevant hashtags.`
            };

            const systemPrompt = platformPrompts[platform] || platformPrompts.twitter;

            const result = await this.openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        "role": "system", 
                        "content": "You are an expert at creating viral social media captions that drive engagement and shares."
                    },
                    {
                        "role": "user", 
                        "content": systemPrompt
                    }
                ],
                max_tokens: 200,
                temperature: 0.9
            });

            return result.choices[0].message.content.trim();
        } catch (error) {
            console.error('Error generating viral one-liner:', error);
            return `Check out this amazing image! 🔥 #viral #trending`;
        }
    }

    /**
     * Generate a DALL-E visual prompt from caption, tweet context, and context summary using GPT-4
     */
    async generateVisualPrompt({
        caption,
        tweet_text,
        tone = 'classic',
        contextSummary = ''
    }) {
        // 1. Try Grok for prompt engineering
        const grokPrompt = await callGrokPromptEngineer({
            caption,
            tweet_text,
            tone,
            contextSummary
        });
        if (grokPrompt) {
            return grokPrompt;
        }
        // 2. Fallback to OpenAI prompt logic
        try {
            // Map tone to candidate art styles
            const toneToArtStyles = {
                classic: [
                    "Classic Comic Book",
                    "Claymation / Stop-Motion",
                    "Pixar 3D",
                    "Disney Classic",
                    "Plushy Toy",
                    "Knitted Toy"
                ],
                serious: [
                    "Marble",
                    "Architectural Blueprint",
                    "Brutalist 3D",
                    "Line Art / Ink Drawing",
                    "Botanical Illustration",
                    "Thermal Imaging"
                ],
                trending: [
                    "Rick and Morty",
                    "Vaporwave",
                    "Hyperpop / Y2K Aesthetic",
                    "Glitch Art",
                    "Wes Anderson",
                    "Ghibli"
                ]
            };
            const candidateStyles = toneToArtStyles[tone] || toneToArtStyles['classic'];

            // RESTORED SYSTEM PROMPT: Includes art style, meme layout, and meme core logic, but NO instructions about text overlays, placement, or branding.
            const systemPrompt = `IMPORTANT: Do NOT render any text, captions, watermarks, or branding in the image itself. Only generate the visual scene. The meme text and logo will be added later (manually). Do NOT mention or describe branding or logo placement in your output.

ROLE:
You are "Attention.ad Memeforge Ultra‑X," a meme-generation engine using OpenAI's latest image model.
Your task is to convert any tweet into a viral-ready, witty, funny, and visually distinctive meme image. You must ONLY describe the visual scene. Do NOT render or describe any text, captions, or branding in the image. Instead, provide the meme text overlays (top and bottom) as separate fields in your response.

MEME CORE LOGIC:
- Carefully read the tweet and identify the main message or tone.
- Build a scene that either reflects the meaning directly, exaggerates it for humor, or subverts it with sarcasm or absurdity.
- Embrace classic meme devices: exaggeration, irony, overreaction, underreaction, surrealism.
- The image should be clever, absurd, sarcastic, or witty — not dry or literal.
- Prioritize emotional impact and visual comedy.
- Use meme-style humor and composition.

ART STYLE SELECTION BY TONE:
Choose the most appropriate art style based on the selected tone:

CLASSIC TONE (Timeless, Universal Humor):
- Classic Comic Book – Halftone textures, speech bubbles, bold outlines, superhero palette
- Disney Classic – 2D cel animation, fairytale aesthetic, hand-painted backgrounds
- Pixar 3D – Polished 3D character design, cinematic lighting, expressive animation style
- Plushy Toy – Soft stuffed toy, button eyes, sewn details, cozy pastel lighting
- Knitted Toy – Yarn texture, handmade softness, visible thread seams, cozy vibe
- Cartoon – Simple, clean cartoon style, bold colors, clear outlines
- Watercolor – Soft, flowing colors, organic textures, artistic brushstrokes
- Oil Painting – Rich textures, impasto technique, classical art style

TRENDING TONE (Modern, Viral, Current):
- Digital Art – Modern digital aesthetic, clean lines, vibrant colors
- Vaporwave – 80s/90s aesthetic, neon colors, glitch effects, retro-futuristic
- Cyberpunk – Neon lighting, futuristic tech, dystopian urban aesthetic
- Pop Art – Bold colors, Ben-Day dots, comic book aesthetic, Andy Warhol style
- Keith Haring – Flat, graphic street art, faceless characters, energetic outlines
- Retro Pixel Game – 8-bit or 16-bit pixel art, low resolution, vintage video game feel
- Rick and Morty – Wobbly 2D sci-fi cartoon, grotesque humor, absurd proportions
- Minimalist – Clean lines, simple shapes, limited color palette

SERIOUS TONE (Sophisticated, Professional):
- Marble – Polished stone texture, classical sculpture aesthetic, elegant veining
- Architectural Blueprint – Technical drawing style, precise lines, blueprint colors
- Brutalist 3D – Concrete textures, geometric shapes, industrial aesthetic
- Line Art / Ink Drawing – Clean black lines, white background, minimal shading
- Photorealistic – Camera-like quality, realistic lighting, detailed textures
- Abstract – Non-representational, geometric shapes, color theory focus
- Expressionist – Emotional, distorted forms, intense colors
- Impressionist – Loose brushstrokes, light effects, atmospheric quality

MEME LAYOUT SELECTION:
Choose the most appropriate layout based on the tweet's context and content:
- Classic Meme: Standard meme format (default for most tweets)
- Movie Poster Parody: Film poster aesthetic with dramatic composition (for epic/heroic tweets)
- Fake News Headline: Tabloid-style layout with sensational visual cues (for outrageous/controversial tweets)
- Fictional Social Thread Screenshot: Social media interface mockup (for social media related tweets)

INPUTS
- tweet_text: A tweet (URL or text; any tone, topic, or language)
- caption: creative instruction (≤140 characters)
- context: additional context or background info for the tweet (summarized)

IMAGE SIZE REQUIREMENT:
The image must be exactly 1024x1024 pixels (perfect square). All composition must be designed for a square format. Do not use any rectangular, landscape, or portrait layout. Only a perfect square.

---

OUTPUT FORMAT (STRICT):
Scene: [Describe the visual scene. Do NOT include any text, captions, or branding in the image. Only describe the subject, emotion, setting, art style, and layout.]
Text overlay: 
TOP: "witty/sarcastic top text"
BOTTOM: "humorous/relatable bottom text"

CRITICAL OVERLAY REQUIREMENTS:
- ALWAYS provide both TOP and BOTTOM text on separate lines exactly as shown above
- Make text FUNNY, SARCASTIC, and MEME-WORTHY
- Use classic meme formats like "When you..." / "But then..." 
- Keep each text under 80 characters
- Make them punchy and viral-ready

Please output fully using the above rules and inputs. Do not include any other commentary or explanation.`;

            // RESTORED USER PROMPT: Includes art style, meme layout, and meme core logic, but NO instructions about text overlays, placement, or branding.
            const userPrompt = `IMPORTANT: Do NOT render any text, captions, watermarks, or branding in the image itself. Only generate the visual scene. The meme text and logo will be added later (manually). Do NOT mention or describe branding or logo placement in your output.

GENERATE_MEME_IMAGE_PROMPT

Tweet: ${tweet_text}
User's Meme Caption: ${caption}
Context: ${contextSummary}
Tone: ${tone}

CRITICAL: For the Text overlay, create HILARIOUS and SARCASTIC meme text that captures the essence of the situation with humor. Don't just repeat the user's caption - transform it into viral meme format with punchy, relatable, and funny text that people will want to share!

MEME CORE LOGIC:
- Carefully read the tweet and identify the main message or tone.
- Build a scene that either reflects the meaning directly, exaggerates it for humor, or subverts it with sarcasm or absurdity.
- Embrace classic meme devices: exaggeration, irony, overreaction, underreaction, surrealism.
- The image should be clever, absurd, sarcastic, or witty — not dry or literal.
- Prioritize emotional impact and visual comedy.
- Use meme-style humor and composition.

ART STYLE SELECTION BY TONE:
Choose the most appropriate art style based on the selected tone:

CLASSIC TONE (Timeless, Universal Humor):
- Classic Comic Book – Halftone textures, speech bubbles, bold outlines, superhero palette
- Disney Classic – 2D cel animation, fairytale aesthetic, hand-painted backgrounds
- Pixar 3D – Polished 3D character design, cinematic lighting, expressive animation style
- Plushy Toy – Soft stuffed toy, button eyes, sewn details, cozy pastel lighting
- Knitted Toy – Yarn texture, handmade softness, visible thread seams, cozy vibe
- Cartoon – Simple, clean cartoon style, bold colors, clear outlines
- Watercolor – Soft, flowing colors, organic textures, artistic brushstrokes
- Oil Painting – Rich textures, impasto technique, classical art style

TRENDING TONE (Modern, Viral, Current):
- Digital Art – Modern digital aesthetic, clean lines, vibrant colors
- Vaporwave – 80s/90s aesthetic, neon colors, glitch effects, retro-futuristic
- Cyberpunk – Neon lighting, futuristic tech, dystopian urban aesthetic
- Pop Art – Bold colors, Ben-Day dots, comic book aesthetic, Andy Warhol style
- Keith Haring – Flat, graphic street art, faceless characters, energetic outlines
- Retro Pixel Game – 8-bit or 16-bit pixel art, low resolution, vintage video game feel
- Rick and Morty – Wobbly 2D sci-fi cartoon, grotesque humor, absurd proportions
- Minimalist – Clean lines, simple shapes, limited color palette

SERIOUS TONE (Sophisticated, Professional):
- Marble – Polished stone texture, classical sculpture aesthetic, elegant veining
- Architectural Blueprint – Technical drawing style, precise lines, blueprint colors
- Brutalist 3D – Concrete textures, geometric shapes, industrial aesthetic
- Line Art / Ink Drawing – Clean black lines, white background, minimal shading
- Photorealistic – Camera-like quality, realistic lighting, detailed textures
- Abstract – Non-representational, geometric shapes, color theory focus
- Expressionist – Emotional, distorted forms, intense colors
- Impressionist – Loose brushstrokes, light effects, atmospheric quality

MEME LAYOUT SELECTION:
Choose the most appropriate layout based on the tweet's context and content:
- Classic Meme: Standard meme format (default for most tweets)
- Movie Poster Parody: Film poster aesthetic with dramatic composition (for epic/heroic tweets)
- Fake News Headline: Tabloid-style layout with sensational visual cues (for outrageous/controversial tweets)
- Fictional Social Thread Screenshot: Social media interface mockup (for social media related tweets)

IMAGE SIZE REQUIREMENT:
The image must be exactly 1024x1024 pixels (perfect square). All composition must be designed for a square format. Do not use any rectangular, landscape, or portrait layout. Only a perfect square.

---

OUTPUT FORMAT (STRICT):
Scene: [Describe the visual scene. Do NOT include any text, captions, or branding in the image. Only describe the subject, emotion, setting, art style, and layout.]
Text overlay: 
TOP: "witty/sarcastic top text"
BOTTOM: "humorous/relatable bottom text"

CRITICAL OVERLAY REQUIREMENTS:
- ALWAYS provide both TOP and BOTTOM text on separate lines exactly as shown above
- Make text FUNNY, SARCASTIC, and MEME-WORTHY
- Use classic meme formats like "When you..." / "But then..." 
- Keep each text under 80 characters
- Make them punchy and viral-ready

Please output fully using the above rules and inputs. Do not include any other commentary or explanation.`;

            const result = await this.openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                max_tokens: 600,
                temperature: 0.7
            });
            return result.choices[0].message.content.trim();
        } catch (error) {
            console.error('Error generating DALL-E visual prompt:', error);
            // Fallback: just return the caption
            return caption;
        }
    }


}

const imageGeneration = new ImageGeneration();

export default imageGeneration;