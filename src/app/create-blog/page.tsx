"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StepperForm } from "@/components/ui/stepper-form";
import { StepConfig } from "@/hooks/use-form-stepper";
import Layout from "@/components/layout/layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  getFromLocalStorage,
  saveToLocalStorage,
  urlFriendly,
} from "@/lib/utils";
import { CreateBlogFormData, createBlogSchema } from "@/lib/zod/create-blog";
import { useAlertHelpers } from "@/contexts/alert-context";
import { useRouter } from "next/navigation";
import { categories } from "@/mock/categories";
import { BlogMetadataForm } from "@/components/blog-create/metadata-form-section";
import { SummaryFormSection } from "@/components/blog-create/summary-form-section";
import { ContentFormSection } from "@/components/blog-create/content-form-section";
import { ReviewFormSection } from "@/components/blog-create/review-form-section";

export default function CreateBlogPage() {
  const router = useRouter();
  const currBlogs = getFromLocalStorage<CreateBlogFormData[]>("blogData") || [];
  const form = useForm<CreateBlogFormData>({
    resolver: zodResolver(createBlogSchema),
    defaultValues: {
      title: "",
      author: "",
      slug: "",
      summary: "",
      category: "",
      content: "",
      confirm: false,
    },
    mode: "onChange",
  });

  const { success, error } = useAlertHelpers();

  const watchedValues = form.watch();

  const handleSubmit = (data: CreateBlogFormData) => {
    try {
      saveToLocalStorage("blogData", [
        ...currBlogs,
        { ...data, date: new Date() },
      ]);
      success("Success", "Blog created successfully!", () =>
        router.replace("/")
      );
    } catch (err: any) {
      console.log(err);
      error("Error", "Blog creation failed!");
    }
  };

  // Watch title changes and update slug accordingly
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "title") {
        const slugValue = urlFriendly(value.title || "");
        form.setValue("slug", slugValue);
      }

      // Check if slug already exists in current blogs
      if (name === "title") {
        let slugValue = urlFriendly(value.title || "");
        let counter = 1;

        // Keep checking and modifying slug until a unique one is found
        while (currBlogs.some((blog) => blog.slug === slugValue)) {
          slugValue = `${urlFriendly(value.title || "")}-${counter}`;
          counter++;
        }

        form.setValue("slug", slugValue);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  // Steps configuration
  const steps: StepConfig[] = [
    {
      id: "metadata",
      title: "Blog Metadata",
      description: "Enter the metadata for your blog post",
      fields: ["title", "author", "slug"],
      component: <BlogMetadataForm form={form} />,
    },
    {
      id: "summary",
      title: "Blog Summary & Category",
      description: "Enter the summary and category for your blog post",
      fields: ["summary", "category"],
      component: <SummaryFormSection form={form} />,
    },
    {
      id: "content",
      title: "Blog Content",
      description: "Enter the content for your blog post",
      fields: ["content"],
      component: <ContentFormSection form={form} />,
    },
    {
      id: "review",
      title: "Review & Submit",
      description: "Review your blog post and submit",
      fields: ["confirm"],
      component: (
        <ReviewFormSection
          form={form}
          categories={categories}
          watchedValues={watchedValues}
        />
      ),
    },
  ];

  return (
    <Layout>
      <Card className="my-4">
        <CardHeader>
          <h1 className="text-3xl font-bold ">Create a New Blog</h1>
          <p className="text-sm text-muted-foreground">
            Create a new blog post and share your thoughts with the world.
          </p>
        </CardHeader>

        <CardContent>
          <StepperForm
            form={form}
            steps={steps}
            onSubmit={handleSubmit}
            submitButtonText="Submit Data"
            nextButtonText="Next"
            previousButtonText="Previous"
            showStepErrors={false}
            allowStepNavigation
          />
        </CardContent>
      </Card>
    </Layout>
  );
}
