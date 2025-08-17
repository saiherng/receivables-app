import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase-server';

// GET /api/receivables/[id] - Get receivable by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('receivables')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Receivable not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to fetch receivable', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/receivables/[id] - Update receivable
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    // Validate required fields
    const { date, customer_name, amount, city } = body;
    if (!date || !customer_name || !amount || !city) {
      return NextResponse.json(
        { error: 'Missing required fields: date, customer_name, amount, city' },
        { status: 400 }
      );
    }

    // Validate amount is a positive number
    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number' },
        { status: 400 }
      );
    }

    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('receivables')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Receivable not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to update receivable', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/receivables/[id] - Delete receivable
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const supabase = await getSupabaseClient();
    const { error } = await supabase
      .from('receivables')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete receivable', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Receivable deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
