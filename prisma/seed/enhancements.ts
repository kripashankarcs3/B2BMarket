export const SUPPLIER_PERSONALITIES = [
  {
    type: 'Premium Manufacturer',
    focus: 'high-quality precision manufacturing with strict QC protocols. Every batch undergoes rigorous testing before dispatch',
    exports: 'Exporting to Middle East, Africa, and Southeast Asian markets',
    moq_note: 'Premium product line with certified quality assurance',
    pitch: 'Quality is not just a promise — it is our process. From raw material inspection to final packaging, every stage follows ISO-certified protocols.',
    factory: 'fully automated production facility spread over 50,000 sq ft with CNC machines and precision tooling',
    export_pct: '40%',
  },
  {
    type: 'Budget Wholesaler',
    focus: 'cost-effective mass production with competitive pricing. High-volume manufacturing optimized for the Indian market',
    exports: 'Serving domestic markets across India with a strong distribution network',
    moq_note: 'Best prices for bulk orders with flexible payment terms',
    pitch: 'We believe quality essentials should be affordable. Our lean manufacturing model passes the savings directly to you.',
    factory: 'large-scale production unit with semi-automated assembly lines capable of 10,000+ units per day',
    export_pct: '5%',
  },
  {
    type: 'OEM/Private Label Specialist',
    focus: 'custom manufacturing and private labeling solutions for brands and businesses',
    exports: 'OEM export partner for brands across Europe and Asia',
    moq_note: 'Custom branding available with dedicated packaging design services',
    pitch: 'Your brand, our manufacturing. We help you launch products without investing in factories — from concept to delivery.',
    factory: 'dedicated OEM facility with separate production zones for different clients to prevent cross-contamination',
    export_pct: '55%',
  },
  {
    type: 'Export Oriented Unit',
    focus: 'export-quality production meeting rigorous international standards and compliance requirements',
    exports: '95% export to 15+ countries with full documentation and customs clearance support',
    moq_note: 'Export quality packaging with all shipping documentation included',
    pitch: 'Trusted by importers across the globe. Every shipment meets international quality benchmarks with full traceability.',
    factory: 'export-dedicated facility with fumigation chambers, metal detectors, and export-grade packaging lines',
    export_pct: '95%',
  },
  {
    type: 'Eco-Friendly Producer',
    focus: 'sustainable and eco-friendly manufacturing processes with minimal environmental impact',
    exports: 'Green manufacturing certified by global environmental bodies, serving eco-conscious buyers',
    moq_note: 'Eco-friendly packaging using recycled and biodegradable materials',
    pitch: 'Sustainability meets affordability. Our solar-powered facility and zero-waste processes make your supply chain greener.',
    factory: 'solar-powered green factory with rainwater harvesting, effluent treatment plant, and zero-liquid-discharge system',
    export_pct: '30%',
  },
  {
    type: 'Heritage Artisan',
    focus: 'traditional craftsmanship passed down through generations with authentic age-old techniques',
    exports: 'Heritage products appreciated by connoisseurs worldwide',
    moq_note: 'Handcrafted with authentic traditional techniques. Each piece is unique.',
    pitch: 'Centuries of craft, preserved in every piece. Our artisans bring generations of wisdom to every product we create.',
    factory: 'heritage workshop employing 50+ master craftsmen with 15+ years of experience in traditional techniques',
    export_pct: '60%',
  },
  {
    type: 'Industrial Giant',
    focus: 'large-scale industrial production with advanced machinery and dedicated R&D wing',
    exports: 'Pan-India distribution with a dedicated logistics fleet of 50+ trucks',
    moq_note: 'Industrial grade with guaranteed volume supply and just-in-time delivery',
    pitch: 'When you need scale, we deliver. Our infrastructure is built for industrial-volume requirements with zero compromise.',
    factory: 'sprawling 2-acre industrial campus with fully automated production lines, in-house lab, and warehouse',
    export_pct: '25%',
  },
  {
    type: 'Startup Innovator',
    focus: 'innovative products with modern design thinking and agile manufacturing',
    exports: 'Fast-growing supplier with modern e-commerce integration and digital-first operations',
    moq_note: 'Digital-first supplier with real-time order tracking and instant confirmation',
    pitch: 'We combine manufacturing expertise with startup agility. Fast turnaround, modern designs, and transparent communication.',
    factory: 'modern compact facility with 3D prototyping, CAD design studio, and flexible production lines',
    export_pct: '15%',
  },
  {
    type: 'Family Business Veteran',
    focus: 'trust and relationship-driven business with decades of market presence',
    exports: 'Long-standing relationships with buyers across India built on trust and consistency',
    moq_note: 'Relationship-first approach with personalized service for every client',
    pitch: 'Three decades, two generations, one commitment — quality and trust. Our reputation is our most valuable asset.',
    factory: 'established manufacturing unit with experienced workforce, many with 10+ years of service',
    export_pct: '10%',
  },
  {
    type: 'Tech-Enabled Manufacturer',
    focus: 'technology-driven manufacturing with ERP integration and real-time production monitoring',
    exports: 'API-integrated supply chain for seamless order management across geographies',
    moq_note: 'Tech-driven supply chain with automated order processing and dispatch',
    pitch: 'Industry 4.0 meets Indian manufacturing. Track your order from raw material to dispatch with our digital platform.',
    factory: 'smart factory with IoT-enabled machines, real-time dashboards, and automated quality control stations',
    export_pct: '35%',
  },
  {
    type: 'Value-Added Reseller',
    focus: 'curated product sourcing with value-added services like kitting, repackaging, and quality checks',
    exports: 'Sourcing and consolidation partner for international buyers',
    moq_note: 'Consolidated shipments from multiple manufacturers with single-invoice convenience',
    pitch: 'We do the sourcing so you can focus on selling. Quality-checked, repackaged, and delivered — all from one partner.',
    factory: 'centralized processing center with sorting lines, repackaging units, and quality inspection stations',
    export_pct: '45%',
  },
  {
    type: 'Government Approved Vendor',
    focus: 'DGS&D approved vendor with experience in government and PSU supply contracts',
    exports: 'Registered with government e-marketplace (GeM) for public procurement',
    moq_note: 'GeM registered vendor with experience in institutional supply contracts',
    pitch: 'Approved by government procurement agencies with a track record of institutional supply excellence.',
    factory: 'compliant facility meeting all government vendor audit requirements with dedicated QA team',
    export_pct: '0%',
  },
];

export const BUYER_BUSINESS_TYPES = [
  { name: 'Retail Chain', suffix: 'Retails Pvt. Ltd.', traits: ['multi-location', 'high-volume', 'brand-conscious'] },
  { name: 'Wholesale Distributor', suffix: 'Distributorship', traits: ['bulk-buyer', 'price-sensitive', 'credit-seeking'] },
  { name: 'Online Marketplace Seller', suffix: 'E-Commerce Ventures', traits: ['inventory-driven', 'fast-shipping', 'catalog-variety'] },
  { name: 'Institutional Buyer', suffix: 'Institutions', traits: ['tender-based', 'compliance-focused', 'long-term'] },
  { name: 'Export Trader', suffix: 'Exports International', traits: ['quality-focused', 'documentation-heavy', 'standards-driven'] },
  { name: 'Hotel & Hospitality', suffix: 'Hospitality Pvt. Ltd.', traits: ['premium-quality', 'regular-orders', 'service-oriented'] },
  { name: 'Contract Manufacturer', suffix: 'Industries', traits: ['raw-material-hungry', 'spec-driven', 'just-in-time'] },
  { name: 'Government Contractor', suffix: 'Govt. Supplies', traits: ['tender-focused', 'compliance-heavy', 'budget-constrained'] },
  { name: 'E-commerce Fulfillment', suffix: 'Fulfillment Services', traits: ['drop-shipping', 'fast-turnaround', 'pan-india'] },
  { name: 'Industrial User', suffix: 'Manufacturing Division', traits: ['raw-material', 'quality-specs', 'regular-reorder'] },
  { name: 'Pharma & Healthcare', suffix: 'Healthcare Solutions', traits: ['regulated', 'certification-focused', 'cold-chain'] },
  { name: 'Construction Developer', suffix: 'Developers Pvt. Ltd.', traits: ['project-based', 'volume-heavy', 'credit-seeking'] },
  { name: 'School & Educational', suffix: 'Educational Supplies', traits: ['seasonal-buying', 'budget-conscious', 'bulk-uniform'] },
  { name: 'Exhibition Organizer', suffix: 'Events & Exhibitions', traits: ['project-based', 'urgent-delivery', 'custom-requests'] },
  { name: 'Bulk Importer', suffix: 'Import Trading Co.', traits: ['container-volumes', 'price-sensitive', 'quality-certified'] },
];

export const PRODUCT_IMAGE_TYPES = [
  { label: 'Front View', suffix: 'front-view', desc: 'product front view against white background' },
  { label: 'Back View', suffix: 'back-view', desc: 'product back and side view showing all angles' },
  { label: 'Packaging', suffix: 'packaging', desc: 'product in retail packaging with label visible' },
  { label: 'Usage Demo', suffix: 'usage', desc: 'product being used in real environment' },
  { label: 'Detail Close-up', suffix: 'detail', desc: 'close-up shot highlighting material and finish quality' },
  { label: 'Size Reference', suffix: 'size-reference', desc: 'product shown with scale for size reference' },
  { label: 'Color Variants', suffix: 'color-variants', desc: 'available color options displayed together' },
  { label: 'Bulk Pack', suffix: 'bulk-pack', desc: 'bulk packaging for wholesale orders' },
  { label: 'Texture Detail', suffix: 'texture', desc: 'macro shot showing texture and weave details' },
  { label: 'With Accessories', suffix: 'with-accessories', desc: 'product including all accessories and parts' },
];

export const NEGOTIATION_MESSAGE_TEMPLATES = [
  // Initial Inquiry (buyer)
  { role: 'buyer', content: 'Hi, I am looking for {product}. Can you share your current best price for bulk quantity? We need regular supply.' },
  { role: 'buyer', content: 'We are exploring suppliers for {product}. Please share your product catalog, MOQ, and pricing for wholesale quantities.' },
  { role: 'buyer', content: 'Do you supply {product} on a monthly contract basis? We need consistent quality and timely delivery.' },
  { role: 'buyer', content: 'I came across your listing for {product}. Could you share detailed specifications and available variants?' },
  { role: 'buyer', content: 'We are a {buyer_type} based in {buyer_city}. Looking for a reliable supplier for {product} on a long-term basis.' },

  // Supplier Response
  { role: 'supplier', content: 'Thank you for your interest! Our price for {product} is ₹{price}/piece for MOQ {moq} pieces. We offer tiered discounts for higher volumes.' },
  { role: 'supplier', content: 'We would be happy to supply {product}. Our current rate is ₹{price}/piece. We have been in this business for {years} years and serve {clients}+ active clients.' },
  { role: 'supplier', content: 'Greetings from {company}! We specialize in {product} with {personality_focus}. Our price range is ₹{price_min}-₹{price_max}/piece depending on volume.' },
  { role: 'supplier', content: 'Thank you for reaching out. Please find our quotation attached. We can offer a special discount for first-time orders above ₹{order_value}.' },

  // Negotiation
  { role: 'buyer', content: 'The price seems a bit high compared to other suppliers. Can you match ₹{target_price}/piece for a monthly order of {qty} units?' },
  { role: 'buyer', content: 'We like your product quality but need a better price. Our annual requirement is {annual_qty} units. What is your best offer?' },
  { role: 'buyer', content: 'Can you offer a payment term of {days} days? We are a regular buyer and will place repeat orders every month.' },
  { role: 'buyer', content: 'We need delivery to {buyer_city}. Please include freight in your quote. Is shipping free above ₹{free_shipping_amt}?' },
  { role: 'buyer', content: 'Your MOQ is too high for a trial order. Can you accommodate a smaller first order of {trial_qty} pieces at the same price?' },

  // Supplier Counter
  { role: 'supplier', content: 'We understand your budget concern. Our best price is ₹{counter_price}/piece for orders above {counter_qty}. This is our final offer for this quality level.' },
  { role: 'supplier', content: 'We can offer a {discount_pct}% discount on orders above ₹{discount_threshold}. For payment terms, we can offer {payment_days} days credit after three successful orders.' },
  { role: 'supplier', content: 'For a trial order, we can reduce MOQ to {reduced_moq} pieces at ₹{trial_price}/piece. The trial amount is adjustable against your first bulk order.' },
  { role: 'supplier', content: 'We can do free shipping for orders above ₹{free_shipping_amt}. For smaller orders, actual freight will be charged as per logistics provider.' },
  { role: 'supplier', content: 'We can match your target price if you commit to a {contract_months}-month contract with a minimum monthly offtake of {min_offtake} units.' },

  // Sample & Quality
  { role: 'buyer', content: 'Can you send product samples before we place the bulk order? We need to verify quality and specifications.' },
  { role: 'buyer', content: 'Do you provide free samples for B2B buyers? We are willing to pay sample cost if adjustable in bulk order.' },
  { role: 'supplier', content: 'Yes, samples are available. Sample cost is ₹{sample_cost} which is fully adjustable in your first bulk order. Delivery takes {sample_delivery} days.' },
  { role: 'supplier', content: 'We can arrange free samples for serious buyers. Please share your business card and GST number for verification.' },

  // Shipping & Logistics
  { role: 'buyer', content: 'What is the lead time for this order? We need delivery by {required_date} for our retail launch.' },
  { role: 'supplier', content: 'Standard lead time is {lead_time} business days. We use {courier} for pan-India delivery with real-time tracking.' },
  { role: 'supplier', content: 'We can expedite the order to {expedited_lead_time} days for an additional {expedite_fee}% charge. Regular delivery is {regular_lead_time} days.' },
  { role: 'buyer', content: 'Please ensure proper packaging for transit. The products are fragile and need bubble wrap protection.' },

  // Order Confirmation
  { role: 'buyer', content: 'We confirm the order. Please share proforma invoice and payment details. We will process payment immediately.' },
  { role: 'buyer', content: 'Order confirmed as discussed. Please send the GST invoice and our order will be released for payment.' },
  { role: 'supplier', content: 'Thank you for the order confirmation! Our bank details: {bank_name}, {branch}. Account: {account_no}. IFSC: {ifsc_code}. Payment within {payment_terms} days.' },
  { role: 'supplier', content: 'Your order #{order_id} is confirmed. We will share production updates and dispatch details. Estimated dispatch: {dispatch_date}.' },

  // Payment & Dispatch
  { role: 'buyer', content: 'Payment of ₹{amount} has been transferred via NEFT. Transaction ref: {txn_ref}. Please confirm receipt and update dispatch status.' },
  { role: 'supplier', content: 'Payment received and verified. Your order is now in production. We will share photos before dispatch for your approval.' },
  { role: 'supplier', content: 'Order dispatched! Tracking ID: {tracking_id}. Courier: {courier}. Expected delivery: {delivery_date}. Track here: {tracking_url}' },
  { role: 'buyer', content: 'Please share the packing list, delivery challan, and GST invoice for our records.' },

  // Post-Delivery
  { role: 'buyer', content: 'Goods received. The shipment quality looks good. We will inspect thoroughly and revert if any issues.' },
  { role: 'buyer', content: 'Order received but {defect_count} pieces have damages. Please arrange replacement or adjust in the next order.' },
  { role: 'supplier', content: 'We are sorry about the damage. We will dispatch replacements immediately. New tracking: {tracking_id}. Transit insurance will cover the claim.' },
  { role: 'buyer', content: 'Quality is consistent with samples. We are placing a repeat order for double the quantity. Please maintain the same quality standards.' },

  // Reorder & Relationship
  { role: 'buyer', content: 'We are ready for our next order. Please share the current pricing as we plan to increase the order quantity by {increase_pct}%.' },
  { role: 'buyer', content: 'Happy with your service! Refer you to our sister concern {sister_concern}. They also need {product} in bulk. Expect their call.' },
  { role: 'supplier', content: 'Thank you for the repeat order! As a valued client, we are offering a special loyalty discount of {loyalty_discount}% on this order.' },
  { role: 'supplier', content: 'We value our partnership. Please share your feedback so we can serve you better. We are introducing new products in {new_category} soon.' },
  { role: 'supplier', content: 'Festive season offer: {festive_discount}% off on all orders placed before {festive_deadline}. Stock up for the season!' },

  // Dispute & Resolution
  { role: 'buyer', content: 'The product received does not match the sample shown. Color variation is significant. We need a resolution urgently.' },
  { role: 'supplier', content: 'We apologize for the discrepancy. Our QC team will investigate. Please share photos of the issue. We will offer a replacement or credit note as per your preference.' },
  { role: 'buyer', content: 'Shipment is delayed beyond the committed timeline. We are losing sales. Please expedite and update with the revised delivery date.' },
  { role: 'supplier', content: 'We regret the delay. Due to raw material supply issues, dispatch was delayed. Offering a {compensation}% discount on this order as compensation.' },
];

export const PARTY_QUOTES = [
  'Harvest season discounts available on bulk orders',
  'Diwali special bulk pricing valid until next month',
  'Year-end stock clearance — up to 20% off on all products',
  'Monsoon stock up — special prices for bulk buyers',
  'New year, new stock — fresh inventory at old prices',
];

export const COURIER_PARTNERS = ['Delhivery', 'DTDC', 'Blue Dart', 'Ekart', 'XpressBees', 'Shadowfax', 'Professional Couriers', 'Trackon', 'Gati', 'SafeXpress'];

export const PAYMENT_TERMS = ['100% advance', '50% advance + 50% on dispatch', '30% advance + 70% on delivery', 'Letter of Credit', '7 days credit', '15 days credit', '30 days credit'];

export const FACTORY_AMENITIES = [
  '24/7 CCTV surveillance',
  'Fire safety compliant',
  'Fumigation chamber',
  'Metal detector at dispatch',
  'Humidity-controlled storage',
  'Cold storage facility',
  'In-house quality lab',
  'Weighbridge for inbound/outbound',
  'Dedicated loading bay for 4 vehicles',
  'Power backup (100% diesel generator)',
  'RO water treatment plant',
  'Effluent treatment facility',
  'ERP-integrated warehouse management',
  'Barcode scanning at dispatch',
  'Worker cafeteria and rest area',
];
