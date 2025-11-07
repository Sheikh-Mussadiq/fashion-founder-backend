# Fashion Founder GPT - Backend

Backend API for Fashion Founder GPT, a fashion consultation chatbot powered by OpenAI Assistants API and Supabase.

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Supabase account and project
- OpenAI API account

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   
   Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```

3. **Create your Fashion GPT Assistant:**
   
   Run the script to create your OpenAI Assistant:
   ```bash
   node scripts/createAssistant.js
   ```
   
   This will output an Assistant ID. Copy it and add to your `.env` file:
   ```env
   OPENAI_ASSISTANT_ID=asst_xxxxxxxxxxxxx
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

## 📋 Environment Variables

Create a `.env` file with the following variables:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI Configuration
OPENAI_API_KEY=sk-xxxxxxxxxxxxx
OPENAI_ASSISTANT_ID=asst_xxxxxxxxxxxxx

# Server Configuration
PORT=3000
NODE_ENV=development
```

## 🛠️ Utility Scripts

### Create Assistant
Creates a new Fashion Founder GPT assistant:
```bash
node scripts/createAssistant.js
```

### List Assistants
Lists all assistants in your OpenAI account:
```bash
node scripts/listAssistants.js
```

## 📡 API Endpoints

### Authentication
All endpoints (except `/api/listassistants`) require authentication via `access_token` parameter.

### Thread Management

#### Create Thread
```http
POST /api/createthread
Authorization: access_token in body

Body:
{
  "thread_name": "My Fashion Consultation",
  "access_token": "your_supabase_token"
}

Response:
{
  "response": {
    "id": "thread_xxxxx",
    "user_id": "user_id",
    "name": "My Fashion Consultation",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### Send Message
```http
POST /api/sendmessage
Authorization: access_token in body

Body:
{
  "thread_id": "thread_xxxxx",
  "role": "user",
  "content": "What should I wear to a summer wedding?",
  "access_token": "your_supabase_token"
}

Response:
{
  "message_id": "msg_xxxxx"
}
```

#### Stream Assistant Response
```http
GET /api/stream?thread_id=thread_xxxxx&access_token=your_token

Response: Server-Sent Events (SSE)
data: {"content": "For a summer wedding..."}
data: {"content": " you could wear..."}
data: [DONE]
```

### Assistant Management

#### Create Assistant (Admin)
```http
POST /api/createassistant
Authorization: access_token in body

Body (optional - uses defaults):
{
  "name": "Fashion Founder GPT",
  "instructions": "Your custom instructions...",
  "model": "gpt-4o",
  "access_token": "your_supabase_token"
}

Response:
{
  "success": true,
  "assistant": {
    "id": "asst_xxxxx",
    "name": "Fashion Founder GPT",
    "model": "gpt-4o"
  },
  "message": "Assistant created successfully! Add this to your .env file:\nOPENAI_ASSISTANT_ID=asst_xxxxx"
}
```

#### List Assistants
```http
GET /api/listassistants

Response:
{
  "assistants": [
    {
      "id": "asst_xxxxx",
      "name": "Fashion Founder GPT",
      "model": "gpt-4o",
      "created_at": 1234567890
    }
  ]
}
```

## 🔒 Security Features

- **Authentication Middleware**: Validates Supabase access tokens
- **Subscription Check**: Enforces 7-day trial and active subscription requirements
- **User Isolation**: All threads and messages are user-scoped

## 🏗️ Architecture

### Single Assistant Model
This backend uses a **single OpenAI Assistant** for all users, configured via the `OPENAI_ASSISTANT_ID` environment variable. This provides:

- ✅ Consistent fashion expertise across all users
- ✅ Easier management and updates
- ✅ Cost-efficient operation
- ✅ Simplified deployment

### Database Schema

**threads table:**
- `id` (text, primary key) - OpenAI thread ID
- `user_id` (uuid, foreign key) - User who owns the thread
- `name` (text) - Thread name/title
- `created_at` (timestamp)

**messages table:**
- `id` (uuid, primary key)
- `thread_id` (text, foreign key) - References threads.id
- `user_id` (uuid, foreign key)
- `role` (text) - 'user' or 'assistant'
- `content` (text) - Message content
- `created_at` (timestamp)

**subscriptions table:**
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key)
- `status` (text) - 'active', 'cancelled', etc.
- `current_period_end` (timestamp)

## 🧪 Testing

Test the API endpoints using curl or Postman:

```bash
# List assistants (no auth required)
curl http://localhost:3000/api/listassistants

# Create thread (requires auth)
curl -X POST http://localhost:3000/api/createthread \
  -H "Content-Type: application/json" \
  -d '{"thread_name": "Test Chat", "access_token": "your_token"}'
```

## 📝 Notes

- The assistant uses GPT-4o model for optimal fashion advice
- Streaming responses provide real-time chat experience
- Trial period is 7 days from user registration
- All API calls are logged for debugging

## 🤝 Support

For issues or questions, please check the main project documentation.
