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
    phone: '+966 58 192 5047',
    phoneFormatted: '+966 58 192 5047',
    whatsapp: '+966581925047',
    whatsappDisplay: '+966 58 192 5047',
    email: 'contact@alphatech.pk',
    supportEmail: 'support@alphatech.pk',
    salesEmail: 'engineering@alphatech.pk',
    address: 'NASTP Alpha Rawalpindi',
    operatingHours: 'Mon - Sat: 9:00 AM - 7:00 PM PKT',
  },
  social: {
    whatsappChannel: 'https://whatsapp.com/channel/alphatech',
    linkedin: 'https://linkedin.com/company/alphatech-pk',
    youtube: 'https://youtube.com/@alphatech-engineering',
    github: 'https://github.com/alphatech-pk',
  },
  shipping: {
    defaultOriginCity: 'Rawalpindi',
    standardDeliveryEstimate: '2 - 4 Business Days',
    expressDeliveryEstimate: '24 - 48 Hours',
    supportedCouriers: ['TCS', 'LEOPARD', 'MNP', 'TRAX'] as const,
    freeShippingThreshold: 50000, // PKR
    standardShippingFee: 450, // PKR
  },
  payments: {
    bank: {
      name: 'HBL',
      accountTitle: 'ARJUMAND ALEEM',
      accountNumber: '58837000118503',
      iban: 'PK34HABB0058837000118503',
    },
    walletNumber: '03034440870',
    proofWhatsapp: '+966 58 192 5047',
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
        description: 'Transfer to HBL account ARJUMAND ALEEM. Send the payment screenshot on WhatsApp.',
        isOnline: false,
      },
      {
        id: 'JAZZCASH',
        name: 'JazzCash Wallet / QR',
        description: 'Send JazzCash to 03034440870, then share the screenshot on WhatsApp.',
        isOnline: true,
      },
      {
        id: 'EASYPAISA',
        name: 'EasyPaisa Wallet',
        description: 'Send EasyPaisa to 03034440870, then share the screenshot on WhatsApp.',
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
