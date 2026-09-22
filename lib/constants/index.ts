export const PRODUCT_CATEGORIES = [
  {
    id: 'power-systems',
    name: 'Power Systems',
    slug: 'power-systems',
    description: 'High-discharge LiPo batteries, power distribution boards, and voltage regulators.',
    count: 12,
  },
  {
    id: 'raw-materials',
    name: 'Raw Materials',
    slug: 'raw-materials',
    description: 'Aerospace-grade carbon fiber plates, tubes, and specialty engineering composites.',
    count: 8,
  },
  {
    id: 'propulsion-fpv',
    name: 'Propulsion & FPV',
    slug: 'propulsion-fpv',
    description: 'Brushless motors, ESCs, carbon props, and low-latency digital video transmitters.',
    count: 15,
  },
  {
    id: 'robotics-actuators',
    name: 'Robotics & Actuators',
    slug: 'robotics-actuators',
    description: 'High-torque precision servos, harmonic gear units, and robotic chassis hardware.',
    count: 9,
  },
] as const;

export const STOCK_STATUS_CONFIG = {
  IN_STOCK: {
    label: 'In Stock',
    color: 'emerald',
    badgeVariant: 'success',
  },
  LOW_STOCK: {
    label: 'Low Stock',
    color: 'amber',
    badgeVariant: 'warning',
  },
  PRE_ORDER: {
    label: 'Pre-Order',
    color: 'blue',
    badgeVariant: 'info',
  },
  OUT_OF_STOCK: {
    label: 'Out of Stock',
    color: 'rose',
    badgeVariant: 'destructive',
  },
} as const;

export const ORDER_STATUS_CONFIG = {
  PENDING_PAYMENT: { label: 'Pending Payment', badgeVariant: 'warning' },
  PAYMENT_UNVERIFIED: { label: 'Payment Unverified', badgeVariant: 'warning' },
  PAYMENT_VERIFIED: { label: 'Payment Verified', badgeVariant: 'info' },
  PROCESSING: { label: 'Processing', badgeVariant: 'default' },
  IN_PRODUCTION: { label: 'In Production', badgeVariant: 'info' },
  READY_FOR_DISPATCH: { label: 'Ready for Dispatch', badgeVariant: 'info' },
  SHIPPED: { label: 'Shipped', badgeVariant: 'default' },
  DELIVERED: { label: 'Delivered', badgeVariant: 'success' },
  COMPLETED: { label: 'Completed', badgeVariant: 'success' },
  CANCELLED: { label: 'Cancelled', badgeVariant: 'destructive' },
  REFUNDED: { label: 'Refunded', badgeVariant: 'outline' },
} as const;

export const QUOTE_STATUS_CONFIG = {
  NEW_REQUEST: { label: 'New Request', badgeVariant: 'warning' },
  UNDER_REVIEW: { label: 'Under Review', badgeVariant: 'info' },
  AWAITING_DESIGN_CLARIFICATION: { label: 'Clarification Needed', badgeVariant: 'warning' },
  QUOTED: { label: 'Quoted', badgeVariant: 'default' },
  ACCEPTED: { label: 'Customer Accepted', badgeVariant: 'success' },
  REJECTED: { label: 'Rejected', badgeVariant: 'destructive' },
  CONVERTED_TO_ORDER: { label: 'Converted to Order', badgeVariant: 'success' },
} as const;

export const SUPPORTED_CAD_EXTENSIONS = ['.stl', '.obj', '.step', '.stp', '.sldprt', '.dxf'] as const;
export const MAX_CAD_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100MB
