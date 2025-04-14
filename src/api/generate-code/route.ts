
import { GenerateCodeRequest, GenerateCodeResponse } from '@/types';
import { createPrompt, callClaudeAPI, parseClaudeResponse } from '@/services/claude';

// This file would be moved to /api/generate-code/route.ts in a Next.js project

export async function POST(request: Request): Promise<Response> {
  try {
    // Parse the request body
    const body = await request.json() as GenerateCodeRequest;
    const { sectionType, requirements, imageDescription } = body;
    
    // Validate the request
    if (!sectionType || !requirements) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Get the API key from environment variables
    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Create the prompt
    const prompt = createPrompt(sectionType, requirements, imageDescription);
    
    // Call Claude API
    const responseText = await callClaudeAPI(apiKey, prompt);
    
    // Parse the response
    const { code, shopifyLiquid } = parseClaudeResponse(responseText);
    
    // Return the generated code
    return new Response(
      JSON.stringify({ code, shopifyLiquid }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('API route error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to generate code' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
