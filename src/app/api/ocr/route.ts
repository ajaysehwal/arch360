import { NextResponse } from 'next/server';
import { createWorker } from 'tesseract.js';
import path from 'path';
import fetch from 'node-fetch';
import cv from 'opencv4nodejs';

// 1. Get absolute paths
const __dirname = path.resolve();
const workerPath = path.join(
  __dirname,
  'node_modules/tesseract.js/src/worker-script/node/index.js'
);
const corePath = path.join(
  __dirname,
  'node_modules/tesseract.js-core/tesseract-core.wasm.js'
);

// async function preprocessImage(buffer: Buffer): Promise<Buffer> {
//   try {
//     // Convert Buffer to a Mat object
//     const mat = cv.(buffer);

//     // Convert to grayscale
//     const gray = mat.cvtColor(cv.COLOR_BGR2GRAY);

//     // Increase contrast
//     const contrast = gray.convertTo(cv.CV_8UC1, 1.5, 0);

//     // Adjust brightness (normalize)
//     const normalized = contrast.normalize(0, 255, cv.NORM_MINMAX);

//     // Convert back to Buffer
//     const processedBuffer = cv.imencode('.jpg', normalized).toString('base64');
//     return Buffer.from(processedBuffer, 'base64');
//   } catch (error) {
//     console.error('Image preprocessing failed:', error);
//     return buffer; // Return original if preprocessing fails
//   }
// }

export async function POST(request: Request) {
  const { imageUrl } = await request.json();

  if (!imageUrl) {
    return NextResponse.json({ message: 'Image URL is required' }, { status: 400 });
  }

  // 2. Create worker with Node.js-specific config
  const worker = await createWorker({
    workerPath,
    corePath,
    logger: (m) => console.log(m),
  });

  const response = await fetch(imageUrl);
  const buffer = await response.arrayBuffer();
  console.log("image buffer", buffer);
  // const processedBuffer = await preprocessImage(Buffer.from(buffer));

  try {
    await worker.loadLanguage('eng');
    await worker.initialize('eng');

    await worker.setParameters({
      tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-()m²~_/\\&°',
      preserve_interword_spaces: '1'
    });

    const { data: { text } } = await worker.recognize(Buffer.from(buffer));

    const cleanText = text
      .replace(/[^\w\s\-()\/\\]/g, '') // Remove special chars
      .replace(/\n{2,}/g, '\n'); // Remove empty lines

    const lines = cleanText.split('\n').filter(line => line.trim() !== '');

    // 3. Process image
    console.log(text, lines);

    // 4. Format result
    const result = lines.reduce((acc: { [key: string]: string }, line, index) => {
      acc[index.toString()] = line.trim();
      return acc;
    }, {});
    console.log(result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('OCR Error:', error);
    return NextResponse.json({ message: 'Failed to process image' }, { status: 500 });
  } finally {
    await worker.terminate();
  }
}