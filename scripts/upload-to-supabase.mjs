#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE;

if (!supabaseUrl || !serviceRole) {
  console.error('Missing environment variables. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE (do NOT commit the service role).');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRole);
const bucket = 'portfolio';

const repoRoot = process.cwd();
const files = [
  'public/antigravity-color.svg',
  'public/assets/resume.jpg',
  'public/assets/resume/RAGURAMAN_Resume.pdf',
  'public/assets/resume/nasscom.jpeg',
  'public/assets/resume/Azure.jpeg',
  'public/assets/RAGU.png',
  'public/assets/new.png',
  'public/assets/card-front.png',
  'public/assets/avatar.png'
];

(async () => {
  for (const rel of files) {
    const filePath = path.join(repoRoot, rel);
    if (!fs.existsSync(filePath)) {
      console.error('MISSING:', rel);
      continue;
    }
    const dest = rel.replace(/^public\/?/, '').replace(/\\/g, '/');
    const stream = fs.createReadStream(filePath);
    console.log('Uploading', rel, '->', dest);
    try {
      const { data, error } = await supabase.storage.from(bucket).upload(dest, stream, { upsert: true });
      if (error) {
        console.error('FAILED', rel, error.message);
      } else {
        console.log('OK', rel, data);
      }
    } catch (err) {
      console.error('ERROR', rel, err && err.message ? err.message : err);
    }
  }
})();
