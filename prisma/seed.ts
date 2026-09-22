import { PrismaClient, Role, StockStatus, OrderType, OrderStatus, PaymentMethod, PaymentStatus, QuoteStatus, CourierCode, ShipmentStatus, InventoryTransactionType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting Alpha Tech deterministic database seed...');

  // ==========================================
  // 1. SITE & DOMAIN SETTINGS
  // ==========================================
  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      brandName: 'ALPHA TECH',
      supportEmail: 'contact@alphatech.pk',
      supportPhone: '+92 51 8449210',
      whatsappNumber: '+923008541299',
      address: 'Plot 12-B, Industrial Area, Sector I-9/2, Islamabad, Pakistan',
      currency: 'PKR',
      lowStockThresholdDefault: 5,
      socialLinks: {
        linkedin: 'https://linkedin.com/company/alphatech-pk',
        youtube: 'https://youtube.com/@alphatechpk',
      },
    },
  });

  await prisma.paymentSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      codEnabled: true,
      codMaxAmount: 50000,
      bankTransferEnabled: true,
      bankName: 'Meezan Bank Limited',
      bankAccountTitle: 'ALPHA TECH ENGINEERING (PVT) LTD',
      bankIban: 'PK45MEZN0001892048192019',
      jazzcashEnabled: true,
      jazzcashNumber: '0300-8541299',
      easypaisaEnabled: true,
      easypaisaNumber: '0345-8541299',
      cardEnabled: false,
    },
  });

  await prisma.shippingSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      defaultOriginCity: 'Lahore',
      defaultShippingFee: 350,
      freeShippingThreshold: 15000,
      expressDeliveryFee: 650,
      codAllowed: true,
    },
  });

  // ==========================================
  // 2. COURIERS
  // ==========================================
  const couriers = [
    { code: CourierCode.TCS, name: 'TCS Express', trackingUrlTemplate: 'https://www.tcsexpress.com/tracking?consignment={trackingNumber}' },
    { code: CourierCode.LEOPARD, name: 'Leopard Courier Services', trackingUrlTemplate: 'https://www.leopardscourier.com/tracking?track={trackingNumber}' },
    { code: CourierCode.M_AND_P, name: 'M&P Express Logistics', trackingUrlTemplate: 'https://mulphilog.com/tracking?cn={trackingNumber}' },
    { code: CourierCode.TRAX, name: 'TRAX Logistics', trackingUrlTemplate: 'https://trax.pk/tracking?tracking_number={trackingNumber}' },
  ];

  for (const c of couriers) {
    await prisma.courier.upsert({
      where: { code: c.code },
      update: { name: c.name, trackingUrlTemplate: c.trackingUrlTemplate },
      create: c,
    });
  }

  // ==========================================
  // 3. SYSTEM USERS & ADDRESSES
  // ==========================================
  const adminUser = await prisma.user.upsert({
    where: { email: 'info@aljazeeragc.com' },
    update: {
      email: 'info@aljazeeragc.com',
      role: Role.SUPER_ADMIN,
      isActive: true,
    },
    create: {
      id: 'usr-admin-aljazeera-01',
      email: 'info@aljazeeragc.com',
      firstName: 'Al',
      lastName: 'Jazeera',
      role: Role.SUPER_ADMIN,
      phone: '+92 300 8541299',
      isActive: true,
    },
  });

  const shopManager = await prisma.user.upsert({
    where: { email: 'manager@alphatech.pk' },
    update: {},
    create: {
      id: 'usr-manager-01',
      email: 'manager@alphatech.pk',
      firstName: 'Bilal',
      lastName: 'Ahmed',
      role: Role.SHOP_MANAGER,
      phone: '+92 321 5551234',
      isActive: true,
    },
  });

  const cadEngineer = await prisma.user.upsert({
    where: { email: 'engineer@alphatech.pk' },
    update: {},
    create: {
      id: 'usr-engineer-01',
      email: 'engineer@alphatech.pk',
      firstName: 'Usman',
      lastName: 'Farooq',
      role: Role.CAD_PRINT_ENGINEER,
      phone: '+92 333 4445566',
      isActive: true,
    },
  });

  const customerUser = await prisma.user.upsert({
    where: { email: 'hamza.tariq@aeroeng.pk' },
    update: {},
    create: {
      id: 'usr-customer-01',
      email: 'hamza.tariq@aeroeng.pk',
      firstName: 'Hamza',
      lastName: 'Tariq',
      role: Role.CUSTOMER,
      phone: '+92 321 4567890',
      isActive: true,
    },
  });

  await prisma.address.upsert({
    where: { id: 'addr-cust-01' },
    update: {},
    create: {
      id: 'addr-cust-01',
      userId: customerUser.id,
      fullName: 'Hamza Tariq',
      phone: '+92 321 4567890',
      province: 'Punjab',
      city: 'Lahore',
      area: 'DHA Phase 5',
      addressLine1: 'House 42, Sector C, Street 8',
      postalCode: '54792',
      country: 'Pakistan',
      isDefault: true,
    },
  });

  // ==========================================
  // 4. CATEGORIES
  // ==========================================
  const categoriesData = [
    {
      id: 'power-systems',
      name: 'Power Systems',
      slug: 'power-systems',
      description: 'High-discharge LiPo batteries, power distribution boards, and voltage regulators.',
      sortOrder: 1,
    },
    {
      id: 'raw-materials',
      name: 'Raw Materials',
      slug: 'raw-materials',
      description: 'Aerospace-grade carbon fiber plates, tubes, and specialty engineering composites.',
      sortOrder: 2,
    },
    {
      id: 'hardware-components',
      name: 'Hardware & Components',
      slug: 'hardware-components',
      description: 'Titanium fasteners, aluminum standoffs, anti-vibration silicon dampers, and bearings.',
      sortOrder: 3,
    },
    {
      id: 'propulsion-fpv',
      name: 'Drone Components',
      slug: 'drone-components',
      description: 'Brushless motors, electronic speed controllers (ESCs), flight controllers, and carbon propellers.',
      sortOrder: 4,
    },
    {
      id: 'robotics-components',
      name: 'Robotics Components',
      slug: 'robotics-components',
      description: 'High-torque digital servo actuators, harmonic gearheads, and sensor suites.',
      sortOrder: 5,
    },
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, sortOrder: cat.sortOrder },
      create: cat,
    });
  }

  // ==========================================
  // 5. PRODUCTS & INVENTORY
  // ==========================================

  // Product 1: BosLipo 1550mAh 150C
  const prod1 = await prisma.product.upsert({
    where: { slug: 'boslipo-1550mah-150c-22v-6s' },
    update: {
      name: 'BosLipo 1550mAh 150C 22.2V 6S',
      basePrice: 24500,
      status: StockStatus.IN_STOCK,
      isFeatured: true,
    },
    create: {
      id: 'prod-boslipo-1550-6s',
      name: 'BosLipo 1550mAh 150C 22.2V 6S',
      slug: 'boslipo-1550mah-150c-22v-6s',
      sku: 'BOS-1550-6S-150C',
      categoryId: 'power-systems',
      shortDescription: 'Ultra-high discharge 150C burst 6S LiPo battery pack engineered for competitive FPV and heavy-lift UAV platforms.',
      description: 'The BosLipo 1550mAh 150C 22.2V 6S lithium polymer battery pack is constructed using high-density cell stacking technology to deliver relentless voltage retention under aggressive full-throttle punch-outs.',
      basePrice: 24500,
      currency: 'PKR',
      status: StockStatus.IN_STOCK,
      stockMode: 'PRODUCT_TRACKED',
      allowBackorder: true,
      lowStockThreshold: 5,
      isFeatured: true,
      technicalSpecifications: {
        'Cell Configuration': '6S1P (6 Cells in Series)',
        'Nominal Voltage': '22.2V',
        'Fully Charged Voltage': '25.2V (4.20V / cell)',
        'Nominal Capacity': '1550 mAh',
        'Continuous Discharge Rating': '75C',
        'Burst Discharge Rating': '150C',
        'Discharge Lead': '12AWG High-Flex Silicone Wire (85mm)',
        'Main Connector': 'Genuine Amass XT60H Yellow',
        'Balance Connector': 'JST-XHR 7-Pin',
        'Weight': '258g ± 5g',
        'Dimensions': '78mm × 38mm × 41mm',
        'Operating Temperature': '-10°C to +60°C',
      },
      compatibilityNotes: 'Recommended for 6S-rated ESCs (minimum 45A - 60A continuous). Ensure charger supports 6S LiPo balancing.',
      shippingNotes: 'Shipped via overland courier under Pakistan dangerous goods battery guidelines.',
    },
  });

  await prisma.productImage.upsert({
    where: { id: 'img-boslipo-1' },
    update: {},
    create: {
      id: 'img-boslipo-1',
      productId: prod1.id,
      url: 'https://picsum.photos/seed/lipo1550/800/800',
      alt: 'BosLipo 1550mAh 150C 22.2V 6S battery pack',
      isPrimary: true,
      sortOrder: 1,
    },
  });

  await prisma.inventory.upsert({
    where: { productId: prod1.id },
    update: { quantity: 24, reservedQuantity: 2 },
    create: {
      productId: prod1.id,
      quantity: 24,
      reservedQuantity: 2,
      lowStockThreshold: 5,
      allowBackorder: true,
    },
  });

  // Product 2: Tattu R-Line V5
  const prod2 = await prisma.product.upsert({
    where: { slug: 'tattu-r-line-v5-1550mah-6s1p-22v-150c' },
    update: {
      name: 'Tattu R-Line V5 1550mAh 6S1P 22.2V 150C',
      basePrice: 28500,
      status: StockStatus.IN_STOCK,
      isFeatured: true,
    },
    create: {
      id: 'prod-tattu-rline-v5',
      name: 'Tattu R-Line V5 1550mAh 6S1P 22.2V 150C',
      slug: 'tattu-r-line-v5-1550mah-6s1p-22v-150c',
      sku: 'TAT-RLV5-1550-6S',
      categoryId: 'power-systems',
      shortDescription: 'Flagship Version 5.0 racing LiPo pack with Al提 material technology for minimum internal resistance.',
      description: 'The Tattu R-Line Version 5.0 is the pinnacle of drone power engineering. Utilizing proprietary electrode coating and reduced internal impedance (IR), this 1550mAh 6S pack provides longer cycle life and unmatched thermal dissipation.',
      basePrice: 28500,
      currency: 'PKR',
      status: StockStatus.IN_STOCK,
      stockMode: 'PRODUCT_TRACKED',
      allowBackorder: false,
      lowStockThreshold: 4,
      isFeatured: true,
      technicalSpecifications: {
        'Cell Configuration': '6S1P',
        'Nominal Voltage': '22.2V',
        'Max Voltage': '25.2V',
        'Capacity': '1550 mAh',
        'Max Continuous Discharge': '150C',
        'Peak Burst Discharge': '200C',
        'Internal Resistance': '< 2.2 mΩ per cell',
        'Power Connector': 'Amass XT60H',
        'Weight': '248g ± 4g',
        'Dimensions': '75mm × 39mm × 43mm',
      },
      compatibilityNotes: 'Engineered for competitive FPV pilots and autonomous high-speed robotics.',
      shippingNotes: 'Overland courier delivery within 48-72 hours across Pakistan.',
    },
  });

  await prisma.productImage.upsert({
    where: { id: 'img-tattu-1' },
    update: {},
    create: {
      id: 'img-tattu-1',
      productId: prod2.id,
      url: 'https://picsum.photos/seed/tattuv5/800/800',
      alt: 'Tattu R-Line V5 1550mAh 6S1P 22.2V 150C battery',
      isPrimary: true,
      sortOrder: 1,
    },
  });

  await prisma.inventory.upsert({
    where: { productId: prod2.id },
    update: { quantity: 18, reservedQuantity: 0 },
    create: {
      productId: prod2.id,
      quantity: 18,
      reservedQuantity: 0,
      lowStockThreshold: 4,
    },
  });

  // Product 3: Carbon Fiber Sheet Plate (with 3 variants)
  const prod3 = await prisma.product.upsert({
    where: { slug: 'carbon-fiber-sheet-plate-500x500mm' },
    update: {
      name: 'Carbon Fiber Sheet Plate',
      basePrice: 8500,
      status: StockStatus.IN_STOCK,
      isFeatured: true,
    },
    create: {
      id: 'prod-carbon-fiber-plate',
      name: 'Carbon Fiber Sheet Plate',
      slug: 'carbon-fiber-sheet-plate-500x500mm',
      sku: 'CFP-500-MASTER',
      categoryId: 'raw-materials',
      shortDescription: '100% 3K twill weave matte carbon fiber panel (500mm × 500mm) with precision quasi-isotropic layup.',
      description: 'Manufactured through high-pressure autoclave consolidation, this aerospace-grade 500mm × 500mm carbon fiber panel delivers exceptional tensile stiffness, zero voids, and perfect dimensional flatness. Available in 1.5mm, 4mm, and 5mm thicknesses.',
      basePrice: 8500,
      currency: 'PKR',
      status: StockStatus.IN_STOCK,
      stockMode: 'VARIANT_TRACKED',
      allowBackorder: true,
      lowStockThreshold: 6,
      isFeatured: true,
      technicalSpecifications: {
        'Weave Pattern': '3K Twill Weave 2x2',
        'Surface Finish': 'Matte / Non-Reflective Satin',
        'Dimensions': '500mm × 500mm (± 1.0mm)',
        'Fiber Orientation': '0° / 90° / ±45° Quasi-Isotropic',
        'Resin Matrix': 'High-Tg Modified Epoxy System',
        'Fiber Volume Fraction (Vf)': '> 62%',
        'Tensile Strength': '≥ 600 MPa',
        'Thermal Stability': 'Up to 120°C continuous',
        'CNC Machinability': 'Excellent with diamond-coated or carbide router bits',
      },
      compatibilityNotes: 'Compatible with standard CNC waterjet or router beds. Wear appropriate PPE when machining composite dust.',
      shippingNotes: 'Packaged between rigid wooden support liners to prevent flex damage during transit.',
    },
  });

  await prisma.productImage.upsert({
    where: { id: 'img-cf-1' },
    update: {},
    create: {
      id: 'img-cf-1',
      productId: prod3.id,
      url: 'https://picsum.photos/seed/carbonfiberplate/800/800',
      alt: 'Carbon Fiber Sheet Plate 500mm x 500mm 3K matte weave',
      isPrimary: true,
      sortOrder: 1,
    },
  });

  // Variant 1: 1.5mm
  const var1 = await prisma.productVariant.upsert({
    where: { sku: 'CFP-500-15MM' },
    update: { price: 8500 },
    create: {
      id: 'var-cf-1-5mm',
      productId: prod3.id,
      sku: 'CFP-500-15MM',
      name: '1.5mm Thickness',
      price: 8500,
      weight: 0.58,
      dimensions: { length: 500, width: 500, thickness: 1.5 },
      attributes: {
        Thickness: '1.5mm',
        Dimensions: '500mm × 500mm',
        Weight: '580g approx.',
        IdealUse: 'Top plates, camera brackets, electronic mounts',
      },
    },
  });

  await prisma.inventory.upsert({
    where: { variantId: var1.id },
    update: { quantity: 16, reservedQuantity: 1 },
    create: {
      productId: prod3.id,
      variantId: var1.id,
      quantity: 16,
      reservedQuantity: 1,
      lowStockThreshold: 4,
    },
  });

  // Variant 2: 4.0mm
  const var2 = await prisma.productVariant.upsert({
    where: { sku: 'CFP-500-40MM' },
    update: { price: 16500 },
    create: {
      id: 'var-cf-4-0mm',
      productId: prod3.id,
      sku: 'CFP-500-40MM',
      name: '4.0mm Thickness',
      price: 16500,
      weight: 1.52,
      dimensions: { length: 500, width: 500, thickness: 4.0 },
      attributes: {
        Thickness: '4.0mm',
        Dimensions: '500mm × 500mm',
        Weight: '1520g approx.',
        IdealUse: 'Drone arms, structural frames, robotic load-bearing links',
      },
    },
  });

  await prisma.inventory.upsert({
    where: { variantId: var2.id },
    update: { quantity: 12, reservedQuantity: 0 },
    create: {
      productId: prod3.id,
      variantId: var2.id,
      quantity: 12,
      reservedQuantity: 0,
      lowStockThreshold: 3,
    },
  });

  // Variant 3: 5.0mm
  const var3 = await prisma.productVariant.upsert({
    where: { sku: 'CFP-500-50MM' },
    update: { price: 19800 },
    create: {
      id: 'var-cf-5-0mm',
      productId: prod3.id,
      sku: 'CFP-500-50MM',
      name: '5.0mm Thickness',
      price: 19800,
      weight: 1.90,
      dimensions: { length: 500, width: 500, thickness: 5.0 },
      attributes: {
        Thickness: '5.0mm',
        Dimensions: '500mm × 500mm',
        Weight: '1900g approx.',
        IdealUse: 'Heavy-lift arms, industrial machinery mounts, high-impact rigs',
      },
    },
  });

  await prisma.inventory.upsert({
    where: { variantId: var3.id },
    update: { quantity: 7, reservedQuantity: 0 },
    create: {
      productId: prod3.id,
      variantId: var3.id,
      quantity: 7,
      reservedQuantity: 0,
      lowStockThreshold: 2,
    },
  });

  // ==========================================
  // 5b. EXPANSION CATEGORIES & PRODUCTS
  // ==========================================
  const { EXPANSION_CATEGORIES, EXPANSION_PRODUCTS } = await import('../lib/data/expansion-catalog');

  await prisma.category.upsert({
    where: { slug: 'robotics-actuators' },
    update: {
      name: 'Robotics & Actuators',
      description: 'High-torque precision servos, harmonic gear units, and robotic chassis hardware.',
    },
    create: {
      id: 'robotics-actuators',
      name: 'Robotics & Actuators',
      slug: 'robotics-actuators',
      description: 'High-torque precision servos, harmonic gear units, and robotic chassis hardware.',
      sortOrder: 5,
      isActive: true,
    },
  });

  for (const cat of EXPANSION_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        sortOrder: cat.displayOrder,
        image: cat.image,
      },
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        sortOrder: cat.displayOrder,
        image: cat.image,
        isActive: true,
      },
    });
  }

  for (const item of EXPANSION_PRODUCTS) {
    const specs = item.technicalSpecifications as Record<string, string>;
    const created = await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        basePrice: item.basePrice,
        status: item.status,
        isFeatured: Boolean(item.isFeatured),
        brand: item.brand || 'Alpha Tech',
        shortDescription: item.shortDescription,
        description: item.description,
        technicalSpecifications: specs,
        categoryId: item.categoryId,
      },
      create: {
        id: item.id,
        name: item.name,
        slug: item.slug,
        sku: item.sku,
        categoryId: item.categoryId,
        brand: item.brand || 'Alpha Tech',
        shortDescription: item.shortDescription,
        description: item.description,
        basePrice: item.basePrice,
        currency: 'PKR',
        status: item.status,
        stockMode: 'PRODUCT_TRACKED',
        allowBackorder: false,
        lowStockThreshold: item.lowStockThreshold,
        isFeatured: Boolean(item.isFeatured),
        technicalSpecifications: specs,
        compatibilityNotes: item.compatibilityNotes,
        shippingNotes: item.shippingNotes,
      },
    });

    await prisma.productImage.upsert({
      where: { id: `${item.id}-img-1` },
      update: { url: item.images[0]?.url || '', alt: item.name },
      create: {
        id: `${item.id}-img-1`,
        productId: created.id,
        url: item.images[0]?.url || '',
        alt: item.name,
        isPrimary: true,
        sortOrder: 1,
      },
    });

    await prisma.inventory.upsert({
      where: { productId: created.id },
      update: { quantity: item.stock, reservedQuantity: 0 },
      create: {
        productId: created.id,
        quantity: item.stock,
        reservedQuantity: 0,
        lowStockThreshold: item.lowStockThreshold,
        allowBackorder: false,
      },
    });
  }

  // ==========================================
  // 6. ENGINEERING SERVICES (8 SERVICES)
  // ==========================================
  const services = [
    {
      id: 'serv-3d-printing',
      name: '3D Printing & Additive Manufacturing',
      slug: '3d-printing-additive-manufacturing',
      serviceType: '3D_PRINTING',
      description: 'Industrial FDM and SLA/Resin printing for rapid functional prototypes, jigs, fixtures, and short-run production batches.',
      sortOrder: 1,
    },
    {
      id: 'serv-mechanical-cad',
      name: 'Mechanical Design & CAD Services',
      slug: 'mechanical-design-cad',
      serviceType: 'CAD_DESIGN',
      description: 'Custom chassis, sheet metal design, bespoke electronic enclosures, and comprehensive Design for Manufacturing (DFM) reviews.',
      sortOrder: 2,
    },
    {
      id: 'serv-custom-enclosures',
      name: 'Custom Enclosures',
      slug: 'custom-enclosures',
      serviceType: 'ENCLOSURE_DESIGN',
      description: 'IP-rated electronic housings, CNC machined aluminum pods, and snap-fit polymer enclosures tailored to custom PCBs.',
      sortOrder: 3,
    },
    {
      id: 'serv-reverse-engineering',
      name: 'Reverse Engineering & CMM Scanning',
      slug: 'reverse-engineering',
      serviceType: 'METROLOGY',
      description: 'High-precision 3D optical scanning and conversion of physical components into parametric CAD solids with tight tolerances.',
      sortOrder: 4,
    },
    {
      id: 'serv-sheet-metal',
      name: 'Sheet Metal Design',
      slug: 'sheet-metal-design',
      serviceType: 'SHEET_METAL',
      description: 'Laser cutting, CNC press brake bending layouts, K-factor calculation, and PEM hardware insertion design.',
      sortOrder: 5,
    },
    {
      id: 'serv-jigs-fixtures',
      name: 'Tooling, Jigs & Assembly Fixtures',
      slug: 'jigs-and-fixtures',
      serviceType: 'PRODUCTION_TOOLING',
      description: 'Custom manufacturing aids, PCB testing fixtures, drill guides, and drone assembly jigs engineered to accelerate production.',
      sortOrder: 6,
    },
    {
      id: 'serv-rapid-prototyping',
      name: 'Rapid Prototyping',
      slug: 'rapid-prototyping',
      serviceType: 'PROTOTYPING',
      description: 'End-to-end concept realization in 48 to 72 hours combining 3D printing, laser cutting, and fast-turn CNC milling.',
      sortOrder: 7,
    },
    {
      id: 'serv-low-volume-mfg',
      name: 'Low-Volume Manufacturing',
      slug: 'low-volume-manufacturing',
      serviceType: 'BATCH_MANUFACTURING',
      description: 'Bridge production runs of 10 to 500 units with rigorous quality inspection and material traceability reports.',
      sortOrder: 8,
    },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: { name: s.name, description: s.description, sortOrder: s.sortOrder },
      create: s,
    });
  }

  // ==========================================
  // 7. DEMO ORDER & PAYMENT & SHIPMENT
  // ==========================================
  const demoOrder = await prisma.order.upsert({
    where: { orderNumber: 'AT-2026-1001' },
    update: {},
    create: {
      id: 'ord-1001',
      orderNumber: 'AT-2026-1001',
      userId: customerUser.id,
      email: 'hamza.tariq@aeroeng.pk',
      phone: '+92 321 4567890',
      orderType: OrderType.PRODUCT,
      status: OrderStatus.READY_FOR_DISPATCH,
      paymentStatus: PaymentStatus.VERIFIED,
      fulfillmentStatus: 'PACKED',
      subtotal: 53000,
      shippingAmount: 450,
      discountAmount: 0,
      total: 53450,
      currency: 'PKR',
      shippingAddressSnapshot: {
        fullName: 'Hamza Tariq',
        phone: '+92 321 4567890',
        province: 'Punjab',
        city: 'Lahore',
        area: 'DHA Phase 5',
        addressLine1: 'House 42, Sector C, Street 8',
        postalCode: '54792',
        country: 'Pakistan',
      },
      items: {
        create: [
          {
            productId: prod1.id,
            productName: 'BosLipo 1550mAh 150C 22.2V 6S',
            sku: 'BOS-1550-6S-150C',
            quantity: 2,
            unitPrice: 24500,
            total: 49000,
          },
          {
            productId: prod3.id,
            variantId: var1.id,
            productName: 'Carbon Fiber Sheet Plate',
            variantName: '1.5mm Thickness',
            sku: 'CFP-500-15MM',
            quantity: 1,
            unitPrice: 8500,
            total: 8500,
          },
        ],
      },
      statusHistory: {
        create: [
          {
            newStatus: OrderStatus.PAYMENT_VERIFIED,
            changedBy: 'FINANCE_TEAM',
            note: 'IBFT Raast payment verified against Meezan Bank statement.',
          },
          {
            newStatus: OrderStatus.PROCESSING,
            changedBy: 'WAREHOUSE',
            note: 'Items pulled from shelf B-4.',
          },
          {
            newStatus: OrderStatus.READY_FOR_DISPATCH,
            changedBy: 'WAREHOUSE',
            note: 'Packed in anti-static box with shock padding.',
          },
        ],
      },
      payments: {
        create: {
          method: PaymentMethod.BANK_TRANSFER,
          amount: 53450,
          status: PaymentStatus.VERIFIED,
          transactionReference: 'RAAST-881920412891',
          provider: 'MEEZAN_BANK',
          verifiedBy: adminUser.id,
          verifiedAt: new Date(),
        },
      },
      shipments: {
        create: {
          courierCode: CourierCode.TCS,
          consignmentNumber: 'CN-TCS-99201',
          trackingNumber: 'TCS-992014829',
          status: ShipmentStatus.BOOKED,
          originCity: 'Lahore',
          destinationCity: 'Lahore',
          recipientName: 'Hamza Tariq',
          recipientPhone: '+92 321 4567890',
          recipientAddress: 'House 42, Sector C, Street 8, DHA Phase 5, Lahore',
          weightKg: 1.25,
          codAmount: 0,
          shippingCost: 450,
        },
      },
    },
  });

  // ==========================================
  // 8. DEMO QUOTE REQUEST
  // ==========================================
  await prisma.quoteRequest.upsert({
    where: { quoteNumber: 'QR-2026-0882' },
    update: {},
    create: {
      id: 'quote-0882',
      quoteNumber: 'QR-2026-0882',
      userId: customerUser.id,
      serviceId: 'serv-3d-printing',
      customerName: 'Muhammad Salman',
      customerEmail: 'salman.eng@uavsystems.pk',
      customerPhone: '+92 333 1234567',
      customerWhatsApp: '+92 333 1234567',
      companyName: 'Aero Dynamics Pakistan',
      serviceType: 'THREE_D_PRINTING',
      projectDescription: 'Lightweight gimbal dampener bracket for Sony A7S III payload on hexacopter UAV. Must withstand vibration up to 120Hz without resonance.',
      quantity: 4,
      requestedDeadline: '2026-04-05',
      application: 'Commercial UAV Aerial Cinematography Mount',
      material: 'Nylon-CF (Carbon Fiber Reinforced)',
      layerHeight: '0.16',
      infill: '60',
      surfaceFinish: 'Standard Post-Cured',
      tolerance: '±0.1mm',
      dimensions: '145mm × 85mm × 42mm',
      ndaRequested: true,
      ndaStatus: 'SIGNED',
      status: QuoteStatus.UNDER_REVIEW,
      assignedEngineer: 'Usman Farooq (CAD/Print Lead)',
      estimatedMaterialCost: 4200,
      estimatedMachineRuntimeHours: 14.5,
      estimatedLaborHours: 3.0,
      quotedPrice: 18500,
      currency: 'PKR',
      files: {
        create: [
          {
            originalFileName: 'gimbal_bracket_revB.step',
            fileSizeBytes: BigInt(8452000),
            format: '.STEP',
            storageKey: 'quotes/2026/0882/gimbal_bracket_revB.step',
          },
          {
            originalFileName: 'isolation_plate_v2.stl',
            fileSizeBytes: BigInt(3120000),
            format: '.STL',
            storageKey: 'quotes/2026/0882/isolation_plate_v2.stl',
          },
        ],
      },
      history: {
        create: [
          {
            newStatus: QuoteStatus.QUOTE_REQUESTED,
            note: 'Initial request submitted via engineering portal',
            changedBy: 'CUSTOMER',
          },
          {
            newStatus: QuoteStatus.UNDER_REVIEW,
            note: 'Assigned to CAD/Print Lead for print orientation & FEA review.',
            changedBy: 'SYSTEM',
          },
        ],
      },
    },
  });

  // ==========================================
  // 9. AUDIT LOG
  // ==========================================
  await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      action: 'SYSTEM_INITIALIZED',
      entityType: 'System',
      entityId: 'alpha-tech-db',
      newValue: { status: 'INITIALIZED', seededRecords: 35 },
      ipAddress: '127.0.0.1',
    },
  });

  console.log('Alpha Tech database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
