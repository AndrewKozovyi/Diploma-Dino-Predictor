import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const environmentsDir = join(import.meta.dirname, '../src/environments');
const envFile = join(environmentsDir, '.env');

if (existsSync(envFile)) {
  process.loadEnvFile(envFile);
}

const readVariable = (name, allowed) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Environment variable ${name} is required, see src/environments/.env.example`);
  }

  if (allowed && !allowed.includes(value)) {
    throw new Error(`Environment variable ${name} must be one of: ${allowed.join(', ')}`);
  }

  return value;
};

const environment = {
  apiUrl: readVariable('API_URL'),
  defaultCulture: readVariable('DEFAULT_CULTURE', ['uk', 'en']),
};

const source = `import type { AppEnvironment } from '../app/interfaces/core/app-environment';

export const environment: AppEnvironment = ${JSON.stringify(environment, null, 2)};
`;

writeFileSync(join(environmentsDir, 'environment.ts'), source);
