import { notFound } from 'next/navigation';
import { BlogPostPageClient } from './BlogPostPageClient';

export function generateMetadata({ params }) {
  const titleFromSlug = params?.slug?.replace(/[-_]+/g, ' ') || 'Blog';
  const capitalized = titleFromSlug
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  return {
    title: `${capitalized} — Blog — Komunitas Chinese Indonesia`,
  };
}

export default function BlogPostPage({ params }) {
  if (!params?.slug) {
    notFound();
  }
  return <BlogPostPageClient slug={params.slug} />;
}
