"use client";

import { notFound } from "next/navigation";
import { getFromLocalStorage } from "@/lib/utils";
import BlogDetail from "@/components/blog-detail/blog-detail";
import { IBlog } from "@/components/landing/blog-card";
import { useEffect, useState } from "react";
import Layout from "@/components/layout/layout";

interface BlogPageProps {
  params: {
    slug: string;
  };
}

function getBlogBySlug(slug: string): IBlog | null {
  let blogs: IBlog[] = [];
  try {
    blogs = (getFromLocalStorage("blogData") as IBlog[]) ?? [];
  } catch (error) {
    console.error("Error accessing localStorage:", error);
  }
  return blogs.find((blog) => blog.slug === slug) || null;
}

export default function BlogPage({ params }: BlogPageProps) {
  const [blog, setBlog] = useState<IBlog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = () => {
      const foundBlog = getBlogBySlug(params.slug);
      if (foundBlog) {
        document.title = `${foundBlog.title} | Blog Wizard`;
      }
      setBlog(foundBlog);
      setLoading(false);
    };

    fetchBlog();
  }, [params.slug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!blog) {
    notFound();
  }

  return (
    <Layout>
      <BlogDetail blog={blog} />
    </Layout>
  );
}
