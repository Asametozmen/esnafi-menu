const BUCKET = "menu-images";

/** Products/settings store an object key, never a full URL — derive it here at render time. */
export function getPublicImageUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}
