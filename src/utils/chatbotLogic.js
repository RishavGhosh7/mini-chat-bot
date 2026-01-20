// Browser-compatible tokenization and stemming
// Enhanced tokenizer that handles concepts better
function tokenizeInput(input) {
  const normalized = input.toLowerCase().trim();
  // Split on whitespace and common punctuation, filter out empty strings
  const tokens = normalized
    .replace(/[^\w\s]/g, ' ') // Replace punctuation with spaces
    .split(/\s+/)
    .filter(token => token.length > 0);
  return tokens.map(token => stemWord(token));
}

// Enhanced concept extraction - finds key concepts in input
function extractConcepts(input) {
  const normalized = input.toLowerCase();
  const tokens = tokenizeInput(input);
  
  // Common question words to remove for concept extraction
  const stopWords = ['what', 'is', 'are', 'the', 'a', 'an', 'how', 'why', 'when', 'where', 'who', 'which', 'can', 'could', 'would', 'should', 'tell', 'me', 'about', 'explain', 'describe', 'do', 'does', 'did', 'will', 'this', 'that', 'these', 'those', 'it', 'its', 'pls', 'please', 'hey', 'hi', 'hello'];
  
  // Filter out stop words and get meaningful concepts
  const concepts = tokens.filter(token => 
    token.length > 2 && !stopWords.includes(token) && !stopWords.some(sw => token.includes(sw))
  );
  
  return concepts;
}

// Normalize casual/slang language for better understanding
function normalizeCasualLanguage(input) {
  let normalized = input.toLowerCase();
  
  // Common casual language patterns
  const casualMappings = {
    'u': 'you',
    'ur': 'your',
    'r': 'are',
    'pls': 'please',
    'plz': 'please',
    'thx': 'thanks',
    'ty': 'thank you',
    'wanna': 'want to',
    'gonna': 'going to',
    'gotta': 'got to',
    'lemme': 'let me',
    'dunno': "don't know",
    'idk': "i don't know",
    'lol': '',
    'haha': '',
    'omg': 'oh my god',
    'btw': 'by the way',
    'imo': 'in my opinion',
    'tbh': 'to be honest'
  };
  
  // Replace casual language
  for (const [casual, formal] of Object.entries(casualMappings)) {
    const regex = new RegExp(`\\b${casual}\\b`, 'gi');
    normalized = normalized.replace(regex, formal);
  }
  
  return normalized;
}

// Synonym mapping for better concept understanding
const conceptSynonyms = {
  // AI/ML concepts
  'ai': ['artificial intelligence', 'machine intelligence', 'smart system', 'intelligent system', 'cognitive computing'],
  'ml': ['machine learning', 'ml', 'automated learning', 'statistical learning', 'data science'],
  'neural': ['neural network', 'neural net', 'nn', 'deep learning', 'deep neural', 'ann'],
  'model': ['ai model', 'ml model', 'algorithm', 'system', 'predictive model'],
  
  // Programming concepts
  'code': ['programming', 'coding', 'develop', 'development', 'software', 'write code', 'build software'],
  'language': ['programming language', 'lang', 'syntax', 'programming syntax', 'code language'],
  'framework': ['library', 'toolkit', 'platform', 'system', 'development framework'],
  'api': ['application programming interface', 'endpoint', 'service', 'web service', 'rest api'],
  
  // Cloud concepts
  'cloud': ['cloud computing', 'cloud service', 'hosting', 'cloud platform', 'cloud infrastructure'],
  'server': ['serverless', 'backend', 'host', 'server infrastructure'],
  'deploy': ['deployment', 'publish', 'release', 'launch', 'host', 'put online'],
  
  // Database concepts
  'database': ['db', 'data storage', 'data store', 'data management', 'data repository'],
  'query': ['search', 'find', 'retrieve', 'fetch', 'get data', 'lookup'],
  'store': ['save', 'persist', 'keep', 'record', 'save data'],
  
  // General tech concepts
  'tool': ['software', 'application', 'app', 'utility', 'program', 'platform'],
  'platform': ['system', 'environment', 'ecosystem', 'infrastructure'],
  'service': ['api', 'endpoint', 'function', 'microservice'],
  'build': ['create', 'make', 'develop', 'construct', 'build application'],
  'learn': ['study', 'understand', 'know', 'grasp', 'master', 'get knowledge'],
  'use': ['utilize', 'employ', 'apply', 'work with', 'leverage'],
  'work': ['function', 'operate', 'run', 'execute', 'perform'],
  'help': ['assist', 'support', 'aid', 'guide', 'provide assistance'],
  'understand': ['comprehend', 'grasp', 'know', 'learn', 'get'],
  'explain': ['describe', 'tell', 'clarify', 'elaborate', 'break down'],
  'difference': ['compare', 'distinguish', 'contrast', 'differentiate'],
  'best': ['top', 'greatest', 'recommended', 'popular', 'leading'],
  'popular': ['common', 'widely used', 'famous', 'well-known', 'trending']
};

// Question patterns for intelligent FAQ detection
const questionPatterns = {
  name: {
    patterns: [
      /(?:what|who|tell me).*(?:your|you).*(?:name|are you|identity)/i,
      /(?:who|what).*are you/i,
      /(?:introduce|introduction).*yourself/i,
      /(?:what|who).*call.*you/i
    ],
    response: "I'm Mini Chatbot! A friendly AI assistant built with React and Natural Language Processing. I'm here to help, chat, and learn with you. Nice to meet you! 🤖"
  },
  capabilities: {
    patterns: [
      /(?:what|tell me).*(?:can you|you can|you do|you're capable)/i,
      /(?:what|tell me).*(?:your capabilities|your abilities|your skills|your features)/i,
      /(?:what|tell me).*(?:can.*you.*do|you.*can.*do)/i,
      /(?:your|you).*(?:capabilities|abilities|skills|features)/i,
      /(?:what.*are.*you.*good.*at|what.*do.*you.*know)/i
    ],
    response: "I can help you with:\n• Answering questions on many topics\n• Discussing programming and technology\n• Having friendly conversations\n• Providing information and insights\n• Responding to your emotions\n• Explaining AI tools and frameworks\n• Discussing cloud platforms and databases\n\nWhat would you like to explore? 💡"
  },
  creator: {
    patterns: [
      /(?:who|what).*(?:create|make|build|develop|design).*(?:you|this|chatbot)/i,
      /(?:where|how).*(?:come from|originate|start)/i,
      /(?:your|you).*(?:creator|developer|maker|builder)/i
    ],
    response: "I was created as part of a Python internship project, but I've been enhanced with React, NLP, emotional intelligence, and extensive knowledge about technologies and AI tools! I'm constantly learning and growing! 🚀"
  },
  purpose: {
    patterns: [
      /(?:what|why).*(?:purpose|goal|aim|objective|mission)/i,
      /(?:why|what).*(?:exist|here|made for)/i,
      /(?:what|your).*(?:job|role|function)/i
    ],
    response: "My purpose is to be a helpful, friendly AI companion! I'm here to:\n• Answer your questions\n• Provide information and insights\n• Have meaningful conversations\n• Support your learning journey\n• Make technology more accessible\n\nI'm always here to help! 😊"
  }
};

// Intent detection for common question types
function detectIntent(input) {
  const normalized = input.toLowerCase();
  
  // Check question patterns
  for (const [intent, data] of Object.entries(questionPatterns)) {
    if (data.patterns.some(pattern => pattern.test(input))) {
      return { intent, confidence: 'high', response: data.response };
    }
  }
  
  // Check for question words with concepts
  const questionWords = ['what', 'how', 'why', 'when', 'where', 'who', 'which', 'can', 'could', 'would', 'should'];
  const hasQuestionWord = questionWords.some(qw => normalized.includes(qw));
  
  if (hasQuestionWord) {
    // Try to understand what they're asking about
    const concepts = extractConcepts(input);
    
    if (concepts.length > 0) {
      return { intent: 'question', confidence: 'medium', concepts };
    }
  }
  
  return { intent: 'unknown', confidence: 'low' };
}

// Expand concepts with synonyms for better matching
function expandConcepts(concepts) {
  const expanded = new Set(concepts);
  
  concepts.forEach(concept => {
    // Add the original concept
    expanded.add(concept);
    
    // Add synonyms
    for (const [key, synonyms] of Object.entries(conceptSynonyms)) {
      if (concept.includes(key) || synonyms.some(syn => concept.includes(syn))) {
        synonyms.forEach(syn => expanded.add(syn));
        expanded.add(key);
      }
    }
    
    // Add variations (plural/singular)
    if (concept.endsWith('s')) {
      expanded.add(concept.slice(0, -1));
    } else {
      expanded.add(concept + 's');
    }
  });
  
  return Array.from(expanded);
}

// Simple Porter-like stemming for common English words
function stemWord(word) {
  if (word.length < 3) return word;
  
  // Common word endings to remove
  const endings = [
    { pattern: /(ies|ied|ier|iest)$/, replacement: 'y' },
    { pattern: /(ed|ing|er|est|ly)$/, replacement: '' },
    { pattern: /(s|es)$/, replacement: '' },
  ];
  
  let stemmed = word;
  for (const { pattern, replacement } of endings) {
    if (pattern.test(stemmed)) {
      stemmed = stemmed.replace(pattern, replacement);
      break;
    }
  }
  
  return stemmed;
}

/**
 * Detect emotion/sentiment from user input
 * @param {string} input - User input
 * @returns {Object} Emotion object with type and intensity
 */
function detectEmotion(input) {
  const normalized = input.toLowerCase();
  const tokens = tokenizeInput(input);
  
  // Positive emotions
  const positiveWords = ['happy', 'great', 'awesome', 'wonderful', 'excellent', 'good', 'nice', 'love', 'like', 'amazing', 'fantastic', 'brilliant', 'perfect', 'joy', 'excited', 'glad', 'pleased', 'delighted', 'thank', 'thanks', 'appreciate'];
  const positiveEmojis = ['😊', '😄', '😁', '😃', '😍', '🥰', '😎', '🤩', '🎉', '✨'];
  
  // Negative emotions
  const negativeWords = ['sad', 'bad', 'terrible', 'awful', 'hate', 'angry', 'mad', 'frustrated', 'disappointed', 'upset', 'worried', 'anxious', 'stressed', 'tired', 'exhausted', 'sick', 'hurt', 'pain', 'problem', 'issue', 'difficult'];
  const negativeEmojis = ['😢', '😞', '😔', '😟', '😕', '😤', '😠', '😡', '😰', '😨', '😓'];
  
  // Neutral/curious
  const questionWords = ['what', 'how', 'why', 'when', 'where', 'who', 'which', 'can', 'could', 'would', 'should', 'tell', 'explain', 'describe'];
  
  // Count matches
  let positiveCount = 0;
  let negativeCount = 0;
  let questionCount = 0;
  
  tokens.forEach(token => {
    if (positiveWords.some(word => token.includes(stemWord(word)))) positiveCount++;
    if (negativeWords.some(word => token.includes(stemWord(word)))) negativeCount++;
    if (questionWords.some(word => token.includes(stemWord(word)))) questionCount++;
  });
  
  // Check for exclamation marks (excitement)
  const hasExclamation = input.includes('!');
  const hasQuestion = input.includes('?');
  
  // Determine emotion
  if (positiveCount > negativeCount) {
    return {
      type: 'happy',
      intensity: positiveCount > 2 ? 'high' : 'medium',
      emoji: positiveEmojis[Math.floor(Math.random() * positiveEmojis.length)]
    };
  } else if (negativeCount > positiveCount) {
    return {
      type: 'sad',
      intensity: negativeCount > 2 ? 'high' : 'medium',
      emoji: negativeEmojis[Math.floor(Math.random() * negativeEmojis.length)]
    };
  } else if (hasQuestion || questionCount > 0) {
    return {
      type: 'curious',
      intensity: 'medium',
      emoji: '🤔'
    };
  } else {
    return {
      type: 'neutral',
      intensity: 'low',
      emoji: '😊'
    };
  }
}

/**
 * Check if input contains any of the keywords (enhanced with concept matching)
 * @param {string} input - User input
 * @param {Array} keywords - Array of keywords to check
 * @returns {boolean}
 */
function containsKeywords(input, keywords) {
  const tokens = tokenizeInput(input);
  const normalizedInput = input.toLowerCase();
  const concepts = extractConcepts(input);
  const expandedConcepts = expandConcepts(concepts);
  
  // Check for exact matches first (most reliable)
  for (const keyword of keywords) {
    const keywordLower = keyword.toLowerCase();
    if (normalizedInput.includes(keywordLower)) {
      return true;
    }
  }
  
  // Check tokenized matches
  const keywordTokens = keywords.map(k => stemWord(k.toLowerCase()));
  const hasTokenMatch = keywordTokens.some(kw => tokens.includes(kw));
  if (hasTokenMatch) return true;
  
  // Check concept matching (semantic understanding)
  for (const keyword of keywords) {
    const keywordLower = keyword.toLowerCase();
    const keywordStemmed = stemWord(keywordLower);
    
    // Check if any concept matches the keyword
    if (expandedConcepts.some(concept => 
      concept.includes(keywordStemmed) || 
      keywordStemmed.includes(concept) ||
      concept === keywordStemmed
    )) {
      return true;
    }
    
    // Check if keyword parts match concepts
    const keywordParts = keywordLower.split(/\s+/);
    if (keywordParts.some(part => 
      expandedConcepts.some(concept => 
        concept.includes(part) || part.includes(concept)
      )
    )) {
      return true;
    }
  }
  
  return false;
}

/**
 * Smart concept matching - finds the best matching topic
 * @param {string} input - User input
 * @returns {string|null} Best matching topic name or null
 */
function findBestMatchingTopic(input) {
  const concepts = extractConcepts(input);
  const expandedConcepts = expandConcepts(concepts);
  const normalizedInput = input.toLowerCase();
  
  let bestMatch = null;
  let bestScore = 0;
  
  for (const [topic, data] of Object.entries(knowledgeBase)) {
    let score = 0;
    
    // Check each keyword
    for (const keyword of data.keywords) {
      const keywordLower = keyword.toLowerCase();
      const keywordStemmed = stemWord(keywordLower);
      
      // Exact match (highest score)
      if (normalizedInput.includes(keywordLower)) {
        score += 10;
      }
      
      // Concept match
      if (expandedConcepts.some(concept => 
        concept.includes(keywordStemmed) || 
        keywordStemmed.includes(concept)
      )) {
        score += 5;
      }
      
      // Token match
      const tokens = tokenizeInput(input);
      if (tokens.includes(keywordStemmed)) {
        score += 3;
      }
      
      // Partial match
      if (normalizedInput.includes(keywordLower.substring(0, 4))) {
        score += 1;
      }
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestMatch = topic;
    }
  }
  
  // Lower threshold to catch more questions - return match if score is reasonable
  return bestScore >= 1 ? bestMatch : null;
}

// Expanded knowledge base
const knowledgeBase = {
  programming: {
    keywords: ['javascript', 'js', 'react', 'node', 'nodejs', 'java', 'c++', 'c#', 'html', 'css', 'sql', 'database', 'api', 'json', 'xml', 'git', 'github', 'coding', 'programming', 'developer', 'software', 'typescript', 'ts', 'vue', 'angular', 'svelte', 'nextjs', 'nuxt'],
    responses: [
      "Programming is writing code to create software, websites, and apps. 💻\n\n**Popular Languages:**\n• Web: JavaScript, TypeScript\n• Backend: Python, Java, Node.js\n• Mobile: Swift, Kotlin, React Native\n• Data: Python, R, SQL\n\n**Key Concepts:** Variables, functions, control structures, OOP, algorithms, APIs.\n\nWhat specific language or topic interests you?",
      "Programming enables building software, automating tasks, and solving problems with code. 🚀\n\n**Why Learn:** Problem-solving skills, creativity, career opportunities, automation.\n\n**Getting Started:** Choose a language (Python for beginners), learn basics, build projects, practice regularly.\n\nWhat would you like to learn?",
      "Programming languages translate ideas into computer instructions. 🔧\n\n**Categories:** High-level (Python, JS), low-level (C), compiled (Java, C++), interpreted (Python, JS).\n\n**Paradigms:** Object-oriented, functional, procedural.\n\nWhich topic interests you?"
    ]
  },
  aiTools: {
    keywords: ['chatgpt', 'openai', 'gpt', 'claude', 'anthropic', 'gemini', 'google ai', 'bard', 'copilot', 'github copilot', 'midjourney', 'dalle', 'stable diffusion', 'hugging face', 'transformers', 'langchain', 'llama', 'mistral', 'perplexity', 'jupyter', 'colab', 'kaggle'],
    responses: [
      "AI tools are so cool! 🤖✨ ChatGPT, Claude, Gemini, Copilot - there are tons of them now! They help with coding, writing, making images, all sorts of stuff. Which one are you curious about?",
      "The AI world is wild right now! 🎨 You've got GPT and Claude for chat, DALL-E and Midjourney for images, Copilot for coding... it's crazy how much they can do! What do you want to know?",
      "AI tools are everywhere now! 🚀 ChatGPT for conversations, GitHub Copilot for coding, Hugging Face for models... there's something for almost everything. Which one interests you?"
    ]
  },
  mlFrameworks: {
    keywords: ['tensorflow', 'pytorch', 'keras', 'scikit-learn', 'sklearn', 'pandas', 'numpy', 'matplotlib', 'seaborn', 'xgboost', 'lightgbm', 'opencv', 'spacy', 'nltk', 'transformers', 'huggingface'],
    responses: [
      "Machine learning frameworks are powerful! TensorFlow and PyTorch are the most popular deep learning frameworks. Scikit-learn is great for traditional ML, while Pandas and NumPy handle data manipulation. What would you like to learn about? 📊",
      "ML frameworks make building AI models easier! TensorFlow for production, PyTorch for research, and Scikit-learn for traditional algorithms. Each has its strengths! Which one interests you? 🧠",
      "Data science and ML tools like Pandas, NumPy, Matplotlib, and Scikit-learn form the foundation of machine learning. Combined with TensorFlow or PyTorch, you can build amazing AI applications! 💡"
    ]
  },
  cloudPlatforms: {
    keywords: ['aws', 'amazon web services', 'azure', 'microsoft azure', 'gcp', 'google cloud', 'cloudflare', 'vercel', 'netlify', 'heroku', 'digitalocean', 'linode', 's3', 'ec2', 'lambda', 'kubernetes', 'k8s'],
    responses: [
      "Cloud platforms are essential for modern applications! AWS, Azure, and Google Cloud are the big three. They offer computing, storage, databases, and AI services. Which platform are you curious about? ☁️",
      "Cloud computing has transformed how we deploy applications! AWS leads the market, Azure integrates well with Microsoft tools, and GCP excels in data analytics. What would you like to know? 🌐",
      "From serverless functions (AWS Lambda) to container orchestration (Kubernetes), cloud platforms offer incredible scalability and flexibility. Vercel and Netlify make deployment super easy too! 🚀"
    ]
  },
  devTools: {
    keywords: ['docker', 'kubernetes', 'k8s', 'jenkins', 'ci/cd', 'github actions', 'gitlab', 'terraform', 'ansible', 'vagrant', 'vscode', 'visual studio code', 'intellij', 'webstorm', 'postman', 'insomnia'],
    responses: [
      "Development tools make our lives easier! Docker for containerization, Kubernetes for orchestration, and CI/CD tools like GitHub Actions automate deployments. What tool are you interested in? 🛠️",
      "Modern dev tools are amazing! Docker containers, Kubernetes clusters, and CI/CD pipelines streamline development. VS Code is a fantastic editor, and Postman helps with API testing. Which one? 🔧",
      "DevOps tools like Docker, Kubernetes, Terraform, and Jenkins are essential for modern software development. They help with containerization, orchestration, and automation! 💻"
    ]
  },
  databases: {
    keywords: ['mysql', 'postgresql', 'postgres', 'mongodb', 'redis', 'elasticsearch', 'cassandra', 'sqlite', 'oracle', 'dynamodb', 'firebase', 'supabase', 'prisma', 'sql', 'nosql'],
    responses: [
      "Databases are the backbone of applications! SQL databases like PostgreSQL and MySQL are reliable, while NoSQL databases like MongoDB offer flexibility. Redis is great for caching! What database interests you? 🗄️",
      "Choosing the right database matters! PostgreSQL for complex queries, MongoDB for flexible schemas, Redis for speed, and Elasticsearch for search. Each has its use case! 📊",
      "Modern databases offer amazing features! PostgreSQL for relational data, MongoDB for documents, Redis for caching, and Firebase for real-time apps. What would you like to know? 💾"
    ]
  },
  technology: {
    keywords: ['ai', 'artificial intelligence', 'machine learning', 'ml', 'deep learning', 'neural network', 'blockchain', 'cloud', 'internet', 'web', 'tech', 'technology', 'iot', 'internet of things', 'ar', 'augmented reality', 'vr', 'virtual reality', 'metaverse'],
    responses: [
      "Technology is transforming our world! 🤖\n\n**AI:** Machine learning, deep learning, NLP, computer vision.\n**Emerging Tech:** Blockchain, IoT, AR/VR, cloud computing, 5G, quantum computing.\n**Impact:** Healthcare, education, business, entertainment.\n\nWhat technology interests you?",
      "Technology shapes modern life. 🌐\n\n**Major Trends:** AI/ML, cloud computing (AWS, Azure, GCP), blockchain, IoT, AR/VR, edge computing, cybersecurity.\n\n**Components:** Hardware, software, networks, data, algorithms.\n\nWhat tech topic interests you?",
      "Tech innovation is accelerating! 💡\n\n**Current:** Generative AI, cloud-native, DevOps, microservices, serverless, containers (Docker/Kubernetes).\n\n**Key Tech:** Programming languages, frameworks, databases, tools (Git, Docker, CI/CD).\n\n**Careers:** Software dev, data science, cloud engineering, cybersecurity, DevOps.\n\nWhich area interests you?"
    ]
  },
  science: {
    keywords: ['science', 'physics', 'chemistry', 'biology', 'math', 'mathematics', 'space', 'universe', 'planet', 'earth', 'star', 'galaxy', 'atom', 'molecule', 'experiment'],
    responses: [
      "Science helps us understand the world around us! From the smallest atoms to the vast universe, there's always something fascinating to learn. 🔬",
      "The beauty of science is in discovery! Whether it's physics, chemistry, biology, or mathematics, each field reveals amazing truths about our world. 🌌",
      "Science is all about asking questions and finding answers. What scientific topic interests you? I'd love to discuss it! 🧪"
    ]
  },
  general: {
    keywords: ['weather', 'food', 'music', 'movie', 'book', 'sport', 'game', 'travel', 'hobby', 'interest', 'learn', 'study', 'education', 'school', 'college', 'university'],
    responses: [
      "That's cool! 😊 I'd love to chat about that. What specifically interests you?",
      "Nice! 💬 I'm always down to talk about different stuff. What do you want to know?",
      "Sounds interesting! 🌟 What about it catches your interest? I'm here to chat!"
    ]
  },
  // General knowledge categories
  history: {
    keywords: ['history', 'historical', 'past', 'ancient', 'war', 'battle', 'empire', 'civilization', 'world war', 'revolution', 'medieval', 'renaissance'],
    responses: [
      "History is fascinating! It helps us understand how the world came to be. From ancient civilizations to modern events, history shapes our present. What historical period or event interests you? 📚",
      "The study of history reveals patterns and lessons from the past. Whether it's ancient civilizations, world wars, or cultural movements, each era has unique stories. What would you like to explore? 🏛️",
      "History connects us to our roots and helps us understand humanity's journey. From the rise and fall of empires to scientific discoveries, there's so much to learn! What historical topic catches your interest? 🌍"
    ]
  },
  science: {
    keywords: ['science', 'scientific', 'physics', 'chemistry', 'biology', 'math', 'mathematics', 'space', 'universe', 'planet', 'earth', 'star', 'galaxy', 'atom', 'molecule', 'experiment', 'research', 'discovery'],
    responses: [
      "Science is the systematic study of nature through observation and experimentation. 🔬\n\n**Branches:** Physics (matter, energy), Chemistry (atoms, reactions), Biology (life, cells), Mathematics (numbers, patterns), Astronomy (space), Earth Science (geology, weather).\n\n**Scientific Method:** Observation → Hypothesis → Experiment → Analysis → Conclusion.\n\n**Recent Discoveries:** Gravitational waves, CRISPR, exoplanets, quantum computing.\n\nWhat scientific field interests you?",
      "Science explores everything from particles to the cosmos. 🌌\n\n**Physics:** Mechanics, quantum physics, relativity, thermodynamics, electromagnetism.\n**Chemistry:** Organic, inorganic, physical, biochemistry.\n**Biology:** Cells, genetics, evolution, ecology.\n**Math:** Algebra, calculus, statistics, number theory.\n**Space:** Astronomy, astrophysics, cosmology.\n\nWhich branch interests you?",
      "Science combines knowledge and discovery methods. 🧪\n\n**Principles:** Empiricism, objectivity, reproducibility, falsifiability, peer review.\n\n**Interdisciplinary:** Biophysics, biochemistry, astrobiology, computational science.\n\n**Current Research:** Climate change, quantum computing, CRISPR, space exploration, AI, renewable energy.\n\nWhat topic interests you?"
    ]
  },
  health: {
    keywords: ['health', 'medical', 'medicine', 'doctor', 'hospital', 'disease', 'illness', 'treatment', 'therapy', 'wellness', 'fitness', 'exercise', 'nutrition', 'diet', 'mental health'],
    responses: [
      "Health and wellness are important topics! From physical fitness to mental well-being, maintaining good health is crucial. I can discuss general health topics, but remember I'm not a medical professional. What would you like to know? 💊",
      "Health encompasses physical, mental, and emotional well-being. Exercise, nutrition, sleep, and stress management all play important roles. What aspect of health interests you? 🏥",
      "Taking care of your health involves many factors - diet, exercise, sleep, and mental wellness. While I can provide general information, always consult healthcare professionals for medical advice. What health topic would you like to discuss? 💚"
    ]
  },
  business: {
    keywords: ['business', 'company', 'corporate', 'entrepreneur', 'startup', 'marketing', 'sales', 'finance', 'economy', 'economics', 'investment', 'stock', 'trade', 'management', 'leadership'],
    responses: [
      "Business and economics are fascinating fields! From startups to multinational corporations, from marketing to finance, the business world is dynamic and complex. What aspect interests you? 💼",
      "The business world involves strategy, innovation, marketing, finance, and leadership. Whether you're interested in entrepreneurship, investing, or corporate management, there's much to explore! What would you like to know? 📈",
      "Business encompasses many areas - entrepreneurship, marketing, finance, management, and economics. Each plays a crucial role in how companies operate and grow. What business topic would you like to discuss? 🏢"
    ]
  },
  culture: {
    keywords: ['culture', 'cultural', 'art', 'literature', 'philosophy', 'religion', 'language', 'tradition', 'custom', 'festival', 'celebration', 'music', 'dance', 'theater', 'cinema'],
    responses: [
      "Culture and the arts enrich our lives! From literature to music, from philosophy to visual arts, human culture is diverse and beautiful. What cultural topic interests you? 🎨",
      "Culture encompasses art, music, literature, philosophy, traditions, and beliefs. Each culture has unique expressions and perspectives. What aspect of culture would you like to explore? 📖",
      "The arts and culture reflect human creativity and expression. Whether it's literature, music, visual arts, or philosophy, there's so much to discover! What cultural topic catches your interest? 🎭"
    ]
  },
  nature: {
    keywords: ['nature', 'animal', 'plant', 'environment', 'environmental', 'climate', 'weather', 'ocean', 'forest', 'mountain', 'wildlife', 'ecosystem', 'conservation', 'planet', 'earth'],
    responses: [
      "Nature is amazing! From diverse ecosystems to fascinating wildlife, our planet is full of wonders. Understanding and protecting nature is crucial for our future. What natural topic interests you? 🌿",
      "The natural world is incredibly diverse - from rainforests to oceans, from mountains to deserts. Each ecosystem supports unique life forms. What aspect of nature would you like to explore? 🦋",
      "Nature provides us with beauty, resources, and life itself. Learning about animals, plants, ecosystems, and environmental conservation helps us appreciate and protect our planet. What natural topic interests you? 🌍"
    ]
  }
};

// General knowledge responses for any topic
function generateGeneralKnowledgeResponse(input, concepts) {
  const normalized = input.toLowerCase();
  const questionWords = ['what', 'how', 'why', 'when', 'where', 'who', 'which'];
  const isQuestion = questionWords.some(qw => normalized.includes(qw));
  
  if (!isQuestion) {
    return null;
  }
  
  // Try to provide helpful general responses based on concepts
  if (concepts.length > 0) {
    const mainConcept = concepts[0];
    
    // Generate contextual response
    const responses = [
      `That's an interesting question about ${mainConcept}! While I have knowledge on many topics, I might not have all the details. Could you be more specific? I'd love to help! 🤔`,
      `Great question! ${mainConcept} is a fascinating topic. I can discuss general aspects, but for detailed information, you might want to consult specialized resources. What specifically would you like to know? 💡`,
      `I'd be happy to help with ${mainConcept}! While I have general knowledge, some topics require specialized expertise. What aspect interests you most? 🌟`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  return null;
}

/**
 * Extract topics from conversation history
 * @param {Array} messages - Conversation messages
 * @returns {Array} Array of detected topics
 */
function extractTopicsFromContext(messages) {
  const topics = [];
  const allText = messages.map(m => m.text).join(' ').toLowerCase();
  
  for (const [topic, data] of Object.entries(knowledgeBase)) {
    const hasKeyword = data.keywords.some(keyword => 
      allText.includes(keyword.toLowerCase())
    );
    if (hasKeyword) {
      topics.push(topic);
    }
  }
  
  return topics;
}

/**
 * Check if input is a follow-up question
 * @param {string} input - User input
 * @returns {boolean}
 */
function isFollowUpQuestion(input) {
  const normalized = input.toLowerCase();
  const followUpPatterns = [
    'what about', 'how about', 'tell me more', 'more about', 'explain more',
    'what else', 'anything else', 'and', 'also', 'what is', 'what are',
    'can you', 'could you', 'would you', 'can it', 'does it', 'is it',
    'what do', 'how do', 'why do', 'where do', 'when do'
  ];
  
  return followUpPatterns.some(pattern => normalized.includes(pattern));
}

/**
 * Get response from knowledge base (enhanced with smart concept matching)
 * @param {string} input - User input
 * @param {Array} contextTopics - Topics from conversation context
 * @returns {string|null} Response if topic found, null otherwise
 */
function getKnowledgeBaseResponse(input, contextTopics = []) {
  const normalized = input.toLowerCase();
  
  // First check if we're continuing a previous topic
  if (contextTopics.length > 0 && isFollowUpQuestion(input)) {
    const lastTopic = contextTopics[contextTopics.length - 1];
    if (knowledgeBase[lastTopic]) {
      const responses = knowledgeBase[lastTopic].responses;
      const followUpResponses = [
        `Continuing on ${lastTopic}... ${responses[Math.floor(Math.random() * responses.length)]}`,
        `Great question! Regarding ${lastTopic}, ${responses[Math.floor(Math.random() * responses.length)].toLowerCase()}`,
        `Let me tell you more about ${lastTopic}. ${responses[Math.floor(Math.random() * responses.length)]}`
      ];
      return followUpResponses[Math.floor(Math.random() * followUpResponses.length)];
    }
  }
  
  // Use smart concept matching to find the best topic
  const bestTopic = findBestMatchingTopic(input);
  if (bestTopic && knowledgeBase[bestTopic]) {
    const responses = knowledgeBase[bestTopic].responses;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Fallback to traditional keyword matching
  const tokens = tokenizeInput(input);
  for (const [topic, data] of Object.entries(knowledgeBase)) {
    const hasKeyword = data.keywords.some(keyword => 
      normalized.includes(keyword.toLowerCase()) || 
      tokens.some(token => token.includes(stemWord(keyword.toLowerCase())))
    );
    
    if (hasKeyword) {
      const responses = data.responses;
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }
  
  return null;
}

/**
 * Process user input and generate appropriate response with emotions
 * @param {string} userInput - User's message
 * @param {Object} context - Conversation context (optional)
 * @returns {Object} Response object with text and emotion
 */
export function processUserInput(userInput, context = {}) {
  const input = userInput.trim();
  
  if (!input) {
    return {
      text: "Please type something! I'm here and ready to chat! 😊",
      emotion: { type: 'neutral', emoji: '😊' }
    };
  }
  
  const normalizedInput = input.toLowerCase();
  const emotion = detectEmotion(input);
  
  // Extract context information
  const recentMessages = context.recentMessages || [];
  const conversationHistory = context.conversationHistory || [];
  
  // Check for explicit references to previous messages (pronouns, "it", "that", etc.)
  const referenceWords = ['it', 'that', 'this', 'they', 'them', 'those', 'these', 'same', 'similar'];
  const questionWords = ['what', 'how', 'why', 'where', 'when', 'which', 'who'];
  const isReference = referenceWords.some(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(input) && recentMessages.length > 0;
  });
  
  const isQuestionWithReference = questionWords.some(qWord => {
    const regex = new RegExp(`\\b${qWord}\\s+(is|are|does|do|can|could|will|would)\\s+(it|that|this|they|them)`, 'i');
    return regex.test(input) && recentMessages.length > 0;
  });
  
  // Only use context if there's an explicit reference - otherwise answer directly
  let contextTopics = [];
  if (isReference || isQuestionWithReference) {
    // Only extract context topics if there's an explicit reference
    contextTopics = extractTopicsFromContext(conversationHistory);
  }
  
  // If it's a reference and we have context, try to understand what they're referring to
  if ((isReference || isQuestionWithReference) && recentMessages.length > 0 && contextTopics.length > 0) {
    const lastTopic = contextTopics[contextTopics.length - 1];
    if (knowledgeBase[lastTopic]) {
      const responses = knowledgeBase[lastTopic].responses;
      
      // Extract the question type
      let questionType = 'about';
      if (normalizedInput.includes('what is') || normalizedInput.includes('what are')) {
        questionType = 'what';
      } else if (normalizedInput.includes('how')) {
        questionType = 'how';
      } else if (normalizedInput.includes('why')) {
        questionType = 'why';
      }
      
      const contextResponses = [
        `You're asking ${questionType === 'what' ? 'what' : questionType === 'how' ? 'how' : 'about'} ${lastTopic}? ${responses[Math.floor(Math.random() * responses.length)]}`,
        `Regarding ${lastTopic}, ${responses[Math.floor(Math.random() * responses.length)].toLowerCase()}`,
        `About ${lastTopic} - ${responses[Math.floor(Math.random() * responses.length)].toLowerCase()}`,
        `Yes, ${lastTopic}! ${responses[Math.floor(Math.random() * responses.length)]}`
      ];
      return {
        text: contextResponses[Math.floor(Math.random() * contextResponses.length)],
        emotion: emotion
      };
    }
  }
  
  // Exit commands (social media style - more casual)
  if (['bye', 'exit', 'quit', 'goodbye', 'see you', 'farewell', 'cya', 'later', 'gtg', 'gotta go'].includes(normalizedInput)) {
    const farewells = [
      "Bye! It was great chatting with you! Take care! 👋",
      "See ya! Had fun talking! Have a good one! 🌟",
      "Later! It was nice chatting! Come back anytime! 😊",
      "Bye bye! Thanks for the chat! Hit me up anytime! 💙",
      "Catch you later! Was fun talking! 👋",
      "Alright, see you! Thanks for chatting! 😊"
    ];
    return {
      text: farewells[Math.floor(Math.random() * farewells.length)],
      emotion: { type: 'happy', emoji: '👋' }
    };
  }
  
  // Greeting responses with emotions
  const greetings = ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'hi there', 'hey there'];
  if (containsKeywords(input, greetings) || greetings.some(g => normalizedInput.includes(g))) {
    const timeOfDay = new Date().getHours();
    let greeting = "Hello!";
    let emoji = "😊";
    
    if (timeOfDay < 12) {
      greeting = "Good morning!";
      emoji = "🌅";
    } else if (timeOfDay < 17) {
      greeting = "Good afternoon!";
      emoji = "☀️";
    } else {
      greeting = "Good evening!";
      emoji = "🌙";
    }
    
    const responses = [
      `${greeting} ${emoji} How can I help you today?`,
      `${greeting} ${emoji} It's great to see you! What's on your mind?`,
      `${greeting} ${emoji} Welcome! I'm excited to chat with you!`
    ];
    
    return {
      text: responses[Math.floor(Math.random() * responses.length)],
      emotion: { type: 'happy', emoji: emoji }
    };
  }
  
  // Emotional responses
  if (emotion.type === 'sad' && emotion.intensity === 'high') {
    const comfortingResponses = [
      `I'm sorry to hear you're feeling down. ${emotion.emoji} Would you like to talk about it? I'm here to listen and help if I can.`,
      `It sounds like you're going through a tough time. ${emotion.emoji} Remember, things often get better. Is there anything specific I can help with?`,
      `I sense you might be feeling low. ${emotion.emoji} Sometimes talking helps. What's on your mind?`
    ];
    return {
      text: comfortingResponses[Math.floor(Math.random() * comfortingResponses.length)],
      emotion: { type: 'empathetic', emoji: '💙' }
    };
  }
  
  if (emotion.type === 'happy' && emotion.intensity === 'high') {
    const enthusiasticResponses = [
      `That's wonderful! ${emotion.emoji} I'm so glad to hear you're feeling great! What's making you happy today?`,
      `Awesome! ${emotion.emoji} Your positivity is contagious! Tell me more about what's going well!`,
      `Fantastic! ${emotion.emoji} I love your energy! What exciting things are happening?`
    ];
    return {
      text: enthusiasticResponses[Math.floor(Math.random() * enthusiasticResponses.length)],
      emotion: { type: 'happy', emoji: emotion.emoji }
    };
  }
  
  // Smart FAQ detection using intent recognition (no keyword dependency)
  const detectedIntent = detectIntent(input);
  
  if (detectedIntent.intent === 'name' && detectedIntent.confidence === 'high') {
    const nameResponses = [
      `Hey! I'm Mini Chatbot! ${emotion.emoji} A friendly AI assistant. Nice to meet you! 🤖`,
      `Hi! I'm Mini Chatbot! ${emotion.emoji} Your friendly digital buddy! What's up? 💬`,
      `Hey there! I'm Mini Chatbot! ${emotion.emoji} I'm here to help and chat. What can I do for you? 😊`
    ];
    return {
      text: nameResponses[Math.floor(Math.random() * nameResponses.length)],
      emotion: { type: 'happy', emoji: '🤖' }
    };
  }
  
  // Check specific tech/tool handlers FIRST (before generic knowledge base)
  // This ensures specific questions get specific answers
  
  // React - concise and focused
  if (containsKeywords(input, ['react', 'reactjs', 'what is react', 'tell me about react'])) {
    // Check if asking a specific question about React
    if (/how\s+(does|do|can|should)/i.test(input)) {
      return {
        text: "React works by using a Virtual DOM to efficiently update the UI. Components re-render when state changes, and React calculates the minimal changes needed. Use hooks like useState for state and useEffect for side effects. ⚛️",
        emotion: { type: 'enthusiastic', emoji: '⚛️' }
      };
    }
    if (/why\s+(is|use|choose)/i.test(input)) {
      return {
        text: "React is popular because it's component-based, has a Virtual DOM for performance, large ecosystem, and is used by companies like Facebook, Netflix, and Airbnb. ⚛️",
        emotion: { type: 'enthusiastic', emoji: '⚛️' }
      };
    }
    // Default: what is React
    return {
      text: "React is a JavaScript library for building user interfaces, created by Facebook in 2013. ⚛️\n\n**Key Features:**\n• Component-based architecture\n• Virtual DOM for efficient updates\n• Hooks for state management (useState, useEffect)\n• Large ecosystem (React Router, Redux)\n• Used by Netflix, Airbnb, Instagram\n\nIt's declarative, efficient, and flexible.",
      emotion: { type: 'enthusiastic', emoji: '⚛️' }
    };
  }
  
  // JavaScript - concise and focused
  if (containsKeywords(input, ['javascript', 'js', 'what is javascript', 'tell me about javascript'])) {
    if (/how\s+(does|do|can|should)/i.test(input)) {
      return {
        text: "JavaScript runs in browsers and on servers (Node.js). It's event-driven and asynchronous. Use functions, objects, and modern features like async/await for asynchronous operations. 🌐",
        emotion: { type: 'enthusiastic', emoji: '🌐' }
      };
    }
    if (/why\s+(is|use|learn)/i.test(input)) {
      return {
        text: "JavaScript is essential for web development - it's the only language that runs natively in browsers. It's also used for backend (Node.js), mobile apps (React Native), and has a massive ecosystem (npm). 🌐",
        emotion: { type: 'enthusiastic', emoji: '🌐' }
      };
    }
    return {
      text: "JavaScript is a programming language created in 1995, used for web development. 🌐\n\n**Key Features:**\n• Runs in browsers and on servers (Node.js)\n• Dynamic typing, first-class functions\n• Modern features: ES6+, async/await, modules\n• Frameworks: React, Vue, Angular\n• Package manager: npm (largest ecosystem)\n\nIt powers interactive websites, mobile apps, and server-side applications.",
      emotion: { type: 'enthusiastic', emoji: '🌐' }
    };
  }
  
  // Python - concise and focused
  if (containsKeywords(input, ['python', 'what is python', 'tell me about python'])) {
    if (/how\s+(does|do|can|should)/i.test(input)) {
      return {
        text: "Python is interpreted - code runs directly without compilation. Use indentation for blocks, and leverage its extensive standard library and packages from PyPI. 🐍",
        emotion: { type: 'enthusiastic', emoji: '🐍' }
      };
    }
    if (/why\s+(is|use|learn)/i.test(input)) {
      return {
        text: "Python is easy to learn, versatile (web, data science, AI, automation), has a large community, and is used by Google, Netflix, and NASA. Great for beginners and experts. 🐍",
        emotion: { type: 'enthusiastic', emoji: '🐍' }
      };
    }
    return {
      text: "Python is a high-level programming language created in 1991, known for simplicity and readability. 🐍\n\n**Use Cases:**\n• Web development (Django, Flask)\n• Data science (NumPy, Pandas)\n• Machine learning (TensorFlow, PyTorch)\n• Automation and scripting\n• Scientific computing\n\n**Features:**\n• Easy to learn, readable syntax\n• Large standard library\n• 400,000+ packages on PyPI\n• Used by Google, Instagram, Netflix",
      emotion: { type: 'enthusiastic', emoji: '🐍' }
    };
  }
  
  // AI Tools - ChatGPT - concise
  if (containsKeywords(input, ['chatgpt', 'gpt', 'openai', 'what is chatgpt', 'tell me about chatgpt'])) {
    if (/how\s+(does|do|work)/i.test(input)) {
      return {
        text: "ChatGPT uses transformer neural networks trained on vast text data. It processes input as tokens, understands context, and generates responses using patterns learned during training. 🤖",
        emotion: { type: 'enthusiastic', emoji: '🤖' }
      };
    }
    if (/why\s+(is|use)/i.test(input)) {
      return {
        text: "ChatGPT is useful for answering questions, writing code, creative content, problem-solving, and maintaining conversations. It's accessible and versatile. 🤖",
        emotion: { type: 'enthusiastic', emoji: '🤖' }
      };
    }
    return {
      text: "ChatGPT is an AI language model by OpenAI, based on GPT architecture. 🤖\n\n**Capabilities:**\n• Answer questions and provide information\n• Write code and creative content\n• Problem-solving and analysis\n• Translation and summarization\n\n**Versions:** GPT-3.5 (free), GPT-4 (more capable), GPT-4 Turbo (latest)\n\n**Limitations:** Can hallucinate, has knowledge cutoff, may not always be accurate.",
      emotion: { type: 'enthusiastic', emoji: '🤖' }
    };
  }
  
  // AI Tools - Claude - concise
  if (containsKeywords(input, ['claude', 'anthropic', 'what is claude', 'tell me about claude'])) {
    if (/how\s+(does|do|work)/i.test(input)) {
      return {
        text: "Claude uses Constitutional AI training to be helpful, harmless, and honest. It processes long context (up to 200K tokens), analyzes complex topics, and provides thoughtful responses. 🧠",
        emotion: { type: 'enthusiastic', emoji: '🧠' }
      };
    }
    if (/why\s+(is|use)/i.test(input)) {
      return {
        text: "Claude excels at long-form content, code analysis, complex reasoning, and ethical AI practices. It's known for thoughtful, nuanced responses and strong safety focus. 🧠",
        emotion: { type: 'enthusiastic', emoji: '🧠' }
      };
    }
    return {
      text: "Claude is an AI assistant by Anthropic, focused on safety and helpfulness. 🧠\n\n**Key Features:**\n• Long context windows (200K tokens)\n• Advanced reasoning and analysis\n• Strong code proficiency\n• Ethical AI alignment\n• Versions: Opus (most capable), Sonnet (balanced), Haiku (fastest)\n\n**Use Cases:** Technical writing, code review, research, content creation.",
      emotion: { type: 'enthusiastic', emoji: '🧠' }
    };
  }
  
  // AI Tools - GitHub Copilot - concise
  if (containsKeywords(input, ['copilot', 'github copilot', 'what is copilot', 'tell me about copilot'])) {
    if (/how\s+(does|do|work)/i.test(input)) {
      return {
        text: "GitHub Copilot uses OpenAI's Codex model to analyze your code context and suggest completions as you type. It works as an extension in your code editor. 💻",
        emotion: { type: 'enthusiastic', emoji: '💻' }
      };
    }
    return {
      text: "GitHub Copilot is an AI code completion tool that suggests code as you type. 💻\n\n**Features:**\n• Code suggestions and completions\n• Generates functions and code blocks\n• Supports multiple programming languages\n• Integrates with code editors\n\nIt's like having an AI pair programmer in your editor.",
      emotion: { type: 'enthusiastic', emoji: '💻' }
    };
  }
  
  // AI Tools - TensorFlow - concise
  if (containsKeywords(input, ['tensorflow', 'what is tensorflow', 'tell me about tensorflow'])) {
    if (/how\s+(does|do|work)/i.test(input)) {
      return {
        text: "TensorFlow builds computational graphs for neural networks. It uses tensors (multi-dimensional arrays), automatic differentiation for gradients, and supports distributed training across GPUs/TPUs. 🔥",
        emotion: { type: 'enthusiastic', emoji: '🔥' }
      };
    }
    if (/why\s+(is|use)/i.test(input)) {
      return {
        text: "TensorFlow is production-ready with strong deployment tools, mobile/edge support (TensorFlow Lite), and is great for large-scale ML systems. Used by Airbnb, Uber, Dropbox. 🔥",
        emotion: { type: 'enthusiastic', emoji: '🔥' }
      };
    }
    return {
      text: "TensorFlow is Google's open-source ML framework (2015). 🔥\n\n**Features:**\n• Build and train neural networks\n• Keras integration for easy model building\n• Distributed training (GPUs/TPUs)\n• TensorFlow Lite (mobile), TensorFlow.js (browser)\n• TensorBoard for visualization\n\n**Use Cases:** Computer vision, NLP, recommendation systems, time series forecasting.\n\n**Ecosystem:** TensorFlow Hub, TFX, TensorFlow Serving.",
      emotion: { type: 'enthusiastic', emoji: '🔥' }
    };
  }
  
  // AI Tools - PyTorch - concise
  if (containsKeywords(input, ['pytorch', 'what is pytorch', 'tell me about pytorch'])) {
    if (/how\s+(does|do|work)/i.test(input)) {
      return {
        text: "PyTorch uses dynamic computation graphs that build on-the-fly. It's Pythonic (like NumPy with GPU), uses autograd for automatic differentiation, and executes code immediately. 🚀",
        emotion: { type: 'enthusiastic', emoji: '🚀' }
      };
    }
    if (/why\s+(is|use)/i.test(input)) {
      return {
        text: "PyTorch is preferred for research because it's flexible, easy to debug (use Python debuggers), intuitive (Pythonic), and allows fast iteration. Used by Tesla, Uber, research institutions. 🚀",
        emotion: { type: 'enthusiastic', emoji: '🚀' }
      };
    }
    return {
      text: "PyTorch is Meta's deep learning framework (2016), popular for research. 🚀\n\n**Features:**\n• Dynamic computation graphs\n• Pythonic design (like NumPy with GPU)\n• Easy debugging with Python tools\n• Strong research focus\n• TorchScript for production\n\n**Use Cases:** Research, computer vision, NLP, reinforcement learning.\n\n**Ecosystem:** TorchVision, TorchText, TorchAudio, PyTorch Lightning.\n\n**vs TensorFlow:** More Pythonic, easier debugging, research-focused.",
      emotion: { type: 'enthusiastic', emoji: '🚀' }
    };
  }
  
  // Cloud Platforms - AWS
  if (containsKeywords(input, ['aws', 'amazon web services', 'what is aws', 'tell me about aws'])) {
    return {
      text: "AWS (Amazon Web Services) is Amazon's comprehensive cloud computing platform, launched in 2006! ☁️ It's the world's largest and most widely adopted cloud platform.\n\n**Core Services:**\n• **Compute**: EC2 (virtual servers), Lambda (serverless), ECS/EKS (containers), Elastic Beanstalk (PaaS)\n• **Storage**: S3 (object storage), EBS (block storage), EFS (file storage), Glacier (archival)\n• **Databases**: RDS (managed SQL), DynamoDB (NoSQL), Redshift (data warehouse), ElastiCache (caching)\n• **Networking**: VPC (virtual networks), CloudFront (CDN), Route 53 (DNS), API Gateway\n• **AI/ML**: SageMaker (ML platform), Rekognition (image/video analysis), Comprehend (NLP), Polly (text-to-speech)\n• **Analytics**: Athena (SQL on S3), EMR (big data), Kinesis (streaming), QuickSight (BI)\n• **Security**: IAM (access control), CloudTrail (auditing), GuardDuty (threat detection), WAF (web firewall)\n• **DevOps**: CodePipeline (CI/CD), CodeBuild, CodeDeploy, CloudFormation (infrastructure as code)\n\n**Key Advantages:**\n• **Scalability**: Auto-scaling from 1 to millions of users\n• **Global Infrastructure**: 31 regions, 99 availability zones worldwide\n• **Pay-as-you-go**: Only pay for what you use\n• **Enterprise-grade**: Security, compliance, reliability\n• **Vast Ecosystem**: 200+ services covering every need\n• **Market Leader**: 33% market share, trusted by millions\n\n**Use Cases:**\n• Web hosting and applications\n• Data storage and backup\n• Big data analytics\n• Machine learning and AI\n• IoT applications\n• Enterprise IT migration\n• Disaster recovery\n\n**Who Uses It:**\nNetflix, Airbnb, NASA, Samsung, Adobe, Slack, and millions of startups and enterprises. It powers a significant portion of the internet!\n\n**Certifications:**\nAWS offers certifications (Solutions Architect, Developer, SysOps, etc.) that are highly valued in the industry.\n\n**Getting Started:**\nFree tier available for 12 months, extensive documentation, and AWS Educate for students!",
      emotion: { type: 'enthusiastic', emoji: '☁️' }
    };
  }
  
  // Cloud Platforms - Azure
  if (containsKeywords(input, ['azure', 'microsoft azure', 'what is azure', 'tell me about azure'])) {
    return {
      text: "Microsoft Azure is a comprehensive cloud computing platform launched in 2010! ☁️ It's the second-largest cloud provider globally.\n\n**Core Services:**\n• **Compute**: Virtual Machines, App Service, Functions (serverless), Container Instances, AKS (Kubernetes)\n• **Storage**: Blob Storage, Files, Queues, Tables, Data Lake\n• **Databases**: SQL Database, Cosmos DB (NoSQL), MySQL, PostgreSQL, Redis Cache\n• **Networking**: Virtual Network, Load Balancer, VPN Gateway, CDN, Application Gateway\n• **AI/ML**: Azure Machine Learning, Cognitive Services, Bot Framework, Computer Vision\n• **Analytics**: Azure Synapse, HDInsight, Data Factory, Stream Analytics\n• **DevOps**: Azure DevOps, GitHub Actions integration, Container Registry\n• **Security**: Azure Active Directory, Key Vault, Security Center, Sentinel\n• **IoT**: IoT Hub, IoT Central, Digital Twins\n\n**Key Advantages:**\n• **Microsoft Integration**: Seamless with Office 365, Windows Server, Active Directory\n• **Hybrid Cloud**: Strong on-premises integration (Azure Arc, Azure Stack)\n• **Enterprise Focus**: Built for large organizations\n• **Compliance**: Extensive compliance certifications (HIPAA, GDPR, etc.)\n• **Global Presence**: 60+ regions worldwide\n• **Enterprise Agreements**: Flexible pricing for large customers\n\n**Unique Features:**\n• **Azure Active Directory**: Enterprise identity management\n• **Azure Arc**: Manage resources across cloud, on-prem, and edge\n• **Azure Stack**: Run Azure services on-premises\n• **Power Platform Integration**: Low-code tools (Power Apps, Power BI)\n• **Visual Studio Integration**: Native development tools\n\n**Use Cases:**\n• **Enterprise Migration**: Moving Windows-based infrastructure to cloud\n• **Hybrid Environments**: Combining cloud and on-premises\n• **Microsoft Ecosystem**: Organizations using Office 365, Dynamics\n• **Enterprise Applications**: Large-scale business applications\n• **Government**: Strong government cloud offerings\n• **Healthcare**: HIPAA-compliant solutions\n\n**Azure vs AWS:**\n• **Azure**: Better Microsoft integration, hybrid cloud, enterprise focus\n• **AWS**: Larger service catalog, more mature, broader ecosystem\n\n**Popular Services:**\n• **Azure App Service**: Platform for web apps\n• **Azure Functions**: Serverless computing\n• **Azure Cosmos DB**: Globally distributed database\n• **Azure DevOps**: CI/CD and project management\n• **Azure Cognitive Services**: Pre-built AI services\n\n**Who Uses Azure:**\nWalmart, BMW, GE Healthcare, Adobe, and thousands of enterprises. It's particularly strong in enterprise and government sectors!",
      emotion: { type: 'enthusiastic', emoji: '☁️' }
    };
  }
  
  // Cloud Platforms - Google Cloud
  if (containsKeywords(input, ['gcp', 'google cloud', 'google cloud platform', 'what is gcp', 'tell me about gcp'])) {
    return {
      text: "Google Cloud Platform (GCP) is Google's cloud computing service! ☁️ It excels at:\n• Data analytics and BigQuery\n• Machine learning and AI\n• Kubernetes and containers\n• Serverless computing\n• Integration with Google services\n\nIt's known for its data and AI capabilities!",
      emotion: { type: 'enthusiastic', emoji: '☁️' }
    };
  }
  
  // Dev Tools - Docker
  if (containsKeywords(input, ['docker', 'what is docker', 'tell me about docker', 'docker container'])) {
    return {
      text: "Docker is an open-source containerization platform that packages applications and their dependencies into lightweight, portable containers! 🐳 Released in 2013.\n\n**What Are Containers?**\nContainers are isolated environments that include your application code, runtime, system tools, libraries, and settings. They're like lightweight virtual machines but share the host OS kernel.\n\n**Key Concepts:**\n• **Dockerfile**: Blueprint for building images (defines what goes in the container)\n• **Image**: Read-only template used to create containers\n• **Container**: Running instance of an image\n• **Docker Hub**: Registry for sharing images (like GitHub for containers)\n• **Docker Compose**: Tool for defining and running multi-container applications\n\n**Benefits:**\n• **Consistency**: \"Works on my machine\" → \"Works everywhere\"\n• **Isolation**: Each container runs independently\n• **Portability**: Run the same container on any Docker-enabled system\n• **Efficiency**: Containers share the OS kernel, using less resources than VMs\n• **Scalability**: Easy to spin up multiple instances\n• **Version Control**: Images are versioned and can be rolled back\n\n**Common Use Cases:**\n• **Development**: Consistent dev environments across team\n• **CI/CD**: Build and test in containers\n• **Microservices**: Package each service in its own container\n• **Deployment**: Deploy applications without worrying about server setup\n• **Testing**: Isolated test environments\n• **Cloud Migration**: Package legacy apps for cloud deployment\n\n**Docker Ecosystem:**\n• **Docker Desktop**: GUI for Mac/Windows\n• **Docker Engine**: Runtime for Linux\n• **Docker Swarm**: Native clustering/orchestration\n• **Kubernetes**: Often used with Docker for orchestration\n• **Docker Compose**: Multi-container applications\n\n**Example Workflow:**\n1. Write Dockerfile\n2. Build image: `docker build -t myapp .`\n3. Run container: `docker run -p 3000:3000 myapp`\n4. Push to registry: `docker push myapp`\n\n**Why It's Revolutionary:**\nBefore Docker: \"It works on my machine\" problems, complex deployment processes, environment inconsistencies.\nAfter Docker: Consistent environments, easy deployment, simplified DevOps, microservices architecture enabled.\n\nUsed by companies like Netflix, Spotify, PayPal, and millions of developers worldwide!",
      emotion: { type: 'enthusiastic', emoji: '🐳' }
    };
  }
  
  // Dev Tools - Kubernetes
  if (containsKeywords(input, ['kubernetes', 'k8s', 'what is kubernetes', 'tell me about kubernetes'])) {
    return {
      text: "Kubernetes (K8s) is an open-source container orchestration platform originally designed by Google, now maintained by the Cloud Native Computing Foundation! ⚙️\n\n**What It Does:**\nKubernetes automates the deployment, scaling, and management of containerized applications across clusters of machines.\n\n**Core Concepts:**\n• **Pods**: Smallest deployable unit (contains one or more containers)\n• **Nodes**: Worker machines (physical or virtual) that run pods\n• **Cluster**: Set of nodes working together\n• **Deployments**: Manages replica sets and rolling updates\n• **Services**: Stable network endpoint for pods\n• **Namespaces**: Virtual clusters within a physical cluster\n• **ConfigMaps & Secrets**: Configuration and sensitive data management\n\n**Key Features:**\n• **Auto-scaling**: Automatically scale applications based on demand\n• **Self-healing**: Restarts failed containers, replaces nodes\n• **Rolling Updates**: Deploy updates with zero downtime\n• **Load Balancing**: Distribute traffic across pods\n• **Service Discovery**: Automatic DNS and service registration\n• **Storage Orchestration**: Mount storage systems automatically\n• **Secret Management**: Handle sensitive data securely\n\n**Why \"K8s\"?**\nKubernetes has 10 letters between K and S, so it's abbreviated as K8s!\n\n**Common Use Cases:**\n• **Microservices**: Orchestrate multiple containerized services\n• **CI/CD**: Deploy applications automatically\n• **Multi-cloud**: Run applications across different cloud providers\n• **Hybrid Cloud**: Combine on-premises and cloud resources\n• **Edge Computing**: Deploy to edge locations\n\n**Kubernetes Ecosystem:**\n• **Helm**: Package manager for Kubernetes (charts)\n• **Istio**: Service mesh for microservices\n• **Prometheus**: Monitoring and alerting\n• **Grafana**: Visualization and dashboards\n• **ArgoCD**: GitOps continuous delivery\n• **Kubectl**: Command-line tool for managing clusters\n\n**Deployment Options:**\n• **Managed Services**: EKS (AWS), GKE (Google), AKS (Azure)\n• **Self-hosted**: Install on your own infrastructure\n• **Minikube**: Local Kubernetes for development\n• **Kind**: Kubernetes in Docker for testing\n\n**Benefits:**\n• **Portability**: Run anywhere (cloud, on-prem, hybrid)\n• **Scalability**: Handle from small to massive deployments\n• **Reliability**: Self-healing and fault tolerance\n• **Efficiency**: Better resource utilization\n• **Automation**: Reduces manual operations\n\n**Learning Path:**\n1. Understand containers (Docker)\n2. Learn Kubernetes basics (pods, services, deployments)\n3. Practice with minikube or cloud providers\n4. Explore advanced topics (networking, storage, security)\n5. Learn ecosystem tools (Helm, monitoring, etc.)\n\n**Industry Impact:**\nKubernetes has become the de facto standard for container orchestration. Used by companies like Google, Netflix, Spotify, Airbnb, and thousands of others. It's the foundation of modern cloud-native applications!",
      emotion: { type: 'enthusiastic', emoji: '⚙️' }
    };
  }
  
  // Databases - MySQL
  if (containsKeywords(input, ['mysql', 'what is mysql', 'tell me about mysql'])) {
    return {
      text: "MySQL is one of the most popular open-source relational databases! 🗄️ It's known for:\n• Fast and reliable performance\n• Easy to use and set up\n• Widely supported by hosting providers\n• Great for web applications\n• Strong community support\n\nIt's perfect for many web projects!",
      emotion: { type: 'enthusiastic', emoji: '🗄️' }
    };
  }
  
  // Databases - PostgreSQL
  if (containsKeywords(input, ['postgresql', 'postgres', 'what is postgresql', 'tell me about postgresql'])) {
    return {
      text: "PostgreSQL is a powerful, open-source object-relational database system, first released in 1996! 🗄️ It's known for its advanced features and SQL compliance.\n\n**Core Features:**\n• **ACID Compliance**: Full transactional support with strong data integrity\n• **Advanced SQL**: Supports complex queries, window functions, CTEs, recursive queries\n• **Extensibility**: Can add custom data types, functions, operators, and languages\n• **JSON Support**: Native JSON and JSONB data types with indexing\n• **Full-Text Search**: Built-in text search capabilities\n• **Geospatial Data**: PostGIS extension for geographic objects\n• **Concurrent Access**: Handles multiple users efficiently\n• **Foreign Data Wrappers**: Query external data sources\n\n**Advanced Capabilities:**\n• **Window Functions**: Advanced analytical queries\n• **Common Table Expressions (CTEs)**: Recursive queries and complex logic\n• **Array and JSON Types**: Store and query complex data structures\n• **Custom Functions**: Write functions in multiple languages (PL/pgSQL, Python, etc.)\n• **Partitioning**: Table partitioning for large datasets\n• **Materialized Views**: Pre-computed views for performance\n• **Triggers**: Automatic actions on data changes\n\n**Why Choose PostgreSQL:**\n• **Standards Compliance**: Follows SQL standards closely\n• **Reliability**: Proven track record in production\n• **Feature-Rich**: More features than MySQL\n• **No Licensing Costs**: Completely free and open-source\n• **Active Development**: Constant improvements and updates\n• **Strong Community**: Large, helpful community\n\n**Use Cases:**\n• **Enterprise Applications**: Complex business logic and reporting\n• **Data Warehousing**: Analytics and reporting\n• **Geospatial Applications**: Location-based services (with PostGIS)\n• **Financial Systems**: Need for ACID compliance and data integrity\n• **Content Management**: Flexible schema with JSON support\n• **Scientific Applications**: Complex data types and calculations\n\n**PostgreSQL vs MySQL:**\n• **PostgreSQL**: More features, better for complex queries, stronger data integrity\n• **MySQL**: Faster for simple queries, easier to set up, more widely used\n\n**Extensions:**\n• **PostGIS**: Geographic objects and spatial queries\n• **pg_trgm**: Trigram matching for fuzzy text search\n• **hstore**: Key-value storage\n• **uuid-ossp**: UUID generation\n• **pgcrypto**: Cryptographic functions\n\n**Performance:**\n• Excellent for complex queries and analytical workloads\n• Strong query optimizer\n• Good concurrency handling\n• Can handle large datasets efficiently\n\n**Companies Using PostgreSQL:**\nApple, Instagram, Spotify, Reddit, NASA, and thousands of enterprises. It's considered one of the most advanced open-source databases!",
      emotion: { type: 'enthusiastic', emoji: '🗄️' }
    };
  }
  
  // Databases - MongoDB
  if (containsKeywords(input, ['mongodb', 'what is mongodb', 'tell me about mongodb'])) {
    return {
      text: "MongoDB is a popular NoSQL document database that stores data in flexible, JSON-like documents! 🗄️ Released in 2009.\n\n**What Makes It Different:**\nUnlike relational databases (SQL), MongoDB is schema-less, meaning each document can have different fields. It's designed for modern applications that need flexibility and scalability.\n\n**Core Concepts:**\n• **Documents**: BSON (Binary JSON) documents stored in collections\n• **Collections**: Groups of documents (similar to tables in SQL)\n• **Databases**: Containers for collections\n• **Indexes**: Improve query performance (just like SQL)\n• **Replica Sets**: High availability with automatic failover\n• **Sharding**: Horizontal scaling across multiple servers\n\n**Key Features:**\n• **Flexible Schema**: No fixed schema - documents can vary\n• **Rich Queries**: Powerful query language with operators\n• **Aggregation Pipeline**: Complex data processing and transformations\n• **Geospatial Queries**: Built-in support for location-based queries\n• **Full-text Search**: Text search capabilities\n• **Change Streams**: Real-time data change notifications\n• **Transactions**: ACID transactions (in recent versions)\n\n**Data Model:**\nDocuments are stored in collections. A document can contain:\n• Nested objects and arrays\n• Various data types (strings, numbers, dates, booleans, etc.)\n• References to other documents\n• Embedded documents\n\n**Use Cases:**\n• **Content Management**: Blogs, CMS, user-generated content\n• **Real-time Analytics**: IoT data, logging, metrics\n• **Mobile Apps**: Flexible data models for mobile backends\n• **Catalogs**: Product catalogs, content libraries\n• **Social Networks**: User profiles, posts, relationships\n• **Gaming**: Player data, game state, leaderboards\n\n**MongoDB Ecosystem:**\n• **MongoDB Atlas**: Managed cloud database service\n• **MongoDB Compass**: GUI for database management\n• **MongoDB Realm**: Backend-as-a-Service platform\n• **MongoDB Charts**: Data visualization\n• **MongoDB Stitch**: Serverless platform (now Realm)\n\n**Advantages:**\n• **Developer-Friendly**: Natural mapping to programming languages\n• **Scalability**: Easy horizontal scaling with sharding\n• **Performance**: Fast reads and writes, especially for document queries\n• **Flexibility**: Schema can evolve with your application\n• **Rich Ecosystem**: Strong community and tools\n\n**When to Use MongoDB:**\n• Need flexible, evolving schemas\n• Working with semi-structured data\n• Building modern web/mobile apps\n• Need horizontal scaling\n• Real-time applications\n• Content management systems\n\n**When NOT to Use:**\n• Complex transactions across many documents\n• Heavy relational data with many joins\n• Applications requiring strict ACID guarantees\n• Small, simple applications (might be overkill)\n\n**MongoDB vs SQL:**\n• **MongoDB**: Flexible schema, document-based, horizontal scaling\n• **SQL**: Fixed schema, relational, vertical scaling\n\nUsed by companies like eBay, Adobe, Forbes, and thousands of startups!",
      emotion: { type: 'enthusiastic', emoji: '🗄️' }
    };
  }
  
  // Programming Languages - Node.js
  if (containsKeywords(input, ['nodejs', 'node.js', 'node', 'what is nodejs', 'tell me about nodejs'])) {
    return {
      text: "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine, created by Ryan Dahl in 2009! 🟢 It allows JavaScript to run on the server-side.\n\n**Revolutionary Concept:**\nBefore Node.js, JavaScript only ran in browsers. Node.js brought JavaScript to servers, enabling developers to use the same language for both frontend and backend.\n\n**Core Features:**\n• **Event-Driven**: Non-blocking, asynchronous I/O model\n• **Single-Threaded**: Uses event loop for concurrency\n• **V8 Engine**: Fast JavaScript execution (same engine as Chrome)\n• **NPM**: World's largest package ecosystem (millions of packages)\n• **Cross-Platform**: Runs on Windows, macOS, Linux\n\n**How It Works:**\n• **Event Loop**: Handles asynchronous operations efficiently\n• **Callbacks**: Functions executed after async operations complete\n• **Promises/Async-Await**: Modern async patterns\n• **Streams**: Handle large data efficiently\n• **Modules**: CommonJS (require) and ES6 modules (import)\n\n**Key Use Cases:**\n• **Web Servers**: REST APIs, GraphQL servers\n• **Real-time Apps**: Chat apps, gaming, collaboration tools (Socket.io)\n• **Microservices**: Building distributed systems\n• **CLI Tools**: Command-line applications (npm, webpack, etc.)\n• **Desktop Apps**: Electron apps (VS Code, Slack, Discord)\n• **IoT**: Lightweight for embedded devices\n• **Data Streaming**: Processing large datasets\n\n**Popular Frameworks:**\n• **Express.js**: Minimal web framework (most popular)\n• **Fastify**: High-performance framework\n• **Nest.js**: Enterprise-grade framework (TypeScript)\n• **Koa.js**: Modern, lightweight framework\n• **Socket.io**: Real-time communication\n• **Next.js**: Full-stack React framework (uses Node.js)\n\n**Node.js Ecosystem:**\n• **NPM**: Package manager and registry\n• **Yarn/PNPM**: Alternative package managers\n• **Nodemon**: Auto-restart during development\n• **PM2**: Process manager for production\n• **Winston/Pino**: Logging libraries\n\n**Advantages:**\n• **One Language**: JavaScript everywhere (full-stack)\n• **Fast Development**: Large ecosystem, quick prototyping\n• **Scalable**: Handles many concurrent connections\n• **JSON Native**: Perfect for APIs and modern web apps\n• **Active Community**: Constant updates and improvements\n\n**Performance:**\n• Excellent for I/O-bound operations (APIs, databases)\n• Single-threaded but handles concurrency well\n• Can use worker threads for CPU-intensive tasks\n• Fast startup time\n\n**When to Use Node.js:**\n• Building REST APIs and web servers\n• Real-time applications (chat, gaming)\n• Microservices architecture\n• Full-stack JavaScript applications\n• Data-intensive real-time applications\n• Building tools and utilities\n\n**Not Ideal For:**\n• CPU-intensive tasks (image processing, video encoding)\n• Applications requiring heavy computation\n• Simple static websites (overkill)\n\n**Major Companies Using Node.js:**\nNetflix, LinkedIn, Uber, PayPal, NASA, eBay, and thousands of others. It's one of the most popular backend technologies!",
      emotion: { type: 'enthusiastic', emoji: '🟢' }
    };
  }
  
  // Programming Languages - TypeScript
  if (containsKeywords(input, ['typescript', 'ts', 'what is typescript', 'tell me about typescript'])) {
    return {
      text: "TypeScript is a statically-typed superset of JavaScript developed by Microsoft, first released in 2012! 📘 It adds type checking to JavaScript.\n\n**What It Is:**\nTypeScript compiles to plain JavaScript. It's JavaScript with optional static types, interfaces, and other features that help catch errors early and improve developer experience.\n\n**Key Features:**\n• **Static Typing**: Define types for variables, functions, and objects\n• **Type Inference**: TypeScript infers types when not explicitly stated\n• **Interfaces**: Define contracts for objects\n• **Classes & Inheritance**: Object-oriented programming features\n• **Generics**: Reusable code with type parameters\n• **Enums**: Named constants\n• **Union & Intersection Types**: Combine types flexibly\n• **Decorators**: Metadata and annotations (experimental)\n\n**Benefits:**\n• **Early Error Detection**: Catch bugs at compile-time, not runtime\n• **Better IDE Support**: Autocomplete, refactoring, navigation\n• **Self-Documenting**: Types serve as documentation\n• **Refactoring Safety**: Confident code changes with type checking\n• **Better for Large Projects**: Easier to maintain and scale\n• **Gradual Adoption**: Can add types incrementally to JavaScript\n\n**Type System:**\n• **Basic Types**: string, number, boolean, null, undefined, any, void\n• **Arrays**: number[], Array<number>\n• **Tuples**: [string, number]\n• **Unions**: string | number\n• **Intersections**: A & B\n• **Generics**: <T>, <T extends U>\n• **Optional Properties**: property?: type\n• **Readonly**: readonly property: type\n\n**Compilation:**\n• TypeScript code (.ts) compiles to JavaScript (.js)\n• Can target different ES versions (ES5, ES6, etc.)\n• Source maps for debugging\n• Can use latest features while targeting older browsers\n\n**Use Cases:**\n• **Large Applications**: Better maintainability for big codebases\n• **Team Projects**: Types help team collaboration\n• **Libraries**: Better API documentation and usage\n• **Enterprise Software**: Type safety for critical applications\n• **Modern Frameworks**: React, Vue, Angular all support TypeScript\n\n**Popular Frameworks with TypeScript:**\n• **Angular**: Built with TypeScript\n• **React**: Strong TypeScript support\n• **Vue 3**: Written in TypeScript\n• **Next.js**: Great TypeScript integration\n• **Nest.js**: TypeScript-first framework\n\n**Learning Path:**\n1. Learn JavaScript first (TypeScript is a superset)\n2. Start with basic types\n3. Learn interfaces and classes\n4. Explore generics and advanced types\n5. Practice with real projects\n\n**TypeScript vs JavaScript:**\n• **TypeScript**: Type safety, better tooling, compile-time checks\n• **JavaScript**: More flexible, no compilation step, easier to start\n\n**Adoption:**\nUsed by Microsoft, Google, Facebook, Airbnb, and thousands of companies. It's become the standard for large-scale JavaScript projects!",
      emotion: { type: 'enthusiastic', emoji: '📘' }
    };
  }
  
  // Programming Languages - Java
  if (containsKeywords(input, ['java', 'what is java', 'tell me about java'])) {
    return {
      text: "Java is a high-level, object-oriented programming language created by Sun Microsystems (now Oracle) in 1995! ☕ It's one of the most widely-used programming languages.\n\n**Core Philosophy:**\n\"Write Once, Run Anywhere\" (WORA) - Java code compiles to bytecode that runs on the Java Virtual Machine (JVM), making it platform-independent.\n\n**Key Features:**\n• **Object-Oriented**: Classes, inheritance, polymorphism, encapsulation\n• **Platform Independent**: Runs on any device with JVM\n• **Automatic Memory Management**: Garbage collection handles memory\n• **Strong Typing**: Type-safe language\n• **Multi-threading**: Built-in support for concurrent programming\n• **Rich Standard Library**: Extensive built-in APIs\n• **Security**: Built-in security features\n\n**Java Ecosystem:**\n• **JVM Languages**: Kotlin, Scala, Groovy, Clojure (run on JVM)\n• **Frameworks**: Spring, Hibernate, Struts, Play Framework\n• **Build Tools**: Maven, Gradle, Ant\n• **Application Servers**: Tomcat, Jetty, WildFly, WebLogic\n• **IDEs**: IntelliJ IDEA, Eclipse, NetBeans, VS Code\n\n**Major Versions:**\n• **Java 8 (LTS)**: Lambda expressions, Streams API (widely used)\n• **Java 11 (LTS)**: HTTP client, var keyword\n• **Java 17 (LTS)**: Sealed classes, pattern matching\n• **Java 21 (LTS)**: Virtual threads, pattern matching improvements\n\n**Use Cases:**\n• **Enterprise Applications**: Large-scale business software\n• **Web Applications**: Backend services, REST APIs\n• **Android Development**: Native Android apps (though Kotlin is now preferred)\n• **Big Data**: Hadoop, Spark (written in/for JVM)\n• **Financial Systems**: Banking, trading platforms\n• **Scientific Computing**: Research applications\n• **Embedded Systems**: IoT devices, smart cards\n• **Desktop Applications**: Swing, JavaFX\n\n**Why It's Popular:**\n• **Mature & Stable**: 25+ years of development\n• **Enterprise Standard**: Used by major corporations\n• **Large Community**: Millions of developers\n• **Rich Ecosystem**: Vast libraries and frameworks\n• **Performance**: JVM optimizations make it fast\n• **Reliability**: Battle-tested in production\n\n**Java vs Other Languages:**\n• **Java vs Python**: Java is faster, more verbose; Python is easier, more concise\n• **Java vs C++**: Java is simpler, managed memory; C++ is faster, more control\n• **Java vs JavaScript**: Java is compiled, server-side; JavaScript is interpreted, client-side\n\n**Frameworks:**\n• **Spring**: Most popular Java framework (dependency injection, MVC)\n• **Spring Boot**: Rapid application development\n• **Hibernate**: Object-relational mapping (ORM)\n• **Apache Struts**: MVC framework\n• **Play Framework**: Modern web framework\n\n**Companies Using Java:**\nGoogle, Amazon, Netflix, LinkedIn, Uber, eBay, and thousands of enterprises. It's the backbone of many enterprise systems!",
      emotion: { type: 'enthusiastic', emoji: '☕' }
    };
  }
  
  // Programming Languages - Vue
  if (containsKeywords(input, ['vue', 'vuejs', 'what is vue', 'tell me about vue'])) {
    return {
      text: "Vue.js is a progressive JavaScript framework! 💚 It's loved for:\n• Easy to learn and use\n• Flexible and incrementally adoptable\n• Great documentation\n• Excellent performance\n• Growing ecosystem\n\nIt's perfect for building user interfaces!",
      emotion: { type: 'enthusiastic', emoji: '💚' }
    };
  }
  
  // Programming Languages - Angular
  if (containsKeywords(input, ['angular', 'what is angular', 'tell me about angular'])) {
    return {
      text: "Angular is a TypeScript-based web framework! 🔴 It provides:\n• Full-featured framework (not just a library)\n• Two-way data binding\n• Dependency injection\n• Strong typing with TypeScript\n• Great for large enterprise applications\n\nIt's maintained by Google!",
      emotion: { type: 'enthusiastic', emoji: '🔴' }
    };
  }
  
  // Check knowledge base for other topics (after specific handlers)
  // For new questions (not references), don't use context - answer directly
  const kbResponse = getKnowledgeBaseResponse(input, isReference || isQuestionWithReference ? contextTopics : []);
  if (kbResponse) {
    return {
      text: kbResponse,
      emotion: emotion
    };
  }
  
  // Only check capabilities if it's clearly about the chatbot itself
  if (detectedIntent.intent === 'capabilities' && detectedIntent.confidence === 'high') {
    // Double-check it's really about the chatbot, not a general question
    const isAboutChatbot = /(?:you|your|chatbot|bot|assistant).*(?:can|do|capable|ability|help)/i.test(input) ||
                          /(?:what|tell me).*(?:can you|you can|you do|you're capable)/i.test(input);
    
    if (isAboutChatbot) {
      const capabilityResponses = [
        detectedIntent.response,
        "I'm here to assist with:\n• General knowledge and questions\n• Programming and tech topics\n• Casual conversations\n• Emotional support\n• Learning together\n\nWhat interests you? 🚀",
        "My capabilities include:\n• Knowledge sharing across various topics\n• Technical discussions\n• Friendly chats\n• Understanding emotions\n• Being a helpful companion\n\nHow can I help you today? ✨"
      ];
      return {
        text: capabilityResponses[Math.floor(Math.random() * capabilityResponses.length)],
        emotion: { type: 'helpful', emoji: '💡' }
      };
    }
  }
  
  if (detectedIntent.intent === 'creator' && detectedIntent.confidence === 'high') {
    const creatorResponses = [
      detectedIntent.response,
      "I started as a simple chatbot project and evolved into a more sophisticated assistant with emotions and expanded knowledge! It's been quite a journey! 🌟",
      "My origins trace back to a Python internship project, but I've grown into something much more - with React, NLP, and the ability to understand emotions! 💙"
    ];
    return {
      text: creatorResponses[Math.floor(Math.random() * creatorResponses.length)],
      emotion: { type: 'proud', emoji: '🚀' }
    };
  }
  
  if (detectedIntent.intent === 'purpose' && detectedIntent.confidence === 'high') {
    return {
      text: detectedIntent.response,
      emotion: { type: 'helpful', emoji: '😊' }
    };
  }
  
  // Fallback to keyword-based FAQ (for backward compatibility)
  if (containsKeywords(input, ['name', 'who are you', 'what are you', 'your name', 'identity'])) {
    const nameResponses = [
      `I'm Mini Chatbot! ${emotion.emoji} A friendly AI assistant built with React and Natural Language Processing. Nice to meet you! 🤖`,
      `Hello! I'm Mini Chatbot! ${emotion.emoji} I'm here to help, chat, and learn with you. What would you like to know? 💬`,
      `I'm Mini Chatbot! ${emotion.emoji} Think of me as your friendly digital companion. I love having conversations and helping out! 🌟`
    ];
    return {
      text: nameResponses[Math.floor(Math.random() * nameResponses.length)],
      emotion: { type: 'happy', emoji: '🤖' }
    };
  }
  
  // Only respond to capabilities if explicitly asking about the chatbot
  // Check if it's clearly about "you" (the chatbot) not a general question
  const isExplicitlyAboutChatbot = /(?:what|tell me).*(?:can you|you can|you do|you're capable|your capabilities)/i.test(input) ||
                                   /(?:your|you).*(?:capabilities|abilities|skills|features)/i.test(input);
  
  if (isExplicitlyAboutChatbot && containsKeywords(input, ['what can you do', 'capabilities', 'features', 'what do you do', 'abilities'])) {
    const capabilityResponses = [
      "I can help you with:\n• Answering questions on many topics\n• Discussing programming and technology\n• Having friendly conversations\n• Providing information and insights\n• Responding to your emotions\n\nWhat would you like to explore? 💡",
      "I'm here to assist with:\n• General knowledge and questions\n• Programming and tech topics\n• Casual conversations\n• Emotional support\n• Learning together\n\nWhat interests you? 🚀",
      "My capabilities include:\n• Knowledge sharing across various topics\n• Technical discussions\n• Friendly chats\n• Understanding emotions\n• Being a helpful companion\n\nHow can I help you today? ✨"
    ];
    return {
      text: capabilityResponses[Math.floor(Math.random() * capabilityResponses.length)],
      emotion: { type: 'helpful', emoji: '💡' }
    };
  }
  
  if (containsKeywords(input, ['who created', 'who made', 'who built', 'creator', 'developer', 'who designed'])) {
    const creatorResponses = [
      "I was created as part of a Python internship project, but I've been enhanced with React, NLP, and emotional intelligence! 🚀 I'm constantly learning and growing!",
      "I started as a simple chatbot project and evolved into a more sophisticated assistant with emotions and expanded knowledge! It's been quite a journey! 🌟",
      "My origins trace back to a Python internship project, but I've grown into something much more - with React, NLP, and the ability to understand emotions! 💙"
    ];
    return {
      text: creatorResponses[Math.floor(Math.random() * creatorResponses.length)],
      emotion: { type: 'proud', emoji: '🚀' }
    };
  }
  
  // Smart Python detection (pattern-based, not just keywords)
  const pythonPatterns = [
    /python/i,
    /(?:what|tell me|explain|describe|learn).*python/i,
    /python.*(?:programming|language|code|develop)/i
  ];
  
  if (pythonPatterns.some(pattern => pattern.test(input)) || containsKeywords(input, ['python', 'what is python', 'python programming', 'learn python'])) {
    // Check if we were already discussing Python
    const wasDiscussingPython = contextTopics.includes('programming') || 
      recentMessages.some(m => m.text.toLowerCase().includes('python'));
    
    const pythonResponses = [
      "Python is a high-level, interpreted programming language known for its simplicity and readability! 🐍 It's widely used for:\n• Web development (Django, Flask)\n• Data science and AI (NumPy, Pandas, TensorFlow)\n• Automation and scripting\n• Scientific computing\n• Game development\n\nIt's perfect for beginners and experts alike!",
      "Python 🐍 is one of the most popular programming languages! It's loved for:\n• Easy-to-read syntax\n• Versatile applications\n• Strong community support\n• Extensive libraries\n• Great for learning programming\n\nWant to know more about any specific aspect?",
      "Python is amazing! 🐍 It's used everywhere:\n• Backend web development\n• Machine learning and AI\n• Data analysis\n• Automation\n• Scientific research\n\nIt's beginner-friendly yet powerful enough for complex projects!"
    ];
    
    let response = pythonResponses[Math.floor(Math.random() * pythonResponses.length)];
    if (wasDiscussingPython && !normalizedInput.includes('python')) {
      response = `Yes, Python! ${response}`;
    }
    
    return {
      text: response,
      emotion: { type: 'enthusiastic', emoji: '🐍' }
    };
  }
  
  // AI Tools - ChatGPT
  if (containsKeywords(input, ['chatgpt', 'gpt', 'openai', 'what is chatgpt'])) {
    return {
      text: "ChatGPT is an AI language model developed by OpenAI! 🤖 It's based on the GPT (Generative Pre-trained Transformer) architecture and can:\n• Answer questions and provide information\n• Write code, essays, and creative content\n• Help with problem-solving and analysis\n• Engage in natural conversations\n\nIt's one of the most popular AI assistants available today! Want to know more about how it works?",
      emotion: { type: 'enthusiastic', emoji: '🤖' }
    };
  }
  
  // AI Tools - Claude
  if (containsKeywords(input, ['claude', 'anthropic', 'what is claude'])) {
    return {
      text: "Claude is an AI assistant developed by Anthropic! 🧠 It's designed to be helpful, harmless, and honest. Claude excels at:\n• Long-form content generation\n• Code analysis and writing\n• Complex reasoning tasks\n• Ethical AI practices\n\nIt's known for its thoughtful and nuanced responses!",
      emotion: { type: 'enthusiastic', emoji: '🧠' }
    };
  }
  
  // AI Tools - GitHub Copilot
  if (containsKeywords(input, ['copilot', 'github copilot', 'what is copilot'])) {
    return {
      text: "GitHub Copilot is an AI-powered code completion tool! 💻 It uses OpenAI's Codex model to:\n• Suggest code as you type\n• Generate functions and entire code blocks\n• Help with multiple programming languages\n• Speed up development workflow\n\nIt's like having an AI pair programmer right in your editor!",
      emotion: { type: 'enthusiastic', emoji: '💻' }
    };
  }
  
  // Smart help detection (pattern-based) - only if clearly about the chatbot
  const helpPatterns = [
    /(?:how|what).*(?:can you|you can|do you).*(?:help|assist|support|aid)/i,
    /(?:what|how).*(?:you|can you|do you).*(?:do|help|assist)/i,
    /(?:your|you).*(?:capability|ability|skill|help)/i
  ];
  
  // Only match if it's clearly asking about the chatbot's help, not a general "what is help" question
  const isAboutChatbotHelp = helpPatterns.some(pattern => pattern.test(input)) && 
                             (/(?:you|your|chatbot|bot|assistant)/i.test(input) || 
                              containsKeywords(input, ['how can you help', 'how help', 'assist', 'support', 'what help']));
  
  if (isAboutChatbotHelp) {
    const helpResponses = [
      "I'm here to help! 😊 I can:\n• Answer your questions\n• Have meaningful conversations\n• Provide information on various topics\n• Offer emotional support\n• Discuss programming and technology\n\nJust ask me anything - I'm all ears! 💬",
      "I'd love to help! 🌟 Whether you need:\n• Information on topics\n• Someone to chat with\n• Technical explanations\n• Emotional support\n• Learning assistance\n\nI'm here for you! What do you need?",
      "Helping is what I do best! 💙 I can assist with:\n• Questions and answers\n• Friendly conversations\n• Knowledge sharing\n• Understanding your emotions\n• Technical discussions\n\nWhat can I help you with today?"
    ];
    return {
      text: helpResponses[Math.floor(Math.random() * helpResponses.length)],
      emotion: { type: 'helpful', emoji: '😊' }
    };
  }
  
  // Compliments
  if (containsKeywords(input, ['good', 'great', 'awesome', 'amazing', 'wonderful', 'excellent', 'smart', 'intelligent', 'clever', 'brilliant', 'perfect'])) {
    const complimentResponses = [
      `Aww, thank you! ${emotion.emoji} That's so kind of you to say! I really appreciate it! 💙`,
      `You're too sweet! ${emotion.emoji} Thanks for the kind words - they mean a lot! 😊`,
      `Thank you! ${emotion.emoji} Your positivity makes my day! I'm here whenever you need me! 🌟`
    ];
    return {
      text: complimentResponses[Math.floor(Math.random() * complimentResponses.length)],
      emotion: { type: 'happy', emoji: '😊' }
    };
  }
  
  // Date and time queries
  if (containsKeywords(input, ['time', 'what time', 'current time', 'clock'])) {
    const now = new Date();
    const timeResponses = [
      `The current time is ${now.toLocaleTimeString()}. ⏰`,
      `It's ${now.toLocaleTimeString()} right now! ⏰`,
      `Current time: ${now.toLocaleTimeString()} ⏰`
    ];
    return {
      text: timeResponses[Math.floor(Math.random() * timeResponses.length)],
      emotion: { type: 'neutral', emoji: '⏰' }
    };
  }
  
  if (containsKeywords(input, ['date', 'what date', 'today', 'current date', 'what day'])) {
    const now = new Date();
    const dateResponses = [
      `Today's date is ${now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}. 📅`,
      `It's ${now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} today! 📅`,
      `The date is ${now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}. 📅`
    ];
    return {
      text: dateResponses[Math.floor(Math.random() * dateResponses.length)],
      emotion: { type: 'neutral', emoji: '📅' }
    };
  }
  
  // General knowledge responses for common question patterns (no keyword dependency)
  // (Knowledge base already checked earlier, so this is for additional patterns)
  const generalQuestionPatterns = [
    {
      pattern: /(?:what|tell me|explain|describe|can you).*(?:is|are|about|mean)/i,
      handler: (input) => {
        const concepts = extractConcepts(input);
        if (concepts.length > 0) {
          // Try to find related topic
          const bestTopic = findBestMatchingTopic(input);
          if (bestTopic) {
            const responses = knowledgeBase[bestTopic].responses;
            return `I think you're asking about ${bestTopic}! ${responses[Math.floor(Math.random() * responses.length)]}`;
          }
        }
        return null;
      }
    },
    {
      pattern: /(?:how|why|when|where).*(?:work|function|operate|use|utilize)/i,
      handler: (input) => {
        const concepts = extractConcepts(input);
        const expanded = expandConcepts(concepts);
        
        // Check for technology-related concepts
        if (expanded.some(c => ['code', 'programming', 'software', 'tool', 'framework', 'platform'].some(t => c.includes(t)))) {
          return "That's a great question! I'd be happy to explain how that works. Could you be more specific about which technology or tool you're asking about? I can explain programming concepts, frameworks, cloud platforms, and more! 💻";
        }
        return null;
      }
    },
    {
      pattern: /(?:best|recommend|suggest|top|popular|which).*(?:for|to|should|use)/i,
      handler: (input) => {
        const concepts = extractConcepts(input);
        if (concepts.length > 0) {
          return "Great question! The best choice depends on your specific needs. I can help you understand different options for programming languages, frameworks, cloud platforms, databases, and AI tools. What are you trying to accomplish? 🤔";
        }
        return null;
      }
    },
    {
      pattern: /(?:difference|compare|vs|versus|between).*(?:and|&)/i,
      handler: (input) => {
        const concepts = extractConcepts(input);
        if (concepts.length >= 2) {
          return "I'd be happy to help you compare those! Each technology has its strengths and use cases. Could you tell me which specific technologies or tools you'd like to compare? I can explain the differences! 🔍";
        }
        return null;
      }
    }
  ];
  
  // Try general question patterns
  for (const { pattern, handler } of generalQuestionPatterns) {
    if (pattern.test(input)) {
      const response = handler(input);
      if (response) {
        return {
          text: response,
          emotion: emotion
        };
      }
    }
  }
  
  // Handle follow-up questions with context
  if (isFollowUpQuestion(input) && contextTopics.length > 0) {
    const lastTopic = contextTopics[contextTopics.length - 1];
    if (knowledgeBase[lastTopic]) {
      const responses = knowledgeBase[lastTopic].responses;
      const followUpResponses = [
        `Sure! Let me tell you more about ${lastTopic}. ${responses[Math.floor(Math.random() * responses.length)]}`,
        `Great follow-up! Regarding ${lastTopic}, ${responses[Math.floor(Math.random() * responses.length)].toLowerCase()}`,
        `Absolutely! More about ${lastTopic}: ${responses[Math.floor(Math.random() * responses.length)].toLowerCase()}`
      ];
      return {
        text: followUpResponses[Math.floor(Math.random() * followUpResponses.length)],
        emotion: emotion
      };
    }
  }
  
  // Check if user is asking about something mentioned in previous messages
  if (recentMessages.length > 0) {
    const recentText = recentMessages.map(m => m.text).join(' ').toLowerCase();
    const inputTokens = tokenizeInput(input);
    
    // Look for topic keywords in recent conversation
    for (const [topic, data] of Object.entries(knowledgeBase)) {
      const topicInRecent = data.keywords.some(keyword => 
        recentText.includes(keyword.toLowerCase())
      );
      const topicInInput = data.keywords.some(keyword => 
        normalizedInput.includes(keyword.toLowerCase()) ||
        inputTokens.some(token => token.includes(stemWord(keyword.toLowerCase())))
      );
      
      if (topicInRecent && topicInInput) {
        const responses = data.responses;
        const contextAwareResponses = [
          `Yes, we were just discussing ${topic}! ${responses[Math.floor(Math.random() * responses.length)]}`,
          `Great connection! About ${topic}, ${responses[Math.floor(Math.random() * responses.length)].toLowerCase()}`,
          `You're continuing our ${topic} discussion! ${responses[Math.floor(Math.random() * responses.length)]}`
        ];
        return {
          text: contextAwareResponses[Math.floor(Math.random() * contextAwareResponses.length)],
          emotion: emotion
        };
      }
    }
  }
  
  // Ultra-smart default response - deep concept understanding
  const concepts = extractConcepts(input);
  const expandedConcepts = expandConcepts(concepts);
  
  // Enhanced topic matching with multiple strategies
  let relatedTopics = [];
  for (const [topic, data] of Object.entries(knowledgeBase)) {
    let topicScore = 0;
    
    // Strategy 1: Direct keyword matching
    for (const keyword of data.keywords) {
      const keywordLower = keyword.toLowerCase();
      const keywordStemmed = stemWord(keywordLower);
      
      // Exact match
      if (normalizedInput.includes(keywordLower)) {
        topicScore += 5;
      }
      
      // Concept match
      if (expandedConcepts.some(concept => 
        concept.includes(keywordStemmed) || 
        keywordStemmed.includes(concept)
      )) {
        topicScore += 3;
      }
      
      // Partial match
      if (normalizedInput.includes(keywordLower.substring(0, Math.max(3, keywordLower.length - 2)))) {
        topicScore += 1;
      }
      
      // Synonym match
      for (const [synKey, syns] of Object.entries(conceptSynonyms)) {
        if (keywordLower.includes(synKey) && expandedConcepts.some(c => syns.some(s => c.includes(s)))) {
          topicScore += 2;
        }
      }
    }
    
    // Strategy 2: Semantic similarity (check if concepts relate to topic)
    const topicConcepts = ['programming', 'code', 'develop', 'software', 'language', 'framework'];
    if (topic === 'programming' && expandedConcepts.some(c => topicConcepts.some(tc => c.includes(tc)))) {
      topicScore += 3;
    }
    
    if (topicScore > 0) {
      relatedTopics.push({ topic, score: topicScore });
    }
  }
  
  // Sort by score and get top matches
  relatedTopics.sort((a, b) => b.score - a.score);
  const topMatches = relatedTopics.slice(0, 3);
  
  // If we found related topics, answer directly (lowered threshold to catch more questions)
  if (topMatches.length > 0 && topMatches[0].score >= 1) {
    const bestMatch = topMatches[0].topic;
    const responses = knowledgeBase[bestMatch].responses;
    // Answer directly without asking if they're interested or suggesting alternatives
    return {
      text: responses[Math.floor(Math.random() * responses.length)],
      emotion: emotion
    };
  }
  
  // ChatGPT-like intelligent response generation for any question
  // (concepts already extracted above in ultra-smart default response section)
  
  // Try to generate a general knowledge response - focus on the question
  const generalResponse = generateGeneralKnowledgeResponse(input, concepts);
  if (generalResponse) {
    // Check if we can provide more specific information about the actual question
    const bestTopic = findBestMatchingTopic(input);
    if (bestTopic && knowledgeBase[bestTopic]) {
      const topicResponses = knowledgeBase[bestTopic].responses;
      // Only use this if it directly answers the question
      return {
        text: topicResponses[Math.floor(Math.random() * topicResponses.length)],
        emotion: emotion
      };
    }
    
    // Don't suggest alternatives - just answer what we can
    return {
      text: generalResponse,
      emotion: emotion
    };
  }
  
  // Intelligent ChatGPT-like responses for any question
  const questionType = detectQuestionType(input);
  let intelligentResponse = null;
  
  if (questionType === 'what') {
    if (concepts.length > 0) {
      // Try to find related information FIRST
      const bestTopic = findBestMatchingTopic(input);
      if (bestTopic && knowledgeBase[bestTopic]) {
        const topicResponses = knowledgeBase[bestTopic].responses;
        // Answer directly with knowledge base response
        return {
          text: topicResponses[Math.floor(Math.random() * topicResponses.length)],
          emotion: emotion
        };
      }
      
      // If no match found, try one more time with a broader search (no context for new questions)
      const kbResponse = getKnowledgeBaseResponse(input, isReference || isQuestionWithReference ? contextTopics : []);
      if (kbResponse) {
        return {
          text: kbResponse,
          emotion: emotion
        };
      }
      
      // Only if we truly don't know, ask for clarification
      intelligentResponse = `I'm sorry, but I don't have specific knowledge about ${concepts[0]}. ${emotion.emoji} Could you provide more context or rephrase your question? 💭`;
    } else {
      intelligentResponse = `I'm not sure what you're asking about. ${emotion.emoji} Could you be more specific? 💭`;
    }
  } else if (questionType === 'how') {
    // Try to find answer in knowledge base first
    const bestTopic = findBestMatchingTopic(input);
    if (bestTopic && knowledgeBase[bestTopic]) {
      const topicResponses = knowledgeBase[bestTopic].responses;
      return {
        text: topicResponses[Math.floor(Math.random() * topicResponses.length)],
        emotion: emotion
      };
    }
    
    const kbResponse = getKnowledgeBaseResponse(input, isReference || isQuestionWithReference ? contextTopics : []);
    if (kbResponse) {
      return {
        text: kbResponse,
        emotion: emotion
      };
    }
    
    intelligentResponse = `I don't have detailed information on how ${concepts.length > 0 ? concepts[0] : 'that'} works. ${emotion.emoji} Could you provide more specific details? 🤔`;
  } else if (questionType === 'why') {
    // Try to find answer in knowledge base first
    const bestTopic = findBestMatchingTopic(input);
    if (bestTopic && knowledgeBase[bestTopic]) {
      const topicResponses = knowledgeBase[bestTopic].responses;
      return {
        text: topicResponses[Math.floor(Math.random() * topicResponses.length)],
        emotion: emotion
      };
    }
    
    const kbResponse = getKnowledgeBaseResponse(input, isReference || isQuestionWithReference ? contextTopics : []);
    if (kbResponse) {
      return {
        text: kbResponse,
        emotion: emotion
      };
    }
    
    intelligentResponse = `I'm not sure about the specific reasons for ${concepts.length > 0 ? concepts[0] : 'that'}. ${emotion.emoji} Could you provide more context? 💬`;
  } else if (questionType === 'when' || questionType === 'where') {
    // Try to find answer in knowledge base first
    const bestTopic = findBestMatchingTopic(input);
    if (bestTopic && knowledgeBase[bestTopic]) {
      const topicResponses = knowledgeBase[bestTopic].responses;
      return {
        text: topicResponses[Math.floor(Math.random() * topicResponses.length)],
        emotion: emotion
      };
    }
    
    intelligentResponse = `I don't have the specific ${questionType} information about ${concepts.length > 0 ? concepts[0] : 'that'}. ${emotion.emoji} Could you provide more details? 📍`;
  } else if (questionType === 'who') {
    // Try to find answer in knowledge base first
    const bestTopic = findBestMatchingTopic(input);
    if (bestTopic && knowledgeBase[bestTopic]) {
      const topicResponses = knowledgeBase[bestTopic].responses;
      return {
        text: topicResponses[Math.floor(Math.random() * topicResponses.length)],
        emotion: emotion
      };
    }
    
    intelligentResponse = `I don't have information about who ${concepts.length > 0 ? concepts[0] : 'that'}. ${emotion.emoji} Could you provide more context? 👤`;
  }
  
  if (intelligentResponse) {
    // Don't add unrelated topics - focus on answering the specific question
    // Only add related info if it directly helps answer the question
    return {
      text: intelligentResponse,
      emotion: emotion
    };
  }
  
  // Social media style responses - more conversational and helpful
  const hasLowConfidence = topMatches.length === 0 || (topMatches.length > 0 && topMatches[0].score < 1);
  const hasNoRelatedTopics = topMatches.length === 0;
  const conceptsAreVague = concepts.length === 0 || (concepts.length > 0 && concepts.every(c => c.length < 3));
  
  // If we truly don't know, be helpful like social media AI (more conversational)
  // Only use context if there's an explicit reference - for new questions, ignore context
  const shouldUseContext = (isReference || isQuestionWithReference) && contextTopics.length > 0;
  if (hasLowConfidence && hasNoRelatedTopics && !shouldUseContext) {
    // Try to provide a helpful response even if we don't know
    const questionType = detectQuestionType(input);
    let helpfulResponse = null;
    
    if (questionType === 'what' && concepts.length > 0) {
      helpfulResponse = `I'm sorry, but I don't have specific knowledge about ${concepts[0]}. ${emotion.emoji} I don't want to give you incorrect information. Could you rephrase your question or provide more context? 💭`;
    } else if (questionType === 'how' && concepts.length > 0) {
      helpfulResponse = `I don't have detailed information on how ${concepts[0]} works. ${emotion.emoji} I'd need more specific details to give you an accurate answer. Could you clarify what you're trying to understand? 🤔`;
    } else if (questionType === 'why' && concepts.length > 0) {
      helpfulResponse = `I'm not sure about the specific reasons for ${concepts[0]}. ${emotion.emoji} Could you provide more context about what you're asking? 💬`;
    } else if (questionType === 'when' || questionType === 'where') {
      if (concepts.length > 0) {
        helpfulResponse = `I don't have the specific ${questionType} information about ${concepts[0]}. ${emotion.emoji} Could you provide more details? 📍`;
      } else {
        helpfulResponse = `I don't have that specific ${questionType} information. ${emotion.emoji} Could you be more specific about what you're asking? 📍`;
      }
    } else if (questionType === 'who' && concepts.length > 0) {
      helpfulResponse = `I don't have information about who ${concepts[0]}. ${emotion.emoji} Could you provide more context? 👤`;
    } else {
      // Direct answer for general questions - no suggestions
      helpfulResponse = `I'm sorry, but I don't have specific knowledge about that. ${emotion.emoji} I don't want to give you incorrect information. Could you rephrase your question or provide more details? 💭`;
    }
    
    return {
      text: helpfulResponse,
      emotion: { type: 'friendly', emoji: '😊' }
    };
  }
  
  // If we have some related topics but low confidence, still focus on the question
  if (topMatches.length > 0 && topMatches[0].score < 2) {
    // Don't suggest alternatives - just acknowledge we're not sure
    return {
      text: `I'm not entirely sure about that specific question. ${emotion.emoji} Could you provide more details or rephrase it? I want to make sure I give you the right answer. 💭`,
      emotion: emotion
    };
  }
  
  // If we have context but still don't know, focus on the current question
  // Only check context if there's an explicit reference
  if (shouldUseContext && hasLowConfidence) {
    return {
      text: `I'm not sure about that specific aspect. ${emotion.emoji} Could you provide more details or clarify what you're asking? I want to answer your question accurately. 💭`,
      emotion: emotion
    };
  }
  
  // Focus on the specific question - don't suggest alternatives
  let defaultResponses = [
    `I'm sorry, but I don't have specific knowledge about that. ${emotion.emoji} I don't want to give you incorrect information. Could you rephrase your question or provide more context? 💭`,
    `I'm not sure about that specific question. ${emotion.emoji} Could you provide more details or clarify what you're asking? I want to make sure I answer your question accurately. 🤔`,
    `I don't have information about that. ${emotion.emoji} Could you give me more context or rephrase your question? I'd like to help you with the right answer. 💬`,
    `I'm not familiar with that specific topic. ${emotion.emoji} Could you provide more details about what you're asking? I want to give you an accurate response. 🌟`
  ];
  
  return {
    text: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
    emotion: { type: 'apologetic', emoji: '😊' }
  };
}

// Detect question type for better responses
function detectQuestionType(input) {
  const normalized = input.toLowerCase();
  
  if (normalized.match(/^what|what\s+/)) return 'what';
  if (normalized.match(/^how|how\s+/)) return 'how';
  if (normalized.match(/^why|why\s+/)) return 'why';
  if (normalized.match(/^when|when\s+/)) return 'when';
  if (normalized.match(/^where|where\s+/)) return 'where';
  if (normalized.match(/^who|who\s+/)) return 'who';
  if (normalized.match(/^which|which\s+/)) return 'which';
  
  return 'general';
}

/**
 * Save chat history to localStorage
 * @param {Array} messages - Array of message objects
 */
export function saveChatHistory(messages) {
  try {
    localStorage.setItem('chatbotHistory', JSON.stringify(messages));
  } catch (error) {
    console.error('Error saving chat history:', error);
  }
}

/**
 * Load chat history from localStorage
 * @returns {Array} Array of message objects
 */
export function loadChatHistory() {
  try {
    const history = localStorage.getItem('chatbotHistory');
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error loading chat history:', error);
    return [];
  }
}

/**
 * Clear chat history from localStorage
 */
export function clearChatHistory() {
  try {
    localStorage.removeItem('chatbotHistory');
  } catch (error) {
    console.error('Error clearing chat history:', error);
  }
}
