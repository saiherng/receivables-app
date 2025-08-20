import { supabase } from './supabase';
import { formatDateForDatabase } from './date-utils';
import { validateReceivableData, validatePaymentData, checkRateLimit } from './validation';

// Helper function to get the current user
async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error('Authentication required. Please sign in again.');
  }
  return user;
}

// Helper function to refresh token if needed
async function refreshTokenIfNeeded() {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session) {
    throw new Error('Authentication required. Please sign in again.');
  }

  // Check if token is expired or will expire soon (within 5 minutes)
  const expiresAt = session.expires_at;
  const now = Math.floor(Date.now() / 1000);
  const fiveMinutes = 5 * 60;

  if (expiresAt && (expiresAt - now) < fiveMinutes) {
    const { data: { session: newSession }, error: refreshError } = await supabase.auth.refreshSession();
    if (refreshError || !newSession) {
      throw new Error('Session expired. Please sign in again.');
    }
  }
}

// API functions for receivables
export const receivablesApi = {
  // Get all receivables
  getAll: async (customer?: string) => {
    await refreshTokenIfNeeded();
    
    // Rate limiting
    const user = await getCurrentUser();
    if (!checkRateLimit(`receivables_get_${user.id}`, 100, 60000)) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    
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
      // If the error is about missing user_id column, try without it
      if (error.message.includes('user_id') && error.message.includes('does not exist')) {
        console.warn('user_id column not found, using RLS policies for filtering');
        // RLS policies should handle the filtering automatically
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('receivables')
          .select('*')
          .order('date', { ascending: false });
        
        if (fallbackError) {
          throw new Error(`Failed to fetch receivables: ${fallbackError.message}`);
        }
        return { data: fallbackData || [] };
      }
      throw new Error(`Failed to fetch receivables: ${error.message}`);
    }

    return { data: data || [] };
  },

  // Get receivable by ID
  getById: async (id: string) => {
    await refreshTokenIfNeeded();
    
    const { data, error } = await supabase
      .from('receivables')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Receivable not found');
      }
      throw new Error(`Failed to fetch receivable: ${error.message}`);
    }

    return { data };
  },

  // Create new receivable
  create: async (data: any) => {
    await refreshTokenIfNeeded();
    
    // Validate and sanitize input data
    const validatedData = validateReceivableData(data);
    
    // Format the date properly before sending to database
    const formattedData = {
      ...validatedData,
      date: formatDateForDatabase(validatedData.date)
    };
    
    const { data: newReceivable, error } = await supabase
      .from('receivables')
      .insert([formattedData])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create receivable: ${error.message}`);
    }

    return { data: newReceivable };
  },

  // Update receivable
  update: async (id: string, data: any) => {
    await refreshTokenIfNeeded();
    
    // Validate and sanitize input data
    const validatedData = validateReceivableData(data);
    
    // Format the date properly before sending to database
    const formattedData = {
      ...validatedData,
      date: validatedData.date ? formatDateForDatabase(validatedData.date) : validatedData.date
    };
    
    const { data: updatedReceivable, error } = await supabase
      .from('receivables')
      .update(formattedData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update receivable: ${error.message}`);
    }

    return { data: updatedReceivable };
  },

  // Delete receivable
  delete: async (id: string) => {
    await refreshTokenIfNeeded();
    
    const { error } = await supabase
      .from('receivables')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete receivable: ${error.message}`);
    }

    return { message: 'Receivable deleted successfully' };
  },
};

// API functions for payments
export const paymentsApi = {
  // Get all payments
  getAll: async () => {
    await refreshTokenIfNeeded();
    
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('payment_date', { ascending: false });

    if (error) {
      // If the error is about missing user_id column, try without it
      if (error.message.includes('user_id') && error.message.includes('does not exist')) {
        console.warn('user_id column not found, using RLS policies for filtering');
        // RLS policies should handle the filtering automatically
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('payments')
          .select('*')
          .order('payment_date', { ascending: false });
        
        if (fallbackError) {
          throw new Error(`Failed to fetch payments: ${fallbackError.message}`);
        }
        return { data: fallbackData || [] };
      }
      throw new Error(`Failed to fetch payments: ${error.message}`);
    }

    return { data: data || [] };
  },

  // Get payment by ID
  getById: async (id: string) => {
    await refreshTokenIfNeeded();
    
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Payment not found');
      }
      throw new Error(`Failed to fetch payment: ${error.message}`);
    }

    return { data };
  },

  // Create new payment
  create: async (data: any) => {
    await refreshTokenIfNeeded();
    
    // Validate and sanitize input data
    const validatedData = validatePaymentData(data);

    // Format the date properly before sending to database
    const formattedData = {
      ...validatedData,
      payment_date: formatDateForDatabase(validatedData.payment_date)
    };

    const { data: newPayment, error } = await supabase
      .from('payments')
      .insert([formattedData])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create payment: ${error.message}`);
    }

    return { data: newPayment };
  },

  // Update payment
  update: async (id: string, data: any) => {
    await refreshTokenIfNeeded();
    
    // Validate and sanitize input data
    const validatedData = validatePaymentData(data);
    
    // Format the date properly before sending to database
    const formattedData = {
      ...validatedData,
      payment_date: validatedData.payment_date ? formatDateForDatabase(validatedData.payment_date) : validatedData.payment_date
    };
    
    const { data: updatedPayment, error } = await supabase
      .from('payments')
      .update(formattedData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update payment: ${error.message}`);
    }

    return { data: updatedPayment };
  },

  // Delete payment
  delete: async (id: string) => {
    await refreshTokenIfNeeded();
    
    const { error } = await supabase
      .from('payments')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete payment: ${error.message}`);
    }

    return { message: 'Payment deleted successfully' };
  },
};

// Backward compatibility: API service class
export class ApiService {
  // Receivables API methods
  async getReceivables() {
    return receivablesApi.getAll();
  }

  async getReceivable(id: string) {
    return receivablesApi.getById(id);
  }

  async createReceivable(receivable: any) {
    return receivablesApi.create(receivable);
  }

  async updateReceivable(id: string, receivable: any) {
    return receivablesApi.update(id, receivable);
  }

  async deleteReceivable(id: string) {
    return receivablesApi.delete(id);
  }

  // Payments API methods
  async getPayments() {
    return paymentsApi.getAll();
  }

  async getPayment(id: string) {
    return paymentsApi.getById(id);
  }

  async createPayment(payment: any) {
    return paymentsApi.create(payment);
  }

  async updatePayment(id: string, payment: any) {
    return paymentsApi.update(id, payment);
  }

  async deletePayment(id: string) {
    return paymentsApi.delete(id);
  }

  // Optimized customer filtering methods
  async getReceivablesByCustomer(customerName: string) {
    return receivablesApi.getAll(customerName);
  }

  async getCustomerSummaryOptimized(customerName: string) {
    // Get receivables for this customer only
    const { data: receivables } = await this.getReceivablesByCustomer(customerName);
    
    // Get all payments and filter by receivable IDs
    const { data: allPayments } = await this.getPayments();
    const receivableIds = receivables.map((r: any) => r.id);
    const payments = allPayments.filter((p: any) => receivableIds.includes(p.receivable_id));

    const totalReceivables = receivables.reduce((sum: number, r: any) => sum + r.amount, 0);
    const totalPaid = payments.reduce((sum: number, p: any) => sum + p.payment_amount, 0);
    const outstandingBalance = totalReceivables - totalPaid;
    const cities = [...new Set(receivables.map((r: any) => r.city))];

    return {
      name: customerName,
      receivables,
      payments,
      totalReceivables,
      totalPaid,
      outstandingBalance,
      cities,
    };
  }

  // Utility methods
  async getPaymentsByReceivable(receivableId: string) {
    const { data: payments } = await this.getPayments();
    return payments.filter((payment: any) => payment.receivable_id === receivableId);
  }

  async getCustomerSummary(customerName: string) {
    const { data: receivables } = await this.getReceivables();
    const { data: payments } = await this.getPayments();

    const customerReceivables = receivables.filter(
      (r: any) => r.customer_name === customerName
    );
    const receivableIds = customerReceivables.map((r: any) => r.id);
    const customerPayments = payments.filter((p: any) =>
      receivableIds.includes(p.receivable_id)
    );

    const totalReceivables = customerReceivables.reduce(
      (sum: number, r: any) => sum + r.amount,
      0
    );
    const totalPaid = customerPayments.reduce(
      (sum: number, p: any) => sum + p.payment_amount,
      0
    );
    const outstandingBalance = totalReceivables - totalPaid;
    const cities = [...new Set(customerReceivables.map((r: any) => r.city))];

    return {
      name: customerName,
      receivables,
      payments,
      totalReceivables,
      totalPaid,
      outstandingBalance,
      cities,
    };
  }

  async getAllCustomerSummaries() {
    const { data: receivables } = await this.getReceivables();
    const { data: payments } = await this.getPayments();

    // Group by customer name
    const customerMap = new Map<string, any>();

    receivables.forEach((receivable: any) => {
      const customerName = receivable.customer_name;
      if (!customerMap.has(customerName)) {
        customerMap.set(customerName, {
          name: customerName,
          receivables: [],
          payments: [],
          cities: new Set(),
        });
      }

      const customer = customerMap.get(customerName);
      customer.receivables.push(receivable);
      customer.cities.add(receivable.city);
    });

    payments.forEach((payment: any) => {
      const receivable = receivables.find((r: any) => r.id === payment.receivable_id);
      if (receivable) {
        const customerName = receivable.customer_name;
        if (customerMap.has(customerName)) {
          customerMap.get(customerName).payments.push(payment);
        }
      }
    });

    // Calculate summaries
    return Array.from(customerMap.values()).map((customer: any) => {
      const totalReceivables = customer.receivables.reduce(
        (sum: number, r: any) => sum + r.amount,
        0
      );
      const totalPaid = customer.payments.reduce(
        (sum: number, p: any) => sum + p.payment_amount,
        0
      );
      const outstandingBalance = totalReceivables - totalPaid;

      return {
        name: customer.name,
        receivables: customer.receivables,
        payments: customer.payments,
        totalReceivables,
        totalPaid,
        outstandingBalance,
        cities: Array.from(customer.cities),
      };
    });
  }
}

// Export a singleton instance
export const apiService = new ApiService();
