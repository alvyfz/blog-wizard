import { CheckboxField } from "../ui/form-fields";

const ReviewFormSection = ({
  watchedValues,
  categories,
  form,
}: {
  watchedValues: {
    title: string;
    author: string;
    slug: string;
    category: string;
    summary: string;
    content: string;
  };
  categories: { value: string; label: string }[];
  form: any;
}) => {
  return (
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
            {categories.find((c) => c.value === watchedValues.category)?.label}
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
  );
};

export { ReviewFormSection };
