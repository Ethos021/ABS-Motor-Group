const clone = (value) => JSON.parse(JSON.stringify(value));
const generateId = (prefix = "item") => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

const sortItems = (items, sortField) => {
  if (!sortField) return items;
  const desc = sortField.startsWith("-");
  const key = desc ? sortField.slice(1) : sortField;

  return items.sort((a, b) => {
    const aVal = a?.[key];
    const bVal = b?.[key];

    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return 1;
    if (bVal == null) return -1;

    if (aVal === bVal) return 0;
    return (aVal > bVal ? 1 : -1) * (desc ? -1 : 1);
  });
};

const createStore = (initialData, { defaults = {} } = {}) => {
  let records = clone(initialData);

  return {
    list: async (sortField) => {
      const items = sortItems(clone(records), sortField);
      return items;
    },
    create: async (data = {}) => {
      const record = {
        ...clone(defaults),
        ...clone(data),
        id: data.id || generateId("item"),
        created_date: data.created_date || new Date().toISOString(),
      };
      records.push(record);
      return clone(record);
    },
    update: async (id, updates = {}) => {
      const index = records.findIndex((item) => item.id === id);
      if (index === -1) return null;
      records[index] = { ...records[index], ...clone(updates) };
      return clone(records[index]);
    },
    delete: async (id) => {
      records = records.filter((item) => item.id !== id);
      return true;
    },
  };
};

const vehicleSeed = [
  {
    id: "veh-001",
    make: "BMW",
    model: "M4 Competition",
    year: 2022,
    price: 154990,
    kilometers: 12000,
    fuel_type: "Petrol",
    transmission: "Automatic",
    body_type: "Coupe",
    drivetrain: "RWD",
    engine: "3.0L Twin-Turbo I6",
    exterior_color: "Brooklyn Grey",
    interior_color: "Merino Black Leather",
    badges: ["Low KMs", "One Owner", "BMW Service Plan"],
    features: [
      "Harman Kardon surround sound",
      "Adaptive M suspension",
      "Heated seats",
      "Head-up display",
      "360° camera",
    ],
    description: "Immaculate M4 Competition finished in Brooklyn Grey with full BMW service history.",
    images: [
      "https://images.unsplash.com/photo-1511910849309-0dffb8785146?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=900&auto=format&fit=crop",
    ],
    created_date: "2024-11-02T10:00:00.000Z",
  },
  {
    id: "veh-002",
    make: "Mercedes-Benz",
    model: "G63 AMG",
    year: 2021,
    price: 339990,
    kilometers: 22000,
    fuel_type: "Petrol",
    transmission: "Automatic",
    body_type: "SUV",
    drivetrain: "AWD",
    engine: "4.0L Bi-Turbo V8",
    exterior_color: "Obsidian Black",
    interior_color: "Designo Nappa Red/Black",
    badges: ["Manufacturer Warranty", "Recent Service", "Matte Package"],
    features: [
      "Burmester surround sound",
      "Night Package",
      "Heated & cooled seats",
      "Adaptive cruise control",
      "Digital cockpit",
    ],
    description: "Iconic G63 AMG with Designo interior and Night Package. Presents as new.",
    images: [
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=1200&auto=format&fit=crop",
    ],
    created_date: "2024-12-15T09:30:00.000Z",
  },
  {
    id: "veh-003",
    make: "Porsche",
    model: "911 Carrera 4S",
    year: 2020,
    price: 299990,
    kilometers: 18000,
    fuel_type: "Petrol",
    transmission: "PDK",
    body_type: "Coupe",
    drivetrain: "AWD",
    engine: "3.0L Twin-Turbo Flat-6",
    exterior_color: "Chalk",
    interior_color: "Black Leather",
    badges: ["Sport Chrono", "Glass Roof", "Porsche Approved"],
    features: [
      "Sport Chrono Package",
      "Rear-axle steering",
      "Bose audio",
      "Adaptive sports seats",
      "PDCC",
    ],
    description: "Well-optioned 992 Carrera 4S in Chalk with Sport Chrono and Bose audio.",
    images: [
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=1100&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=1000&auto=format&fit=crop",
    ],
    created_date: "2024-10-20T13:45:00.000Z",
  },
];

const staffSeed = [
  {
    id: "staff-001",
    full_name: "Alex Bennett",
    email: "alex.bennett@absmotorgroup.com",
    phone: "+61 400 000 111",
    role: "Sales",
    is_active: true,
    created_date: "2024-08-12T09:00:00.000Z",
  },
  {
    id: "staff-002",
    full_name: "Mia Clarke",
    email: "mia.clarke@absmotorgroup.com",
    phone: "+61 400 000 222",
    role: "Finance",
    is_active: true,
    created_date: "2024-08-18T11:30:00.000Z",
  },
];

const enquirySeed = [
  {
    id: "enq-001",
    firstName: "Jordan",
    lastName: "Lee",
    email: "jordan.lee@example.com",
    mobile: "+61 412 555 987",
    enquiry_type: "vehicle_interest",
    status: "new",
    vehicleDetails: "BMW M4 Competition",
    message: "Hi team, can I book a time to view the M4 this weekend?",
    created_date: "2024-12-01T08:00:00.000Z",
  },
];

const calendarSeed = [
  {
    id: "cal-001",
    title: "Public Holiday",
    start_datetime: "2025-01-27T00:00:00.000Z",
    end_datetime: "2025-01-27T23:59:59.000Z",
    is_recurring: false,
    recurrence_pattern: "none",
    block_type: "holiday",
    notes: "Australia Day observed",
    is_active: true,
    created_date: "2024-12-10T10:00:00.000Z",
  },
];

const bookingSeed = [
  {
    id: "book-001",
    booking_type: "test_drive",
    scheduled_datetime: "2025-01-15T10:00:00.000Z",
    customer_name: "Samantha Grey",
    customer_phone: "+61 477 000 333",
    customer_email: "s.grey@example.com",
    duration_minutes: 60,
    status: "confirmed",
    created_date: "2024-12-05T09:00:00.000Z",
  },
];

const vehicleStore = createStore(vehicleSeed);
const staffStore = createStore(staffSeed);
const enquiryStore = createStore(enquirySeed, { defaults: { status: "new" } });
const calendarStore = createStore(calendarSeed, { defaults: { is_active: true } });
const bookingStore = createStore(bookingSeed, { defaults: { status: "pending" } });

export const localApi = {
  entities: {
    Vehicle: vehicleStore,
    Enquiry: enquiryStore,
    Staff: staffStore,
    CalendarBlock: calendarStore,
    Booking: bookingStore,
  },
  auth: {
    me: async () => ({
      id: "local-admin",
      role: "admin",
      email: "admin@absmotorgroup.com",
      name: "ABS Admin",
    }),
  },
  integrations: {
    Core: {},
  },
};
