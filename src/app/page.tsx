import { BlogList } from "@/components/landing/blog-list";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900">Blog Wizard</h1>
          <p className="text-gray-600 mt-2">Your personal blog collection</p>
        </div>
      </div>
      
      {/* Blog List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BlogList />
      </div>
    </div>
  );
}
