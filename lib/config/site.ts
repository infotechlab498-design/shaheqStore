export const siteConfig = {
  name: 'ALPHA TECH',
  legalName: 'Alpha Tech Engineering & Technologies (Pvt) Ltd.',
  shortName: 'Alpha Tech',
  tagline: 'Precision Drone Systems, Advanced Robotics & Custom Engineering',
  description:
    'Engineering platform specializing in high-discharge LiPo batteries, aerospace-grade carbon fiber, FPV and robotics components, CAD design, sub-millimeter 3D printing, and rapid prototyping services.',
  url: process.env.APP_URL || 'https://alphatech.pk',
  currency: {
    code: 'PKR',
    symbol: '₨',
    label: 'Pakistani Rupee',
  },
  contact: {
    phone: '+92 300 0000000',
    phoneFormatted: '+92 (300) 000-0000',
    whatsapp: '+923000000000',
    email: 'contact@alphatech.pk',
    supportEmail: 'support@alphatech.pk',
    salesEmail: 'engineering@alphatech.pk',
    address: 'Alpha Tech Engineering Facility, Industrial Tech Zone, Lahore, Pakistan',
    operatingHours: 'Mon - Sat: 9:00 AM - 7:00 PM PKT',
  },
  social: {
    whatsappChannel: 'https://whatsapp.com/channel/alphatech',
    linkedin: 'https://linkedin.com/company/alphatech-pk',
    youtube: 'https://youtube.com/@alphatech-engineering',
    github: 'https://github.com/alphatech-pk',
  },
  shipping: {
    defaultOriginCity: 'Lahore',
    standardDeliveryEstimate: '2 - 4 Business Days',
    expressDeliveryEstimate: '24 - 48 Hours',
    supportedCouriers: ['TCS', 'LEOPARD', 'MNP', 'TRAX'] as const,
    freeShippingThreshold: 50000, // PKR
    standardShippingFee: 450, // PKR
  },
  payments: {
    acceptedMethods: [
      {
        id: 'CASH_ON_DELIVERY',
        name: 'Cash on Delivery (COD)',
        description: 'Pay cash upon parcel delivery via authorized courier service.',
        isOnline: false,
      },
      {
        id: 'BANK_TRANSFER',
        name: 'Direct Bank Transfer / IBFT',
        description: 'Transfer via Raast or Online Banking. Requires transaction receipt upload.',
        isOnline: false,
      },
      {
        id: 'JAZZCASH',
        name: 'JazzCash Wallet / QR',
        description: 'Instant mobile account payment or voucher confirmation.',
        isOnline: true,
      },
      {
        id: 'EASYPAISA',
        name: 'EasyPaisa Wallet',
        description: 'Instant mobile account transfer via EasyPaisa app or OTC.',
        isOnline: true,
      },
      {
        id: 'CARD',
        name: 'Debit / Credit Card (PayFast / 1Link)',
        description: 'Secure card processing via 3D-Secure 1Link gateway.',
        isOnline: true,
      },
    ],
  },
  nav: {
    main: [
      { label: 'Home', href: '/' },
      { label: 'Shop Catalog', href: '/shop' },
      { label: 'Engineering Services', href: '/services' },
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    admin: [
      { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
      { label: 'Products', href: '/admin/products', icon: 'Package' },
      { label: 'Inventory', href: '/admin/inventory', icon: 'Layers' },
      { label: 'Orders', href: '/admin/orders', icon: 'ShoppingCart' },
      { label: 'Quote Queue', href: '/admin/quotes', icon: 'FileCode2' },
      { label: 'Payments', href: '/admin/payments', icon: 'CreditCard' },
      { label: 'Shipments', href: '/admin/shipments', icon: 'Truck' },
      { label: 'Customers', href: '/admin/customers', icon: 'Users' },
      { label: 'Analytics', href: '/admin/analytics', icon: 'BarChart3' },
      { label: 'Staff & Roles', href: '/admin/staff', icon: 'ShieldCheck' },
      { label: 'Settings', href: '/admin/settings', icon: 'Settings' },
    ],
  },
};
