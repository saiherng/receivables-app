import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase-server';

// GET /api/receivables - Get all receivables
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customer = searchParams.get('customer');

    const supabase = await getSupabaseClient();
    let query = supabase
      .from('receivables')
      .select('*')
      .order('date', { ascending: false });

    // Add customer filter if provided
    if (customer) {
      query = query.eq('customer_name', customer);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch receivables', details: error.message },
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

// POST /api/receivables - Create new receivable
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { date, customer_name, amount, city, description } = body;
    
    // Check for missing required fields
    const missingFields = [];
    if (!date) missingFields.push('date');
    if (!customer_name || customer_name.trim() === '') missingFields.push('customer_name');
    if (amount === undefined || amount === null) missingFields.push('amount');
    if (!city || city.trim() === '') missingFields.push('city');
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
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

    // Prepare data for insertion
    let formattedDate = date.trim();
    if (formattedDate && !formattedDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const parsedDate = new Date(formattedDate);
      if (!isNaN(parsedDate.getTime())) {
        formattedDate = parsedDate.toISOString().split('T')[0];
      }
    }

    const receivableData = {
      date: formattedDate,
      customer_name: customer_name.trim(),
      amount: Number(amount),
      city: city.trim(),
      description: description ? description.trim() : null
    };

    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('receivables')
      .insert([receivableData])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create receivable', details: error.message },
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
