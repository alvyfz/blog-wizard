import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, User } from "lucide-react";
import { categories } from "@/mock/categories";
import Link from "next/link";

export interface IBlog {
  title: string;
  author: string;
  slug: string;
  summary: string;
  category: string;
  content: string;
  confirm: boolean;
  date: Date;
}
interface BlogCardProps {
  blog: IBlog;
}

function BlogCard({ blog }: BlogCardProps) {
  const categoryLabel =
    categories.find((cat) => cat.value === blog.category)?.label ||
    blog.category;
  const formattedDate = new Date(blog.date).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link href={`/${blog.slug}`}>
      <Card className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg font-semibold line-clamp-2 leading-tight">
              {blog.title}
            </h3>
            <Badge variant="secondary" className="shrink-0">
              {categoryLabel}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{blog.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarDays className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {blog.summary}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

export { BlogCard };
