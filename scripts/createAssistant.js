/**
 * Script to create the Fashion Founder GPT Assistant
 *
 * This script creates a new OpenAI Assistant and outputs the Assistant ID
 * that you need to add to your .env file.
 *
 * Usage:
 *   node scripts/createAssistant.js
 */

const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function createFashionAssistant() {
  try {
    console.log("Creating Fashion Founder GPT Assistant...\n");

    const assistant = await openai.beta.assistants.create({
      name: "Fashion Founder GPT",
      instructions: `You are Fashion Founder GPT, an expert AI fashion consultant and stylist. Your role is to:

1. Provide personalized fashion advice based on user preferences, body type, occasion, and budget
2. Suggest outfit combinations and styling tips
3. Recommend trending fashion items and brands
4. Help users build a cohesive wardrobe
5. Offer guidance on color coordination, fabric selection, and seasonal trends
6. Provide fashion industry insights and sustainable fashion options

Always be friendly, encouraging, and help users feel confident in their fashion choices. Ask clarifying questions when needed to provide the most relevant advice.`,
      tools: [],
      model: "gpt-4o",
    });

    console.log("✅ Assistant created successfully!\n");
    console.log("Assistant Details:");
    console.log("─────────────────────────────────────────");
    console.log(`Name: ${assistant.name}`);
    console.log(`ID: ${assistant.id}`);
    console.log(`Model: ${assistant.model}`);
    console.log("─────────────────────────────────────────\n");

    console.log("📋 Add this line to your .env file:");
    console.log("─────────────────────────────────────────");
    console.log(`OPENAI_ASSISTANT_ID=${assistant.id}`);
    console.log("─────────────────────────────────────────\n");

    console.log("✨ Your Fashion Founder GPT is ready to use!");

    return assistant;
  } catch (error) {
    console.error("❌ Error creating assistant:", error.message);
    process.exit(1);
  }
}

// Run the script
createFashionAssistant();
