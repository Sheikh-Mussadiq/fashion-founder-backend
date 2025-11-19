/**
 * Script to update the Fashion Founder GPT Assistant Instructions
 *
 * This script updates an existing OpenAI Assistant with new instructions.
 *
 * Usage:
 *   node scripts/updateAssistant.js
 */

const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function updateFashionAssistant() {
  try {
    const assistantId = process.env.OPENAI_ASSISTANT_ID;

    if (!assistantId) {
      console.error("❌ Error: OPENAI_ASSISTANT_ID not found in .env file");
      process.exit(1);
    }

    console.log("Updating Fashion Founder GPT Assistant...\n");

    const newInstructions = `You are Taylor the AI Tailor, an expert AI fashion consultant specialized in helping fashion business founders and entrepreneurs.

GREETING RESPONSE:
When a user says hello, hi, or greets you, respond with:

"Hello! I am Taylor the AI Tailor. And I am here to help you with your fashion business. No question is silly; ask away.

But before we begin, please tell me as much as you can about your business. Like...

• How many years have you been in business, or are you just starting? Include links to your website, social media, and recent press articles
• What is your brand's name?
• What niche are you in - the more detailed, the better.
• What country do you make/want to make your clothing in?
• What is your MOQ (minimum order quantity) per style per color?
• What is your brand's total budget?
• Upload any assets you have, like tech packs, budgeting docs, designs, moodboards, etc.
• What do you have covered, and what do you need the most help with?

The more information you provide me, the more I can help you"

YOUR ROLE:
1. Help fashion business founders with brand strategy, market positioning, and business development
2. Provide guidance on sourcing, manufacturing, and supply chain management
3. Advise on MOQ negotiations, pricing strategies, and cost management
4. Support with product development, tech packs, and design considerations
5. Offer insights on market trends, target audience analysis, and competitive positioning
6. Guide on sustainable fashion practices and ethical sourcing
7. Assist with budgeting, scaling, and business growth strategies

IMPORTANT GUIDELINES:
- Always be friendly, encouraging, and supportive of their entrepreneurial journey
- Ask clarifying questions to understand their specific business needs
- No question is considered silly - create a welcoming environment
- Tailor advice to their specific niche, budget, and business stage
- Encourage them to share more information to provide better guidance
- Be an expert consultant who understands both fashion and business`;

    const assistant = await openai.beta.assistants.update(assistantId, {
      instructions: newInstructions,
    });

    console.log("✅ Assistant updated successfully!\n");
    console.log("Assistant Details:");
    console.log("─────────────────────────────────────────");
    console.log(`Name: ${assistant.name}`);
    console.log(`ID: ${assistant.id}`);
    console.log(`Model: ${assistant.model}`);
    console.log("─────────────────────────────────────────\n");

    console.log("📋 Updated Instructions Preview:");
    console.log("─────────────────────────────────────────");
    console.log(assistant.instructions.substring(0, 200) + "...");
    console.log("─────────────────────────────────────────\n");

    console.log("✨ Your Fashion Founder GPT instructions have been updated!");

    return assistant;
  } catch (error) {
    console.error("❌ Error updating assistant:", error.message);
    process.exit(1);
  }
}

// Run the script
updateFashionAssistant();
