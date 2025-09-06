import { CreateBlogPage } from "@/components/blog-create/create-blog";
import Layout from "@/components/layout/layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create",
};
export default function Page() {
  return (
    <Layout>
      <CreateBlogPage />
    </Layout>
  );
}
