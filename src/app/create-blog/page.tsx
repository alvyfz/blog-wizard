"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StepperForm } from "@/components/ui/stepper-form";
import { StepConfig } from "@/hooks/use-form-stepper";
import Layout from "@/components/layout/layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  CheckboxField,
  InputField,
  SelectField,
  TextareaField,
} from "@/components/ui/form-fields";
import {
  getFromLocalStorage,
  saveToLocalStorage,
  urlFriendly,
} from "@/lib/utils";
import { CreateBlogFormData, createBlogSchema } from "@/lib/zod/create-blog";
import { useAlertHelpers } from "@/contexts/alert-context";
import { useRouter } from "next/navigation";
import { categories } from "@/mock/categories";

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
      saveToLocalStorage("blogData", [...currBlogs, data]);
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
      component: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Blog Metadata</h3>
          <InputField
            control={form.control}
            name="slug"
            label="Slug"
            placeholder="Enter the slug of your blog post"
            required
            disabled
          />
          <InputField
            control={form.control}
            name="title"
            label="Title"
            placeholder="Enter the title of your blog post"
            required
          />
          <InputField
            control={form.control}
            name="author"
            label="Author"
            placeholder="Enter the author of your blog post"
            required
          />
        </div>
      ),
    },
    {
      id: "summary",
      title: "Blog Summary & Category",
      description: "Enter the summary and category for your blog post",
      fields: ["summary", "category"],
      component: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Blog Summary & Category</h3>
          <SelectField
            control={form.control}
            name="category"
            label="Category"
            placeholder="Select a category"
            required
            options={categories}
          />
          <TextareaField
            control={form.control}
            name="summary"
            label="Summary"
            placeholder="Enter a brief summary of your blog post"
            required
          />
        </div>
      ),
    },
    {
      id: "content",
      title: "Blog Content",
      description: "Enter the content for your blog post",
      fields: ["content"],
      component: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Blog Content</h3>
          <TextareaField
            control={form.control}
            name="content"
            label="Content"
            placeholder="Write your blog content here..."
            required
          />
        </div>
      ),
    },
    {
      id: "review",
      title: "Review & Submit",
      description: "Review your blog post and submit",
      fields: ["confirm"],
      component: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Review & Submit</h3>
          <div className="bg-muted p-4 rounded-lg space-y-3">
            <h4 className="font-medium">Blog Post Summary:</h4>
            <div className="text-sm space-y-1">
              <p className="break-words">
                <strong>Title:</strong> {watchedValues.title}
              </p>
              <p className="break-words">
                <strong>Author:</strong> {watchedValues.author}
              </p>
              <p className="break-words">
                <strong>Slug:</strong> {watchedValues.slug}
              </p>
              <p className="break-words">
                <strong>Category:</strong>{" "}
                {
                  categories.find((c) => c.value === watchedValues.category)
                    ?.label
                }
              </p>
              <p className="break-words">
                <strong>Summary:</strong> {watchedValues.summary}
              </p>
              <p className="break-words">
                <strong>Content:</strong> {watchedValues.content}
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <CheckboxField
              control={form.control}
              name="confirm"
              label="I confirm that the above information is correct"
              required
            />
          </div>
        </div>
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
