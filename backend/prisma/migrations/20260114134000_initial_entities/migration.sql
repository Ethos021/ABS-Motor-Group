-- CreateTable
CREATE TABLE `dealers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `dealers_city_idx`(`city`),
    INDEX `dealers_state_idx`(`state`),
    INDEX `dealers_country_idx`(`country`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vehicles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_date` DATETIME(3) NOT NULL,
    `created_by` INTEGER NULL,
    `vin` VARCHAR(191) NULL,
    `stock_number` VARCHAR(191) NULL,
    `make` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `badge` VARCHAR(191) NULL,
    `rego_num` VARCHAR(191) NULL,
    `price` DECIMAL(12, 2) NOT NULL,
    `special_price` DECIMAL(12, 2) NULL,
    `year` INTEGER NOT NULL,
    `odometer` INTEGER NULL,
    `mileage` INTEGER NULL,
    `status` ENUM('AVAILABLE', 'RESERVED', 'SOLD', 'IN_TRANSIT') NOT NULL DEFAULT 'AVAILABLE',
    `body` VARCHAR(191) NULL,
    `fuel_type` VARCHAR(191) NULL,
    `transmission` VARCHAR(191) NULL,
    `gear_type` VARCHAR(191) NULL,
    `gear_count` INTEGER NULL,
    `color` VARCHAR(191) NULL,
    `interior_colour` VARCHAR(191) NULL,
    `engine_size` VARCHAR(191) NULL,
    `drive` VARCHAR(191) NULL,
    `door_num` INTEGER NULL,
    `cylinders` INTEGER NULL,
    `power_kw` INTEGER NULL,
    `power_hp` INTEGER NULL,
    `standard_features` TEXT NULL,
    `optional_features` TEXT NULL,
    `adv_description` TEXT NULL,
    `short_description` TEXT NULL,
    `stock_type` VARCHAR(191) NULL,
    `is_demo` BOOLEAN NOT NULL DEFAULT false,
    `is_special` BOOLEAN NOT NULL DEFAULT false,
    `is_prestiged` BOOLEAN NOT NULL DEFAULT false,
    `is_used` BOOLEAN NOT NULL DEFAULT false,
    `is_dap` BOOLEAN NOT NULL DEFAULT false,
    `is_featured` BOOLEAN NOT NULL DEFAULT false,
    `stock_status` VARCHAR(191) NULL,
    `yard_code` VARCHAR(191) NULL,
    `series` VARCHAR(191) NULL,
    `nvic` VARCHAR(191) NULL,
    `redbook_code` VARCHAR(191) NULL,
    `rego_expiry` DATETIME(3) NULL,
    `build_date` DATETIME(3) NULL,
    `compliance_date` DATETIME(3) NULL,
    `video_link` VARCHAR(191) NULL,
    `images` JSON NULL,
    `sleeping_capacity` INTEGER NULL,
    `toilet` BOOLEAN NULL,
    `shower` BOOLEAN NULL,
    `air_conditioning` BOOLEAN NULL,
    `fridge` BOOLEAN NULL,
    `stereo` BOOLEAN NULL,
    `gps` BOOLEAN NULL,
    `serial_number` VARCHAR(191) NULL,
    `wheel_size` VARCHAR(191) NULL,
    `towball_weight` INTEGER NULL,
    `warranty` VARCHAR(191) NULL,
    `wheels` VARCHAR(191) NULL,
    `axle_configuration` VARCHAR(191) NULL,
    `gcm` INTEGER NULL,
    `gvm` INTEGER NULL,
    `tare` INTEGER NULL,
    `engine_number` VARCHAR(191) NULL,
    `engine_make` VARCHAR(191) NULL,
    `dealerId` INTEGER NULL,

    UNIQUE INDEX `vehicles_vin_key`(`vin`),
    UNIQUE INDEX `vehicles_stock_number_key`(`stock_number`),
    INDEX `vehicles_make_idx`(`make`),
    INDEX `vehicles_model_idx`(`model`),
    INDEX `vehicles_year_idx`(`year`),
    INDEX `vehicles_status_idx`(`status`),
    INDEX `vehicles_dealerId_idx`(`dealerId`),
    INDEX `vehicles_created_by_idx`(`created_by`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(191) NOT NULL,
    `last_name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `customers_email_key`(`email`),
    INDEX `customers_last_name_idx`(`last_name`),
    INDEX `customers_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sales` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `vehicleId` INTEGER NOT NULL,
    `customerId` INTEGER NOT NULL,
    `dealerId` INTEGER NULL,
    `sale_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `sale_price` DECIMAL(10, 2) NOT NULL,
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `sales_vehicleId_idx`(`vehicleId`),
    INDEX `sales_customerId_idx`(`customerId`),
    INDEX `sales_dealerId_idx`(`dealerId`),
    INDEX `sales_sale_date_idx`(`sale_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `enquiries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_date` DATETIME(3) NOT NULL,
    `created_by` INTEGER NULL,
    `enquiry_type` ENUM('vehicle_interest', 'test_drive', 'finance', 'trade_in', 'general', 'sell_vehicle') NOT NULL,
    `first_name` VARCHAR(191) NOT NULL,
    `last_name` VARCHAR(191) NOT NULL,
    `mobile` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `message` TEXT NULL,
    `has_tradein` BOOLEAN NOT NULL DEFAULT false,
    `trade_in_year` INTEGER NULL,
    `trade_in_make` VARCHAR(191) NULL,
    `trade_in_model` VARCHAR(191) NULL,
    `trade_in_odometer` INTEGER NULL,
    `wants_finance` BOOLEAN NOT NULL DEFAULT false,
    `wants_test_drive` BOOLEAN NOT NULL DEFAULT false,
    `vehicle_id` INTEGER NULL,
    `vehicle_details` VARCHAR(191) NULL,
    `vehicle_price` DECIMAL(12, 2) NULL,
    `vehicle_snapshot` JSON NULL,
    `finance_estimate` DECIMAL(12, 2) NULL,
    `preferred_contact_method` ENUM('phone', 'email', 'whatsapp') NULL,
    `preferred_contact_time` VARCHAR(191) NULL,
    `utm_source` VARCHAR(191) NULL,
    `utm_medium` VARCHAR(191) NULL,
    `utm_campaign` VARCHAR(191) NULL,
    `referrer` VARCHAR(191) NULL,
    `page_url` VARCHAR(191) NULL,
    `ip_address` VARCHAR(191) NULL,
    `status` ENUM('new', 'contacted', 'qualified', 'appointment_set', 'lost', 'closed_won', 'closed_lost') NOT NULL DEFAULT 'new',
    `priority` ENUM('low', 'medium', 'high', 'urgent') NOT NULL DEFAULT 'medium',
    `assigned_staff_id` INTEGER NULL,
    `contacted_at` DATETIME(3) NULL,
    `closed_at` DATETIME(3) NULL,
    `internal_notes` VARCHAR(191) NULL,

    INDEX `enquiries_enquiry_type_idx`(`enquiry_type`),
    INDEX `enquiries_vehicle_id_idx`(`vehicle_id`),
    INDEX `enquiries_assigned_staff_id_idx`(`assigned_staff_id`),
    INDEX `enquiries_status_idx`(`status`),
    INDEX `enquiries_priority_idx`(`priority`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `staff` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_date` DATETIME(3) NOT NULL,
    `created_by` INTEGER NULL,
    `full_name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `role` ENUM('SALES', 'FINANCE', 'MANAGER', 'SERVICE_ADVISOR') NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `availability_hours` JSON NULL,

    UNIQUE INDEX `staff_email_key`(`email`),
    INDEX `staff_role_idx`(`role`),
    INDEX `staff_is_active_idx`(`is_active`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `calendar_blocks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_date` DATETIME(3) NOT NULL,
    `created_by` INTEGER NULL,
    `title` VARCHAR(191) NOT NULL,
    `start_datetime` DATETIME(3) NOT NULL,
    `end_datetime` DATETIME(3) NOT NULL,
    `is_recurring` BOOLEAN NOT NULL DEFAULT false,
    `recurrence_pattern` ENUM('daily', 'weekly', 'monthly', 'yearly') NULL,
    `recurrence_end_date` DATETIME(3) NULL,
    `block_type` ENUM('holiday', 'meeting', 'maintenance', 'training', 'other') NOT NULL,
    `staff_id` INTEGER NULL,
    `notes` VARCHAR(191) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    INDEX `calendar_blocks_block_type_idx`(`block_type`),
    INDEX `calendar_blocks_staff_id_idx`(`staff_id`),
    INDEX `calendar_blocks_is_active_idx`(`is_active`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bookings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_date` DATETIME(3) NOT NULL,
    `created_by` INTEGER NULL,
    `enquiry_id` INTEGER NULL,
    `booking_type` ENUM('test_drive', 'inspection', 'finance_meeting', 'delivery', 'consultation') NOT NULL,
    `scheduled_datetime` DATETIME(3) NOT NULL,
    `duration_minutes` INTEGER NULL,
    `staff_id` INTEGER NULL,
    `vehicle_id` INTEGER NULL,
    `vehicle_snapshot` JSON NULL,
    `customer_name` VARCHAR(191) NULL,
    `customer_email` VARCHAR(191) NULL,
    `customer_phone` VARCHAR(191) NULL,
    `status` ENUM('pending', 'confirmed', 'completed', 'cancelled', 'no_show') NOT NULL DEFAULT 'pending',
    `confirmation_sent` BOOLEAN NOT NULL DEFAULT false,
    `reminder_sent` BOOLEAN NOT NULL DEFAULT false,
    `notes` VARCHAR(191) NULL,
    `customer_notes` VARCHAR(191) NULL,
    `cancellation_reason` VARCHAR(191) NULL,
    `cancelled_at` DATETIME(3) NULL,

    INDEX `bookings_enquiry_id_idx`(`enquiry_id`),
    INDEX `bookings_staff_id_idx`(`staff_id`),
    INDEX `bookings_vehicle_id_idx`(`vehicle_id`),
    INDEX `bookings_booking_type_idx`(`booking_type`),
    INDEX `bookings_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_date` DATETIME(3) NOT NULL,
    `created_by` INTEGER NULL,
    `full_name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',

    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `users_role_idx`(`role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `vehicles` ADD CONSTRAINT `vehicles_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vehicles` ADD CONSTRAINT `vehicles_dealerId_fkey` FOREIGN KEY (`dealerId`) REFERENCES `dealers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sales` ADD CONSTRAINT `sales_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sales` ADD CONSTRAINT `sales_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sales` ADD CONSTRAINT `sales_dealerId_fkey` FOREIGN KEY (`dealerId`) REFERENCES `dealers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `enquiries` ADD CONSTRAINT `enquiries_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `enquiries` ADD CONSTRAINT `enquiries_vehicle_id_fkey` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `enquiries` ADD CONSTRAINT `enquiries_assigned_staff_id_fkey` FOREIGN KEY (`assigned_staff_id`) REFERENCES `staff`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `staff` ADD CONSTRAINT `staff_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `calendar_blocks` ADD CONSTRAINT `calendar_blocks_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `calendar_blocks` ADD CONSTRAINT `calendar_blocks_staff_id_fkey` FOREIGN KEY (`staff_id`) REFERENCES `staff`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_enquiry_id_fkey` FOREIGN KEY (`enquiry_id`) REFERENCES `enquiries`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_staff_id_fkey` FOREIGN KEY (`staff_id`) REFERENCES `staff`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_vehicle_id_fkey` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

