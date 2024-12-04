// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Replace with your own Supabase URL and API key
const supabaseUrl = 'https://myspzbtzlcuhmgreyljd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15c3B6YnR6bGN1aG1ncmV5bGpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxOTY2NTYsImV4cCI6MjA0ODc3MjY1Nn0.I-ebjlSd9545F3tiBVCXX-lDR2mlsI5cRE33ugYn0t0';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
