const directMatches: Record<string, string[]> = {
  "Commerce and finance": ["Accounting, Finance & Tax", "Business Development", "Sales"],
  "Management and business": ["Business Development", "Sales", "Digital Marketing", "Human Resources & Recruitment", "Retail, Store & E-commerce"],
  "Computer applications and IT": ["IT, Software & Technology", "Digital Marketing"],
  "Engineering and technology": ["IT, Software & Technology", "Engineering & Manufacturing", "Construction, Real Estate & Architecture"],
  "Media, journalism, and communication": ["Content, Media & Creative", "Digital Marketing"],
  "Fine arts, performing arts, and creative fields": ["Design, Fashion & Lifestyle", "Content, Media & Creative"],
  "Medical, dental, and healthcare": ["Healthcare & Medical"],
  Law: ["Legal & Compliance"],
  "Education and teaching": ["Education & Training"],
  "Hotel management, tourism, travel, and aviation": ["Hospitality, Travel & Aviation"],
  "Agriculture, veterinary, fisheries, and allied": ["Agriculture, Food & Environment"]
};

const adjacentTargets = ["Sales", "Business Development", "Digital Marketing", "Customer Support & BPO", "Administration & Office Roles"];

export function getFieldMatchScore(fieldOfStudy?: string, targetField?: string) {
  if (!fieldOfStudy || !targetField || fieldOfStudy === "Other" || targetField === "Other") return 60;
  if (directMatches[fieldOfStudy]?.includes(targetField)) return 85;
  if (adjacentTargets.includes(targetField)) return 65;
  return 40;
}
