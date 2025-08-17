import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase-server';

// GET /api/payments - Get all payments
export async function GET() {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('payment_date', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch payments', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: data || [] });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/payments - Create new payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { receivable_id, payment_date, payment_amount, payment_type } = body;
    if (!receivable_id || !payment_date || !payment_amount || !payment_type) {
      return NextResponse.json(
        { error: 'Missing required fields: receivable_id, payment_date, payment_amount, payment_type' },
        { status: 400 }
      );
    }

    // Validate payment_amount is a positive number
    if (typeof payment_amount !== 'number' || payment_amount <= 0) {
      return NextResponse.json(
        { error: 'Payment amount must be a positive number' },
        { status: 400 }
      );
    }

    const supabase = await getSupabaseClient();
    // Verify that the receivable exists
    const { data: receivable, error: receivableError } = await supabase
      .from('receivables')
      .select('id, amount')
      .eq('id', receivable_id)
      .single();

    if (receivableError || !receivable) {
      return NextResponse.json(
        { error: 'Receivable not found' },
        { status: 404 }
      );
    }

    const { data, error } = await supabase
      .from('payments')
      .insert([body])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create payment', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
