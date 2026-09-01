export function mapSupplier(supplier: any) {
  return {
    id: supplier.id,
    name: supplier.companyName,
    slug: supplier.slug,
    logo: supplier.logo || '',
    coverImage: supplier.coverImage || '',
    description: supplier.description,
    rating: supplier.rating,
    reviewCount: supplier.reviewCount,
    productCount: supplier.productCount,
    yearEstablished: supplier.yearEstablished,
    employees: supplier.employeeCount,
    certifications: supplier.certifications?.map((c: any) => c.name) || [],
    verified: supplier.isVerified,
    premium: supplier.isPremium,
    responseTime: supplier.responseTime,
    location: supplier.location || `${supplier.city}, ${supplier.state}`,
    contactEmail: supplier.contactEmail,
    contactPhone: supplier.contactPhone,
    website: supplier.website || '',
  };
}
