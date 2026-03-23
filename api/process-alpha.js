import { createClient } from '@supabase/supabase-js';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY?.trim();
const SUPABASE_URL = process.env.VITE_SUPABASE_URL?.trim();

// 👑 THE UPGRADE: We now pull the master Service Role Key to bypass RLS
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing Supabase configuration in environment.");
}

// Initialize Supabase with backend-level admin privileges
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { passcode } = req.body;
  if (passcode !== 'alpha2026') {
    return res.status(401).json({ error: 'Unauthorized: Invalid Passcode' });
  }

  try {
    console.log("📂 Serverless: Accessing Supabase Staging Vault...");
    const { data: rawTweets, error: fetchError } = await supabase.from('raw_tweets').select('id, content');
    
    if (fetchError) throw new Error(`Supabase Fetch Error: ${fetchError.message}`);
    
    if (!rawTweets || rawTweets.length === 0) {
      return res.status(200).json({ message: "Vault is empty. No alpha to process." });
    }

    console.log("🧠 Serverless: Sending curated data to Gemini 2.5 Flash...");
    const formattedTweets = rawTweets.map(tweet => ({ text: tweet.content }));
    
    const systemPrompt = `You are an elite Web3 on-chain analyst. Analyze these raw curated tweets and extract intelligence.
    Output a pure JSON array containing the objects. Do NOT use markdown fences. Just return the raw JSON array.
    
    Extraction Rules (Classify each extracted insight into ONE of these Card Types):
    1. EARLY ALPHA: project_name, description, metric_value (Follower count or "NEW"), metric_label ("FOLLOWERS" or "STATUS"), card_type: "Early Alpha".
    2. TOP FUNDING: project_name, description, metric_value (Amount raised e.g., "$5M"), metric_label ("RAISED"), card_type: "Top Funding".
    3. TOP ENGAGEMENT: project_name, description, metric_value (View/like count), metric_label ("ENGAGEMENT"), card_type: "Top Engagement".
    4. EARLY ALPHA NFT: Find tweets specifically about new NFT collections, mints, or digital art. project_name, description, metric_value (Supply, Mint Price, or "TBA"), metric_label ("SUPPLY", "MINT", or "STATUS"), card_type: "Early Alpha NFT".
    `;
    
    const userPrompt = `TWEETS:\n${JSON.stringify(formattedTweets, null, 2)}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        generationConfig: { temperature: 0.1 } 
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API HTTP Error:", errorText);
      throw new Error(`Gemini API Error: Status ${response.status}`);
    }
    
    let data;
    try {
      data = await response.json();
    } catch (e) {
      console.error("Failed to parse Gemini Response to JSON. The response was likely truncated.");
      throw new Error("Gemini returned incomplete or malformed data.");
    }
    
    const candidate = data?.candidates?.[0];
    
    if (!candidate || candidate.finishReason === 'SAFETY') {
      throw new Error("Gemini blocked or returned invalid candidate format.");
    }

    let rawText = candidate.content.parts[0].text.trim();
    if (rawText.startsWith("```")) {
      rawText = rawText.replace(/^```json\n/, "").replace(/\n```$/, "");
    }
    
    let cards = [];
    try {
      cards = JSON.parse(rawText);
    } catch (parseErr) {
      console.error("Failed to parse the final array from Gemini:", rawText);
      throw new Error("Gemini hallucinated. Output was not a valid JSON array.");
    }

    if (cards.length > 0) {
      console.log("⚡ Serverless: Pushing intelligence to Supabase Mainnet...");
      // Because we use the Service Key, this INSERT will slice right through the RLS armor
      const { error: insertError } = await supabase.from('weekly_intelligence').insert(cards);
      if (insertError) throw insertError;

      console.log("🧹 Serverless: Wiping processed tweets from staging vault...");
      const idsToDelete = rawTweets.map(t => t.id);
      await supabase.from('raw_tweets').delete().in('id', idsToDelete); 
      
      return res.status(200).json({ message: `Successfully processed ${cards.length} alpha signals.` });
    } else {
       return res.status(200).json({ message: "Gemini parsed the data but returned 0 cards." });
    }

  } catch (error) {
    console.error("❌ SERVERLESS PIPELINE FAILED:", error.message);
    return res.status(500).json({ error: error.message });
  }
}