import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY?.trim();
const SUPABASE_URL = process.env.VITE_SUPABASE_URL?.trim();
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY?.trim();
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- 1. FETCH TWEETS ---
async function fetchTweets() {
  console.log("📂 Accessing Supabase Staging Vault (raw_tweets)...");
  const { data, error } = await supabase.from('raw_tweets').select('id, content');
  if (error) throw new Error(`Supabase Fetch Error: ${error.message}`);
  if (!data || data.length === 0) {
    console.log("⚠️ Staging vault is empty. No new alpha injected today.");
    return [];
  }
  return data.map(tweet => ({ text: tweet.content }));
}

// --- 2. PARSE WITH AI ---
async function parseWithGemini(tweets) {
  console.log("🧠 Sending curated data to Gemini 2.5 Flash...");
  const systemPrompt = `You are an elite Web3 on-chain analyst. Analyze these raw curated tweets and extract intelligence.
  Output a pure JSON array containing the objects. Do NOT use markdown fences. Just return the raw JSON array.
  
  Extraction Rules (Classify each extracted insight into ONE of these Card Types):
  1. EARLY ALPHA: project_name, description, metric_value (Follower count or "NEW"), metric_label ("FOLLOWERS" or "STATUS"), card_type: "Early Alpha".
  2. TOP FUNDING: project_name, description, metric_value (Amount raised e.g., "$5M"), metric_label ("RAISED"), card_type: "Top Funding".
  3. TOP ENGAGEMENT: project_name, description, metric_value (View/like count), metric_label ("ENGAGEMENT"), card_type: "Top Engagement".
  `;
  const userPrompt = `TWEETS:\n${JSON.stringify(tweets, null, 2)}`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig: { temperature: 0.1 } 
    })
  });

  if (!response.ok) throw new Error(`Gemini Error: ${await response.text()}`);
  const data = await response.json();
  let rawText = data.candidates[0].content.parts[0].text.trim();
  if (rawText.startsWith("```")) rawText = rawText.replace(/^```json\n/, "").replace(/\n```$/, "");
  return JSON.parse(rawText);
}

// --- 3. PUSH & CLEANUP (Cumulative Mode) ---
async function pushToDatabase(cards) {
  if (cards.length === 0) return;
  console.log("⚡ Pushing intelligence to Supabase Mainnet (Cumulative Mode)...");
  
  // ARCHITECT FIX: We NO LONGER wipe weekly_intelligence here. We just add to it.
  const { error: insertError } = await supabase.from('weekly_intelligence').insert(cards);
  if (insertError) throw insertError;
  console.log("🚀 SUCCESS: Intelligence Grid Updated!");

  console.log("🧹 Wiping the raw_tweets staging vault...");
  const { error: deleteError } = await supabase.from('raw_tweets').delete().neq('id', '00000000-0000-0000-0000-000000000000'); 
  if (deleteError) throw deleteError;
  console.log("✅ Staging vault wiped clean.");
}

async function runPipeline() {
  try {
    const tweets = await fetchTweets();
    if (tweets.length > 0) {
      const cards = await parseWithGemini(tweets);
      await pushToDatabase(cards);
    }
  } catch (error) {
    console.error("❌ PIPELINE FAILED:", error.message);
  }
}
runPipeline();