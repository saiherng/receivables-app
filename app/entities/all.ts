export interface Receivable {
  id: string;
  customer_name: string;
  amount: number;
  date: string;
  due_date: string;
  description: string;
  city: string;
  status: 'pending' | 'paid' | 'overdue';
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  receivable_id: string;
  payment_amount: number;
  payment_date: string;
  payment_type: 'cash' | 'check' | 'bank_transfer' | 'credit_card';
  reference_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Mock data storage (in a real app, this would be a database)
class MockStorage {
  private receivables: Receivable[] = [];
  private payments: Payment[] = [];

  // Receivable methods
  async getAll(): Promise<Receivable[]> {
    return this.receivables;
  }

  async create(data: Omit<Receivable, 'id' | 'created_at' | 'updated_at'>): Promise<Receivable> {
    const receivable: Receivable = {
      ...data,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.receivables.push(receivable);
    return receivable;
  }

  async update(id: string, data: Partial<Receivable>): Promise<Receivable> {
    const index = this.receivables.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Receivable not found');
    
    this.receivables[index] = {
      ...this.receivables[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    return this.receivables[index];
  }

  async delete(id: string): Promise<void> {
    const index = this.receivables.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Receivable not found');
    this.receivables.splice(index, 1);
  }

  // Payment methods
  async getAllPayments(): Promise<Payment[]> {
    return this.payments;
  }

  async createPayment(data: Omit<Payment, 'id' | 'created_at' | 'updated_at'>): Promise<Payment> {
    const payment: Payment = {
      ...data,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.payments.push(payment);
    return payment;
  }

  async updatePayment(id: string, data: Partial<Payment>): Promise<Payment> {
    const index = this.payments.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Payment not found');
    
    this.payments[index] = {
      ...this.payments[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    return this.payments[index];
  }

  async deletePayment(id: string): Promise<void> {
    const index = this.payments.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Payment not found');
    this.payments.splice(index, 1);
  }
}

const storage = new MockStorage();

export const Receivable = {
  getAll: () => storage.getAll(),
  create: (data: Omit<Receivable, 'id' | 'created_at' | 'updated_at'>) => storage.create(data),
  update: (id: string, data: Partial<Receivable>) => storage.update(id, data),
  delete: (id: string) => storage.delete(id),
};

export const Payment = {
  getAll: () => storage.getAllPayments(),
  create: (data: Omit<Payment, 'id' | 'created_at' | 'updated_at'>) => storage.createPayment(data),
  update: (id: string, data: Partial<Payment>) => storage.updatePayment(id, data),
  delete: (id: string) => storage.deletePayment(id),
};
