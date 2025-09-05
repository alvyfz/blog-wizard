import { InputField } from "../ui/form-fields";

interface BlogMetadataProps {
  form: any;
}

const BlogMetadataForm = ({ form }: BlogMetadataProps) => {
  return (
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
  );
};

export { BlogMetadataForm };
