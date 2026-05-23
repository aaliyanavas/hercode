import { mkdir, writeFile } from 'fs/promises';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE =
  'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
const MODELS_DIR = path.join(__dirname, '../public/models');

const FILES = [
  'tiny_face_detector_model-weights_manifest.json',
  'tiny_face_detector_model-shard1',
  'face_expression_model-weights_manifest.json',
  'face_expression_model-shard1',
];

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`);
  const body = res.body;
  if (!body) throw new Error(`No body for ${url}`);
  await pipeline(Readable.fromWeb(body), createWriteStream(dest));
}

await mkdir(MODELS_DIR, { recursive: true });
for (const file of FILES) {
  const url = `${BASE}/${file}`;
  const dest = path.join(MODELS_DIR, file);
  process.stdout.write(`Downloading ${file}...\n`);
  await download(url, dest);
}
process.stdout.write('Models ready in public/models\n');
