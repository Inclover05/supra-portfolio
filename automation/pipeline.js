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
    console.log("⚠️ Staging vault is empty.");
    return [];
  }
  
  // Return the full object so we can keep track of the IDs for deletion later
  return data;
}

// --- 2. PARSE WITH AI (NFT UPGRADE & SAFETY FIX) ---
async function parseWithGemini(rawTweets) {
  console.log("🧠 Sending curated data to Gemini 2.5 Flash...");
  
  // Map just the text for the AI
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

  if (!response.ok) throw new Error(`Gemini Error: ${await response.text()}`);
  
  const data = await response.json();
  const candidate = data?.candidates?.[0];
  
  if (!candidate || candidate.finishReason === 'SAFETY') {
    throw new Error("Gemini blocked or returned invalid candidate format.");
  }

  let rawText = candidate.content.parts[0].text.trim();
  if (rawText.startsWith("```")) {
    rawText = rawText.replace(/^```json\n/, "").replace(/\n```$/, "");
  }
  
  // JSON SAFETY CATCH
  try {
    return JSON.parse(rawText);
  } catch (error) {
    console.error("❌ Invalid JSON format received from Gemini:", rawText);
    return []; // Return empty so we don't crash
  }
}

// --- 3. PUSH & TARGETED CLEANUP ---
async function pushToDatabase(cards, originalTweets) {
  if (cards.length === 0) return;
  console.log("⚡ Pushing intelligence to Supabase Mainnet...");
  
  const { error: insertError } = await supabase.from('weekly_intelligence').insert(cards);
  if (insertError) throw insertError;
  console.log("🚀 SUCCESS: Intelligence Grid Updated!");

  console.log("🧹 Wiping processed tweets from staging vault...");
  // TARGETED DELETE: Only wipes the exact IDs we successfully processed
  const idsToDelete = originalTweets.map(t => t.id);
  await supabase.from('raw_tweets').delete().in('id', idsToDelete); 
}

async function runPipeline() {
  try {
    const rawTweets = await fetchTweets();
    if (rawTweets.length > 0) {
      const cards = await parseWithGemini(rawTweets);
      if (cards.length > 0) {
        await pushToDatabase(cards, rawTweets);
      }
    }
  } catch (error) {
    console.error("❌ PIPELINE FAILED:", error.message);
  }
}

runPipeline();