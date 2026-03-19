// Environment-aware Base URLs
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_ROOT = `${BASE_URL}/api`;

export const API_PATH = `${BASE_URL}/api`;
export const ENDPOINTS = {
  // Drupal 11 Main Menu
  menu: `/menu_items/main`,
  
  // Drupal View for Hero Slider (REST/JSON export)
  hero: `/hero-banners?_format=json`,
  pages: '/node/page',
  search: '/serach', 
  categories: '/categories',
  
  // Accessory Nodes with Media & Brand Relationships
  accessories: `/node/accessory?include=field_thumbnail.field_media_image,field_images.field_media_image,field_compatible_brand,field_compatible_model,field_category`,
};


/**
 * Universal Path Cleaner
 * Converts 'internal:/catalog' or '<front>' to React-friendly routes
 */
/**
 * Cleans Drupal URLs for React Router.
 * Removes base URLs, internal: prefixes, and the /api subdirectory.
 */
export const cleanPath = (url) => {
  if (!url) return '/';

  // 1. Remove "internal:" prefix if Drupal passes it directly
  let path = url.replace('internal:', '');

  // 2. Remove the base URL if Drupal sent an absolute link
  path = path.replace(import.meta.env.VITE_API_BASE_URL, '');

  // 3. Remove the /api prefix (specifically matching it at the start of the path)
  path = path.replace(/^\/api/, '');

  // 4. Handle frontpage edge cases
  if (path === '<front>' || path === '' || path === '/') {
    return '/';
  }

  // 5. Ensure it always starts with a forward slash for React Router
  return path.startsWith('/') ? path : `/${path}`;
};

/**
 * Image Resolver
 * Safely traverses Drupal 11 Media -> File relationship
 */
export const getDrupalImage = (relationships, included) => {
  // 1. Get the attached ID (Thumbnail or Gallery fallback)
  const entityId = relationships?.field_thumbnail?.data?.id 
                || relationships?.field_images?.data?.[0]?.id;
               
  if (!entityId || !included) return '/placeholder-accessory.jpg';

  // 2. Find the entity in the included array
  const linkedEntity = included.find(item => item.id === entityId);
  if (!linkedEntity) return '/placeholder-accessory.jpg';

  let rawUrl = null;

  // 🚀 SCENARIO A: It's a Standard Image Field (File Entity)
  if (linkedEntity.type.startsWith('file--')) {
    rawUrl = linkedEntity.attributes?.uri?.url;
  } 
  // 🚀 SCENARIO B: It's a Media Library Field (Media Entity -> File Entity)
  else if (linkedEntity.type.startsWith('media--')) {
    // Try to get the file ID from field_media_image (or fallback to thumbnail)
    const fileId = linkedEntity.relationships?.field_media_image?.data?.id
                || linkedEntity.relationships?.thumbnail?.data?.id;
                
    const fileEntity = included.find(item => item.id === fileId);
    rawUrl = fileEntity?.attributes?.uri?.url;
  }

  // 3. If we still don't have a URL, show the placeholder
  if (!rawUrl) return '/placeholder-accessory.jpg';

  // 4. Safely return the final formatted URL
  return rawUrl.startsWith('http') ? rawUrl : `${BASE_URL}${rawUrl}`;
};

export const formatAccessoryData = (node, included = []) => {
  const { attributes, relationships } = node;

  // 1. Resolve Full Gallery for the Detail Page Carousel
  const galleryRefs = relationships?.field_images?.data || [];
  
  const gallery = galleryRefs.map((imgRef) => {
    // A. Find the Media object
    const media = included.find(inc => inc.id === imgRef.id);
    if (!media) return null;

    // B. Aggressively hunt for the attached File ID. 
    // Drupal uses different relationship names depending on your setup. We check them all.
    const fileId = media.relationships?.field_media_image?.data?.id 
                || media.relationships?.thumbnail?.data?.id 
                || media.relationships?.image?.data?.id
                || media.relationships?.field_image?.data?.id;

    // C. Find the actual file object using that ID
    const file = included.find(inc => inc.id === fileId);

    // D. Extract the URL
    const rawUrl = file?.attributes?.uri?.url;
    if (!rawUrl) return null;

    // E. Attach Base URL securely
    const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://drupal.c4k.in';
    return rawUrl.startsWith('http') ? rawUrl : `${BASE_URL}${rawUrl}`;
  }).filter(Boolean); // Automatically removes broken links so Swiper doesn't crash

  // Fallback to thumbnail ONLY if the gallery is completely empty
  const finalGallery = gallery.length > 0 ? gallery : [getDrupalImage(relationships, included)];
  
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
    // gallery: gallery.length > 0 ? gallery : [getDrupalImage(relationships, included)],
    gallery: gallery,
    material: attributes.field_material?.replace(/_/g, ' '),
    finish: attributes.field_finish_type,
    colors: attributes.field_available_colors || [],
    years: attributes.field_vehicle_year || [],
    description: attributes.field_description?.processed,
    metatags: attributes.metatag || [],
  };
};

