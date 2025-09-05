"use client";

import { useState, useCallback, useMemo } from "react";
import { UseFormReturn, FieldValues } from "react-hook-form";

export interface StepConfig {
  id: string;
  title: string;
  description?: string;
  fields: string[]; // Field names that must be validated for this step
  isOptional?: boolean;
  component: React.ReactNode;
}

export interface UseFormStepperProps<TFieldValues extends FieldValues> {
  steps: StepConfig[];
  form: UseFormReturn<TFieldValues>;
  onStepChange?: (step: number) => void;
  onComplete?: (data: TFieldValues) => void;
}

export interface UseFormStepperReturn {
  currentStep: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  canGoNext: boolean;
  canGoPrevious: boolean;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  reset: () => void;
  getStepErrors: (stepIndex: number) => string[];
  isStepValid: (stepIndex: number) => boolean;
  isStepCompleted: (stepIndex: number) => boolean;
  progress: number;
  canSubmit: boolean;
}

export function useFormStepper<TFieldValues extends FieldValues>({
  steps,
  form,
  onStepChange,
  onComplete,
}: UseFormStepperProps<TFieldValues>): UseFormStepperReturn {
  const [currentStep, setCurrentStep] = useState(0);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const progress = (currentStep / (steps.length - 1)) * 100;

  const isStepValid = useCallback(
    (stepIndex: number): boolean => {
      if (stepIndex >= steps.length) return false;

      const step = steps[stepIndex];
      const { formState } = form;

      if (step.isOptional) {
        const hasData = step.fields.some((field) => {
          const value = form.getValues(field as any);
          return value !== undefined && value !== null && value !== "";
        });
        if (!hasData) return true;
      }

      return step.fields.every((field) => !formState.errors[field]);
    },
    [steps, form]
  );

  const isStepCompleted = useCallback(
    (stepIndex: number): boolean => {
      return stepIndex < currentStep && isStepValid(stepIndex);
    },
    [currentStep, isStepValid]
  );

  const getStepErrors = useCallback(
    (stepIndex: number): string[] => {
      if (stepIndex >= steps.length) return [];

      const step = steps[stepIndex];
      const { formState } = form;
      const errors: string[] = [];

      step.fields.forEach((field) => {
        const error = formState.errors[field];
        if (error?.message) {
          errors.push(error.message as string);
        }
      });

      return errors;
    },
    [steps, form]
  );

  const canGoNext = useCallback((): boolean => {
    if (isLastStep) return false;
    return isStepValid(currentStep);
  }, [currentStep, isLastStep, isStepValid]);

  const canSubmit = useMemo((): boolean => {
    return isStepValid(currentStep) && isLastStep;
  }, [currentStep, isStepValid, isLastStep]);

  const canGoPrevious = useCallback((): boolean => {
    return !isFirstStep;
  }, [isFirstStep]);

  const nextStep = useCallback(async () => {
    if (!canGoNext()) return;

    const currentStepConfig = steps[currentStep];
    const isValid = await form.trigger(currentStepConfig.fields as any[]);

    if (isValid) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      onStepChange?.(newStep);

      // Jika ini step terakhir dan valid, panggil onComplete
      if (newStep === steps.length - 1) {
        const allValid = await form.trigger();
        if (allValid) {
          onComplete?.(form.getValues());
        }
      }
    }
  }, [currentStep, steps, form, canGoNext, onStepChange, onComplete]);

  const previousStep = useCallback(() => {
    if (!canGoPrevious()) return;

    const newStep = currentStep - 1;
    setCurrentStep(newStep);
    onStepChange?.(newStep);
  }, [currentStep, canGoPrevious, onStepChange]);

  const goToStep = useCallback(
    (step: number) => {
      if (step < 0 || step >= steps.length) return;

      if (step <= currentStep || isStepCompleted(step - 1)) {
        setCurrentStep(step);
        onStepChange?.(step);
      }
    },
    [currentStep, steps.length, isStepCompleted, onStepChange]
  );

  const reset = useCallback(() => {
    setCurrentStep(0);
    form.reset();
    onStepChange?.(0);
  }, [form, onStepChange]);

  return {
    currentStep,
    isFirstStep,
    isLastStep,
    canGoNext: canGoNext(),
    canGoPrevious: canGoPrevious(),
    nextStep,
    previousStep,
    goToStep,
    reset,
    getStepErrors,
    isStepValid,
    isStepCompleted,
    progress,
    canSubmit,
  };
}
