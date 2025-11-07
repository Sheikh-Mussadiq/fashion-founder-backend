/**
 * Script to list all OpenAI Assistants in your account
 * 
 * Usage:
 *   node scripts/listAssistants.js
 */

const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function listAllAssistants() {
  try {
    console.log('Fetching your OpenAI Assistants...\n');

    const assistants = await openai.beta.assistants.list({
      order: "desc",
      limit: 20
    });

    if (assistants.data.length === 0) {
      console.log('No assistants found. Create one using: node scripts/createAssistant.js\n');
      return;
    }

    console.log(`Found ${assistants.data.length} assistant(s):\n`);
    console.log('═══════════════════════════════════════════════════════════════');

    assistants.data.forEach((assistant, index) => {
      console.log(`\n${index + 1}. ${assistant.name || 'Unnamed Assistant'}`);
      console.log('─────────────────────────────────────────');
      console.log(`   ID: ${assistant.id}`);
      console.log(`   Model: ${assistant.model}`);
      console.log(`   Created: ${new Date(assistant.created_at * 1000).toLocaleString()}`);
      if (assistant.instructions) {
        const shortInstructions = assistant.instructions.length > 100 
          ? assistant.instructions.substring(0, 100) + '...' 
          : assistant.instructions;
        console.log(`   Instructions: ${shortInstructions}`);
      }
    });

    console.log('\n═══════════════════════════════════════════════════════════════\n');
    console.log('💡 To use an assistant, add its ID to your .env file:');
    console.log('   OPENAI_ASSISTANT_ID=<assistant_id>\n');

  } catch (error) {
    console.error('❌ Error listing assistants:', error.message);
    process.exit(1);
  }
}

// Run the script
listAllAssistants();
