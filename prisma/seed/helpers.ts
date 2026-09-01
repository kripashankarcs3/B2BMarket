export class SeededRng {
  private state: number;

  constructor(seed: number) {
    this.state = seed;
  }

  next(): number {
    this.state |= 0;
    this.state = (this.state + 0x6d2b79f5) | 0;
    let t = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  int(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  float(min: number, max: number, decimals = 2): number {
    const val = min + this.next() * (max - min);
    return parseFloat(val.toFixed(decimals));
  }

  pick<T>(arr: T[]): T {
    return arr[this.int(0, arr.length - 1)];
  }

  pickN<T>(arr: T[], count: number): T[] {
    const shuffled = [...arr].sort(() => this.next() - 0.5);
    return shuffled.slice(0, Math.min(count, arr.length));
  }

  weightedPick<T>(items: { value: T; weight: number }[]): T {
    const totalWeight = items.reduce((s, i) => s + i.weight, 0);
    let r = this.next() * totalWeight;
    for (const item of items) {
      r -= item.weight;
      if (r <= 0) return item.value;
    }
    return items[items.length - 1].value;
  }

  shuffle<T>(arr: T[]): T[] {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.int(0, i);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateGstNumber(rng: SeededRng, stateCode: string): string {
  const digits = Array.from({ length: 10 }, () => rng.int(0, 9)).join('');
  const alpha = String.fromCharCode(65 + rng.int(0, 25));
  const last = rng.int(0, 9);
  return `${stateCode}${digits}${alpha}Z${last}`;
}

export function generateHsnCode(rng: SeededRng): string {
  const s1 = String(rng.int(10, 99));
  const s2 = String(rng.int(10, 99));
  const s3 = String(rng.int(10, 99));
  return `${s1}.${s2}.${s3}`;
}

export function generatePhone(rng: SeededRng): string {
  const digits = Array.from({ length: 10 }, () => rng.int(0, 9)).join('');
  return `+91${digits}`;
}

export function generatePincode(rng: SeededRng): string {
  return String(rng.int(100000, 999999));
}

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal',
];

export const INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bengaluru', 'Ahmedabad', 'Chennai', 'Kolkata',
  'Surat', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur',
  'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara',
  'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut',
  'Rajkot', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar',
  'Noida', 'Jodhpur', 'Ranchi', 'Raipur', 'Kota', 'Chandigarh',
  'Guwahati', 'Solapur', 'Hubli', 'Moradabad', 'Mysore', 'Gwalior',
  'Jabalpur', 'Tiruppur', 'Salem', 'Bhubaneswar', 'Warangal',
  'Cuttack', 'Bhavnagar', 'Dehradun',
];

export const CITY_STATE_MAP: Record<string, string> = {
  'Mumbai': 'Maharashtra', 'Delhi': 'Delhi', 'Bengaluru': 'Karnataka',
  'Ahmedabad': 'Gujarat', 'Chennai': 'Tamil Nadu', 'Kolkata': 'West Bengal',
  'Surat': 'Gujarat', 'Pune': 'Maharashtra', 'Jaipur': 'Rajasthan',
  'Lucknow': 'Uttar Pradesh', 'Kanpur': 'Uttar Pradesh', 'Nagpur': 'Maharashtra',
  'Indore': 'Madhya Pradesh', 'Thane': 'Maharashtra', 'Bhopal': 'Madhya Pradesh',
  'Visakhapatnam': 'Andhra Pradesh', 'Patna': 'Bihar', 'Vadodara': 'Gujarat',
  'Ghaziabad': 'Uttar Pradesh', 'Ludhiana': 'Punjab', 'Agra': 'Uttar Pradesh',
  'Nashik': 'Maharashtra', 'Faridabad': 'Haryana', 'Meerut': 'Uttar Pradesh',
  'Rajkot': 'Gujarat', 'Varanasi': 'Uttar Pradesh', 'Srinagar': 'Jammu and Kashmir',
  'Aurangabad': 'Maharashtra', 'Dhanbad': 'Jharkhand', 'Amritsar': 'Punjab',
  'Noida': 'Uttar Pradesh', 'Jodhpur': 'Rajasthan', 'Ranchi': 'Jharkhand',
  'Raipur': 'Chhattisgarh', 'Kota': 'Rajasthan', 'Chandigarh': 'Chandigarh',
  'Guwahati': 'Assam', 'Solapur': 'Maharashtra', 'Hubli': 'Karnataka',
  'Moradabad': 'Uttar Pradesh', 'Mysore': 'Karnataka', 'Gwalior': 'Madhya Pradesh',
  'Jabalpur': 'Madhya Pradesh', 'Tiruppur': 'Tamil Nadu', 'Salem': 'Tamil Nadu',
  'Bhubaneswar': 'Odisha', 'Warangal': 'Telangana', 'Cuttack': 'Odisha',
  'Bhavnagar': 'Gujarat', 'Dehradun': 'Uttarakhand',
};

export const INDIAN_FIRST_NAMES = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan',
  'Ishaan', 'Shaurya', 'Anaya', 'Diya', 'Myra', 'Aaradhya', 'Sara', 'Ananya',
  'Aadhya', 'Ishita', 'Saanvi', 'Navya', 'Rohan', 'Krishna', 'Akash', 'Ravi',
  'Suresh', 'Mahesh', 'Rajesh', 'Dinesh', 'Manoj', 'Sanjay', 'Priya', 'Neha',
  'Shreya', 'Kavita', 'Anita', 'Sunita', 'Deepak', 'Vijay', 'Amit', 'Nitin',
  'Pradeep', 'Gaurav', 'Rajat', 'Nikhil', 'Nisha', 'Pooja', 'Ritu', 'Swati',
  'Rahul', 'Vikas', 'Praveen', 'Mohan', 'Hari', 'Gopal', 'Lakshmi', 'Geeta',
];

export const INDIAN_LAST_NAMES = [
  'Sharma', 'Verma', 'Singh', 'Kumar', 'Patel', 'Reddy', 'Gupta', 'Joshi',
  'Chatterjee', 'Banerjee', 'Mukherjee', 'Das', 'Bose', 'Sen', 'Ghosh',
  'Nair', 'Menon', 'Pillai', 'Iyer', 'Rao', 'Naidu', 'Prasad', 'Agarwal',
  'Jain', 'Mehta', 'Shah', 'Desai', 'Trivedi', 'Pandey', 'Mishra', 'Dubey',
  'Tiwari', 'Chauhan', 'Yadav', 'Khan', 'Ansari', 'Sheikh', 'Saxena',
  'Kapoor', 'Malhotra', 'Chopra', 'Bajaj', 'Mahajan', 'Kohli', 'Oberoi',
];

export const COMPANY_SUFFIXES = [
  'Industries', 'Enterprises', 'Corporation', 'Exports', 'Impex',
  'Manufacturing', 'Trading Co.', 'Pvt. Ltd.', 'Limited', 'Group',
  'Emerging Pvt. Ltd.', 'International', 'Overseas', 'Global', 'Solutions',
  'Technologies', 'Distributors', 'Suppliers', 'Wholesale', 'Ltd.',
];

export const BUSINESS_TYPES = [
  'Manufacturer', 'Wholesale Supplier', 'Exporter', 'Trader',
  'Manufacturer & Exporter', 'Distributor', 'Importer', 'Producer',
];
