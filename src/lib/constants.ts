export const ORDER_STATUS_STYLES = {
  pending: { variant: 'warning' as const, label: 'Pending' },
  confirmed: { variant: 'info' as const, label: 'Confirmed' },
  processing: { variant: 'info' as const, label: 'Processing' },
  shipped: { variant: 'info' as const, label: 'Shipped' },
  delivered: { variant: 'success' as const, label: 'Delivered' },
  cancelled: { variant: 'danger' as const, label: 'Cancelled' },
  returned: { variant: 'warning' as const, label: 'Returned' },
};

export const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' },
] as const;

export const DEFAULT_PAGE_SIZE = 24;

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
] as const;

export const GST_RATES = [0, 5, 12, 18, 28] as const;
