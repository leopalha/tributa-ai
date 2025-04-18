import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eqliefeonbjpyocnywfe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxbGllZmVvbmJqcHlvY255d2ZlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDk2NDU0NCwiZXhwIjoyMDU2NTQwNTQ0fQ.imrIorRL0IsNJ1rA4jpSPKHzE3a-pEwGSEluXh32bBc';

export const supabase = createClient(supabaseUrl, supabaseKey); 