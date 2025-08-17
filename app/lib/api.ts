// API service for client-side operations
export class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = '/api';
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`API returned non-JSON response. Status: ${response.status}. Check server logs.`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error: any) {
      throw error;
    }
  }

  // Receivables API methods
  async getReceivables() {
    return this.request<{ data: any[] }>('/receivables');
  }

  async getReceivable(id: string) {
    return this.request<{ data: any }>(`/receivables/${id}`);
  }

  async createReceivable(receivable: any) {
    return this.request<{ data: any }>('/receivables', {
      method: 'POST',
      body: JSON.stringify(receivable),
    });
  }

  async updateReceivable(id: string, receivable: any) {
    return this.request<{ data: any }>(`/receivables/${id}`, {
      method: 'PUT',
      body: JSON.stringify(receivable),
    });
  }

  async deleteReceivable(id: string) {
    return this.request<{ message: string }>(`/receivables/${id}`, {
      method: 'DELETE',
    });
  }

  // Payments API methods
  async getPayments() {
    return this.request<{ data: any[] }>('/payments');
  }

  async getPayment(id: string) {
    return this.request<{ data: any }>(`/payments/${id}`);
  }

  async createPayment(payment: any) {
    return this.request<{ data: any }>('/payments', {
      method: 'POST',
      body: JSON.stringify(payment),
    });
  }

  async updatePayment(id: string, payment: any) {
    return this.request<{ data: any }>(`/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payment),
    });
  }

  async deletePayment(id: string) {
    return this.request<{ message: string }>(`/payments/${id}`, {
      method: 'DELETE',
    });
  }

  // Optimized customer filtering methods
  async getReceivablesByCustomer(customerName: string) {
    return this.request<{ data: any[] }>(`/receivables?customer=${encodeURIComponent(customerName)}`);
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
      receivables: customerReceivables,
      payments: customerPayments,
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
