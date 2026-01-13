-- Create database schema for ABS Motor Group
-- Run this script to initialize the database

-- User Entity (Built-in authentication)
CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_by CHAR(36),
    CONSTRAINT chk_user_role CHECK (role IN ('admin', 'user')),
    CONSTRAINT fk_user_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Staff Entity
CREATE TABLE IF NOT EXISTS staff (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by CHAR(36),
    
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    availability_hours JSON,
    CONSTRAINT chk_staff_role CHECK (role IN ('Sales', 'Finance', 'Manager', 'Service Advisor')),
    CONSTRAINT fk_staff_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Enquiry Entity
CREATE TABLE IF NOT EXISTS enquiries (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by CHAR(36),
    
    -- Enquiry Type & Basic Info
    enquiry_type VARCHAR(50) NOT NULL,
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
    vehicleId CHAR(36),
    vehicleDetails TEXT,
    vehiclePrice DECIMAL(10, 2),
    vehicleSnapshot JSON,
    financeEstimate JSON,
    
    -- Contact Preferences
    preferredContactMethod VARCHAR(50),
    preferredContactTime VARCHAR(100),
    
    -- Tracking & Attribution
    utmSource VARCHAR(255),
    utmMedium VARCHAR(255),
    utmCampaign VARCHAR(255),
    referrer TEXT,
    pageUrl TEXT,
    ipAddress VARCHAR(45),
    
    -- Status & Management
    status VARCHAR(50) DEFAULT 'new',
    priority VARCHAR(50) DEFAULT 'medium',
    assignedStaffId CHAR(36),
    contactedAt TIMESTAMP NULL,
    closedAt TIMESTAMP NULL,
    internalNotes TEXT,
    CONSTRAINT chk_enquiry_type CHECK (enquiry_type IN ('vehicle_interest', 'test_drive', 'finance', 'trade_in', 'general', 'sell_vehicle')),
    CONSTRAINT chk_enquiry_contact_method CHECK (preferredContactMethod IS NULL OR preferredContactMethod IN ('phone', 'email', 'whatsapp')),
    CONSTRAINT chk_enquiry_status CHECK (status IN ('new', 'contacted', 'qualified', 'appointment_set', 'lost', 'closed_won', 'closed_lost')),
    CONSTRAINT chk_enquiry_priority CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    CONSTRAINT fk_enquiry_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_enquiry_staff FOREIGN KEY (assignedStaffId) REFERENCES staff(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CalendarBlock Entity
CREATE TABLE IF NOT EXISTS calendar_blocks (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by CHAR(36),
    
    title VARCHAR(255) NOT NULL,
    start_datetime TIMESTAMP NOT NULL,
    end_datetime TIMESTAMP NOT NULL,
    
    -- Recurrence
    is_recurring BOOLEAN DEFAULT false,
    recurrence_pattern VARCHAR(50),
    recurrence_end_date TIMESTAMP NULL,
    
    -- Block Details
    block_type VARCHAR(50) NOT NULL,
    staff_id CHAR(36),
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    CONSTRAINT chk_calendar_recurrence CHECK (recurrence_pattern IS NULL OR recurrence_pattern IN ('daily', 'weekly', 'monthly', 'yearly')),
    CONSTRAINT chk_calendar_block_type CHECK (block_type IN ('holiday', 'meeting', 'maintenance', 'training', 'other')),
    CONSTRAINT fk_calendar_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_calendar_staff FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Booking Entity
CREATE TABLE IF NOT EXISTS bookings (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by CHAR(36),
    
    enquiry_id CHAR(36),
    booking_type VARCHAR(50) NOT NULL,
    
    -- Schedule
    scheduled_datetime TIMESTAMP NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    
    -- Assignments
    staff_id CHAR(36),
    vehicle_id CHAR(36),
    vehicle_snapshot JSON,
    
    -- Customer Info
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(50),
    
    -- Status & Communication
    status VARCHAR(50) DEFAULT 'pending',
    confirmation_sent BOOLEAN DEFAULT false,
    reminder_sent BOOLEAN DEFAULT false,
    
    -- Notes
    notes TEXT,
    customer_notes TEXT,
    cancellation_reason TEXT,
    cancelled_at TIMESTAMP NULL,
    CONSTRAINT chk_booking_type CHECK (booking_type IN ('test_drive', 'inspection', 'finance_meeting', 'delivery', 'consultation')),
    CONSTRAINT chk_booking_status CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
    CONSTRAINT fk_booking_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_booking_enquiry FOREIGN KEY (enquiry_id) REFERENCES enquiries(id) ON DELETE SET NULL,
    CONSTRAINT fk_booking_staff FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create indexes for better query performance
CREATE INDEX idx_enquiries_status ON enquiries(status);
CREATE INDEX idx_enquiries_type ON enquiries(enquiry_type);
CREATE INDEX idx_enquiries_assigned_staff ON enquiries(assignedStaffId);
CREATE INDEX idx_enquiries_created_date ON enquiries(created_date);
CREATE INDEX idx_enquiries_email ON enquiries(email);

CREATE INDEX idx_staff_email ON staff(email);
CREATE INDEX idx_staff_role ON staff(role);
CREATE INDEX idx_staff_active ON staff(is_active);

CREATE INDEX idx_calendar_blocks_staff ON calendar_blocks(staff_id);
CREATE INDEX idx_calendar_blocks_dates ON calendar_blocks(start_datetime, end_datetime);
CREATE INDEX idx_calendar_blocks_active ON calendar_blocks(is_active);

CREATE INDEX idx_bookings_enquiry ON bookings(enquiry_id);
CREATE INDEX idx_bookings_staff ON bookings(staff_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_datetime ON bookings(scheduled_datetime);
CREATE INDEX idx_bookings_email ON bookings(customer_email);

CREATE INDEX idx_users_email ON users(email);
