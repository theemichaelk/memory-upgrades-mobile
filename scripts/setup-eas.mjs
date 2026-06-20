import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const envPath = path.join(root, '.env');
const appConfigPath = path.join(root, 'app.config.ts');

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  return Object.fromEntries(
    fs
      .readFileSync(filePath, 'utf8')
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => {
        const index = line.indexOf('=');
        return [line.slice(0, index), line.slice(index + 1)];
      })
  );
}

function writeEnvValue(key, value) {
  const env = readEnvFile(envPath);
  env[key] = value;

  const lines = fs.readFileSync(path.join(root, '.env.example'), 'utf8').split('\n');
  const output = lines.map((line) => {
    if (!line || line.startsWith('#')) {
      return line;
    }

    const index = line.indexOf('=');
    const envKey = line.slice(0, index);
    return `${envKey}=${env[envKey] ?? line.slice(index + 1)}`;
  });

  if (!output.some((line) => line.startsWith(`${key}=`))) {
    output.push(`${key}=${value}`);
  }

  fs.writeFileSync(envPath, `${output.filter(Boolean).join('\n')}\n`);
}

function getWhoami() {
  try {
    return execSync('npx eas-cli whoami', { encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

function getProjectInfo() {
  try {
    const output = execSync('npx eas-cli project:info --json', { encoding: 'utf8' });
    return JSON.parse(output);
  } catch {
    return null;
  }
}

console.log('Memory Upgrades — EAS setup helper\n');

const account = getWhoami();
if (!account) {
  console.log('Step 1: Log in to Expo');
  console.log('  npm run eas:login');
  console.log('Then rerun: npm run eas:setup');
  process.exit(1);
}

console.log(`Logged in as: ${account}`);
writeEnvValue('EXPO_PUBLIC_EXPO_OWNER', account);

const project = getProjectInfo();
if (project?.id) {
  writeEnvValue('EXPO_PUBLIC_EAS_PROJECT_ID', project.id);
  console.log(`Linked project ID: ${project.id}`);
  console.log('\nEAS setup complete. Next: npm run build:preview:android');
  process.exit(0);
}

console.log('\nStep 2: Link this app to an Expo project');
console.log('  npm run eas:init');
console.log('\nAfter eas init finishes, rerun: npm run eas:setup');