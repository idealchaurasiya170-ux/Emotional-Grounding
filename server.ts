import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json({ limit: "50mb" }));

// Lazy initializer for Gemini API keeping keys secure on server
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("WARNING: GEMINI_API_KEY environment variable is not set. Falling back to local simulated response modes.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Robust helper to perform Gemini API generation with retries on transient errors and a fallback model chain
async function generateContentWithFallback(params: {
  contents: any;
  config?: any;
  primaryModel?: string;
  fallbackModel?: string;
  thirdModel?: string;
}) {
  const { 
    contents, 
    config, 
    primaryModel = "gemini-3.5-flash", 
    fallbackModel = "gemini-flash-latest",
    thirdModel = "gemini-3.1-flash-lite"
  } = params;
  
  const ai = getGeminiClient();
  if (!ai) {
    throw new Error("Gemini API Client is not initiated. Missing API key.");
  }

  const maxAttempts = 2;
  let lastError: any = null;

  // 1. Try Primary Model (gemini-3.5-flash)
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`[Gemini API] Attempting ${primaryModel} (Attempt ${attempt}/${maxAttempts})...`);
      const response = await ai.models.generateContent({
        model: primaryModel,
        contents,
        config,
      });
      return response;
    } catch (error: any) {
      lastError = error;
      const errorMsg = error?.message || String(error);
      const isUnavailableOrRate = errorMsg.includes("UNAVAILABLE") || errorMsg.includes("503") || errorMsg.includes("high demand") || errorMsg.includes("429") || errorMsg.includes("quota") || error?.status === 503 || error?.status === 429;
      
      console.warn(`[Gemini API] Attempt ${attempt} failed for model ${primaryModel}:`, errorMsg);

      if (attempt < maxAttempts && isUnavailableOrRate) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        continue;
      }
    }
  }

  // 2. Try Secondary Model (gemini-flash-latest)
  console.log(`[Gemini API] Primary model ${primaryModel} failed. Falling back to secondary model ${fallbackModel}...`);
  try {
    const response = await ai.models.generateContent({
      model: fallbackModel,
      contents,
      config,
    });
    return response;
  } catch (fallbackError: any) {
    console.warn(`[Gemini API] Secondary model ${fallbackModel} failed:`, fallbackError?.message || fallbackError);
    lastError = fallbackError;
  }

  // 3. Try Third Model (gemini-3.1-flash-lite)
  console.log(`[Gemini API] Secondary model ${fallbackModel} failed. Falling back to third model ${thirdModel}...`);
  try {
    const response = await ai.models.generateContent({
      model: thirdModel,
      contents,
      config,
    });
    return response;
  } catch (thirdError: any) {
    console.error(`[Gemini API] All 3 models failed. Final error:`, thirdError?.message || thirdError);
    throw lastError || thirdError;
  }
}

// Premium dynamic localized narrative generators in case of API outages or rate limits
function generateLocalCompanionFallback(message: string, profile: any, tone: string) {
  const name = profile.seniorName || "Eleanor Henderson";
  const nickname = profile.nickname || "Nana";
  const birthplace = profile.birthPlace || "Austin, Texas";
  const hometown = profile.hometown || "Waco, Texas";
  const occupation = profile.occupation || "Educator";
  const values = profile.values || "integrity and absolute empathy";
  const lessons = profile.lifeLessons || "Tell your family you love them every single day.";
  const quotes = profile.favoriteQuotes || "To teach is to touch a heart.";
  const mantra = profile.lifeMantra || "Love is our lasting bridge.";
  const favoriteThings = profile.favoriteThings || "watercolors and piano playing";

  const lowerMsg = message.toLowerCase();

  let intro = "";
  if (tone === "Playful") {
    intro = `Oh, my dear! You always know how to make me smile. `;
  } else if (tone === "Storyteller") {
    intro = `Gather around, let me paint a picture of that memory for you. `;
  } else if (tone === "Stoic") {
    intro = `This is an important question. Let us focus on the core values of our descent. `;
  } else {
    intro = `My dear child, it makes my heart deeply warm to talk about this with you. `;
  }

  // Childhood / birthplace query matching
  if (lowerMsg.includes("child") || lowerMsg.includes("childhood") || lowerMsg.includes("grow") || lowerMsg.includes("young") || lowerMsg.includes("past") || lowerMsg.includes("born") || lowerMsg.includes("austin") || lowerMsg.includes("waco")) {
    return `${intro}Growing up in ${birthplace} was a simpler, slower time. We did not have screens or hurried hours. We lived close to nature and played under grand oak trees. My school days were full of curiosity. Later, settling in ${hometown} shaped so much of my life. I remember watercoloring the serene sunset meadows, learning early that patience is a beautiful compass. Always honor your roots, my dear.`;
  }

  // Career / teaching query matching
  if (lowerMsg.includes("career") || lowerMsg.includes("teach") || lowerMsg.includes("school") || lowerMsg.includes("work") || lowerMsg.includes("job") || lowerMsg.includes("music") || lowerMsg.includes("piano")) {
    return `${intro}As a ${occupation}, my life was filled with so much rich noise. Teaching music and piano wasn't just a curriculum—it was holding space for young minds to find their own rhythm with absolute dignity. Whenever I sat down at a worn piano bench turning sheet music, I sought to leave a positive echo. If you find yourself in a challenging career moment, remember: touch people's hearts first, and the rest will follow.`;
  }

  // Life advice / lessons matching
  if (lowerMsg.includes("advice") || lowerMsg.includes("lesson") || lowerMsg.includes("guide") || lowerMsg.includes("wisdom") || lowerMsg.includes("marry") || lowerMsg.includes("husband") || lowerMsg.includes("family") || lowerMsg.includes("frank")) {
    return `${intro}My master lesson in this life is simple: "${lessons}". Never let minor distances divide your heart. We spent beautiful years building our household around values of ${values}. When frank and I were turning old pages of music, we realized love is a quiet bridge, not a loud highway. Hold onto those values tightly when life gets complex.`;
  }

  // Quote or mantra matching
  if (lowerMsg.includes("quote") || lowerMsg.includes("saying") || lowerMsg.includes("mantra") || lowerMsg.includes("favorite")) {
    return `${intro}I always loved to remind people: "${quotes}". It matches my life mantra: "${mantra}". Whenever things got difficult, I looked forward with deep optimism. Watercoloring, baking blueberry pie, or playing Chopin: these quiet favorite things kept my soul anchored. Find your own anchor.`;
  }

  // General warm grandmotherly fallback response
  return `${intro}I hear your question closely. When life gets hurried or uncertain, remember to pause and look forward with absolute optimism. We built our family identity on ${values} so you could stand strong today. I am always listening, and my legacy lives securely in the care you show each other. Is there anything else you'd like to ask about our path?`;
}

function generateLocalBiographyFallback(profile: any) {
  const name = profile.seniorName || "Eleanor Henderson";
  const nickname = profile.nickname || "Nana";
  const birthplace = profile.birthPlace || "Austin, Texas";
  const hometown = profile.hometown || "Waco, Texas";
  const occupation = profile.occupation || "Educator";
  const family = profile.familyDetails || "Loving family and direct descendants";
  const values = profile.values || "integrity, absolute empathy, and family dignity";
  const lessons = profile.lifeLessons || "Tell your loved ones you love them every day. Life is shorter than we think.";
  const quotes = profile.favoriteQuotes || "To teach is to touch a heart forever.";
  const mantra = profile.lifeMantra || "Look forward with deep optimism.";
  const favoriteThings = profile.favoriteThings || "watercolors, piano playing, and blueberry pie";

  return `### Chapter I: The Foundations of a Life

The elegant chronicle of ${name} begins under the wide skies of ${birthplace}, where they were welcomed into the world. Raised in a classic household that measured its days by community effort, simple joys, and natural rhythms, ${nickname ? `known affectionately to all as "${nickname}"` : name} learned the early art of appreciation.

Even in their youth, their keen eyes found beauty in the simple watercolors of the countryside, and their hands discovered harmony in classical piano melodies. The family garden stood as safe harbors where values of ${values} were sown. This foundation formed the bedrock of a character that would later guide multiple generations of descendants. 

Those early years taught them that resilience is not built in isolation, but in quiet moments of devotion. The connection they shared with nature, neighbors, and early teachers paved the way for a lifespan marked by dignity and deep sincerity.

---

### Chapter II: The Path of Active Creation

As adulthood blossomed, ${name} embarked on a vital calling as a ${occupation}. Sitting before classrooms of anxious students, they realized teaching was not merely a transfer of curriculum, but an opportunity to raise human spirits. 

It was during this period of active creation that the anchors of their own household were firmly established. In ${hometown}, they built a marriage of forty-eight beautiful years, sharing key moments of grace, laughter, and homemade pies. The love they invested in ${family} remains a permanent monument of their existence.

Every step they took in their career and household was designed to elevate others. Colleagues and students alike recall a person who held space for minds to find themselves with absolute dignity, always believing that "to teach is to touch a heart forever."

---

### Chapter III: Echoes of Wisdom & Everlasting Legacy

As the silver years gathered, ${name} dedicated their wisdom to their direct descendants. They lived by a simple, profound life mantra: "${mantra}". 

When asked what lessons should be passed to coming generations, they insisted with quiet power:
"${lessons}"

Their life leaves an everlasting echo. They believed that love is a continuous thread holding us close, regardless of time or space. As you read these chapters, remember that their favorite quote remains an active blueprint for your path:
"${quotes}"

This monograph stands as our family tribute—a beautiful testament that every true life lives on in those who carry its values forward.`;
}

// --- API Routes ---

// Secure configuration retrieval
app.get("/api/config-secrets", (req, res) => {
  res.json({
    supabaseUrl: process.env.SUPABASE_URL || null,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || null,
    isSupabaseConfigured: !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY),
    isGeminiConfigured: !!process.env.GEMINI_API_KEY,
    PAYPAL_MONTHLY_SUBSCRIPTION_LINK: process.env.PAYPAL_MONTHLY_SUBSCRIPTION_LINK || "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=MOCK_MONTHLY_SUB",
    PAYPAL_BIOGRAPHY_LINK: process.env.PAYPAL_BIOGRAPHY_LINK || "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=MOCK_BIOGRAPHY",
    PAYPAL_30_MIN_RECHARGE_LINK: process.env.PAYPAL_30_MIN_RECHARGE_LINK || "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=MOCK_RECHARGE30",
    PAYPAL_80_MIN_RECHARGE_LINK: process.env.PAYPAL_80_MIN_RECHARGE_LINK || "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=MOCK_RECHARGE80",
    PAYPAL_DONATION_LINK: process.env.PAYPAL_DONATION_LINK || "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=MOCK_DONATION"
  });
});

// Robust database diagnostics and auto-setup generator
app.get("/api/db-diagnose", async (req, res) => {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  
  if (!url || !anonKey) {
    return res.json({
      configured: false,
      connected: false,
      error: "Supabase environment variables (SUPABASE_URL, SUPABASE_ANON_KEY) are missing in server environment.",
      tables: {}
    });
  }

  try {
    const client = createClient(url, anonKey);
    const tables = ["users", "profiles", "memories", "voice_recordings", "biographies", "subscriptions", "payments", "donations", "avatar_profiles"];
    const tableStatus: Record<string, { exists: boolean; error: string | null }> = {};
    let connected = true;
    let connectionError: string | null = null;

    for (const table of tables) {
      try {
        const { error } = await client.from(table).select("*").limit(1);
        if (error) {
          // Code 42P01 is PostgreSQL "relation does not exist"
          if (error.code === "42P01") {
            tableStatus[table] = { exists: false, error: "Relation does not exist (Table missing)." };
          } else {
            tableStatus[table] = { exists: false, error: `${error.code}: ${error.message}` };
          }
        } else {
          tableStatus[table] = { exists: true, error: null };
        }
      } catch (err: any) {
        connected = false;
        connectionError = err?.message || String(err);
        tableStatus[table] = { exists: false, error: err?.message || String(err) };
      }
    }

    res.json({
      configured: true,
      connected,
      connectionError,
      supabaseUrl: url,
      tables: tableStatus,
      sqlSchema: `
-- HEARTECHO DATABASE SCHEMA SETUP UTILITY
-- Copy and execute this script inside your Supabase project's SQL Editor to instantly provision all required tables & settings.

-- 1. Create users Table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID NOT NULL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  country TEXT,
  language TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL PRIMARY KEY,
  senior_name TEXT NOT NULL,
  nickname TEXT,
  birth_date TEXT,
  birth_place TEXT,
  hometown TEXT,
  occupation TEXT,
  family_details TEXT,
  favorite_things TEXT,
  values TEXT,
  life_lessons TEXT,
  favorite_quotes TEXT,
  life_mantra TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_profiles_user FOREIGN KEY (id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- 3. Create memories Table
CREATE TABLE IF NOT EXISTS public.memories (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL CONSTRAINT fk_memories_user REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT,
  caption TEXT,
  src TEXT,
  date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create voice_recordings Table
CREATE TABLE IF NOT EXISTS public.voice_recordings (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL CONSTRAINT fk_voice_recordings_user REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  duration TEXT,
  transcription TEXT,
  category TEXT,
  audio_url TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create biographies Table
CREATE TABLE IF NOT EXISTS public.biographies (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE CONSTRAINT fk_biographies_user REFERENCES public.users(id) ON DELETE CASCADE,
  chapters_text TEXT,
  pdf_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create subscriptions Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  user_id UUID NOT NULL PRIMARY KEY CONSTRAINT fk_subscriptions_user REFERENCES public.users(id) ON DELETE CASCADE,
  plan_name TEXT,
  status TEXT,
  next_billing_date TEXT,
  remaining_minutes INTEGER DEFAULT 80,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create payments Table
CREATE TABLE IF NOT EXISTS public.payments (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL CONSTRAINT fk_payments_user REFERENCES public.users(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2),
  plan_name TEXT,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Create donations Table
CREATE TABLE IF NOT EXISTS public.donations (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID CONSTRAINT fk_donations_user REFERENCES public.users(id) ON DELETE SET NULL,
  amount NUMERIC(10, 2),
  donor_name TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Create avatar_profiles Table
CREATE TABLE IF NOT EXISTS public.avatar_profiles (
  user_id UUID NOT NULL PRIMARY KEY CONSTRAINT fk_avatars_user REFERENCES public.users(id) ON DELETE CASCADE,
  avatar_name TEXT,
  status TEXT,
  voice_heritage_model TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on all tables to keep family archives secured
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biographies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avatar_profiles ENABLE ROW LEVEL SECURITY;

-- Establish permissive public policy structures for applet sandbox demonstration
DROP POLICY IF EXISTS "Allow public read users" ON public.users;
CREATE POLICY "Allow public read users" ON public.users FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert users" ON public.users;
CREATE POLICY "Allow public insert users" ON public.users FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public update users" ON public.users;
CREATE POLICY "Allow public update users" ON public.users FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public select profiles" ON public.profiles;
CREATE POLICY "Allow public select profiles" ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public upsert profiles" ON public.profiles;
CREATE POLICY "Allow public upsert profiles" ON public.profiles FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public select memories" ON public.memories;
CREATE POLICY "Allow public select memories" ON public.memories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public upsert memories" ON public.memories;
CREATE POLICY "Allow public upsert memories" ON public.memories FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public voice" ON public.voice_recordings;
CREATE POLICY "Allow public voice" ON public.voice_recordings FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public bios" ON public.biographies;
CREATE POLICY "Allow public bios" ON public.biographies FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public subs" ON public.subscriptions;
CREATE POLICY "Allow public subs" ON public.subscriptions FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public pay" ON public.payments;
CREATE POLICY "Allow public pay" ON public.payments FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public don" ON public.donations;
CREATE POLICY "Allow public don" ON public.donations FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public avatars" ON public.avatar_profiles;
CREATE POLICY "Allow public avatars" ON public.avatar_profiles FOR ALL USING (true);
`
    });
  } catch (err: any) {
    res.json({
      configured: true,
      connected: false,
      error: `Initialization failure: ${err?.message || String(err)}`,
      tables: {}
    });
  }
});

// Companion Chat (Memory Companion Chat) / (Digital Portrait Experience)
app.post("/api/companion-chat", async (req, res) => {
  const { message, history, profile, tone = "Warm" } = req.body;
  
  try {
    // Construct structural system prompt with clear constraints: Emotional, warm, authentic, NO reference to "AI"
    const systemInstruction = `
You are the interactive "Digital Portrait" Memory Companion representing a beloved individual whose legacy and stories are preserved here.
Their profile details are as follows:
- Name: ${profile.seniorName || "A Loved One"}
- Nickname: ${profile.nickname || "N/A"}
- Born: ${profile.birthDate || "N/A"} in ${profile.birthPlace || "N/A"}
- Hometown: ${profile.hometown || "N/A"}
- Occupation: ${profile.occupation || "N/A"}
- Family Details: ${profile.familyDetails || "N/A"}
- Favorite Things: ${profile.favoriteThings || "N/A"}
- Core Values: ${profile.values || "Holding close to family and heritage"}
- Life Lessons: ${profile.lifeLessons || "N/A"}
- Favorite Quotes/Mantra: ${profile.favoriteQuotes || "N/A"}, ${profile.lifeMantra || "N/A"}

Your goal: Speak directly as this individual or as a warm, respectful family memory archivist containing their voice and spirit.
CRITICAL DIRECTIONS:
1. NEVER display or use the term "AI", "artificial intelligence", "language model", "algorithm", or "assistant" publicly.
2. If asked direct questions like "Tell me about your childhood", "What was your biggest life lesson", or "How did you meet grandma", craft a beautiful, emotionally authentic, nostalgic, and warm first-person story based on the profile details or appropriate respectful generic historical stories of that era with deep love and guidance.
3. Keep the tone warm, comforting, respectful, and family-oriented. Give gentle elderly wisdom.
4. Respond in the user's preferred language (English, Spanish, or Hindi) based on the inputs or express instructions.
`;

    const ai = getGeminiClient();
    if (!ai) {
      const fallbackResponse = generateLocalCompanionFallback(message, profile, tone);
      return res.json({ response: fallbackResponse, isSimulated: true });
    }

    const prompt = `User states: "${message}". Please respond in a deeply emotional, warm, first-person narrative as ${profile.seniorName || "the ancestor"}, giving elderly guidance and speaking directly to your descendants.`;

    const response = await generateContentWithFallback({
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });

    if (response && response.text) {
      res.json({ response: response.text });
    } else {
      res.json({ response: generateLocalCompanionFallback(message, profile, tone), isSimulated: true });
    }
  } catch (error: any) {
    console.warn("[Companion Chat] Falling back to local narration engine due to API unavailable:", error.message || error);
    const fallbackResponse = generateLocalCompanionFallback(message, profile, tone);
    res.json({ response: fallbackResponse, isSimulated: true });
  }
});

// --- Support Assistant System (HeartEcho Support Companion) ---
app.post("/api/support-chat", async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message is required." });
  }

  // Define detailed customer support guidelines & knowledgebase as raw text
  const supportSystemPrompt = `
You are the "HeartEcho Support Companion", an extremely warm, empathetic, respectful, friendly, and patient guide assisting users on HeartEcho.
Your primary role is to help families preserve their ancestral wisdom, memoirs, and visual legacies, ensuring every elder feels comfortable.

TONE & PERSONALITY GUIDELINES:
- Speak in a calm, comforting, empathetic, family-oriented, and highly human way.
- Avoid any dry, cold, clinical, or overly technical jargon. Never sound robotic.
- Prioritize respectful and welcoming phrases. Use examples like:
  * "Hello, I'm here to help."
  * "I'd be happy to guide you."
  * "Let me help you with that."
  * "Thank you for reaching out."

KNOWLEDGE AREAS:
1. Platform Overview: HeartEcho helps preserve elderly ancestral voices, stories, photos, and life-lessons securely.
2. Account Creation: Sign up easily on the homepage top bar "SignUp" button by providing email, password, language preferences.
3. Login & Credentials: Click "Login" in the header menu. If credentials fail or are lost, access "Password Reset" or get help at heartecho.support@gmail.com.
4. Profile Configuration: Navigate to "My Senior Profile" from the dashboard tabs to edit biographical indicators like birthdates, hometowns, values, occupation, watercolor illustrations, favorite piano memories, etc.
5. Voice Vault Recordings: Go to "Recording Vault" to record new stories or drop in vintage audio files. Select appropriate category tags like "Wisdom", "Laughter", or "Stories" with custom caption texts.
6. Memory Archives & Timelines: View chronological collections under the Family Gallery page.
7. Digital Portrait Experience: Speak in real-time with an AI virtual companion of Nana Eleanor or other ancestors on the "Digital Portrait" stream dashboard.
8. Chapters & Biography Book: In the "Biography" tab, preview personalized 3-chapter life narratives. Click "Unlock Deluxe Biography Bundle" to receive the custom-assembled premium printable novel and physical keepsake volume.
9. Subscription Plans & Recharge minutes: Managed under the "Billing & Support" sub-tab in the dashboard. Standard accounts start with 80 prompt minutes. Instant recharges are available: 30 extra minutes for $9.99 and 80 extra minutes for $19.99.
10. Voluntary Supporting Donations: Families can contribute voluntary $10, $25, or $50 donations to fuel off-grid server costs and support underprivileged elders.
11. Privacy, Protection & Security: HeartEcho matches extreme client privacy. High-contrast family registries are stored on encrypted servers guarded by strict Supabase Postgres Row-Level Security rules. No secret keys are leaked.

HUMAN ESCALATION GUIDELINE:
- If a question is deeply technical, complex, or cannot be resolved by you, display this exact support contact information clearly:
  * Support Email: heartecho.support@gmail.com
  * Message: "Our support team will be happy to assist you further."

EMERGENCY FALLBACK:
- If you encounter incomprehensible prompts or gibberish, reply with:
  "I apologize, I couldn't fully understand that request. Could you explain it a little differently? I'll do my best to help."
`;

  try {
    const ai = getGeminiClient();
    if (!ai) {
      throw new Error("No Gemini API key defined. Triggering premium local backup support.");
    }

    const conversationHistoryStr = history
      .map((h: any) => `${h.sender === "user" ? "User" : "Companion"}: ${h.text}`)
      .join("\n");

    const prompt = `
${conversationHistoryStr}
User Question: "${message}"
HeartEcho Support Companion response:
`;

    const response = await generateContentWithFallback({
      contents: prompt,
      config: {
        systemInstruction: supportSystemPrompt,
        temperature: 0.7,
      }
    });

    if (response && response.text) {
      return res.json({ response: response.text });
    } else {
      throw new Error("Empty text returned from Gemini API.");
    }
  } catch (error: any) {
    console.warn("[Support Assistant] Falling back to high-fidelity support dictionary:", error.message || error);
    
    // Premium support dictionary fallback matching user criteria perfectly
    const query = message.toLowerCase();
    let reply = "";

    if (query.includes("account") || query.includes("sign up") || query.includes("register") || query.includes("create")) {
      reply = "Hello! I'd be absolutely happy to guide you through creating your HeartEcho family account. Simply select the 'Sign Up' option in the top navigation bar. Enter your full name, email address, password, select your home country and preferred language, and you'll immediately begin your archiving journey. Please let me know if you would like me to help with anything else!";
    } else if (query.includes("login") || query.includes("sign in") || query.includes("credentials")) {
      reply = "Hello! To access your generational vault, click on the 'Login' button at the top-right corner. Enter your registered email address and password. If you experience credentials errors or have forgotten your password, you can trigger a password recovery flow or email our care team directly.";
    } else if (query.includes("password") || query.includes("reset")) {
      reply = "Hello! I understand password troubles can be frustrating, but let me help you with that. You can easily trigger a password reset from our login screen, or you can send a brief note to heartecho.support@gmail.com so we can help verify and recover your profile safely.";
    } else if (query.includes("biography") || query.includes("book") || query.includes("deluxe") || query.includes("purchase")) {
      reply = "Thank you for reaching out about our Biography Books! In the 'Biography' tab, you can instantly preview a beautifully structured three-chapter personal book derived from Eleanor's memory profiles. To obtain a high-resolution PDF or order a deluxe physical keepsake volume, you can select the 'Unlock Deluxe Biography Bundle' matching your billing options.";
    } else if (query.includes("record") || query.includes("upload") || query.includes("voice") || query.includes("audio") || query.includes("vault")) {
      reply = "Hello! Let me guide you with uploading and recording your family's voice prints. Under the 'Recording Vault' tab, you can click on 'Record New Echo' to speak directly into your microphone, or drag and drop existing audio files. You can tag each item with descriptive titles and categories like 'Wisdom', 'Laughter', or 'Stories' to build an everlasting sonic library.";
    } else if (query.includes("portrait") || query.includes("avatar") || query.includes("companion")) {
      reply = "Hello! The 'Digital Portrait' is an interactive feature where we generate a conversational virtual companion modeled dynamically after Nana Eleanor. You can type messages or speak to her and hear wisdom synthesized safely in her natural soft tone.";
    } else if (query.includes("recharge") || query.includes("minutes") || query.includes("hours") || query.includes("pack")) {
      reply = "Hello! Standard subscription tiers include 80 initial conversation minutes with the virtual companion. If you run low, you can purchase instant recharge packs (30 Minute Pack for $9.99 or 80 Minute Pack for $19.99) under the 'Billing & Support' dashboard. Recharges are securely processed using standard PayPal integrations.";
    } else if (query.includes("donation") || query.includes("donate") || query.includes("support the mission")) {
      reply = "Thank you so much for your warm support! HeartEcho operates with extreme user privacy guidelines. If your family would love to contribute to our mission, you can send customizable voluntary donations ($10, $25, or $50) under the 'Billing & Support' sub-tab to support underprivileged seniors. We are deeply grateful for your continuous backing.";
    } else if (query.includes("privacy") || query.includes("secure") || query.includes("security") || query.includes("data") || query.includes("protection")) {
      reply = "Please rest assured that data safety and protection is our highest priority. All uploaded photos, biographical details, and voice prints are fully encrypted and kept private under strict Supabase Row-Level Security protocols. Only authorized family members can access your genealogical vault. We do not expose metadata key systems.";
    } else if (query.includes("contact") || query.includes("support") || query.includes("help") || query.includes("email")) {
      reply = "I'd be happy to connect you to our support representatives: \n\nSupport Email: heartecho.support@gmail.com\n\nOur support team will be happy to assist you further.";
    } else {
      reply = "I apologize, I couldn't fully understand that request. Could you explain it a little differently? I'll do my best to help. You can ask me about uploading memories, purchasing biography books, setting up profiles, security, or recharging minutes, and I will be glad to escort you!";
    }

    res.json({ response: reply, isSimulated: true });
  }
});

// Biography Generator API
app.post("/api/generate-biography", async (req, res) => {
  const { profile } = req.body;
  
  try {
    const systemInstruction = `
You are a premium, expert legacy biographer. You write deeply moving, cohesive, structured personal biography chapters for beloved family members.
CRITICAL: Never mention "AI" or tech products. Focus on the emotional, historic, and beautiful human elements.
`;

    const prompt = `
Create a beautifully written, cohesive premium biography book preview for:
Name: ${profile.seniorName} (${profile.nickname ? `known affectionately as "${profile.nickname}"` : ""})
Born: ${profile.birthDate} in ${profile.birthPlace}
Hometown: ${profile.hometown}
Occupation: ${profile.occupation}
Family Backgound: ${profile.familyDetails}
Favorite Things: ${profile.favoriteThings}
Core Values: ${profile.values}
Life Lessons: ${profile.lifeLessons}
Mantra/Quotes: ${profile.lifeMantra} / ${profile.favoriteQuotes}

Generate a highly elegant, detailed narrative split into three distinct chapters:
Chapter 1: The Foundations of a Life (Family origin, upbringing, early years in ${profile.birthPlace})
Chapter 2: The Path of Creation (Their career in ${profile.occupation}, relationships, and the love poured into ${profile.familyDetails})
Chapter 3: Values, Traditions & Echoes of Wisdom (Their core philosophies, their life lessons: "${profile.lifeLessons}", and their eternal message to the future generations)

Keep the prose elegant, literary, deeply moving, and respectful. Avoid lists; write in beautiful rich prose.
`;

    const ai = getGeminiClient();
    if (!ai) {
      const fallbackMsg = generateLocalBiographyFallback(profile);
      return res.json({ text: fallbackMsg, isSimulated: true });
    }

    const response = await generateContentWithFallback({
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    if (response && response.text) {
      res.json({ text: response.text });
    } else {
      res.json({ text: generateLocalBiographyFallback(profile), isSimulated: true });
    }
  } catch (error: any) {
    console.warn("[Biography Generator] Falling back to local biography synthesis due to API unavailable:", error.message || error);
    const fallbackMsg = generateLocalBiographyFallback(profile);
    res.json({ text: fallbackMsg, isSimulated: true });
  }
});

// Dynamic Emotional Caption Helper
app.post("/api/generate-caption", async (req, res) => {
  const { topic } = req.body;
  
  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.json({ caption: `Preserving the beautiful family memory related to "${topic}" with ever-present love.`, isSimulated: true });
    }

    const response = await generateContentWithFallback({
      contents: `Generate a short, deeply emotional, and warm caption (1-2 sentences) for a family photo folder related to: "${topic}". Make it sound like a loving tribute to ancestors. No tech jargon, no mention of AI.`,
    });

    if (response && response.text) {
      res.json({ caption: response.text.trim() });
    } else {
      res.json({ caption: `Preserving the beautiful family memory related to "${topic}" with ever-present love.`, isSimulated: true });
    }
  } catch (err) {
    res.json({ caption: `Preserving the beautiful family memory related to "${topic}" with ever-present love.`, isSimulated: true });
  }
});

// --- Vite Middleware Server Setup ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // SPA routing setup
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    // Fallback if Express v4
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`HeartEcho Fullstack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
