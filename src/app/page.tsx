import Layout from "@/components/layout/layout";
import { IBlog } from "@/components/landing/blog-card";
import { BlogList } from "@/components/landing/blog-list";
import { getFromLocalStorage } from "@/lib/utils";

export default function Home() {
  return (
    <Layout>
      {/* Blog List */}
      <BlogList />
    </Layout>
  );
}
