import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { categories } from "@/mock/categories";

interface BlogData {
  title: string;
  author: string;
  summary: string;
  content: string;
  category: string;
  date: Date;
  slug: string;
  confirm: boolean;
}

interface BlogDetailProps {
  blog: BlogData;
}

export default function BlogDetail({ blog }: BlogDetailProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const categoryLabel =
    categories.find((cat) => cat.value === blog.category)?.label ||
    blog.category;

  return (
    <div className="w-full my-4">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Blog List
      </Link>

      {/* Blog Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
          {blog.title}
        </h1>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{blog.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(blog.date)}</span>
          </div>
        </div>

        {/* Category */}
        {categoryLabel && (
          <div className="flex items-center gap-2 mb-6">
            <Tag className="w-4 h-4 text-gray-500" />
            <Badge variant="secondary">{categoryLabel}</Badge>
          </div>
        )}

        {/* Summary */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
          <p className="text-blue-800 text-lg leading-relaxed">
            {blog.summary}
          </p>
        </div>
      </header>

      {/* Blog Content */}
      <article className="bg-white rounded-lg shadow-sm border p-4">
        <div className="max-w-none leading-relaxed text-lg">
          {blog.content.split("\n").map((paragraph, index) => {
            if (paragraph.trim() === "") return null;
            return (
              <p
                key={index}
                className="mb-6 text-gray-700 break-words whitespace-pre-wrap"
              >
                {paragraph}
              </p>
            );
          })}
        </div>
      </article>
    </div>
  );
}
