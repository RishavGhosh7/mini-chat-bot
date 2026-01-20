# 🤖 Mini Chatbot

A modern, interactive chatbot built with React and Natural Language Processing (NLP) with **emotional intelligence** and an **expanded knowledge base**. This project demonstrates how to build a rule-based chatbot with enhanced NLP capabilities, emotion detection, and comprehensive knowledge across multiple topics.

## 📋 Project Overview

This Mini Chatbot is a web-based application that can respond to user inputs including greetings, frequently asked questions (FAQs), and general queries. It features **emotion detection**, **sentiment analysis**, and an **expanded knowledge base** covering programming, technology, science, and more. The chatbot uses NLP techniques like tokenization and keyword matching to improve response accuracy and handle variations in user input, while also understanding and responding to user emotions.

## ✨ Features

### Core Features

1. **Greeting Responses** 🤝
   - Responds to various greetings: "Hi", "Hello", "Hey", "Good morning", "Good evening"
   - Time-aware greetings based on the current time of day

2. **FAQ Handling** ❓
   - Answers common questions:
     - "What is your name?"
     - "What can you do?"
     - "Who created you?"
     - "What is Python?"
     - "How can you help me?"

3. **Emotion Detection & Sentiment Analysis** 😊😢🤔
   - Detects user emotions (happy, sad, curious, neutral)
   - Responds empathetically to emotional states
   - Shows current chatbot mood/emotion in the UI
   - Emotion-aware responses that adapt to user sentiment
   - Visual emotion indicators in messages

4. **Expanded Knowledge Base** 📚
   - **Programming Topics**: JavaScript, React, Python, Java, C++, databases, APIs, Git, and more
   - **Technology Topics**: AI, machine learning, blockchain, cloud computing, cybersecurity
   - **Science Topics**: Physics, chemistry, biology, mathematics, space, universe
   - **General Topics**: Weather, food, music, movies, books, sports, travel, hobbies
   - Multiple response variations for each topic
   - Intelligent topic matching using NLP

5. **Context Awareness & Conversation Memory** 🧠💭
   - Remembers previous messages in the conversation
   - Tracks topics discussed throughout the chat
   - Handles follow-up questions intelligently
   - Resolves pronoun references ("it", "that", "this", "they")
   - Continues conversations about previously discussed topics
   - Provides context-aware responses that acknowledge previous discussion
   - Example: Ask "What is Python?" then "What is it used for?" - understands "it" refers to Python

6. **Natural Language Processing** 🧠
   - Tokenization of user input using custom browser-compatible implementation
   - Keyword identification and matching
   - Stemming for better word matching (Porter-like algorithm)
   - Case-insensitive input processing
   - Context-aware response generation

7. **Exit Commands** 👋
   - Users can exit by typing: "bye", "exit", "quit", "goodbye", "see you", "farewell"
   - Varied farewell messages

8. **Chat History** 💾
   - Automatically saves chat history to browser's localStorage
   - Persists across browser sessions
   - Option to clear chat history
   - Maintains conversation context across sessions

### Bonus Features

- **Emotional Intelligence** 💙
  - Detects and responds to user emotions
  - Empathetic responses to sad/happy states
  - Emotion indicator in header showing current mood
  - Emotion emojis in bot messages

- **Varied Responses** 🎲
  - Multiple response variations for each query type
  - Random selection for more natural conversations
  - Context-aware response generation
  - Follow-up question handling ("Tell me more", "What about...", "How about...")

- **Date & Time Responses** ⏰
  - Responds to queries about current time and date
  - Formatted date responses with day names

- **Compliment Recognition** 🌟
  - Recognizes and responds to compliments
  - Appreciative and friendly responses

- **Modern Web Interface** 🎨
  - Beautiful, responsive UI with gradient design
  - Emotion indicator with animated emoji (left side of header)
  - Three-column header layout (Emotion | Title | Clear Button)
  - Smooth animations and transitions
  - Mobile-friendly responsive design
  - Typing indicators for better UX
  - Emotion emojis in message bubbles
  - Clean, non-overlapping button layout

- **Real-time Chat Experience** 💬
  - Instant message display
  - Auto-scrolling to latest messages
  - Message timestamps
  - Emotion tracking per message

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.2.3
- **NLP Implementation**: Custom browser-compatible tokenization and stemming
- **Styling**: CSS3 with modern design patterns
- **Storage**: localStorage for chat history persistence
- **Build Tool**: Create React App (react-scripts)

## 📦 Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Setup Steps

1. **Clone or navigate to the project directory**
   ```bash
   cd "Mini chat-bot"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   - The app will automatically open at `http://localhost:3000`
   - If it doesn't, manually navigate to the URL

## 🚀 How to Run

1. Make sure you're in the project directory
2. Run `npm start` in your terminal
3. The React development server will start
4. Your default browser will open the chatbot interface
5. Start chatting!

### Build for Production

To create a production build:

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## 💻 Usage

1. **Start a conversation**: Type a greeting like "Hello" or "Hi"
2. **Ask questions**: Try asking "What is your name?" or "What can you do?"
3. **Explore FAQs**: Ask about Python, capabilities, or creator
4. **Check time/date**: Ask "What time is it?" or "What's the date?"
5. **Exit**: Type "bye", "exit", or "quit" to end the conversation

## 🏗️ Project Structure

```
Mini chat-bot/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── components/
│   │   ├── Chatbot.js      # Main chatbot component
│   │   └── Chatbot.css     # Chatbot styles
│   ├── utils/
│   │   └── chatbotLogic.js # Core chatbot logic with NLP
│   ├── App.js              # Main app component
│   ├── App.css             # App styles
│   ├── index.js            # React entry point
│   └── index.css           # Global styles
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## 🔧 Key Implementation Details

### NLP Processing

The chatbot uses custom browser-compatible NLP functions for:
- **Tokenization**: Breaking down user input into individual words using regex-based splitting
- **Stemming**: Reducing words to their root form using Porter-like algorithm (e.g., "running" → "run")
- **Keyword Matching**: Intelligent matching of user intent with case-insensitive processing

### Emotion Detection

The chatbot analyzes user input to detect emotions:
- **Positive Emotions**: Detects words like "happy", "great", "awesome", "love"
- **Negative Emotions**: Detects words like "sad", "angry", "frustrated", "worried"
- **Curious State**: Identifies questions and inquiry patterns
- **Emotion Intensity**: Determines high/medium/low intensity based on keyword frequency
- **Empathetic Responses**: Provides comforting responses for negative emotions, enthusiastic responses for positive ones

### Context Awareness

The chatbot maintains conversation context through:
- **Topic Extraction**: Identifies topics from conversation history (programming, technology, science, etc.)
- **Reference Resolution**: Understands pronouns and references to previous topics
- **Follow-up Detection**: Recognizes continuation patterns like "Tell me more", "What about...", "How about..."
- **Context Tracking**: Maintains awareness of last 5 messages for relevant responses
- **Topic Continuation**: Seamlessly continues discussions about previously mentioned topics

### Response Logic

The chatbot processes inputs through:
1. Input normalization (lowercase, trim)
2. Context extraction from conversation history
3. Emotion detection and sentiment analysis
4. Tokenization and stemming
5. Keyword matching against predefined patterns
6. Context-aware response generation
7. Topic tracking and follow-up handling

### State Management

- React hooks (`useState`, `useEffect`) for component state
- localStorage for persistent chat history
- Real-time message updates

## 🎨 UI Features

- **Gradient Design**: Modern purple gradient theme
- **Message Bubbles**: Distinct styling for user and bot messages
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Fade-in animations for messages
- **Typing Indicator**: Visual feedback when bot is "thinking"

## 📝 Code Quality

- Clean, readable code with comments
- Modular component structure
- Separation of concerns (logic vs. UI)
- Error handling for localStorage operations

## 🧪 Testing the Chatbot

Try these sample inputs:

- **Greetings**: "Hi", "Hello", "Good morning", "Hey there"
- **FAQs**: "What is your name?", "What can you do?", "What is Python?"
- **Emotions**: "I'm feeling sad", "I'm so happy!", "I'm frustrated"
- **Programming**: "Tell me about JavaScript", "What is React?", "Explain Python"
- **Technology**: "What is AI?", "Tell me about machine learning", "What is blockchain?"
- **Science**: "Explain physics", "Tell me about space", "What is chemistry?"
- **Compliments**: "You're awesome!", "You're so smart", "You're great!"
- **Time queries**: "What time is it?", "What's the date?", "What day is it?"
- **Context Awareness** (try these sequences):
  - "Tell me about Python" → "What is it used for?" (understands "it" = Python)
  - "What is JavaScript?" → "Tell me more" (continues JavaScript discussion)
  - "Explain AI" → "How does it work?" (understands "it" = AI)
  - "What is React?" → "What about Vue?" (follow-up question)
- **Exit**: "bye", "exit", "quit", "see you later"

## 🚧 Future Enhancements

Potential improvements:
- Integration with external APIs for more dynamic responses
- Machine learning model integration
- Multi-language support
- Voice input/output
- More sophisticated NLP models
- User authentication and cloud storage
- Conversation summarization
- Long-term memory across sessions
- Multi-turn conversation planning

## 📄 License

ISC

## 👨‍💻 Development

This project was built as part of a Python internship project, enhanced with React and modern web technologies.

---

**Enjoy chatting with your Mini Chatbot!** 😊
