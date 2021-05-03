import { readFileSync } from 'fs';
import { sep } from 'path';

export const loadConfiguration = () =>
  JSON.parse(readFileSync(process.env.CONFIG_PATH.replace(/\//g, sep), 'utf8'));
