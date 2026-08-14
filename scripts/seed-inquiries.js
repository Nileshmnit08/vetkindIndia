const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
const WebSocket = require('ws');

// Load env vars from .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: {
    transport: WebSocket
  }
});

const statuses = [
  'NEW',
  'OPEN',
  'IN PROGRESS',
  'CONTACTED',
  'QUALIFIED',
  'CONVERTED',
  'CLOSED',
  'SPAM'
];

const priorities = ['Low', 'Medium', 'High', 'Urgent'];
const sources = ['website', 'direct', 'referral', 'event'];
const types = ['general', 'support', 'sales', 'partnership'];

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const dummyData = statuses.map((status, index) => {
  return {
    name: `Test User ${index + 1}`,
    email: `testuser${index + 1}@example.com`,
    phone: `+123456789${index}`,
    company: `Dummy Corp ${index + 1}`,
    message: `This is a dummy inquiry for testing the ${status} status. We are interested in your products and would like to schedule a call.`,
    status: status,
    priority: randomChoice(priorities),
    source: randomChoice(sources),
    inquiry_type: randomChoice(types),
    city: 'New York',
    country: 'USA'
  };
});

async function seed() {
  console.log("Seeding inquiries...");
  const { data, error } = await supabase
    .from('inquiries')
    .insert(dummyData)
    .select();

  if (error) {
    console.error("Error inserting inquiries:", error);
    process.exit(1);
  }

  console.log(`Successfully inserted ${data.length} inquiries.`);
  
  // Optionally, add an activity log for each
  console.log("Adding dummy activity logs...");
  const activities = data.map(inquiry => ({
    inquiry_id: inquiry.id,
    activity_type: 'NOTE',
    content: 'Initial dummy data inserted for testing.',
  }));

  const { error: actError } = await supabase
    .from('inquiry_activities')
    .insert(activities);

  if (actError) {
    console.error("Error inserting activities:", actError);
  } else {
    console.log("Activities inserted successfully.");
  }
}

seed();
