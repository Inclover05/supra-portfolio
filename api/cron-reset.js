import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL?.trim();
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Critical Failure: Missing Supabase environment variables.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;
  
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized: Invalid Cron Signature' });
  }

  try {
    console.log("⏳ CRON WAKEUP: Initiating Sunday Grid Reset...");

    const { error } = await supabase
      .from('weekly_intelligence')
      .delete()
      .gt('id', -1); 

    if (error) {
      throw error;
    }

    console.log("✅ CRON SUCCESS: The intelligence grid has been purged.");
    return res.status(200).json({ message: 'System purged successfully. Awaiting new intelligence.' });

  } catch (error) {
    console.error("❌ CRON PURGE FAILED:", error.message);
    return res.status(500).json({ error: error.message });
  }
}