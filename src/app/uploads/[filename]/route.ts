import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function getUploadDir(): string {
  if (process.env.DATA_DIR) {
    return path.join(process.env.DATA_DIR, 'uploads');
  }
  return path.join(process.cwd(), 'public', 'uploads');
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const safeFilename = path.basename(filename);
  const filePath = path.join(/*turbopackIgnore: true*/ getUploadDir(), safeFilename);

  if (!fs.existsSync(/*turbopackIgnore: true*/ filePath)) {
    return new NextResponse('File not found', { status: 404 });
  }

  const ext = path.extname(safeFilename).toLowerCase();
  let contentType = 'application/octet-stream';
  if (['.jpg', '.jpeg'].includes(ext)) contentType = 'image/jpeg';
  else if (ext === '.png') contentType = 'image/png';
  else if (ext === '.webp') contentType = 'image/webp';
  else if (ext === '.svg') contentType = 'image/svg+xml';

  const fileBuffer = fs.readFileSync(/*turbopackIgnore: true*/ filePath);

  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
