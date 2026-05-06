/**
 * Book Detail Page
 * Server Component with generateStaticParams
 */

import BookDetailClient from './BookDetailClient';

// Required for static export with dynamic routes
export async function generateStaticParams() {
  // Return empty array - pages will be generated on-demand in dev mode
  // For production build, you would fetch all book IDs here
  return [];
}

export const dynamicParams = true;

export default function BookDetailPage({ params }) {
  const { id } = params;
  return <BookDetailClient id={id} />;
}
