import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const token = request.cookies.get('versace_admin_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const authenticated = await verifyToken(token);

    if (!authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Read uploaded files
    const formData = await request.formData();

    // The admin page sends files using the "files" field
    const files = formData.getAll('files');

    if (!files.length) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    // Supabase admin client
    const supabase = getSupabaseAdminClient();

    if (!supabase) {
      console.error('Supabase admin client is not configured');

      return NextResponse.json(
        { error: 'Supabase admin client is not configured' },
        { status: 500 }
      );
    }

    const uploadedFiles: Array<{
      url: string;
      path: string;
    }> = [];

    for (const file of files) {
      if (!(file instanceof File)) {
        return NextResponse.json(
          { error: 'Invalid file' },
          { status: 400 }
        );
      }

      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'Only image files are allowed' },
          { status: 400 }
        );
      }

      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'Image size must be less than 10MB' },
          { status: 400 }
        );
      }

      const extension =
        file.name.split('.').pop()?.toLowerCase() || 'jpg';

      const safeExtension = /^[a-z0-9]+$/.test(extension)
        ? extension
        : 'jpg';

      const fileName = `${crypto.randomUUID()}.${safeExtension}`;

      // Store inside the products bucket
      const filePath = fileName;

      const fileBuffer = Buffer.from(await file.arrayBuffer());

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, fileBuffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error(
          'Supabase storage upload error:',
          JSON.stringify(uploadError, null, 2)
        );

        return NextResponse.json(
          {
            error: 'Failed to upload image',
            details: uploadError.message,
          },
          { status: 500 }
        );
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      uploadedFiles.push({
        url: publicUrl,
        path: filePath,
      });
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      urls: uploadedFiles.map((file) => file.url),
    });
  } catch (error) {
    console.error('Upload route error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        details:
          error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
