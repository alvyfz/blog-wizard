import z from "zod";

// Validation schema for multi-step form
export const createBlogSchema = z.object({
  // Step 1: Metadata
  title: z.string().min(10, "Title must be at least 10 characters"),
  author: z.string().min(2, "Author must be at least 2 characters"),
  slug: z.string().min(5, "Slug must be at least 5 characters"),

  // Step 2: Summary & Category
  summary: z.string().min(20, "Summary must be at least 20 characters"),
  category: z.string().min(1, "Please select a category"),

  // Step 3: Content
  content: z.string().min(100, "Content must be at least 100 characters"),

  // Step 4: Review & Confirmation
  confirm: z.boolean().refine((val) => val === true, {
    message: "You must check the confirm box",
  }),
});

export type CreateBlogFormData = z.infer<typeof createBlogSchema>;
