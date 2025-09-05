"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isCreateBlogPage = pathname === "/create-blog";

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* App Name */}
        <Link href="/" className="text-xl font-semibold text-gray-900 hover:text-gray-700">
          Blog Wizard
        </Link>

        {/* Create Blog Button - hanya tampil jika bukan di halaman /create-blog */}
        {!isCreateBlogPage && (
          <Link href="/create-blog">
            <Button variant="default" size="sm">
              Create Blog
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}