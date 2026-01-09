-- Create database schema for ABS Motor Group
-- Run this script to initialize the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Entity (Built-in authentication)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    created_by UUID REFERENCES users(id)
);

-- Staff Entity
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) NOT NULL CHECK (role IN ('Sales', 'Finance', 'Manager', 'Service Advisor')),
    is_active BOOLEAN DEFAULT true,
    availability_hours JSONB
);

-- Enquiry Entity
CREATE TABLE IF NOT EXISTS enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    
    -- Enquiry Type & Basic Info
    enquiry_type VARCHAR(50) NOT NULL CHECK (enquiry_type IN ('vehicle_interest', 'test_drive', 'finance', 'trade_in', 'general', 'sell_vehicle')),
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    mobile VARCHAR(50),
    email VARCHAR(255) NOT NULL,
    message TEXT,
    
    -- Trade-in Details
    hasTradein BOOLEAN DEFAULT false,
    tradeInYear VARCHAR(4),
    tradeInMake VARCHAR(100),
    tradeInModel VARCHAR(100),
    tradeInOdometer INTEGER,
    
    -- Preferences
    wantsFinance BOOLEAN DEFAULT false,
    wantsTestDrive BOOLEAN DEFAULT false,
    
    -- Vehicle Details
    vehicleId UUID,
    vehicleDetails TEXT,
    vehiclePrice DECIMAL(10, 2),
    vehicleSnapshot JSONB,
    financeEstimate JSONB,
    
    -- Contact Preferences
    preferredContactMethod VARCHAR(50) CHECK (preferredContactMethod IN ('phone', 'email', 'whatsapp')),
    preferredContactTime VARCHAR(100),
    
    -- Tracking & Attribution
    utmSource VARCHAR(255),
    utmMedium VARCHAR(255),
    utmCampaign VARCHAR(255),
    referrer TEXT,
    pageUrl TEXT,
    ipAddress VARCHAR(45),
    
    -- Status & Management
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'appointment_set', 'lost', 'closed_won', 'closed_lost')),
    priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    assignedStaffId UUID REFERENCES staff(id),
    contactedAt TIMESTAMP,
    closedAt TIMESTAMP,
    internalNotes TEXT
);

-- CalendarBlock Entity
CREATE TABLE IF NOT EXISTS calendar_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    
    title VARCHAR(255) NOT NULL,
    start_datetime TIMESTAMP NOT NULL,
    end_datetime TIMESTAMP NOT NULL,
    
    -- Recurrence
    is_recurring BOOLEAN DEFAULT false,
    recurrence_pattern VARCHAR(50) CHECK (recurrence_pattern IN ('daily', 'weekly', 'monthly', 'yearly')),
    recurrence_end_date TIMESTAMP,
    
    -- Block Details
    block_type VARCHAR(50) NOT NULL CHECK (block_type IN ('holiday', 'meeting', 'maintenance', 'training', 'other')),
    staff_id UUID REFERENCES staff(id),
    notes TEXT,
    is_active BOOLEAN DEFAULT true
);

-- Booking Entity
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    
    enquiry_id UUID REFERENCES enquiries(id),
    booking_type VARCHAR(50) NOT NULL CHECK (booking_type IN ('test_drive', 'inspection', 'finance_meeting', 'delivery', 'consultation')),
    
    -- Schedule
    scheduled_datetime TIMESTAMP NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    
    -- Assignments
    staff_id UUID REFERENCES staff(id),
    vehicle_id UUID,
    vehicle_snapshot JSONB,
    
    -- Customer Info
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(50),
    
    -- Status & Communication
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
    confirmation_sent BOOLEAN DEFAULT false,
    reminder_sent BOOLEAN DEFAULT false,
    
    -- Notes
    notes TEXT,
    customer_notes TEXT,
    cancellation_reason TEXT,
    cancelled_at TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_type ON enquiries(enquiry_type);
CREATE INDEX IF NOT EXISTS idx_enquiries_assigned_staff ON enquiries(assignedStaffId);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_date ON enquiries(created_date);
CREATE INDEX IF NOT EXISTS idx_enquiries_email ON enquiries(email);

CREATE INDEX IF NOT EXISTS idx_staff_email ON staff(email);
CREATE INDEX IF NOT EXISTS idx_staff_role ON staff(role);
CREATE INDEX IF NOT EXISTS idx_staff_active ON staff(is_active);

CREATE INDEX IF NOT EXISTS idx_calendar_blocks_staff ON calendar_blocks(staff_id);
CREATE INDEX IF NOT EXISTS idx_calendar_blocks_dates ON calendar_blocks(start_datetime, end_datetime);
CREATE INDEX IF NOT EXISTS idx_calendar_blocks_active ON calendar_blocks(is_active);

CREATE INDEX IF NOT EXISTS idx_bookings_enquiry ON bookings(enquiry_id);
CREATE INDEX IF NOT EXISTS idx_bookings_staff ON bookings(staff_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_datetime ON bookings(scheduled_datetime);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(customer_email);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create triggers for updated_date
CREATE OR REPLACE FUNCTION update_updated_date_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_date = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_date BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();

CREATE TRIGGER update_staff_updated_date BEFORE UPDATE ON staff
    FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();

CREATE TRIGGER update_enquiries_updated_date BEFORE UPDATE ON enquiries
    FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();

CREATE TRIGGER update_calendar_blocks_updated_date BEFORE UPDATE ON calendar_blocks
    FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();

CREATE TRIGGER update_bookings_updated_date BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();
