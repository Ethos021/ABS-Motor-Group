import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@absmotorgroup.com' },
    update: {},
    create: {
      email: 'admin@absmotorgroup.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isActive: true,
    },
  });
  console.log('✓ Created admin user:', admin.email);

  // Create staff user
  const staffPassword = await bcrypt.hash('staff123', 10);
  const staff = await prisma.user.upsert({
    where: { email: 'staff@absmotorgroup.com' },
    update: {},
    create: {
      email: 'staff@absmotorgroup.com',
      password: staffPassword,
      firstName: 'Staff',
      lastName: 'Member',
      role: 'staff',
      isActive: true,
    },
  });
  console.log('✓ Created staff user:', staff.email);

  // Create staff members
  const staffMember1 = await prisma.staff.upsert({
    where: { email: 'john.doe@absmotorgroup.com' },
    update: {},
    create: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@absmotorgroup.com',
      phone: '+61 400 123 456',
      position: 'Sales Manager',
      department: 'sales',
      isActive: true,
      startDate: new Date('2020-01-15'),
      bio: 'Experienced sales manager with over 10 years in the automotive industry.',
    },
  });
  console.log('✓ Created staff member:', staffMember1.email);

  const staffMember2 = await prisma.staff.upsert({
    where: { email: 'jane.smith@absmotorgroup.com' },
    update: {},
    create: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@absmotorgroup.com',
      phone: '+61 400 234 567',
      position: 'Finance Specialist',
      department: 'finance',
      isActive: true,
      startDate: new Date('2021-03-20'),
      bio: 'Expert in automotive financing solutions.',
    },
  });
  console.log('✓ Created staff member:', staffMember2.email);

  // Create sample vehicles
  const vehicles = [
    {
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
      price: 32000.00,
      mileage: 15000,
      bodyType: 'Sedan',
      fuelType: 'Petrol',
      transmission: 'Automatic',
      color: 'Silver',
      engineSize: '2.5L',
      doors: 4,
      seats: 5,
      description: 'Well-maintained Toyota Camry with full service history. One owner vehicle.',
      features: JSON.stringify(['Bluetooth', 'Cruise Control', 'Backup Camera', 'Lane Assist']),
      status: 'available',
      isFeatured: true,
    },
    {
      make: 'BMW',
      model: 'X5',
      year: 2021,
      price: 68000.00,
      mileage: 22000,
      bodyType: 'SUV',
      fuelType: 'Diesel',
      transmission: 'Automatic',
      color: 'Black',
      engineSize: '3.0L',
      doors: 5,
      seats: 7,
      description: 'Luxury SUV with premium features and exceptional performance.',
      features: JSON.stringify(['Leather Seats', 'Navigation', 'Sunroof', 'Parking Sensors', 'Apple CarPlay']),
      status: 'available',
      isFeatured: true,
    },
    {
      make: 'Mercedes-Benz',
      model: 'C-Class',
      year: 2023,
      price: 55000.00,
      mileage: 5000,
      bodyType: 'Sedan',
      fuelType: 'Petrol',
      transmission: 'Automatic',
      color: 'White',
      engineSize: '2.0L',
      doors: 4,
      seats: 5,
      description: 'Nearly new Mercedes C-Class with manufacturer warranty.',
      features: JSON.stringify(['Premium Sound', 'LED Headlights', 'Heated Seats', 'Keyless Entry']),
      status: 'available',
      isFeatured: false,
    },
    {
      make: 'Honda',
      model: 'Civic',
      year: 2020,
      price: 24000.00,
      mileage: 35000,
      bodyType: 'Sedan',
      fuelType: 'Petrol',
      transmission: 'Manual',
      color: 'Blue',
      engineSize: '1.8L',
      doors: 4,
      seats: 5,
      description: 'Reliable and economical Honda Civic in excellent condition.',
      features: JSON.stringify(['Bluetooth', 'USB Connectivity', 'Air Conditioning']),
      status: 'available',
      isFeatured: false,
    },
    {
      make: 'Ford',
      model: 'Ranger',
      year: 2022,
      price: 48000.00,
      mileage: 18000,
      bodyType: 'Ute',
      fuelType: 'Diesel',
      transmission: 'Automatic',
      color: 'Red',
      engineSize: '3.2L',
      doors: 4,
      seats: 5,
      description: 'Powerful work horse with excellent towing capacity.',
      features: JSON.stringify(['4WD', 'Tow Bar', 'Bull Bar', 'Sat Nav', 'Roof Rack']),
      status: 'available',
      isFeatured: true,
    },
  ];

  for (const vehicleData of vehicles) {
    const vehicle = await prisma.vehicle.create({
      data: vehicleData,
    });
    console.log(`✓ Created vehicle: ${vehicle.make} ${vehicle.model}`);
  }

  console.log('Database seeding completed successfully!');
  console.log('\n=== Default Credentials ===');
  console.log('Admin: admin@absmotorgroup.com / admin123');
  console.log('Staff: staff@absmotorgroup.com / staff123');
  console.log('===========================\n');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
