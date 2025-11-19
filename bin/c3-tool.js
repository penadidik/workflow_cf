#!/usr/bin/env node
import { Command } from 'commander';
import execa from 'execa';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { uploadFileToR2, listR2Objects } from '../src/r2.js';

dotenv.config();

const program = new Command();
program.name('c3-tool').description('Simple Cloudflare C3/R2 CLI helpers').version('0.1.0');

program
  .command('init [name]')
  .description('Scaffold a new Cloudflare project using create-cloudflare (C3)')
  .option('-f, --framework <framework>', 'framework to scaffold (react/vue/worker/pages/etc)')
  .action(async (name = 'my-cloudflare-app', opts) => {
    const args = ['create', 'cloudflare@latest', '--', name];
    if (opts.framework) args.push('--framework', opts.framework);
    console.log('Running:', 'npm', args.join(' '));
    try {
      await execa('npm', args, { stdio: 'inherit' });
    } catch (err) {
      console.error('Failed to run create-cloudflare:', err.message);
      process.exit(1);
    }
  });

program
  .command('r2:upload <bucket> <file> [key]')
  .description('Upload a file to Cloudflare R2 (S3-compatible). Provide BUCKET, FILE, optional OBJECT KEY')
  .option('--endpoint <endpoint>', 'Custom R2 endpoint (defaults to https://<account_id>.r2.cloudflarestorage.com)')
  .action(async (bucket, file, key, opts) => {
    try {
      const objectKey = key || path.basename(file);
      await uploadFileToR2({ bucket, file, key: objectKey, endpoint: opts.endpoint });
      console.log(`Uploaded ${file} -> ${bucket}/${objectKey}`);
    } catch (err) {
      console.error('Upload failed:', err.message);
      process.exit(1);
    }
  });

program
  .command('r2:list <bucket>')
  .description('List objects in an R2 bucket')
  .option('--endpoint <endpoint>', 'Custom R2 endpoint')
  .action(async (bucket, opts) => {
    try {
      const items = await listR2Objects({ bucket, endpoint: opts.endpoint });
      if (!items.length) console.log('No objects found.');
      else items.forEach(i => console.log(i.Key, `(${i.Size} bytes)`));
    } catch (err) {
      console.error('List failed:', err.message);
      process.exit(1);
    }
  });

program
  .command('wrangler:deploy [dir]')
  .description('Run wrangler publish in project dir (must have wrangler configured)')
  .action(async (dir = '.') => {
    try {
      await execa('npx', ['wrangler', 'publish'], { stdio: 'inherit', cwd: dir });
    } catch (err) {
      console.error('wrangler publish failed:', err.message);
      process.exit(1);
    }
  });

program.parse(process.argv);

