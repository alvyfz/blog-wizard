"use client";

import { BlogCard, IBlog } from "@/components/landing/blog-card";
import { Card, CardContent } from "@/components/ui/card";
import { getFromLocalStorage } from "@/lib/utils";

const BlogList = () => {
  const blogData = getFromLocalStorage<IBlog[]>("blogData") || [];
  // Sort blogs by date (newest first)
  const sortedBlogs = blogData.sort((a: any, b: any) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });
  console.log(sortedBlogs);
  console.log(blogData);
  if (sortedBlogs.length === 0) {
    return (
      <Card className="py-12 mt-4">
        <CardContent className="text-center">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-muted-foreground">
              You haven't created any blogs yet
            </h3>
            <p className="text-sm text-muted-foreground">
              Start creating your first blog by clicking the "Create Blog"
              button above.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 mt-3">
      {sortedBlogs.map((blog, index) => (
        <BlogCard key={`${blog.slug}-${index}`} blog={blog} />
      ))}
    </div>
  );
};

export { BlogList };
