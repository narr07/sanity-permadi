import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { GetServerSideProps } from 'next';

import { POST_QUERY } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import { Post } from "@/components/Post";

interface PageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export async function generateMetadata({ params }: { params: { locale: string, slug: string } }): Promise<Metadata> {
  const { data: post } = await sanityFetch({
    query: POST_QUERY,
    params: { slug: params.slug, language: params.locale },
  });

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested post could not be found.',
    };
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/${params.locale}/blog/posts/${params.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      // images: post.images.map((image: any) => ({
      //   url: image.url,
      //   width: image.width,
      //   height: image.height,
      //   alt: image.alt,
      // })),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      // images: post.images.map((image: any) => image.url),
    },
  };
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
  const { locale, slug } = context.params as { locale: string; slug: string };
  const { data: post } = await sanityFetch({
    query: POST_QUERY,
    params: { slug, language: locale },
  });

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      params: {
        locale,
        slug,
      },
    },
  };
};

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

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'id' }];
}
