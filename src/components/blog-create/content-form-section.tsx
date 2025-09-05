import { TextareaField } from "../ui/form-fields";

const ContentFormSection = ({ form }: { form: any }) => {
  return (
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
  );
};

export { ContentFormSection };
