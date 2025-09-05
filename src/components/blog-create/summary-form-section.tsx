import { categories } from "@/mock/categories";
import { SelectField, TextareaField } from "../ui/form-fields";

interface SummarySectionProps {
  form: any;
}

const SummaryFormSection: React.FC<SummarySectionProps> = ({ form }) => {
  return (
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
  );
};

export { SummaryFormSection };
