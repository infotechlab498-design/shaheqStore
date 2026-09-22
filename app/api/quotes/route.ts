import { NextRequest, NextResponse } from 'next/server';
import { QuoteService } from '@/lib/services/quote.service';
import { QuoteRequestSchema } from '@/lib/validations/quote.schema';

export async function GET() {
  try {
    const quotes = await QuoteService.getAllQuotes();
    return NextResponse.json({
      success: true,
      data: quotes,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch quotes',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with Zod
    const validatedData = QuoteRequestSchema.parse(body);

    const files = Array.isArray(body.files)
      ? body.files.map((f: any) => ({
          originalFileName: f.originalFileName || f.name,
          fileSizeBytes: f.fileSizeBytes || 1024 * 1024,
          format: f.format || f.type || '.STL',
          storageKey: f.storageKey || `quotes/${Date.now()}/${f.name || 'cad-model.stl'}`,
        }))
      : [];

    const result = await QuoteService.submitQuoteRequest({
      ...validatedData,
      files,
    });

    if (!result.success || !result.quote) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to submit quote request' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result.quote,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.errors ? error.errors[0]?.message : error.message || 'Invalid quote request',
      },
      { status: 400 }
    );
  }
}
