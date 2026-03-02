// Environment-aware Base URLs
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_ROOT = `${BASE_URL}/api`;

export const API_PATH = `${BASE_URL}/api`;
export const ENDPOINTS = {
  // Drupal 11 Main Menu
  menu: `/menu_items/main`,
  
  // Drupal View for Hero Slider (REST/JSON export)
  hero: `${API_ROOT}/views/hero_banner`, 
  
  // Accessory Nodes with Media & Brand Relationships
  accessories: `/node/accessory?include=field_thumbnail.field_media_image,field_images.field_media_image,field_compatible_brand,field_compatible_model,field_category`,
};


/**
 * Universal Path Cleaner
 * Converts 'internal:/catalog' or '<front>' to React-friendly routes
 */
export const cleanPath = (url) => {
  if (!url) return '/';
  return url.replace('internal:', '').replace('<front>', '/');
};

/**
 * Image Resolver
 * Safely traverses Drupal 11 Media -> File relationship
 */
export const getDrupalImage = (relationships, included) => {
  const mediaId = relationships?.field_thumbnail?.data?.id;
  if (!mediaId || !included) return '/placeholder-accessory.jpg';

  const media = included.find(item => item.id === mediaId);
  const fileId = media?.relationships?.field_media_image?.data?.id;
  const file = included.find(item => item.id === fileId);

  return file?.attributes?.uri?.url 
    ? `${BASE_URL}${file.attributes.uri.url}` 
    : '/placeholder-accessory.jpg';

  // Add this check inside getDrupalImage
  const rawUrl = file?.attributes?.uri?.url;
  if (!rawUrl) return '/placeholder-accessory.jpg';
  
  // If Drupal returns a full URL (starts with http), don't prepend BASE_URL
  return rawUrl.startsWith('http') ? rawUrl : `${BASE_URL}${rawUrl}`;
};

export const formatAccessoryData = (node, included = []) => {
  const { attributes, relationships } = node;

  // 1. Resolve Full Gallery for the Detail Page Carousel
  const galleryRefs = relationships?.field_images?.data || [];
  const gallery = galleryRefs.map(imgRef => {
    const media = included.find(inc => inc.id === imgRef.id);
    const fileId = media?.relationships?.field_media_image?.data?.id;
    const file = included.find(inc => inc.id === fileId);
    const url = file?.attributes?.uri?.url;
    return url ? (url.startsWith('http') ? url : `${BASE_URL}${url}`) : null;
  }).filter(Boolean);

  // 1. Resolve Category
  const catRef = relationships?.field_category?.data;
  const category = included.find(inc => inc.id === catRef?.id)?.attributes?.name || 'Accessories';

  // 2. Resolve Compatible Brand (Make)
  const brandRef = relationships?.field_compatible_brand?.data?.[0];
  const brand = included.find(inc => inc.id === brandRef?.id)?.attributes?.name || 'Universal';

  // 3. Resolve Compatible Model
  const modelRef = relationships?.field_compatible_model?.data?.[0];
  const model = included.find(inc => inc.id === modelRef?.id)?.attributes?.name || 'All Models';

  return {
    id: node.id,
    title: attributes.title,
    price: attributes.field_price,
    sku: attributes.field_sku_product_code,
    path: attributes.path.alias,
    available: attributes.field_availability,
    category,
    brand, // Used for the first level filter
    model, // Used for the second level (dependent) filter
    thumb: getDrupalImage(relationships, included),
    gallery: gallery.length > 0 ? gallery : [getDrupalImage(relationships, included)],
    material: attributes.field_material?.replace(/_/g, ' '),
    finish: attributes.field_finish_type,
    colors: attributes.field_available_colors || [],
    years: attributes.field_vehicle_year || [],
    description: attributes.field_description?.processed,
  };
};