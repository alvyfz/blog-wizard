import { BlogList } from "@/components/landing/blog-list";
import Layout from "@/components/layout/layout";

export default function Home() {
  return (
    <Layout>
      {" "}
      <p className="text-gray-600 mt-2">Your personal blog collection</p>
      {/* Blog List */}
      <BlogList />
    </Layout>
  );
}
