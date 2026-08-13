const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

globalThis.WebSocket = require('ws');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const email = 'admin@vetkind.com';
  const password = 'adminpassword123';
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const { data: existingUser } = await supabase.from('users').select('id').eq('email', email).single();
  
  if (existingUser) {
    const { error } = await supabase.from('users').update({
      password: hashedPassword,
      role: 'ADMIN',
      status: 'ACTIVE'
    }).eq('email', email);
    
    if (error) {
      console.error('Error updating existing admin:', error);
    } else {
      console.log('Updated existing admin password.');
    }
  } else {
    const { error } = await supabase.from('users').insert({
      email,
      name: 'Super Admin',
      password: hashedPassword,
      role: 'ADMIN',
      status: 'ACTIVE'
    });
    
    if (error) {
      console.error('Error creating new admin:', error);
    } else {
      console.log('Created new admin user.');
    }
  }
}

run();
