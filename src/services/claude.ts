
/**
 * Claude API integration for Shopify Liquid code generation
 */
import { GenerateCodeRequest, GenerateCodeResponse } from "@/types";

// The main function to generate code via API
export async function generateShopifyCode(
  sectionType: string,
  requirements: string,
  imageDescription: string
): Promise<{ code: string; shopifyLiquid: string }> {
  try {
    // For now we'll use a mock response, but the code is ready to call a real API
    console.log("Generating code for:", { sectionType, requirements, imageDescription });
    
    // Mock generating for 3 seconds
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Return mock response
    return getMockResponse(sectionType);
  } catch (error) {
    console.error("Error generating code:", error);
    throw error;
  }
}

// Helper function to create the prompt for Claude
export function createPrompt(sectionType: string, requirements: string, imageDescriptions: string): string {
  return `You are ShopifyExpert, a specialized AI expert in creating flawless Shopify Liquid code. I need you to generate complete code for a ${sectionType} section in Shopify.

REFERENCE IMAGES:
${imageDescriptions || 'No reference images provided.'}

SECTION REQUIREMENTS:
${requirements}

Please create a complete, production-ready Shopify section that implements all these requirements. Include HTML, CSS, and JSON schema. Follow these specifications:

1. Use unique class names with the pattern "section-${sectionType.toLowerCase().replace(/\s+/g, '-')}-[element]" to avoid CSS conflicts
2. Make all text content placeholder (Lorem Ipsum)
3. Include these standard settings in schema: background_color, padding_top, padding_bottom
4. Make the section fully responsive for mobile, tablet and desktop
5. Add appropriate comments explaining the code
6. Follow modern Shopify best practices

For images, use this structure:
<img src="{{ section.settings.image | img_url: 'master'}}" alt="{{ section.settings.image_alt | escape }}" loading="lazy">

For videos, use this structure:
{% if section.settings.video != blank %}
  <video src="{{ section.settings.video.sources[1].url }}" loop muted playsinline autoplay style="width: 100%; display: block;"></video>
{% endif %}

Structure your response exactly like this:

<html>
<!-- HTML code for the section -->
</html>

<style>
/* CSS code for the section */
</style>

{% schema %}
{
  // JSON schema for the section
}
{% endschema %}`;
}

// Mock responses for different section types
function getMockResponse(sectionType: string): { code: string, shopifyLiquid: string } {
  // Different mock responses based on section type
  const mockHtml = `<div class="section-${sectionType.toLowerCase().replace(/\s+/g, '-')}">
  <div class="container">
    <h2 class="section-${sectionType.toLowerCase().replace(/\s+/g, '-')}-heading">{{ section.settings.heading }}</h2>
    <div class="section-${sectionType.toLowerCase().replace(/\s+/g, '-')}-content">
      {{ section.settings.content }}
    </div>
    {% if section.settings.image != blank %}
      <div class="section-${sectionType.toLowerCase().replace(/\s+/g, '-')}-image">
        <img src="{{ section.settings.image | img_url: 'master' }}" alt="{{ section.settings.image_alt | escape }}" loading="lazy">
      </div>
    {% endif %}
    {% if section.settings.button_text != blank %}
      <a href="{{ section.settings.button_url }}" class="section-${sectionType.toLowerCase().replace(/\s+/g, '-')}-button">
        {{ section.settings.button_text }}
      </a>
    {% endif %}
  </div>
</div>`;

  const mockCss = `
.section-${sectionType.toLowerCase().replace(/\s+/g, '-')} {
  padding-top: {{ section.settings.padding_top }}px;
  padding-bottom: {{ section.settings.padding_bottom }}px;
  background-color: {{ section.settings.background_color }};
}

.section-${sectionType.toLowerCase().replace(/\s+/g, '-')}-heading {
  font-size: 32px;
  margin-bottom: 20px;
  text-align: center;
}

.section-${sectionType.toLowerCase().replace(/\s+/g, '-')}-content {
  margin-bottom: 30px;
  text-align: center;
}

.section-${sectionType.toLowerCase().replace(/\s+/g, '-')}-image {
  margin: 0 auto 30px;
  max-width: 100%;
  text-align: center;
}

.section-${sectionType.toLowerCase().replace(/\s+/g, '-')}-button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #000;
  color: #fff;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.section-${sectionType.toLowerCase().replace(/\s+/g, '-')}-button:hover {
  background-color: #333;
}

@media screen and (max-width: 768px) {
  .section-${sectionType.toLowerCase().replace(/\s+/g, '-')}-heading {
    font-size: 24px;
  }
}`;

  const mockSchema = `{
  "name": "${sectionType} Section",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Your heading here"
    },
    {
      "type": "richtext",
      "id": "content",
      "label": "Content",
      "default": "<p>Your description here</p>"
    },
    {
      "type": "image_picker",
      "id": "image",
      "label": "Image"
    },
    {
      "type": "text",
      "id": "image_alt",
      "label": "Image alt text",
      "info": "Describe the image for accessibility"
    },
    {
      "type": "text",
      "id": "button_text",
      "label": "Button text"
    },
    {
      "type": "url",
      "id": "button_url",
      "label": "Button URL"
    },
    {
      "type": "color",
      "id": "background_color",
      "label": "Background color",
      "default": "#ffffff"
    },
    {
      "type": "range",
      "id": "padding_top",
      "label": "Top padding",
      "default": 60,
      "min": 0,
      "max": 100,
      "step": 10,
      "unit": "px"
    },
    {
      "type": "range",
      "id": "padding_bottom",
      "label": "Bottom padding",
      "default": 60,
      "min": 0,
      "max": 100,
      "step": 10,
      "unit": "px"
    }
  ],
  "presets": [
    {
      "name": "${sectionType} Section",
      "category": "Custom Content"
    }
  ]
}`;

  return {
    code: mockHtml + "\n\n" + mockCss,
    shopifyLiquid: `{% schema %}\n${mockSchema}\n{% endschema %}`
  };
}

// This function would be used in a serverless function to call Claude API directly
export async function callClaudeAPI(apiKey: string, prompt: string): Promise<string> {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 4000,
        messages: [
          { 
            role: "user", 
            content: prompt
          }
        ]
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error calling Claude API');
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Error calling Claude API:', error);
    throw error;
  }
}

// This shows how to parse the API response to get the code and schema
export function parseClaudeResponse(responseText: string): { code: string, shopifyLiquid: string } {
  // Split by schema tag to separate the code and schema
  const parts = responseText.split('{% schema %}');
  
  if (parts.length < 2) {
    return { code: responseText, shopifyLiquid: '' };
  }
  
  return {
    code: parts[0].trim(),
    shopifyLiquid: `{% schema %}${parts[1].trim()}`
  };
}
