"use client";

import * as React from "react";
import { UseFormReturn, FieldValues } from "react-hook-form";
import { Stepper, Step } from "./stepper";
import { Button } from "./button";
import { Form } from "./form";
import { useFormStepper, StepConfig } from "@/hooks/use-form-stepper";
import { cn, isDevEnv } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

export interface StepperFormProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>;
  steps: StepConfig[];
  onSubmit: (data: TFieldValues) => void | Promise<void>;
  className?: string;
  orientation?: "horizontal" | "vertical";
  showProgress?: boolean;
  variant?: "default" | "simple";
  submitButtonText?: string;
  nextButtonText?: string;
  previousButtonText?: string;
  showStepErrors?: boolean;
  allowStepNavigation?: boolean;
}

function StepperForm<TFieldValues extends FieldValues>({
  form,
  steps,
  onSubmit,
  className,
  orientation = "horizontal",
  showProgress = true,
  variant = "default",
  submitButtonText = "Submit",
  nextButtonText = "Next",
  previousButtonText = "Back",
  showStepErrors = true,
  allowStepNavigation = true,
}: StepperFormProps<TFieldValues>) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const stepper = useFormStepper({
    steps,
    form,
    onComplete: async (data) => {
      setIsSubmitting(true);
      try {
        await onSubmit(data);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Convert StepConfig to Step for Stepper component
  const stepperSteps: Step[] = steps.map((step) => ({
    id: step.id,
    title: step.title,
    description: step.description,
    isOptional: step.isOptional,
  }));

  const currentStepErrors = stepper.getStepErrors(stepper.currentStep);
  const hasCurrentStepErrors = currentStepErrors.length > 0;

  // const handleStepClick = (stepIndex: number) => {
  //   if (allowStepNavigation) {
  //     stepper.goToStep(stepIndex);
  //   }
  // };

  const handleSubmit = async () => {
    if (stepper.isLastStep) {
      setIsSubmitting(true);
      try {
        const data = form.getValues();
        await onSubmit(data);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      stepper.nextStep();
    }
  };

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* Stepper Header */}
      <Stepper
        steps={stepperSteps}
        currentStep={stepper.currentStep}
        orientation={orientation}
        showProgress={showProgress}
        variant={variant}
        className={allowStepNavigation ? "cursor-pointer" : ""}
      />

      {/* Form Content */}
      <Form control={form.control}>
        <div className="space-y-6">
          {/* Step Content */}
          <div className="min-h-[200px]">
            {steps[stepper.currentStep].component}
          </div>

          {/* Step Errors */}
          {showStepErrors && hasCurrentStepErrors && (
            <div className="rounded-md border border-destructive/20 bg-destructive/10 p-4">
              <h4 className="text-sm font-medium text-destructive mb-2">
                Please fix the following errors:
              </h4>
              <ul className="text-sm text-destructive space-y-1">
                {currentStepErrors.map((error, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-destructive mt-0.5">•</span>
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              {!stepper.isFirstStep && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={stepper.previousStep}
                  disabled={!stepper.canGoPrevious || isSubmitting}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {previousButtonText}
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Step Indicator */}
              <span className="text-sm text-muted-foreground">
                {stepper.currentStep + 1} of {steps.length}
              </span>

              {/* Next/Submit Button */}
              {stepper.isLastStep ? (
                <Button
                  type="submit"
                  disabled={!stepper.canSubmit || isSubmitting}
                  className="flex items-center gap-2"
                  onClick={handleSubmit}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      {submitButtonText}
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  disabled={!stepper.canGoNext || isSubmitting}
                  className="flex items-center gap-2"
                  onClick={handleSubmit}
                >
                  {nextButtonText}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </Form>

      {/* Debug Info (only in development) */}
      {isDevEnv && (
        <div className="mt-8 p-4 bg-muted rounded-lg text-xs space-y-2">
          <div>
            <strong>Debug Info:</strong>
          </div>
          <div>Current Step: {stepper.currentStep}</div>
          <div>Can Go Next: {stepper.canGoNext ? "Yes" : "No"}</div>
          <div>Can Go Previous: {stepper.canGoPrevious ? "Yes" : "No"}</div>
          <div>Progress: {Math.round(stepper.progress)}%</div>
          <div>Form Valid: {form.formState.isValid ? "Yes" : "No"}</div>
          <div>Form Errors: {Object.keys(form.formState.errors).length}</div>
        </div>
      )}
    </div>
  );
}

export { StepperForm };
