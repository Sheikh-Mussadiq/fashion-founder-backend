const { createClient } = require("@supabase/supabase-js");
const OpenAI = require("openai");
require("dotenv").config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const listAssistants = async (req, res) => {
  try {
    const assistants = await openai.beta.assistants.list();
    res.json({ assistants: assistants.data });
  } catch (err) {
    console.error("Error listing assistants:", err);
    res.status(500).json({ error: err.message });
  }
};

const createAssistant = async (req, res) => {
  const {
    name = "Fashion Founder GPT",
    instructions = `You are Fashion Founder GPT, an expert AI fashion consultant and stylist. Your role is to:

1. Provide personalized fashion advice based on user preferences, body type, occasion, and budget
2. Suggest outfit combinations and styling tips
3. Recommend trending fashion items and brands
4. Help users build a cohesive wardrobe
5. Offer guidance on color coordination, fabric selection, and seasonal trends
6. Provide fashion industry insights and sustainable fashion options

Always be friendly, encouraging, and help users feel confident in their fashion choices. Ask clarifying questions when needed to provide the most relevant advice.`,
    tools = [],
    model = "gpt-4o",
  } = req.body;

  try {
    const assistant = await openai.beta.assistants.create({
      name,
      instructions,
      tools,
      model,
    });

    // Return the assistant details including the ID
    // User should copy this ID to their .env file as OPENAI_ASSISTANT_ID
    res.json({
      success: true,
      assistant: {
        id: assistant.id,
        name: assistant.name,
        model: assistant.model,
        instructions: assistant.instructions,
      },
      message: `Assistant created successfully! Add this to your .env file:\nOPENAI_ASSISTANT_ID=${assistant.id}`,
    });
  } catch (err) {
    console.error("Error creating assistant:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createAssistant,
  listAssistants,
};
