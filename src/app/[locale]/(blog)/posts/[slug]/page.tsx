 
import { notFound } from 'next/navigation';
 

import { POST_QUERY } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import { Post } from "@/components/Post";


export default async function PostPage({ params }: { params: { locale: string, slug: string } }) {
  const { data: post } = await sanityFetch({
    query: POST_QUERY,
    params: { slug: params.slug, language: params.locale },
  });

  if (!post) {
    notFound();
  }

  return (
    <div>
      <Post post={post} />
    </div>
  );
}

 
