-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create receivables table
CREATE TABLE IF NOT EXISTS receivables (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    customer_name TEXT NOT NULL,
    amount DECIMAL(15,2) NOT NULL CHECK (amount >= 0),
    city TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    receivable_id UUID NOT NULL REFERENCES receivables(id) ON DELETE CASCADE,
    payment_date DATE NOT NULL,
    payment_amount DECIMAL(15,2) NOT NULL CHECK (payment_amount >= 0),
    payment_type TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customers table (optional - for future use)
CREATE TABLE IF NOT EXISTS customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    cities TEXT[] DEFAULT '{}',
    total_receivables DECIMAL(15,2) DEFAULT 0,
    total_paid DECIMAL(15,2) DEFAULT 0,
    outstanding_balance DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, name)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_receivables_user_id ON receivables(user_id);
CREATE INDEX IF NOT EXISTS idx_receivables_customer_name ON receivables(customer_name);
CREATE INDEX IF NOT EXISTS idx_receivables_date ON receivables(date);
CREATE INDEX IF NOT EXISTS idx_receivables_city ON receivables(city);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_receivable_id ON payments(receivable_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_date ON payments(payment_date);
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(name);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_receivables_updated_at 
    BEFORE UPDATE ON receivables 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at 
    BEFORE UPDATE ON payments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at 
    BEFORE UPDATE ON customers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS (Row Level Security)
ALTER TABLE receivables ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for authenticated users
-- Users can only see and modify their own data

-- Receivables policies
CREATE POLICY "Users can view their own receivables" ON receivables
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own receivables" ON receivables
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own receivables" ON receivables
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own receivables" ON receivables
    FOR DELETE USING (auth.uid() = user_id);

-- Payments policies
CREATE POLICY "Users can view their own payments" ON payments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payments" ON payments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payments" ON payments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payments" ON payments
    FOR DELETE USING (auth.uid() = user_id);

-- Customers policies
CREATE POLICY "Users can view their own customers" ON customers
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own customers" ON customers
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own customers" ON customers
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own customers" ON customers
    FOR DELETE USING (auth.uid() = user_id);

-- Function to automatically set user_id on insert
CREATE OR REPLACE FUNCTION set_user_id()
RETURNS TRIGGER AS $$
BEGIN
    NEW.user_id = auth.uid();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically set user_id
CREATE TRIGGER set_receivables_user_id
    BEFORE INSERT ON receivables
    FOR EACH ROW EXECUTE FUNCTION set_user_id();

CREATE TRIGGER set_payments_user_id
    BEFORE INSERT ON payments
    FOR EACH ROW EXECUTE FUNCTION set_user_id();

CREATE TRIGGER set_customers_user_id
    BEFORE INSERT ON customers
    FOR EACH ROW EXECUTE FUNCTION set_user_id();

-- Insert sample data for testing (optional)
-- Note: This will only work if you have a test user created
-- You can remove this section in production
