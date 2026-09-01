import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { SeededRng, slugify, generateGstNumber, generateHsnCode, generatePhone, generatePincode, INDIAN_FIRST_NAMES, INDIAN_LAST_NAMES } from './seed/helpers';
import { generateCategories } from './seed/categories';
import { SUPPLIER_PERSONALITIES, BUYER_BUSINESS_TYPES, PRODUCT_IMAGE_TYPES, NEGOTIATION_MESSAGE_TEMPLATES, COURIER_PARTNERS, PAYMENT_TERMS, FACTORY_AMENITIES, PARTY_QUOTES } from './seed/enhancements';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });
const rng = new SeededRng(42);

function pickN<T>(arr: T[], min: number, max: number): T[] {
  const count = rng.int(min, Math.min(max, arr.length));
  return rng.shuffle(arr).slice(0, count);
}

function pick<T>(arr: T[]): T { return arr[rng.int(0, arr.length - 1)]; }

// ─── CITY INDUSTRY CLUSTERS ───────────────────────────────
// Each city has real industrial specializations
const CITY_CLUSTERS: Record<string, { slugs: string[]; desc: string; estYearRange: [number, number] }> = {
  Tiruppur: { slugs: ['mens-ethnic-wear', 'womens-ethnic-wear', 'mens-casual-wear', 'womens-casual-wear', 'kids-wear', 'activewear', 'innerwear', 'sleepwear', 'fashion-accessories'], desc: 'Textile and garment manufacturing hub', estYearRange: [1995, 2018] },
  Surat: { slugs: ['mens-ethnic-wear', 'womens-ethnic-wear', 'silk-fabrics', 'synthetic-fabrics', 'cotton-fabrics', 'jute-products'], desc: 'Synthetic textile and diamond processing capital', estYearRange: [1988, 2015] },
  Ludhiana: { slugs: ['mens-casual-wear', 'innerwear', 'activewear', 'sleepwear', 'kids-wear', 'two-wheeler-parts', 'auto-accessories'], desc: 'Industrial and textile manufacturing centre', estYearRange: [1985, 2010] },
  Moradabad: { slugs: ['home-decor', 'tableware', 'kitchen-storage', 'puja-essentials', 'brass-metal'], desc: 'Brass metal handicrafts export hub', estYearRange: [1990, 2012] },
  Jaipur: { slugs: ['home-decor', 'imitation-jewelry', 'silver-jewelry', 'bridal-jewelry', 'pearl-jewelry', 'cotton-fabrics', 'blue-pottery'], desc: 'Blue pottery, gemstone and textile hub', estYearRange: [1992, 2014] },
  Mumbai: { slugs: ['cosmetics', 'pharmaceuticals', 'healthcare', 'ayurvedic', 'beauty', 'packaging', 'industrial-chemicals'], desc: 'Financial and pharmaceutical capital', estYearRange: [1980, 2008] },
  Delhi: { slugs: ['electronics', 'home-appliances', 'stationery', 'office-supplies', 'sports', 'fitness', 'home-decor', 'kitchen-storage'], desc: 'National capital commercial and wholesale hub', estYearRange: [1985, 2015] },
  Ahmedabad: { slugs: ['industrial-chemicals', 'dyes-pigments', 'paints-coatings', 'adhesives-sealants', 'construction', 'textile-machinery'], desc: 'Chemical and textile manufacturing hub', estYearRange: [1982, 2012] },
  Bengaluru: { slugs: ['electronics', 'computer-peripherals', 'electrical-components', 'industrial-machinery', 'food-processing'], desc: 'Electronics and industrial manufacturing hub', estYearRange: [1992, 2016] },
  Chennai: { slugs: ['automotive', 'car-parts', 'auto-electrical', 'tires', 'steel-iron', 'industrial-machinery'], desc: 'Automotive manufacturing capital of India', estYearRange: [1988, 2010] },
  Hyderabad: { slugs: ['pharmaceuticals', 'healthcare', 'medical-equipment', 'ayurvedic', 'electronics', 'computer-peripherals'], desc: 'Pharmaceutical and IT hub', estYearRange: [1995, 2015] },
  Kolkata: { slugs: ['tea-coffee', 'jute-products', 'leather-bags', 'stationery', 'office-supplies', 'confectionery', 'spices-masala'], desc: 'Tea, jute and heritage manufacturing hub', estYearRange: [1980, 2005] },
  Pune: { slugs: ['automotive', 'car-parts', 'industrial-machinery', 'cnc-machines', 'material-handling', 'packaging-machinery'], desc: 'Automotive and engineering hub', estYearRange: [1990, 2012] },
  Rajkot: { slugs: ['automotive', 'auto-parts', 'engineering', 'steel-iron', 'hardware-tools', 'kitchen-storage'], desc: 'Engineering and auto parts hub', estYearRange: [1985, 2010] },
  Noida: { slugs: ['electronics', 'home-appliances', 'packaging', 'plastic-packaging', 'flexible-packaging', 'printed-packaging'], desc: 'Electronics and packaging manufacturing hub', estYearRange: [2000, 2018] },
  Ghaziabad: { slugs: ['steel-iron', 'pipes-fittings', 'hardware-tools', 'construction', 'paints-construction', 'sanitaryware'], desc: 'Steel and construction materials hub', estYearRange: [1990, 2010] },
  Indore: { slugs: ['food-processing', 'snacks-namkeen', 'spices-masala', 'confectionery', 'packaging', 'soaps-body-wash'], desc: 'Food processing and packaging hub', estYearRange: [1995, 2015] },
  Agra: { slugs: ['leather-bags', 'footwear', 'handicrafts', 'marble-products', 'home-decor'], desc: 'Leather and handicraft heritage hub', estYearRange: [1985, 2008] },
};

// ─── COMPANY PROFILES ─────────────────────────────────────
// Each company has a story, founding year, employee count, and specialization
const COMPANY_NAMES = [
  { name: 'Om Metals & Engineering', suffix: 'Pvt. Ltd.', vibe: 'industrial' },
  { name: 'Shiv Textile Mills', suffix: 'Ltd.', vibe: 'textile' },
  { name: 'Ganesh Electronics', suffix: 'Corporation', vibe: 'electronics' },
  { name: 'Laxmi Industries', suffix: 'Group', vibe: 'general' },
  { name: 'Saraswati Packaging', suffix: 'Pvt. Ltd.', vibe: 'packaging' },
  { name: 'Durga Auto Components', suffix: 'Ltd.', vibe: 'automotive' },
  { name: 'Krishna Pharmaceuticals', suffix: 'Ltd.', vibe: 'pharma' },
  { name: 'Sai Enterprises', suffix: 'Exports', vibe: 'export' },
  { name: 'Tirupati Tradelink', suffix: 'International', vibe: 'trading' },
  { name: 'Bharat Electricals', suffix: 'Ltd.', vibe: 'electrical' },
  { name: 'Neelkamal Fabrics', suffix: 'Pvt. Ltd.', vibe: 'textile' },
  { name: 'Shree Balaji Chemicals', suffix: 'Ltd.', vibe: 'chemical' },
  { name: 'Radha Krishan Food Products', suffix: 'Pvt. Ltd.', vibe: 'food' },
  { name: 'Maa Durga Constructions', suffix: 'Ltd.', vibe: 'construction' },
  { name: 'Ambey Steel Traders', suffix: 'Corporation', vibe: 'metal' },
  { name: 'Surya Roshni Appliances', suffix: 'Ltd.', vibe: 'electronics' },
  { name: 'Gayatri Paper Mills', suffix: 'Pvt. Ltd.', vibe: 'paper' },
  { name: 'Vinayak Auto Parts', suffix: 'Industries', vibe: 'automotive' },
  { name: 'Kailash Timber & Ply', suffix: 'Ltd.', vibe: 'wood' },
  { name: 'Rameshwaram Leather', suffix: 'Exports', vibe: 'leather' },
  { name: 'New Rajasthan Textiles', suffix: 'Mills Ltd.', vibe: 'textile' },
  { name: 'Aditya Birla Distributors', suffix: 'Corporation', vibe: 'trading' },
  { name: 'Ganesh Polyplast', suffix: 'Ltd.', vibe: 'plastic' },
  { name: 'Mahesh Surgical & Medical', suffix: 'Pvt. Ltd.', vibe: 'medical' },
  { name: 'Shiv Shankar Chemicals', suffix: 'Ltd.', vibe: 'chemical' },
  { name: 'Somnath Ceramics', suffix: 'Pvt. Ltd.', vibe: 'ceramic' },
  { name: 'Trimurti Agro Products', suffix: 'Ltd.', vibe: 'agriculture' },
  { name: 'Aastha Home Appliances', suffix: 'Pvt. Ltd.', vibe: 'electronics' },
  { name: 'Sanjay Sports Industries', suffix: 'Ltd.', vibe: 'sports' },
  { name: 'Pioneer Engineering Works', suffix: 'Corporation', vibe: 'engineering' },
  { name: 'Narmada Steel Corporation', suffix: 'Ltd.', vibe: 'metal' },
  { name: 'Nathdwara Fabrics', suffix: 'Pvt. Ltd.', vibe: 'textile' },
  { name: 'Padmavati Pharma', suffix: 'Ltd.', vibe: 'pharma' },
  { name: 'Hari Om Packaging', suffix: 'Ltd.', vibe: 'packaging' },
  { name: 'Ravi Electricals', suffix: 'Industries', vibe: 'electrical' },
  { name: 'Shalimar Leather Works', suffix: 'Pvt. Ltd.', vibe: 'leather' },
  { name: 'Bikaner Handicrafts', suffix: 'Exports', vibe: 'handicraft' },
  { name: 'Konark Food & Beverages', suffix: 'Pvt. Ltd.', vibe: 'food' },
  { name: 'Kalinga Steel Tubes', suffix: 'Ltd.', vibe: 'metal' },
  { name: 'Himalaya Health Products', suffix: 'Pvt. Ltd.', vibe: 'health' },
];

// ─── FOUNDER PROFILES ─────────────────────────────────────
const FOUNDERS = [
  { first: 'Rajesh', last: 'Agarwal', title: 'Managing Director' },
  { first: 'Anil', last: 'Sharma', title: 'CEO' },
  { first: 'Sunil', last: 'Mehta', title: 'Founder & Director' },
  { first: 'Vikram', last: 'Patel', title: 'Proprietor' },
  { first: 'Deepak', last: 'Jain', title: 'Managing Partner' },
  { first: 'Ravi', last: 'Gupta', title: 'Director' },
  { first: 'Suresh', last: 'Reddy', title: 'Founder & CEO' },
  { first: 'Amit', last: 'Verma', title: 'Managing Director' },
  { first: 'Prakash', last: 'Singh', title: 'CEO' },
  { first: 'Vinod', last: 'Yadav', title: 'Proprietor' },
  { first: 'Manoj', last: 'Das', title: 'Founder' },
  { first: 'Kishore', last: 'Bajaj', title: 'Managing Director' },
  { first: 'Rakesh', last: 'Kapoor', title: 'CEO' },
  { first: 'Nitin', last: 'Chopra', title: 'Founder & Director' },
  { first: 'Gaurav', last: 'Malhotra', title: 'Director' },
  { first: 'Pradeep', last: 'Kohli', title: 'Managing Partner' },
  { first: 'Vijay', last: 'Saxena', title: 'Proprietor' },
  { first: 'Sanjay', last: 'Trivedi', title: 'CEO' },
  { first: 'Rahul', last: 'Pandey', title: 'Founder' },
  { first: 'Dinesh', last: 'Chauhan', title: 'Managing Director' },
];

const REVIEW_TEMPLATES: Record<number, string[]> = {
  5: [
    'Excellent quality products from {supplier}. We have been sourcing {product} for over a year and the consistency is remarkable — same quality every batch. Packaging was secure and delivery was ahead of schedule. Highly recommended for wholesale buyers.',
    'Very reliable supplier. The {product} order arrived two days early and quality exceeded expectations. The materials used are exactly as specified in the product description. Will definitely place repeat orders.',
    'Top notch quality from {supplier} and professional communication throughout. The bulk pricing on {product} is competitive and they accommodated our custom packaging without any hassle. Five stars.',
    'Outstanding {product}. We ordered for our retail chain and sales have been excellent. {supplier} maintains strict quality control — every piece was consistent. Shipping was prompt and well coordinated with tracking updates.',
    'Best wholesale experience on this platform. {supplier} understood our requirements for {product}, provided samples before bulk order, and delivered exactly as promised. Pricing is very competitive for the quality offered.',
  ],
  4: [
    'Good quality {product} matching the description. Delivery was on time via Delhivery. Minor variance in shade across batches but overall acceptable for the price point. Good value for bulk pricing.',
    'Satisfied with the purchase from {supplier}. Communication was smooth and they were responsive to queries about {product}. Quality is consistent. A small delay in dispatch but overall a good experience.',
    'Reliable supplier with consistent {product} quality. The order processing was smooth and delivery was within the promised timeline. Packaging could be improved for fragile items but otherwise fully satisfactory.',
    'Quality of {product} matches the sample provided earlier. {supplier} offers competitive pricing for bulk quantities. Delivery was on time. Would appreciate better communication on dispatch updates.',
  ],
  3: [
    'Average quality {product}. Acceptable for the price point but there is room for improvement in consistency. Delivery from {supplier} was delayed by a couple of days. Communication was basic but responsive.',
    'Decent supplier for {product}. The products are as described but quality could be more consistent across batches. Pricing from {supplier} is reasonable for this market segment. Mixed experience overall.',
    'Products meet basic requirements but nothing exceptional. {supplier} delivered on time but communication could be more proactive. Will consider for future orders if pricing remains competitive.',
  ],
  2: [
    'Product quality from {supplier} is below expectations. Several {product} items showed defects. The supplier was responsive to complaints but the replacement process took over two weeks.',
    'Not fully satisfied with this order of {product}. The material quality does not match what {supplier} promised during negotiations. Would caution other buyers to inspect samples thoroughly before placing bulk orders.',
  ],
  1: [
    'Poor experience with {supplier}. The {product} arrived damaged and the supplier was not cooperative about returns. Quality is nowhere near what was described in the listing. Would not recommend.',
    'Disappointing quality from {supplier}. The batch of {product} we received had significant inconsistencies in size and finish. Customer service was unhelpful and it took weeks to get a partial refund. Avoid for critical orders.',
  ],
};

// ─── REAL PRODUCT NAMES ──────────────────────────────────
const CATEGORY_PRODUCTS: Record<string, { products: { name: string; priceMin: number; priceMax: number; moq: number; specs: { label: string; value: string }[] }[] }> = {
  'led-lights': { products: [
    { name: 'Philips B22 LED Bulb 9W', priceMin: 28, priceMax: 32, moq: 200, specs: [{ label: 'Wattage', value: '9W' }, { label: 'Base', value: 'B22' }, { label: 'Lumens', value: '810 lm' }, { label: 'Color Temp', value: '6500K' }] },
    { name: 'Wipro Garnet LED Bulb 12W', priceMin: 38, priceMax: 45, moq: 100, specs: [{ label: 'Wattage', value: '12W' }, { label: 'Base', value: 'E27/B22' }, { label: 'Life', value: '25000 hrs' }] },
    { name: 'Syska LED Tube Light 20W 4ft', priceMin: 155, priceMax: 185, moq: 50, specs: [{ label: 'Wattage', value: '20W' }, { label: 'Length', value: '4 Feet' }, { label: 'Body', value: 'Aluminum + PC' }] },
    { name: 'Havells LED Panel Light 12W', priceMin: 285, priceMax: 345, moq: 25, specs: [{ label: 'Wattage', value: '12W' }, { label: 'Size', value: '6 inch' }, { label: 'Warranty', value: '3 Years' }] },
    { name: 'Bajaj LED Flood Light 30W', priceMin: 420, priceMax: 520, moq: 20, specs: [{ label: 'Wattage', value: '30W' }, { label: 'IP Rating', value: 'IP65' }, { label: 'Body', value: 'Die Cast Aluminum' }] },
    { name: 'Crompton LED Strip 5M', priceMin: 245, priceMax: 295, moq: 50, specs: [{ label: 'Length', value: '5 Meter' }, { label: 'LED/m', value: '60' }, { label: 'Color', value: 'RGB + White' }] },
  ]},
  'mobile-accessories': { products: [
    { name: 'Samsung 25W Type-C Fast Charger', priceMin: 195, priceMax: 245, moq: 100, specs: [{ label: 'Output', value: '25W PD' }, { label: 'Port', value: 'USB-C' }, { label: 'Compatible', value: 'Samsung/OnePlus/Realme' }] },
    { name: 'Boat 2A USB Charger', priceMin: 85, priceMax: 120, moq: 200, specs: [{ label: 'Output', value: '5V/2.1A' }, { label: 'Ports', value: 'Dual USB' }, { label: 'Safety', value: 'Overcharge Protection' }] },
    { name: 'Realme Type-C Cable 1M', priceMin: 45, priceMax: 65, moq: 500, specs: [{ label: 'Length', value: '1 Meter' }, { label: 'Material', value: 'TPE' }, { label: 'Current', value: '3A Max' }] },
    { name: 'Mi 20000mAh Power Bank', priceMin: 595, priceMax: 745, moq: 30, specs: [{ label: 'Capacity', value: '20000mAh' }, { label: 'Output', value: '18W PD' }, { label: 'Cell', value: 'Li-Polymer' }] },
    { name: 'Spigen Rugged Phone Case', priceMin: 149, priceMax: 195, moq: 100, specs: [{ label: 'Material', value: 'PC + TPU' }, { label: 'Military Grade', value: 'MIL-STD-810G' }] },
    { name: 'JBL Tune 110 Wired Earphone', priceMin: 245, priceMax: 295, moq: 50, specs: [{ label: 'Driver', value: '9mm' }, { label: 'Impedance', value: '16Ω' }, { label: 'Mic', value: 'Yes' }] },
  ]},
  'home-appliances': { products: [
    { name: 'Butterfly Rapid 750W Mixer Grinder', priceMin: 1495, priceMax: 1795, moq: 15, specs: [{ label: 'Motor', value: '750W Copper' }, { label: 'Jars', value: '3' }, { label: 'Speed', value: '3 Speed + Pulse' }] },
    { name: 'Prestige PKOSS 1.5L Kettle', priceMin: 445, priceMax: 525, moq: 30, specs: [{ label: 'Capacity', value: '1.5L' }, { label: 'Body', value: 'SS 304' }, { label: 'Power', value: '1500W' }] },
    { name: 'Bajaj Majesty 1600W Induction', priceMin: 1295, priceMax: 1595, moq: 20, specs: [{ label: 'Power', value: '1600W' }, { label: 'Cooktop', value: 'Touch Control' }, { label: 'Warranty', value: '2 Years' }] },
    { name: 'Usha 1200W Steam Iron', priceMin: 395, priceMax: 495, moq: 30, specs: [{ label: 'Type', value: 'Steam/Dry' }, { label: 'Soleplate', value: 'Non-Stick' }, { label: 'Tank', value: '200ml' }] },
    { name: 'Kent 16021 RO Water Purifier', priceMin: 4495, priceMax: 5495, moq: 10, specs: [{ label: 'Process', value: 'RO+UV+UF' }, { label: 'Tank', value: '8L' }, { label: 'Warranty', value: '3 Years' }] },
  ]},
  'electrical-components': { products: [
    { name: 'Legrand 20A MCB Single Pole', priceMin: 65, priceMax: 85, moq: 200, specs: [{ label: 'Rating', value: '20A' }, { label: 'Poles', value: 'Single' }, { label: 'Breaking', value: '6kA' }] },
    { name: 'Anchor Roma 6A Switch', priceMin: 22, priceMax: 28, moq: 500, specs: [{ label: 'Rating', value: '6A 250V' }, { label: 'Material', value: 'PC' }, { label: 'Color', value: 'White' }] },
    { name: 'GM 3-Pin Socket 6A', priceMin: 32, priceMax: 42, moq: 300, specs: [{ label: 'Rating', value: '6A' }, { label: 'Pins', value: '3' }, { label: 'Material', value: 'Brass + PC' }] },
    { name: 'Polycab 2.5 sqmm Wire 90M', priceMin: 1850, priceMax: 2150, moq: 50, specs: [{ label: 'Size', value: '2.5 sq mm' }, { label: 'Conductor', value: 'Copper' }, { label: 'Length', value: '90 Meter' }] },
  ]},
  'fans': { products: [
    { name: 'Havells 1200mm Stealth Fan', priceMin: 995, priceMax: 1245, moq: 20, specs: [{ label: 'Size', value: '1200mm' }, { label: 'Speed', value: '380 RPM' }, { label: 'Power', value: '55W' }, { label: 'BEE Star', value: '5 Star' }] },
    { name: 'Orient Electric 1200mm Fan', priceMin: 845, priceMax: 995, moq: 30, specs: [{ label: 'Size', value: '1200mm' }, { label: 'RPM', value: '360' }, { label: 'Warranty', value: '2 Years' }] },
    { name: 'Bajaj 200mm Exhaust Fan', priceMin: 495, priceMax: 595, moq: 40, specs: [{ label: 'Sweep', value: '200mm' }, { label: 'CFM', value: '850' }, { label: 'Power', value: '45W' }] },
    { name: 'Usha 400mm Stand Fan', priceMin: 1595, priceMax: 1895, moq: 15, specs: [{ label: 'Size', value: '400mm' }, { label: 'Type', value: 'Oscillating' }, { label: 'Speeds', value: '3' }] },
  ]},
  'solar-products': { products: [
    { name: 'Loom Solar 160W Panel', priceMin: 5495, priceMax: 6495, moq: 10, specs: [{ label: 'Wattage', value: '160W' }, { label: 'Cells', value: '36 Poly' }, { label: 'Warranty', value: '25 Years' }] },
    { name: 'Microtek 1000VA Inverter', priceMin: 4495, priceMax: 5495, moq: 10, specs: [{ label: 'Capacity', value: '1000VA' }, { label: 'Wave', value: 'Pure Sine' }, { label: 'Battery', value: 'External' }] },
    { name: 'Exide 150AH Solar Battery', priceMin: 8495, priceMax: 9995, moq: 8, specs: [{ label: 'Capacity', value: '150AH' }, { label: 'Type', value: 'Tubular' }, { label: 'Warranty', value: '5 Years' }] },
    { name: 'Luminous 12W LED Solar Light', priceMin: 595, priceMax: 745, moq: 30, specs: [{ label: 'Wattage', value: '12W' }, { label: 'Panel', value: '6W Poly' }, { label: 'Run Time', value: '10-12 Hours' }] },
  ]},
  'mens-ethnic-wear': { products: [
    { name: 'Manyavar Cotton Silk Kurta', priceMin: 495, priceMax: 695, moq: 30, specs: [{ label: 'Fabric', value: 'Cotton Silk' }, { label: 'Fit', value: 'Regular' }, { label: 'Sizes', value: 'M-5XL' }] },
    { name: 'FabIndia Cotton Kurta', priceMin: 395, priceMax: 545, moq: 40, specs: [{ label: 'Fabric', value: '100% Cotton' }, { label: 'Pattern', value: 'Solid' }, { label: 'Neck', value: 'Band Collar' }] },
    { name: 'Raymond Suiting Kurta Fabric', priceMin: 295, priceMax: 395, moq: 100, specs: [{ label: 'Fabric', value: 'Cotton Blend' }, { label: 'Width', value: '44 inch' }, { label: 'Weight', value: '200 GSM' }] },
  ]},
  'womens-ethnic-wear': { products: [
    { name: 'Banarasi Silk Saree', priceMin: 2495, priceMax: 3995, moq: 5, specs: [{ label: 'Fabric', value: 'Pure Banarasi Silk' }, { label: 'Work', value: 'Zari Weave' }, { label: 'Length', value: '5.5 Mtr' }] },
    { name: 'Cotton Handloom Saree', priceMin: 495, priceMax: 695, moq: 20, specs: [{ label: 'Fabric', value: 'Handloom Cotton' }, { label: 'Blouse', value: 'Not Included' }] },
    { name: 'Georgette Ready Salwar Suit', priceMin: 595, priceMax: 895, moq: 25, specs: [{ label: 'Set', value: 'Kurta+Salwar+Dupatta' }, { label: 'Fabric', value: 'Georgette' }] },
    { name: 'Silk Lehenga Choli', priceMin: 3495, priceMax: 5495, moq: 5, specs: [{ label: 'Set', value: 'Lehenga+Choli+Dupatta' }, { label: 'Work', value: 'Zari + Resham' }] },
  ]},
  'mens-casual-wear': { products: [
    { name: 'US Polo Cotton T-Shirt', priceMin: 195, priceMax: 295, moq: 100, specs: [{ label: 'Fabric', value: 'Cotton Jersey' }, { label: 'GSM', value: '180' }, { label: 'Sizes', value: 'S-5XL' }] },
    { name: 'Levi\'s Cotton Shirt', priceMin: 495, priceMax: 695, moq: 50, specs: [{ label: 'Fabric', value: 'Cotton' }, { label: 'Fit', value: 'Regular' }, { label: 'Collar', value: 'Button Down' }] },
    { name: 'Spykar Slim Fit Jeans', priceMin: 495, priceMax: 645, moq: 40, specs: [{ label: 'Fabric', value: 'Cotton Denim' }, { label: 'Weight', value: '12oz' }, { label: 'Sizes', value: '28-40' }] },
    { name: 'Puma Cotton Shorts', priceMin: 295, priceMax: 395, moq: 60, specs: [{ label: 'Fabric', value: 'Cotton' }, { label: 'Pattern', value: 'Solid' }, { label: 'Pockets', value: '2 Side' }] },
  ]},
  'womens-casual-wear': { products: [
    { name: 'H&M Printed Top', priceMin: 245, priceMax: 345, moq: 50, specs: [{ label: 'Fabric', value: 'Cotton' }, { label: 'Pattern', value: 'Floral Print' }, { label: 'Sizes', value: 'XS-3XL' }] },
    { name: 'Zara Skinny Jeans', priceMin: 545, priceMax: 695, moq: 30, specs: [{ label: 'Fabric', value: 'Stretch Denim' }, { label: 'Rise', value: 'Mid' }, { label: 'Sizes', value: '26-36' }] },
    { name: 'Mango Midi Dress', priceMin: 595, priceMax: 795, moq: 25, specs: [{ label: 'Fabric', value: 'Poly Viscose' }, { label: 'Length', value: 'Midi' }, { label: 'Sizes', value: 'XS-3XL' }] },
  ]},
  'kids-wear': { products: [
    { name: 'Gini & Jony Cotton Set', priceMin: 295, priceMax: 395, moq: 60, specs: [{ label: 'Set', value: 'T-Shirt + Short' }, { label: 'Fabric', value: 'Cotton' }, { label: 'Age', value: '2-10 Years' }] },
    { name: 'Lilliput School Uniform', priceMin: 345, priceMax: 445, moq: 100, specs: [{ label: 'Set', value: 'Shirt+Pant+Tie' }, { label: 'Fabric', value: 'Cotton Blend' }, { label: 'Sizes', value: '4-14 Years' }] },
    { name: 'Hopscotch Baby Romper', priceMin: 195, priceMax: 295, moq: 80, specs: [{ label: 'Fabric', value: 'Organic Cotton' }, { label: 'Closure', value: 'Snap' }, { label: 'Age', value: '0-24 Months' }] },
  ]},
  'kitchen-storage': { products: [
    { name: 'Cello Plastic Container 1L', priceMin: 45, priceMax: 65, moq: 300, specs: [{ label: 'Capacity', value: '1L' }, { label: 'Material', value: 'PP' }, { label: 'Microwave', value: 'Safe' }] },
    { name: 'Milton Steel Tiffin 3-Tier', priceMin: 445, priceMax: 545, moq: 30, specs: [{ label: 'Tiers', value: '3' }, { label: 'Material', value: 'SS 304' }, { label: 'Capacity', value: '900ml' }] },
    { name: 'Borosil Glass Jar 1L Airtight', priceMin: 95, priceMax: 135, moq: 100, specs: [{ label: 'Capacity', value: '1L' }, { label: 'Material', value: 'Borosilicate' }, { label: 'Lid', value: 'SS Airtight' }] },
  ]},
  'cookware': { products: [
    { name: 'Hawkins Pressure Cooker 5L', priceMin: 1495, priceMax: 1795, moq: 15, specs: [{ label: 'Capacity', value: '5L' }, { label: 'Material', value: 'Aluminum' }, { label: 'Warranty', value: '10 Years' }] },
    { name: 'Prestige Non-Stick Kadai 24cm', priceMin: 395, priceMax: 495, moq: 30, specs: [{ label: 'Size', value: '24cm' }, { label: 'Coating', value: 'Granite' }, { label: 'Lid', value: 'Glass' }] },
    { name: 'Vidiem Cast Iron Tawa 30cm', priceMin: 345, priceMax: 445, moq: 25, specs: [{ label: 'Diameter', value: '30cm' }, { label: 'Material', value: 'Cast Iron' }, { label: 'Induction', value: 'Compatible' }] },
  ]},
  'tableware': { products: [
    { name: 'La Opala Melamine 12PC Set', priceMin: 645, priceMax: 795, moq: 20, specs: [{ label: 'Pieces', value: '12' }, { label: 'Material', value: 'Melamine' }, { label: 'Includes', value: '4 Dinner+4 Dessert+4 Bowl' }] },
    { name: 'Corelle Bone China 18PC', priceMin: 1495, priceMax: 1995, moq: 12, specs: [{ label: 'Pieces', value: '18' }, { label: 'Material', value: 'Bone China' }, { label: 'Dishwasher', value: 'Safe' }] },
    { name: 'Stainless Steel Thali 5-Section', priceMin: 245, priceMax: 345, moq: 50, specs: [{ label: 'Sections', value: '5' }, { label: 'Material', value: 'SS 304' }, { label: 'Diameter', value: '30cm' }] },
  ]},
  'bed-linen': { products: [
    { name: 'Bombay Dyeing Cotton Sheet 90x100', priceMin: 495, priceMax: 645, moq: 30, specs: [{ label: 'Size', value: '90x100' }, { label: 'TC', value: '280' }, { label: 'Set', value: 'Sheet+2 Pillow' }] },
    { name: 'Wakefit Memory Foam Pillow', priceMin: 395, priceMax: 545, moq: 30, specs: [{ label: 'Fill', value: 'Memory Foam' }, { label: 'Cover', value: 'Cotton' }, { label: 'Pack', value: '1 Piece' }] },
    { name: 'Springtek Microfiber Comforter', priceMin: 845, priceMax: 995, moq: 15, specs: [{ label: 'Size', value: 'Double' }, { label: 'Fill', value: 'Microfiber' }, { label: 'Weight', value: '500 GSM' }] },
  ]},
  'gym-equipment': { products: [
    { name: 'Cockatoo PVC Dumbbell Set 10kg', priceMin: 645, priceMax: 795, moq: 20, specs: [{ label: 'Weight', value: '10kg Pair' }, { label: 'Material', value: 'PVC' }, { label: 'Grip', value: 'Ergonomic' }] },
    { name: 'Proline Yoga Mat 183x61x10mm', priceMin: 345, priceMax: 445, moq: 40, specs: [{ label: 'Thickness', value: '10mm' }, { label: 'Material', value: 'NBR' }, { label: 'Non-Slip', value: 'Yes' }] },
    { name: 'Amazon Basics Resistance Band Set', priceMin: 245, priceMax: 345, moq: 60, specs: [{ label: 'Set', value: '5 Bands' }, { label: 'Resistance', value: '5-25kg' }, { label: 'Material', value: 'Latex' }] },
  ]},
  'cement': { products: [
    { name: 'Ultratech OPC 53 Grade Cement', priceMin: 345, priceMax: 395, moq: 200, specs: [{ label: 'Grade', value: 'OPC 53' }, { label: 'Bag', value: '50 kg' }, { label: 'Setting', value: '30 min initial' }] },
    { name: 'ACC PPC Cement', priceMin: 295, priceMax: 345, moq: 200, specs: [{ label: 'Grade', value: 'PPC' }, { label: 'Bag', value: '50 kg' }, { label: 'Strength', value: '43 MPa' }] },
    { name: 'Birla White Cement', priceMin: 495, priceMax: 595, moq: 100, specs: [{ label: 'Type', value: 'White Cement' }, { label: 'Bag', value: '50 kg' }, { label: 'Whiteness', value: '91%' }] },
  ]},
  'steel-iron': { products: [
    { name: 'JSW TMT Fe-500D 12mm', priceMin: 68, priceMax: 76, moq: 1000, specs: [{ label: 'Grade', value: 'Fe-500D' }, { label: 'Dia', value: '12mm' }, { label: 'Length', value: '12 Mtr' }] },
    { name: 'Tata Structura 40x40x5mm Angle', priceMin: 68, priceMax: 76, moq: 500, specs: [{ label: 'Size', value: '40x40x5mm' }, { label: 'Length', value: '6 Mtr' }, { label: 'Grade', value: 'IS 2062' }] },
    { name: 'Jindal GI Pipe 20mm', priceMin: 445, priceMax: 545, moq: 50, specs: [{ label: 'Dia', value: '20mm' }, { label: 'Thickness', value: '2.3mm' }, { label: 'Length', value: '3 Mtr' }] },
  ]},
  'tiles': { products: [
    { name: 'Kajaria Vitrified 60x60 Glossy', priceMin: 42, priceMax: 52, moq: 200, specs: [{ label: 'Size', value: '600x600mm' }, { label: 'Finish', value: 'Glossy' }, { label: 'PEI', value: '4' }] },
    { name: 'Somany Ceramic Wall 30x60', priceMin: 32, priceMax: 42, moq: 300, specs: [{ label: 'Size', value: '300x600mm' }, { label: 'Finish', value: 'Digital' }, { label: 'Application', value: 'Wall' }] },
    { name: 'Johnson Marble 60x60', priceMin: 68, priceMax: 85, moq: 150, specs: [{ label: 'Size', value: '600x600mm' }, { label: 'Type', value: 'Full Body' }, { label: 'Finish', value: 'Polished' }] },
  ]},
  'pipes-fittings': { products: [
    { name: 'Supreme PVC Pipe 25mm 4kg', priceMin: 95, priceMax: 125, moq: 100, specs: [{ label: 'Dia', value: '25mm' }, { label: 'Pressure', value: '4 kg' }, { label: 'Length', value: '3 Mtr' }] },
    { name: 'Astral CPVC Pipe 20mm', priceMin: 145, priceMax: 185, moq: 50, specs: [{ label: 'Dia', value: '20mm' }, { label: 'Temp', value: '93°C Max' }, { label: 'Length', value: '3 Mtr' }] },
    { name: 'Finci PVC Fittings Elbow 25mm', priceMin: 8, priceMax: 12, moq: 1000, specs: [{ label: 'Type', value: 'Elbow 90°' }, { label: 'Size', value: '25mm' }, { label: 'Material', value: 'PVC' }] },
  ]},
  'paints-construction': { products: [
    { name: 'Asian Royale 20L Emulsion', priceMin: 1295, priceMax: 1595, moq: 20, specs: [{ label: 'Finish', value: 'Matt' }, { label: 'Volume', value: '20L' }, { label: 'Coverage', value: '120 sqft/L' }] },
    { name: 'Dulux Weathershield 10L Exterior', priceMin: 2495, priceMax: 2995, moq: 15, specs: [{ label: 'Type', value: 'Exterior' }, { label: 'Vol', value: '10L' }, { label: 'Finish', value: 'Smooth' }] },
    { name: 'Nerolac Paints Primer 20L', priceMin: 895, priceMax: 1095, moq: 25, specs: [{ label: 'Type', value: 'Primer' }, { label: 'Vol', value: '20L' }, { label: 'Application', value: 'Interior/Exterior' }] },
  ]},
  'sanitaryware': { products: [
    { name: 'Hindware Wall Hung WC', priceMin: 3495, priceMax: 4495, moq: 10, specs: [{ label: 'Type', value: 'Wall Hung' }, { label: 'Material', value: 'Vitreous China' }, { label: 'Flush', value: 'Dual 3/6L' }] },
    { name: 'Jaguar Wash Basin 60cm', priceMin: 1495, priceMax: 1995, moq: 15, specs: [{ label: 'Size', value: '60x45cm' }, { label: 'Material', value: 'Vitreous China' }, { label: 'Mount', value: 'Wall Drop-In' }] },
    { name: 'Cera Single Lever Mixer', priceMin: 595, priceMax: 795, moq: 40, specs: [{ label: 'Type', value: 'Single Lever' }, { label: 'Finish', value: 'Chrome' }, { label: 'Warranty', value: '5 Years' }] },
  ]},
  'hardware': { products: [
    { name: 'Stanley 16oz Claw Hammer', priceMin: 195, priceMax: 245, moq: 50, specs: [{ label: 'Weight', value: '16 oz' }, { label: 'Handle', value: 'Fiberglass' }, { label: 'Head', value: 'Forged Steel' }] },
    { name: 'Bosch 13mm Impact Drill', priceMin: 2495, priceMax: 2995, moq: 10, specs: [{ label: 'Chuck', value: '13mm Keyless' }, { label: 'Power', value: '750W' }, { label: 'RPM', value: '0-2800' }] },
    { name: 'Godrej Mortice Lock', priceMin: 345, priceMax: 445, moq: 60, specs: [{ label: 'Type', value: 'Mortice' }, { label: 'Body', value: 'Brass' }, { label: 'Keys', value: '3' }] },
  ]},
  'corrugated-boxes': { products: [
    { name: '3-Ply Corrugated Box 12x10x8', priceMin: 18, priceMax: 24, moq: 1000, specs: [{ label: 'Ply', value: '3' }, { label: 'Size', value: '12x10x8 inch' }, { label: 'Material', value: 'Kraft Paper' }] },
    { name: '5-Ply Shipping Carton 18x12x12', priceMin: 35, priceMax: 45, moq: 500, specs: [{ label: 'Ply', value: '5' }, { label: 'Size', value: '18x12x12 inch' }, { label: 'Burst', value: '14 kg/cm²' }] },
    { name: 'Printed Gift Box 10x8x4', priceMin: 12, priceMax: 18, moq: 2000, specs: [{ label: 'Material', value: 'Paperboard' }, { label: 'Finish', value: 'Matte Lamination' }] },
  ]},
  'office-furniture': { products: [
    { name: 'Featherlite Mesh Chair', priceMin: 2495, priceMax: 3495, moq: 10, specs: [{ label: 'Type', value: 'Ergonomic' }, { label: 'Material', value: 'Mesh + PU' }, { label: 'Warranty', value: '3 Years' }] },
    { name: 'Durian L-Shape Desk 150cm', priceMin: 8995, priceMax: 12995, moq: 5, specs: [{ label: 'Size', value: '150x150cm' }, { label: 'Material', value: 'MDF + Laminate' }, { label: 'Drawers', value: '3' }] },
    { name: 'Godrej Interio Cabinet 4-Door', priceMin: 12995, priceMax: 15995, moq: 5, specs: [{ label: 'Doors', value: '4' }, { label: 'Material', value: 'Steel' }, { label: 'Shelf Capacity', value: '50 kg' }] },
  ]},
  'living-room-furniture': { products: [
    { name: 'Urban Ladder 3-Seater Sofa', priceMin: 14995, priceMax: 19995, moq: 5, specs: [{ label: 'Seats', value: '3' }, { label: 'Upholstery', value: 'Fabric' }, { label: 'Warranty', value: '5 Years' }] },
    { name: 'Wooden Street Centre Table', priceMin: 4995, priceMax: 6995, moq: 10, specs: [{ label: 'Material', value: 'Sheesham Wood' }, { label: 'Size', value: '90x60x45cm' }, { label: 'Finish', value: 'Natural Teak' }] },
    { name: 'Pepperfry TV Unit 6ft', priceMin: 8495, priceMax: 9995, moq: 8, specs: [{ label: 'Length', value: '6 ft' }, { label: 'Material', value: 'Engineered Wood' }, { label: 'Storage', value: '2 Drawers + Open' }] },
  ]},
  'notebooks-diaries': { products: [
    { name: 'Classmate Pulse Notebook 172pg', priceMin: 45, priceMax: 55, moq: 500, specs: [{ label: 'Pages', value: '172' }, { label: 'Size', value: '21x27cm' }, { label: 'Binding', value: 'Spiral' }] },
    { name: 'Navneet Premium Diary A5', priceMin: 195, priceMax: 245, moq: 100, specs: [{ label: 'Size', value: 'A5' }, { label: 'Pages', value: '200' }, { label: 'Cover', value: 'PU Leather' }] },
    { name: 'ITC Classmate Copy 200pg', priceMin: 35, priceMax: 45, moq: 1000, specs: [{ label: 'Pages', value: '200' }, { label: 'Size', value: 'A4' }, { label: 'Type', value: 'Long Book' }] },
  ]},
  'writing-instruments': { products: [
    { name: 'Parker Vector Ball Pen', priceMin: 95, priceMax: 145, moq: 200, specs: [{ label: 'Type', value: 'Ball Pen' }, { label: 'Body', value: 'SS' }, { label: 'Ink', value: 'Blue/Black' }] },
    { name: 'Reynolds 045 Fine Grip 10pc', priceMin: 95, priceMax: 125, moq: 500, specs: [{ label: 'Pack', value: '10 Gel Pens' }, { label: 'Tip', value: '0.5mm' }, { label: 'Ink', value: 'Assorted' }] },
    { name: 'Camlin Kokuyo Pencil 12pc', priceMin: 75, priceMax: 95, moq: 500, specs: [{ label: 'Pack', value: '12 Pencils' }, { label: 'Grade', value: 'HB/2B' }, { label: 'Eraser', value: 'Included' }] },
  ]},
  'hair-care': { products: [
    { name: 'Dove Hair Oil 200ml', priceMin: 145, priceMax: 185, moq: 100, specs: [{ label: 'Volume', value: '200ml' }, { label: 'Type', value: 'Hair Oil' }, { label: 'Ingredient', value: 'Coconut + Almond' }] },
    { name: 'L\'Oreal Paris Shampoo 1L', priceMin: 395, priceMax: 495, moq: 30, specs: [{ label: 'Volume', value: '1L' }, { label: 'Type', value: 'Sulfate Free' }, { label: 'For', value: 'Damaged Hair' }] },
    { name: 'Pantene Conditioner 200ml', priceMin: 195, priceMax: 245, moq: 60, specs: [{ label: 'Volume', value: '200ml' }, { label: 'Type', value: 'Conditioner' }, { label: 'Formula', value: 'Pro-Vitamin' }] },
  ]},
  'skin-care': { products: [
    { name: 'Ponds Face Wash 100g', priceMin: 85, priceMax: 115, moq: 150, specs: [{ label: 'Size', value: '100g' }, { label: 'Type', value: 'Face Wash' }, { label: 'Skin Type', value: 'Oily' }] },
    { name: 'Nivea Body Lotion 400ml', priceMin: 245, priceMax: 295, moq: 50, specs: [{ label: 'Volume', value: '400ml' }, { label: 'Type', value: 'Body Lotion' }, { label: 'SPF', value: '15' }] },
    { name: 'Lakme Sunscreen SPF 50 50g', priceMin: 295, priceMax: 345, moq: 40, specs: [{ label: 'SPF', value: '50 PA+++' }, { label: 'Size', value: '50g' }, { label: 'Type', value: 'Sunscreen Gel' }] },
  ]},
  'footwear': { products: [
    { name: 'Bata Men\'s Formal Shoes', priceMin: 595, priceMax: 795, moq: 40, specs: [{ label: 'Material', value: 'Leather' }, { label: 'Sole', value: 'PU' }, { label: 'Sizes', value: '7-12' }] },
    { name: 'Liberty Canvas Shoes', priceMin: 345, priceMax: 445, moq: 60, specs: [{ label: 'Upper', value: 'Canvas' }, { label: 'Sole', value: 'Rubber' }, { label: 'Sizes', value: '6-11' }] },
    { name: 'Campus Sports Shoes', priceMin: 395, priceMax: 545, moq: 50, specs: [{ label: 'Upper', value: 'Mesh' }, { label: 'Sole', value: 'EVA' }, { label: 'Closure', value: 'Lace Up' }] },
  ]},
  'snacks-namkeen': { products: [
    { name: 'Haldiram\'s Aloo Bhujia 200g', priceMin: 48, priceMax: 58, moq: 500, specs: [{ label: 'Weight', value: '200g' }, { label: 'Type', value: 'Namkeen' }, { label: 'Shelf Life', value: '6 Months' }] },
    { name: 'Balaji Wafers 100g (Multipack 50)', priceMin: 22, priceMax: 28, moq: 1000, specs: [{ label: 'Weight', value: '100g/pack' }, { label: 'Pack', value: '50 Pieces' }, { label: 'Flavor', value: 'Assorted' }] },
    { name: 'Parle Hide & Seek 300g', priceMin: 85, priceMax: 105, moq: 500, specs: [{ label: 'Weight', value: '300g' }, { label: 'Type', value: 'Biscuits' }, { label: 'Pack', value: 'Jar Pack' }] },
  ]},
  'spices-masala': { products: [
    { name: 'MDH Turmeric Powder 500g', priceMin: 95, priceMax: 125, moq: 200, specs: [{ label: 'Weight', value: '500g' }, { label: 'Type', value: 'Pure Turmeric' }, { label: 'Purity', value: '99.5%' }] },
    { name: 'Everest Garam Masala 200g', priceMin: 145, priceMax: 185, moq: 150, specs: [{ label: 'Weight', value: '200g' }, { label: 'Blend', value: '12 Spices' }, { label: 'Pack', value: 'Pouch' }] },
    { name: 'Catch Red Chilli Powder 1kg', priceMin: 195, priceMax: 245, moq: 100, specs: [{ label: 'Weight', value: '1kg' }, { label: 'Type', value: 'Pure Ground' }, { label: 'Heat Level', value: 'Medium' }] },
  ]},
  'rice-grains': { products: [
    { name: 'India Gate Basmati Rice 5kg', priceMin: 295, priceMax: 395, moq: 100, specs: [{ label: 'Weight', value: '5kg' }, { label: 'Type', value: 'Basmati' }, { label: 'Ageing', value: '2 Years' }] },
    { name: 'Fortune Toor Dal 1kg', priceMin: 95, priceMax: 125, moq: 200, specs: [{ label: 'Weight', value: '1kg' }, { label: 'Type', value: 'Toor Dal' }, { label: 'Grade', value: 'A Grade' }] },
    { name: 'Tata Sampann Moong Dal 1kg', priceMin: 85, priceMax: 115, moq: 200, specs: [{ label: 'Weight', value: '1kg' }, { label: 'Type', value: 'Moong Dal' }, { label: 'Protein', value: '24g/100g' }] },
  ]},
  'tea-coffee': { products: [
    { name: 'Taj Mahal Tea Bags 100s', priceMin: 195, priceMax: 245, moq: 100, specs: [{ label: 'Count', value: '100 Bags' }, { label: 'Type', value: 'Black Tea' }, { label: 'Region', value: 'Assam Blend' }] },
    { name: 'Bru Instant Coffee 200g', priceMin: 295, priceMax: 345, moq: 60, specs: [{ label: 'Weight', value: '200g' }, { label: 'Type', value: 'Instant' }, { label: 'Jar', value: 'Glass' }] },
    { name: 'Darjeeling First Flush 250g', priceMin: 495, priceMax: 695, moq: 30, specs: [{ label: 'Weight', value: '250g' }, { label: 'Flush', value: 'First Flush' }, { label: 'Notes', value: 'Muscatel' }] },
  ]},
  'medical-equipment': { products: [
    { name: 'Omron BP Monitor HEM 7120', priceMin: 1995, priceMax: 2495, moq: 15, specs: [{ label: 'Type', value: 'Upper Arm' }, { label: 'Memory', value: '60 Readings' }, { label: 'Warranty', value: '5 Years' }] },
    { name: 'Dr Morepen Glucometer', priceMin: 645, priceMax: 795, moq: 30, specs: [{ label: 'Range', value: '20-600 mg/dL' }, { label: 'Memory', value: '500' }, { label: 'Test Time', value: '5 Seconds' }] },
    { name: 'AccuSure Thermometer', priceMin: 195, priceMax: 245, moq: 50, specs: [{ label: 'Type', value: 'Digital' }, { label: 'Time', value: '10 Sec' }, { label: 'Accuracy', value: '±0.1°C' }] },
  ]},
  'ayurvedic': { products: [
    { name: 'Dabur Chyawanprash 1kg', priceMin: 395, priceMax: 495, moq: 30, specs: [{ label: 'Weight', value: '1kg' }, { label: 'Type', value: 'Classic' }, { label: 'Herbs', value: '40+ Ayurvedic' }] },
    { name: 'Zandu Pancharishta 450ml', priceMin: 145, priceMax: 195, moq: 60, specs: [{ label: 'Volume', value: '450ml' }, { label: 'Type', value: 'Ayurvedic Tonic' }, { label: 'Uses', value: 'Digestive Health' }] },
    { name: 'Himalaya Liv 52 DS 60 Tabs', priceMin: 115, priceMax: 145, moq: 100, specs: [{ label: 'Count', value: '60 Tablets' }, { label: 'Type', value: 'Herbal' }, { label: 'For', value: 'Liver Health' }] },
  ]},
  'dry-fruits': { products: [
    { name: 'Premium California Almonds 1kg', priceMin: 495, priceMax: 595, moq: 50, specs: [{ label: 'Weight', value: '1kg' }, { label: 'Grade', value: 'Premium' }, { label: 'Pack', value: 'Vacuum Sealed' }] },
    { name: 'Kashmiri Walnuts 500g', priceMin: 445, priceMax: 545, moq: 30, specs: [{ label: 'Weight', value: '500g' }, { label: 'Origin', value: 'Kashmir' }, { label: 'Type', value: 'Akrot Giri' }] },
    { name: 'Organic Dates Medjool 1kg', priceMin: 695, priceMax: 895, moq: 25, specs: [{ label: 'Weight', value: '1kg' }, { label: 'Grade', value: 'Premium' }, { label: 'Origin', value: 'Kutch' }] },
  ]},
  'leather-bags': { products: [
    { name: 'Hidesign Leather Laptop Bag', priceMin: 2995, priceMax: 3995, moq: 10, specs: [{ label: 'Material', value: 'Full Grain Leather' }, { label: 'Laptop', value: '15.6 inch' }, { label: 'Compartments', value: '3' }] },
    { name: 'Da Milano Leather Wallet', priceMin: 1495, priceMax: 1995, moq: 20, specs: [{ label: 'Material', value: 'Genuine Leather' }, { label: 'Slots', value: '8+1 ID' }, { label: 'RFID', value: 'Blocking' }] },
    { name: 'Leather Shoulder Bag Women', priceMin: 1995, priceMax: 2495, moq: 15, specs: [{ label: 'Material', value: 'Buffalo Leather' }, { label: 'Strap', value: 'Adjustable' }, { label: 'Pockets', value: '4' }] },
  ]},
  'cotton-fabrics': { products: [
    { name: 'Cotton Shirting Fabric 44"', priceMin: 95, priceMax: 145, moq: 100, specs: [{ label: 'Width', value: '44 inch' }, { label: 'GSM', value: '120' }, { label: 'Fiber', value: '100% Cotton' }] },
    { name: 'Grey Cotton Fabric 60"', priceMin: 65, priceMax: 85, moq: 200, specs: [{ label: 'Width', value: '60 inch' }, { label: 'GSM', value: '80' }, { label: 'Use', value: 'Dyeing Base' }] },
    { name: 'Organic Cotton Voile 44"', priceMin: 145, priceMax: 195, moq: 50, specs: [{ label: 'Width', value: '44 inch' }, { label: 'Cert', value: 'GOTS' }, { label: 'Weight', value: '100 GSM' }] },
  ]},
  'corporate-gifts': { products: [
    { name: 'Custom Diary with Pen Set', priceMin: 195, priceMax: 295, moq: 100, specs: [{ label: 'Includes', value: 'Diary + Pen' }, { label: 'Customization', value: 'Logo Print' }, { label: 'Cover', value: 'PU Leather' }] },
    { name: 'Promotional USB Power Bank', priceMin: 345, priceMax: 445, moq: 100, specs: [{ label: 'Capacity', value: '5000mAh' }, { label: 'Branding', value: 'Laser Engrave' }, { label: 'Colors', value: '5 Options' }] },
    { name: 'Corporate Gift Hamper', priceMin: 495, priceMax: 795, moq: 50, specs: [{ label: 'Includes', value: '5 Items' }, { label: 'Pack', value: 'Premium Box' }, { label: 'Items', value: 'Pen+Mug+Tissue+Coaster' }] },
  ]},
  'plastic-molded': { products: [
    { name: 'Sintex Plastic Chair', priceMin: 445, priceMax: 545, moq: 50, specs: [{ label: 'Material', value: 'PP' }, { label: 'Weight Capacity', value: '150 kg' }, { label: 'Color', value: 'Assorted' }] },
    { name: 'Nilkamal Plastic Stool', priceMin: 195, priceMax: 245, moq: 100, specs: [{ label: 'Height', value: '45cm' }, { label: 'Material', value: 'PP' }, { label: 'Capacity', value: '120 kg' }] },
    { name: 'Plastic Storage Crate 50L', priceMin: 295, priceMax: 345, moq: 60, specs: [{ label: 'Capacity', value: '50L' }, { label: 'Material', value: 'HDPE' }, { label: 'Stackable', value: 'Yes' }] },
  ]},
  'imitation-jewelry': { products: [
    { name: 'Kundan Necklace Set', priceMin: 495, priceMax: 795, moq: 20, specs: [{ label: 'Material', value: 'Gold Plated' }, { label: 'Stones', value: 'Kundan + Polki' }, { label: 'Set', value: 'Necklace + Earrings' }] },
    { name: 'American Diamond Set', priceMin: 345, priceMax: 495, moq: 30, specs: [{ label: 'Material', value: 'Silver + CZ' }, { label: 'Set', value: 'Necklace+Earring+Bracelet' }] },
    { name: 'Oxidized Silver Earrings', priceMin: 95, priceMax: 145, moq: 60, specs: [{ label: 'Material', value: 'German Silver' }, { label: 'Type', value: 'Jhumka' }, { label: 'Finish', value: 'Oxidized' }] },
  ]},
  'safety-gear': { products: [
    { name: '3M N95 Respirator Mask', priceMin: 45, priceMax: 65, moq: 500, specs: [{ label: 'Standard', value: 'N95' }, { label: 'FDA', value: 'Approved' }, { label: 'Pack', value: '50 Pieces' }] },
    { name: 'Safety Goggles Anti-Fog', priceMin: 55, priceMax: 75, moq: 200, specs: [{ label: 'Lens', value: 'PC Anti-Fog' }, { label: 'Frame', value: 'PVC' }, { label: 'Ventilation', value: 'Indirect' }] },
    { name: 'Industrial Safety Gloves', priceMin: 95, priceMax: 145, moq: 100, specs: [{ label: 'Type', value: 'Cut Resistant' }, { label: 'Level', value: '5' }, { label: 'Material', value: 'HPPE + SS' }] },
  ]},
  'car-parts': { products: [
    { name: 'Maruti 800 Brake Pad Set', priceMin: 345, priceMax: 445, moq: 30, specs: [{ label: 'Fits', value: 'Maruti 800/Alto' }, { label: 'Type', value: 'Front Disc' }, { label: 'Material', value: 'Ceramic' }] },
    { name: 'Bosch Car Battery 12V 35AH', priceMin: 2495, priceMax: 2995, moq: 10, specs: [{ label: 'Voltage', value: '12V' }, { label: 'Capacity', value: '35AH' }, { label: 'Warranty', value: '24 Months' }] },
    { name: 'Michelin Tyre 175/65 R14', priceMin: 2995, priceMax: 3495, moq: 20, specs: [{ label: 'Size', value: '175/65 R14' }, { label: 'Type', value: 'Tubeless' }, { label: 'Life', value: '60000 km' }] },
  ]},
};

async function main() {
  console.log('🧹 Clearing existing data...');
  const deleteOrder = ['Message', 'ConversationParticipant', 'Conversation', 'OrderItem', 'Order', 'Address', 'CompareItem', 'WishlistItem', 'CartItem', 'Review', 'ProductCertification', 'ProductSpecification', 'ProductImage', 'BulkPrice', 'Product', 'SupplierCertification', 'Supplier', 'Session', 'User', 'Category'];
  for (const model of deleteOrder) {
    try { await (prisma as any)[model].deleteMany(); } catch {}
  }

  // ─── 1. CATEGORIES ───────────────────────────────────────
  console.log('📁 Creating categories...');
  const categoryDefs = generateCategories(rng);
  const catMap: Record<string, string> = {};
  for (const def of categoryDefs.filter(c => !c.parentSlug)) {
    const cat = await prisma.category.create({ data: { name: def.name, slug: def.slug, description: def.description, icon: def.icon } });
    catMap[def.slug] = cat.id;
  }
  for (const def of categoryDefs.filter(c => c.parentSlug)) {
    const parentId = catMap[def.parentSlug!];
    if (parentId) {
      const cat = await prisma.category.create({ data: { name: def.name, slug: def.slug, description: def.description, icon: def.icon, parentId } });
      catMap[def.slug] = cat.id;
    }
  }
  console.log(`   ✅ ${Object.keys(catMap).length} categories`);

  // ─── 2. SUPPLIERS WITH ECOSYSTEM ─────────────────────────
  console.log('🏭 Creating suppliers with company profiles...');
  const citySlugs = Object.keys(CITY_CLUSTERS);
  const supplierIds: string[] = [];
  const supplierCities: Record<string, string> = {};
  const allProductIds: string[] = [];
  const productSupplierMap: Record<string, string> = {};

const STATE_MAP: { [key: string]: string } = {
  'Agra': 'Uttar Pradesh', 'Ahmedabad': 'Gujarat', 'Amritsar': 'Punjab',
  'Aurangabad': 'Maharashtra', 'Bengaluru': 'Karnataka', 'Bhopal': 'Madhya Pradesh',
  'Bhubaneswar': 'Odisha', 'Chandigarh': 'Chandigarh', 'Chennai': 'Tamil Nadu',
  'Delhi': 'Delhi', 'Ghaziabad': 'Uttar Pradesh', 'Guwahati': 'Assam',
  'Hyderabad': 'Telangana', 'Indore': 'Madhya Pradesh', 'Jaipur': 'Rajasthan',
  'Kolkata': 'West Bengal', 'Lucknow': 'Uttar Pradesh', 'Ludhiana': 'Punjab',
  'Moradabad': 'Uttar Pradesh', 'Mumbai': 'Maharashtra', 'Nagpur': 'Maharashtra',
  'Noida': 'Uttar Pradesh', 'Patna': 'Bihar', 'Pune': 'Maharashtra',
  'Rajkot': 'Gujarat', 'Surat': 'Gujarat', 'Tiruppur': 'Tamil Nadu',
  'Vadodara': 'Gujarat', 'Varanasi': 'Uttar Pradesh', 'Visakhapatnam': 'Andhra Pradesh',
};

  for (let si = 0; si < 200; si++) {
    const city = citySlugs[si % citySlugs.length];
    const cluster = CITY_CLUSTERS[city];
    const supplierState = STATE_MAP[city] || 'Maharashtra';
    const personaLity = SUPPLIER_PERSONALITIES[si % SUPPLIER_PERSONALITIES.length];
    const factoryAmenities = pickN(FACTORY_AMENITIES, 2, 4).join(', ');

    // Pick company profile
    const profile = COMPANY_NAMES[si % COMPANY_NAMES.length];
    const companyName = `${profile.name} ${profile.suffix}`;
    const slug = slugify(companyName) + '-' + si;
    const founder = FOUNDERS[si % FOUNDERS.length];
    const estYear = cluster.estYearRange[0] + (si * 7 % (cluster.estYearRange[1] - cluster.estYearRange[0]));
    const verified = si % 4 !== 0;
    const premium = si % 7 === 0;
    const employees = pick(['10-25', '25-50', '50-100', '100-200', '200-500']);
    const rating = parseFloat((3.6 + rng.float(0, 1.2)).toFixed(1));

    // Create user account for supplier
    const supUser = await prisma.user.create({
      data: {
        email: `info@${slug}.com`,
        passwordHash: '$2b$10$8K1p/a0dL1LXMIgoEDFrwOfMQkfHs.8Jx5H5OM8STeKxX3J8yG8uW',
        name: `${founder.first} ${founder.last}`,
        phone: generatePhone(rng),
        role: 'SUPPLIER',
        companyName,
        gstNumber: generateGstNumber(rng, supplierState.slice(0, 2).toUpperCase()),
        isEmailVerified: true,
      },
    });

    const supplier = await prisma.supplier.create({
      data: {
        userId: supUser.id,
        companyName,
        slug,
        logo: `https://picsum.photos/seed/${slug}-logo/200/200`,
        coverImage: `https://picsum.photos/seed/${slug}-cover/1200/400`,
        description: `${companyName} is a ${personaLity.type.toLowerCase()} — ${personaLity.focus}. Based in ${city}, ${supplierState} (${cluster.desc}). Founded in ${estYear} by ${founder.first} ${founder.last}, the company has grown into ${personaLity.factory} employing ${employees} people. ${personaLity.pitch} ${personaLity.exports} (${personaLity.export_pct} of revenue). Infrastructure includes ${factoryAmenities}.`,
        yearEstablished: estYear,
        employeeCount: employees,
        location: `${city}, ${supplierState}`,
        city,
        state: supplierState,
        contactEmail: `info@${slug}.com`,
        contactPhone: generatePhone(rng),
        website: `https://${slug}.com`,
        isVerified: verified,
        isPremium: premium,
        responseTime: pick(['Within 1 hour', 'Within 4 hours', 'Within 12 hours', 'Within 24 hours']),
        rating,
        reviewCount: 0,
      },
    });
    supplierIds.push(supplier.id);
    supplierCities[supplier.id] = city;

    // Add certifications
    const supCerts = pickN(['ISO 9001:2015', 'ISO 14001', 'MSME Registered', 'GST Compliant', 'IEC Certified', 'BIS Certified', 'FSSAI Certified', 'CE Marked'], 1, 4);
    for (const cert of supCerts) {
      try { await prisma.supplierCertification.create({ data: { supplierId: supplier.id, name: cert, issuedBy: cert.includes('ISO') ? 'Bureau of Indian Standards' : cert.includes('FSSAI') ? 'FSSAI' : 'DGFT' } }); } catch {}
    }

    // ─── PRODUCTS ────────────────────────────────────────
    const supplierCatSlugs = cluster.slugs.filter(s => catMap[s]).slice(0, 2);
    const productsPerCat = rng.int(5, 15);
    let prodCount = 0;

    for (const catSlug of supplierCatSlugs) {
      const categoryId = catMap[catSlug];
      const productData = CATEGORY_PRODUCTS[catSlug];
      if (!productData) continue;

      const availableProds = rng.shuffle(productData.products);
      const numProds = Math.min(productsPerCat, availableProds.length);

      for (let pi = 0; pi < numProds; pi++) {
        const tmpl = availableProds[pi];
        const gstRate = pick([0, 5, 12, 18, 28]);
        const productName = tmpl.name;
        const productSlug = slugify(`${companyName.slice(0, 15)}-${productName}`) + `-${si}-${pi}`;
        const price = rng.float(tmpl.priceMin, tmpl.priceMax);

        const product = await prisma.product.create({
          data: {
            name: productName,
            slug: productSlug,
            description: `${companyName} offers ${productName} at competitive wholesale prices. ${pick(['Lead time: 5-7 business days', 'Lead time: 7-10 business days', 'Lead time: 10-15 business days'])}. ${pick(['Standard corrugated box packaging', 'Export-grade bubble wrap packaging', 'Retail-ready blister packaging', 'Bulk packaging in gunny bags'])}. ${pick(['Customization available on request', 'Private labeling available', 'Sample available (cost adjustable in bulk)', 'OEM/ODM accepted'])}. ${tmpl.specs.map(s => `${s.label}: ${s.value}`).join('. ')}. Quality assured with timely pan-India delivery.${personaLity.type === 'Eco-Friendly Producer' ? ' Eco-friendly packaging with recycled materials.' : ''}`,
            shortDescription: `${productName} - Wholesale by ${companyName}, ${city}. ${pick(['Best price', 'Premium quality', 'Bulk supply available', 'Pan India delivery', 'Custom OEM available', 'Export quality', 'Sample available'])}. MOQ: ${tmpl.moq} pcs. ${pick(['GST invoice provided', 'Pan India shipping', 'Ready to dispatch'])}.`,
            price,
            compareAtPrice: rng.next() > 0.5 ? price * rng.float(1.15, 1.35) : undefined,
            minOrder: tmpl.moq,
            unit: 'pieces',
            categoryId,
            supplierId: supplier.id,
            rating: 0,
            reviewCount: 0,
            inStock: true,
            stockCount: rng.int(tmpl.moq * 5, tmpl.moq * 30),
            hsnCode: generateHsnCode(rng),
            gstRate,
            tags: [catSlug, city.toLowerCase(), 'wholesale', personaLity.type.replace(/\s+/g, '-').toLowerCase()],
            featured: si % 5 === 0 && pi < 3,
            isActive: true,
            metaTitle: `${productName} | Wholesale Price | ${companyName}`,
            metaDescription: `Buy ${productName} at wholesale price. MOQ: ${tmpl.moq} pieces. ${companyName}, ${city}.`,
          },
        });
        allProductIds.push(product.id);
        productSupplierMap[product.id] = supplier.id;
        prodCount++;

        // Bulk pricing
        const bulkData = [];
        for (let b = 0; b < rng.int(1, 3); b++) {
          const qty = tmpl.moq * (b + 1) * (b === 0 ? 1 : rng.int(3, 8));
          const discount = 0.03 + b * 0.04 + rng.float(0, 0.02);
          const bp = Math.round(price * (1 - discount));
          const maxQty = b < 2 ? qty * rng.int(3, 6) : undefined;
          bulkData.push({ productId: product.id, minQty: qty, maxQty: maxQty || undefined, price: Math.round(bp) });
        }
        await prisma.bulkPrice.createMany({ data: bulkData, skipDuplicates: true });

        // Specifications
        if (tmpl.specs.length > 0) {
          await prisma.productSpecification.createMany({
            data: tmpl.specs.map(s => ({ productId: product.id, label: s.label, value: s.value })),
            skipDuplicates: true,
          });
        }

        // Product images
        const imgCount = rng.int(3, 6);
        for (let imgIdx = 0; imgIdx < imgCount; imgIdx++) {
          const imgType = PRODUCT_IMAGE_TYPES[imgIdx % PRODUCT_IMAGE_TYPES.length];
          await prisma.productImage.create({
            data: { productId: product.id, url: `https://picsum.photos/seed/${productSlug}-${imgType.suffix}/600/600`, alt: `${productName} - ${imgType.label} (${imgType.desc})`, order: imgIdx },
          });
        }
      }
    }

    // Update supplier product count
    await prisma.supplier.update({ where: { id: supplier.id }, data: { productCount: prodCount } });

    if ((si + 1) % 25 === 0) console.log(`   ${si + 1}/200 suppliers (${allProductIds.length} products)`);
  }
  console.log(`   ✅ 200 suppliers with ${allProductIds.length} products`);

  // ─── 3. BUYERS WITH ADDRESSES ────────────────────────────
  console.log('👤 Creating buyers...');
  const buyerIds: string[] = [];
  const buyerAddressIds: Record<string, string> = {};
  const buyerCities: Record<string, string> = {};
  const buyerNames: Record<string, string> = {};

  for (let bi = 0; bi < 1500; bi++) {
    const firstName = pick(INDIAN_FIRST_NAMES);
    const lastName = pick(INDIAN_LAST_NAMES);
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}${lastName.toLowerCase()}${bi}@email.com`;
    const allBuyerCities = ['Mumbai', 'Delhi', 'Bengaluru', 'Ahmedabad', 'Chennai', 'Kolkata', 'Surat', 'Pune', 'Jaipur', 'Hyderabad', 'Lucknow', 'Indore', 'Bhopal', 'Patna', 'Nagpur', 'Chandigarh', 'Bhubaneswar', 'Guwahati'];
    const buyerCity = pick(allBuyerCities);
    const buyerState = STATE_MAP[buyerCity as string] || 'Maharashtra';
    const bizType = pick(BUYER_BUSINESS_TYPES);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: '$2b$10$8K1p/a0dL1LXMIgoEDFrwOfMQkfHs.8Jx5H5OM8STeKxX3J8yG8uW',
        name,
        phone: generatePhone(rng),
        role: 'BUYER',
        companyName: rng.next() > 0.3 ? `${name.split(' ')[1] || 'Trading'} ${bizType.suffix}` : undefined,
        isEmailVerified: true,
        createdAt: new Date(Date.now() - rng.int(30, 365) * 86400000),
      },
    });
    buyerIds.push(user.id);
    buyerCities[user.id] = buyerCity;
    buyerNames[user.id] = name;

    // 1-2 addresses
    for (let ai = 0; ai < rng.int(1, 2); ai++) {
      const addr = await prisma.address.create({
        data: {
          userId: user.id,
          label: ai === 0 ? 'Business' : 'Warehouse',
          fullName: name,
          phone: generatePhone(rng),
          line1: `${rng.int(1, 999)}, ${pick(['MG Road', 'Station Road', 'Industrial Area', 'Main Bazaar', 'Sector ' + rng.int(1, 30), 'Linking Road'])}`,
          line2: ai === 0 ? undefined : pick(['Near Bus Stand', 'Industrial Estate', 'Opposite Railway Station']),
          city: buyerCity,
          state: buyerState,
          pincode: generatePincode(rng),
          isDefault: ai === 0,
        },
      });
      if (ai === 0) buyerAddressIds[user.id] = addr.id;
    }
  }
  console.log(`   ✅ ${buyerIds.length} buyers with addresses`);

  // ─── 4. ORDERS (BUYER → SUPPLIER → PRODUCTS) ────────────
  console.log('📋 Creating orders with real buyer-supplier relationships...');
  const orderIds: string[] = [];
  const orderBuyerMap: Record<string, string> = {};
  const orderSupplierMap: Record<string, string> = {};
  const deliveredOrders: string[] = [];
  const orderProductMap: Record<string, string[]> = {};
  const statuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED'];
  const statusWeights = [5, 8, 12, 15, 45, 10, 5];

  for (let oi = 0; oi < 3000; oi++) {
    const buyerId = pick(buyerIds);
    const supplierId = pick(supplierIds);
    const buyerCity = buyerCities[buyerId];

    // Get supplier's products
    const supplierProds = allProductIds.filter(pid => productSupplierMap[pid] === supplierId);
    if (supplierProds.length < 1) continue;

    const numItems = rng.int(1, Math.min(4, supplierProds.length));
    const selectedProds = pickN(supplierProds, numItems, numItems);
    const orderProducts = [];
    let subtotal = 0;

    for (const prodId of selectedProds) {
      const prod = await prisma.product.findUnique({ where: { id: prodId }, select: { id: true, name: true, price: true, unit: true } });
      if (!prod) continue;
      const qty = rng.int(50, 500);
      const lineTotal = qty * prod.price;
      subtotal += lineTotal;
      orderProducts.push({ productId: prod.id, name: prod.name, price: prod.price, quantity: qty, unit: prod.unit, total: Math.round(lineTotal * 100) / 100 });
    }
    if (orderProducts.length === 0) continue;

    const totalWeight = statusWeights.reduce((s, w, i) => s + w * (statuses[i] === 'DELIVERED' ? 2 : 1), 0);
    let statusIdx = 0;
    let r = rng.next() * totalWeight;
    for (let i = 0; i < statuses.length; i++) {
      const w = statusWeights[i] * (statuses[i] === 'DELIVERED' ? 2 : 1);
      r -= w;
      if (r <= 0) { statusIdx = i; break; }
    }
    const status = statuses[statusIdx] as any;
    const taxRate = 0.18;
    const tax = subtotal * taxRate;
    const shipping = subtotal > 50000 ? 0 : 500;
    const total = subtotal + tax + shipping;
    const daysAgo = rng.int(1, 90);

    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-${String(10000 + oi).slice(0, 8)}`,
        userId: buyerId,
        status,
        total: Math.round(total * 100) / 100,
        subtotal: Math.round(subtotal * 100) / 100,
        shippingCost: shipping,
        taxAmount: Math.round(tax * 100) / 100,
        gstAmount: Math.round(tax * 100) / 100,
        currency: 'INR',
        supplierId,
        supplierName: (await prisma.supplier.findUnique({ where: { id: supplierId }, select: { companyName: true } }))?.companyName || 'Unknown',
        shippingAddressId: buyerAddressIds[buyerId],
        trackingNumber: status === 'SHIPPED' || status === 'DELIVERED' ? `TRK${rng.int(100000000, 999999999)}` : undefined,
        notes: rng.next() > 0.7 ? pick([
          `Urgent delivery required. Please dispatch via ${pick(COURIER_PARTNERS)}. Payment: ${pick(PAYMENT_TERMS)}.`,
          `GST invoice required. Shipping via ${pick(COURIER_PARTNERS)}. Payment terms: ${pick(PAYMENT_TERMS)}.`,
          `Call before delivery. Use ${pick(COURIER_PARTNERS)} for shipping. Invoice with e-way bill required.`,
          `Need by next week. ${pick(COURIER_PARTNERS)} preferred courier. Include packing slip and GST invoice.`,
          `Export documentation needed. Ship via ${pick(COURIER_PARTNERS)}. Commercial invoice and packing list required.`,
          `Bulk order — use palletized shipment via ${pick(COURIER_PARTNERS)}. Delivery at warehouse loading bay.`,
        ]) : undefined,
        createdAt: new Date(Date.now() - daysAgo * 86400000),
      },
    });
    orderIds.push(order.id);
    orderBuyerMap[order.id] = buyerId;
    orderSupplierMap[order.id] = supplierId;

    // Order items
    for (const op of orderProducts) {
      await prisma.orderItem.create({ data: { orderId: order.id, ...op } });
    }

    // Track delivered orders for reviews & chats
    if (status === 'DELIVERED') {
      deliveredOrders.push(order.id);
      orderProductMap[order.id] = orderProducts.map(op => op.productId);
    }
  }
  console.log(`   ✅ ${orderIds.length} orders (${deliveredOrders.length} delivered)`);

  // ─── 5. REVIEWS (ONLY FROM BUYERS WHO ORDERED) ──────────
  console.log('⭐ Creating reviews from real buyers...');
  let reviewCount = 0;
  for (const orderId of deliveredOrders) {
    const buyerId = orderBuyerMap[orderId];
    const supplierId = orderSupplierMap[orderId];
    const products = orderProductMap[orderId] || [];
    const supplier = await prisma.supplier.findUnique({ where: { id: supplierId }, select: { companyName: true } });

    for (const productId of products) {
      if (rng.next() > 0.6) continue; // ~40% of delivered orders get reviewed
      const product = await prisma.product.findUnique({ where: { id: productId }, select: { name: true } });
      if (!product) continue;

      const rating = rng.weightedPick([{ value: 5, weight: 35 }, { value: 4, weight: 30 }, { value: 3, weight: 20 }, { value: 2, weight: 10 }, { value: 1, weight: 5 }]);
      const templates = REVIEW_TEMPLATES[rating] || REVIEW_TEMPLATES[3];
      const comment = pick(templates).replace('{supplier}', supplier?.companyName || 'the supplier').replace('{product}', product.name);
      const title = rating >= 4 ? pick(['Great quality', 'Excellent product', 'Highly satisfied', 'Good purchase', 'Value for money']) : rating >= 3 ? pick(['Average experience', 'Decent product', 'As expected']) : pick(['Disappointed', 'Not as described', 'Poor quality', 'Won\'t order again']);

      try {
        await prisma.review.create({
          data: {
            productId,
            userId: buyerId,
            rating,
            title,
            comment,
            images: [],
            helpful: rng.int(0, 15),
            createdAt: new Date(Date.now() - rng.int(1, 30) * 86400000),
          },
        });
        reviewCount++;
      } catch {}
    }
  }

  // Update review counts and ratings
  await prisma.$executeRawUnsafe(`UPDATE "Product" SET "reviewCount" = (SELECT COUNT(*) FROM "Review" WHERE "Review"."productId" = "Product".id)`);
  await prisma.$executeRawUnsafe(`UPDATE "Product" SET "rating" = COALESCE((SELECT AVG("rating")::float FROM "Review" WHERE "Review"."productId" = "Product".id AND "Review"."rating" > 0), 0)`);
  await prisma.$executeRawUnsafe(`UPDATE "Supplier" SET "reviewCount" = (SELECT COALESCE(SUM("Product"."reviewCount"), 0) FROM "Product" WHERE "Product"."supplierId" = "Supplier".id)`);
  await prisma.$executeRawUnsafe(`UPDATE "Supplier" SET "rating" = (SELECT COALESCE(AVG("Product"."rating"), 0) FROM "Product" WHERE "Product"."supplierId" = "Supplier".id AND "Product"."reviewCount" > 0)`);
  console.log(`   ✅ ${reviewCount} reviews from verified buyers`);

  // ─── 6. CONVERSATIONS (BUYER ↔ SUPPLIER ABOUT ORDERS) ────
  console.log('💬 Creating conversations about real orders...');
  let convCount = 0;
  const orderPool = rng.shuffle(deliveredOrders).slice(0, 300);

  for (const orderId of orderPool) {
    const buyerId = orderBuyerMap[orderId];
    const supplierId = orderSupplierMap[orderId];
    const supplierUser = await prisma.supplier.findUnique({ where: { id: supplierId }, select: { userId: true, companyName: true } });
    if (!supplierUser) continue;

    const supplierProd = allProductIds.filter(pid => productSupplierMap[pid] === supplierId);
    const prodId = supplierProd.length > 0 ? pick(supplierProd) : undefined;
    const prod = prodId ? await prisma.product.findUnique({ where: { id: prodId }, select: { name: true } }) : undefined;

    const conv = await prisma.conversation.create({
      data: {
        productId: prodId,
        productName: prod?.name,
        lastMessage: '',
        unread: 0,
      },
    });
    await prisma.conversationParticipant.createMany({
      data: [
        { conversationId: conv.id, userId: buyerId, role: 'buyer' },
        { conversationId: conv.id, userId: supplierUser.userId, role: 'supplier' },
      ],
      skipDuplicates: true,
    });

    // Realistic business messages — pick from enhancement templates
    const userBizType = pick(BUYER_BUSINESS_TYPES);
    const msgPool = rng.shuffle(NEGOTIATION_MESSAGE_TEMPLATES).map(t => {
      const c = t.content
        .replace('{product}', prod?.name || 'your products')
        .replace('{buyer_city}', buyerCities[buyerId] || 'your city')
        .replace('{buyer_type}', userBizType.name)
        .replace('{price}', String(rng.int(200, 2000)))
        .replace('{moq}', String(rng.int(50, 500)))
        .replace('{company}', supplierUser.companyName)
        .replace('{personality_focus}', 'manufacturing and supply')
        .replace('{price_min}', String(rng.int(100, 300)))
        .replace('{price_max}', String(rng.int(300, 2000)))
        .replace('{order_value}', String(rng.int(10000, 50000)))
        .replace('{target_price}', String(rng.int(150, 300)))
        .replace('{qty}', String(rng.int(500, 5000)))
        .replace('{annual_qty}', String(rng.int(5000, 50000)))
        .replace('{days}', String(pick(['15', '30', '45', '60'])))
        .replace('{free_shipping_amt}', String(rng.int(25000, 75000)))
        .replace('{trial_qty}', String(rng.int(50, 200)))
        .replace('{counter_price}', String(rng.int(180, 350)))
        .replace('{counter_qty}', String(rng.int(500, 2000)))
        .replace('{discount_pct}', String(pick(['3', '5', '7', '10'])))
        .replace('{discount_threshold}', String(rng.int(50000, 200000)))
        .replace('{payment_days}', String(pick(['15', '30', '45'])))
        .replace('{reduced_moq}', String(rng.int(25, 100)))
        .replace('{trial_price}', String(rng.int(200, 500)))
        .replace('{contract_months}', String(pick(['3', '6', '12'])))
        .replace('{min_offtake}', String(rng.int(500, 2000)))
        .replace('{sample_cost}', String(rng.int(200, 1000)))
        .replace('{sample_delivery}', String(rng.int(3, 7)))
        .replace('{required_date}', `next ${pick(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])}`)
        .replace('{lead_time}', String(rng.int(5, 15)))
        .replace('{courier}', pick(COURIER_PARTNERS))
        .replace('{expedited_lead_time}', String(rng.int(2, 4)))
        .replace('{expedite_fee}', String(rng.int(10, 25)))
        .replace('{regular_lead_time}', String(rng.int(7, 12)))
        .replace('{bank_name}', pick(['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra']))
        .replace('{branch}', pick(['Mumbai', 'Delhi', 'Bengaluru']))
        .replace('{account_no}', String(rng.int(10000000000, 99999999999)))
        .replace('{ifsc_code}', `${pick(['HDFC', 'ICIC', 'SBIN', 'UTIB', 'KKBK'])}${String(rng.int(1000, 9999))}`)
        .replace('{payment_terms}', pick(PAYMENT_TERMS))
        .replace('{order_id}', orderId.slice(0, 8))
        .replace('{dispatch_date}', `within ${rng.int(3, 7)} business days`)
        .replace('{amount}', String(rng.int(10000, 100000)))
        .replace('{txn_ref}', `NEFT${rng.int(1000000, 9999999)}`)
        .replace('{tracking_id}', `TRK${rng.int(10000000, 99999999)}`)
        .replace('{delivery_date}', `${rng.int(3, 10)} days`)
        .replace('{tracking_url}', `track.${pick(COURIER_PARTNERS).toLowerCase()}.com/${rng.int(10000000, 99999999)}`)
        .replace('{defect_count}', String(rng.int(2, 15)))
        .replace('{increase_pct}', String(pick(['25', '50', '75', '100'])))
        .replace('{sister_concern}', `${pick(['Singh', 'Gupta', 'Patel', 'Reddy', 'Mehta'])} ${pick(['Trading Co.', 'Enterprises', 'Industries', 'Retails'])}`)
        .replace('{loyalty_discount}', String(pick(['2', '3', '5'])))
        .replace('{new_category}', pick(['home-decor', 'packaging', 'safety-gear', 'office-supplies']))
        .replace('{festive_discount}', String(pick(['5', '8', '10', '12'])))
        .replace('{festive_deadline}', `this ${pick(['Friday', 'month end', 'week'])}`)
        .replace('{compensation}', String(pick(['5', '8', '10'])))
        .replace('{years}', String(rng.int(8, 30)))
        .replace('{clients}', String(rng.int(50, 500)));
      return { content: c, role: t.role };
    });
    const msgs = msgPool.map(m => m.content);
    if (rng.next() > 0.6) msgs.push(pick(PARTY_QUOTES));

    const msgCount = rng.int(3, Math.min(6, msgs.length));
    let lastMsg = '';
    for (let mi = 0; mi < msgCount; mi++) {
      const isBuyer = mi % 2 === 0;
      const senderId = isBuyer ? buyerId : supplierUser.userId;
      const content = msgs[mi];
      const timestamp = new Date(Date.now() - (msgCount - mi) * 86400000 - rng.int(0, 12) * 3600000);
      await prisma.message.create({ data: { conversationId: conv.id, senderId, content, type: 'TEXT', createdAt: timestamp } });
      lastMsg = content;
    }
    await prisma.conversation.update({
      where: { id: conv.id },
      data: { lastMessage: lastMsg, lastMessageAt: new Date() },
    });
    convCount++;
  }
  console.log(`   ✅ ${convCount} conversations with order context`);

  // ─── 7. UPDATE COUNTS ──────────────────────────────────
  await prisma.$executeRawUnsafe(`UPDATE "Category" SET "productCount" = (SELECT COUNT(*) FROM "Product" WHERE "Product"."categoryId" = "Category".id AND "Product"."isActive" = true)`);

  const totalUsers = await prisma.user.count();
  const totalProducts = await prisma.product.count();
  const totalOrders = await prisma.order.count();
  const totalReviews = await prisma.review.count();
  const totalAddresses = await prisma.address.count();

  console.log(`\n🎉 MARKETPLACE ECOSYSTEM SEEDED!`);
  console.log(`   Categories:  ${Object.keys(catMap).length}`);
  console.log(`   Suppliers:   ${supplierIds.length} (with company profiles, certifications)`);
  console.log(`   Products:    ${totalProducts} (each with specs, images, bulk pricing)`);
  console.log(`   Buyers:      ${buyerIds.length} (with addresses)`);
  console.log(`   Orders:      ${totalOrders} (linked to real buyers & suppliers)`);
  console.log(`   Reviews:     ${totalReviews} (only from verified purchasers)`);
  console.log(`   Addresses:   ${totalAddresses}`);
  console.log(`   Users:       ${totalUsers}`);
  console.log(`   Conversations: ${convCount} (with order-context messages)`);
}

main()
  .catch((e) => { console.error('Seed failed:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
