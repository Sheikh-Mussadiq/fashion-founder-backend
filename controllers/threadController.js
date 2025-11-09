const { createClient } = require("@supabase/supabase-js");
const OpenAI = require("openai");
const crypto = require("crypto");
require("dotenv").config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const createThread = async (req, res) => {
  // Check subscription status - require active subscription
  if (!req.subscription) {
    return res.status(403).json({
      error: "Active subscription required. Please subscribe to continue.",
    });
  }

  const { thread_name } = req.body;
  try {
    const thread = await openai.beta.threads.create();
    const response = await supabase
      .from("threads")
      .insert({
        id: thread.id,
        user_id: req.user.id,
        name: thread_name,
      })
      .select()
      .single();

    res.json({ response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const sendMessage = async (req, res) => {
  // Check subscription status - require active subscription
  if (!req.subscription) {
    return res.status(403).json({
      error: "Active subscription required. Please subscribe to continue.",
    });
  }

  const { thread_id, role = "user", content } = req.body;
  try {
    const msgId = crypto.randomUUID();
    await supabase
      .from("messages")
      .insert([{ id: msgId, thread_id, user_id: req.user.id, role, content }]);
    await openai.beta.threads.messages.create(thread_id, { role, content });
    res.json({ message_id: msgId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const streamResponse = async (req, res) => {
  // Check subscription status - require active subscription
  if (!req.subscription) {
    return res.status(403).json({
      error: "Active subscription required. Please subscribe to continue.",
    });
  }

  const thread_id = req.query.thread_id;

  // Use the single assistant from environment variable
  const assistantId = process.env.OPENAI_ASSISTANT_ID;

  if (!assistantId) {
    console.error("OPENAI_ASSISTANT_ID not configured in environment");
    return res.status(500).json({ error: "Assistant configuration missing" });
  }

  try {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    const stream = await openai.beta.threads.runs.create(thread_id, {
      assistant_id: assistantId,
      stream: true,
    });

    let fullMessage = "";

    for await (const event of stream) {
      if (event.event === "thread.message.delta") {
        const content = event.data.delta.content[0].text.value;
        if (content) {
          fullMessage += content;
          res.write(`data: ${JSON.stringify({ content: content })}\n\n`);
        }
      }
    }

    const msgId = crypto.randomUUID();
    await supabase.from("messages").insert({
      id: msgId,
      thread_id,
      user_id: req.user.id,
      role: "assistant",
      content: fullMessage,
    });

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    console.error("Stream error:", err);
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
};

module.exports = {
  createThread,
  sendMessage,
  streamResponse,
};
