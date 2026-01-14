import { PrismaClient, VehicleStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with demo data...");

  const dealer = await prisma.dealer.upsert({
  where: { id: 1 },     // use the unique primary key
  update: {},
  create: {
    id: 1,              // ensure this id is used on first insert
    name: "ABS Motor Group Main",
    email: "info@absmotorgroup.com",
    phone: "+61 400 123 456",
    address: "123 Example Street",
    city: "Melbourne",
    state: "VIC",
    country: "Australia",
  },
});

  const customers = await prisma.$transaction([
    prisma.customer.upsert({
      where: { email: "alex@example.com" },
      update: {},
      create: {
        firstName: "Alex",
        lastName: "Johnson",
        email: "alex@example.com",
        phone: "+61 410 000 111",
      },
    }),
    prisma.customer.upsert({
      where: { email: "sarah@example.com" },
      update: {},
      create: {
        firstName: "Sarah",
        lastName: "Lee",
        email: "sarah@example.com",
        phone: "+61 410 000 222",
      },
    }),
  ]);

  const vehicles = await prisma.$transaction([
    prisma.vehicle.upsert({
      where: { vin: "VIN-DEMO-001" },
      update: {},
      create: {
        vin: "VIN-DEMO-001",
        make: "Toyota",
        model: "Camry",
        year: 2022,
        price: 32000,
        mileage: 15000,
        color: "Silver",
        status: VehicleStatus.AVAILABLE,
        dealerId: dealer.id,
      },
    }),
    prisma.vehicle.upsert({
      where: { vin: "VIN-DEMO-002" },
      update: {},
      create: {
        vin: "VIN-DEMO-002",
        make: "BMW",
        model: "X5",
        year: 2021,
        price: 68000,
        mileage: 22000,
        color: "Black",
        status: VehicleStatus.RESERVED,
        dealerId: dealer.id,
      },
    }),
  ]);

  await prisma.sale.upsert({
    where: { id: 1 },
    update: {},
    create: {
      vehicleId: vehicles[0].id,
      customerId: customers[0].id,
      dealerId: dealer.id,
      salePrice: 31500,
      saleDate: new Date(),
      notes: "Demo sale record",
    },
  });

  console.log("✓ Seed data created");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
