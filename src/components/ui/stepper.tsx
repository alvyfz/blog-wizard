"use client";

import * as React from "react";
import { Progress } from "./progress";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface Step {
  id: string;
  title: string;
  description?: string;
  isOptional?: boolean;
}

export interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
  orientation?: "horizontal" | "vertical";
  showProgress?: boolean;
  variant?: "default" | "simple";
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      steps,
      currentStep,
      className,
      orientation = "horizontal",
      showProgress = true,
      variant = "default",
      ...props
    },
    ref
  ) => {
    const progressValue = (currentStep / (steps.length - 1)) * 100;
    const isVertical = orientation === "vertical";

    return (
      <div
        ref={ref}
        className={cn(
          "w-full",
          isVertical ? "space-y-4" : "space-y-4",
          className
        )}
        {...props}
      >
        {/* Progress Bar */}
        {showProgress && (
          <div className="mb-6">
            <Progress value={progressValue} className="h-2" />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>
                Step {currentStep + 1} of {steps.length}
              </span>
              <span>{Math.round(progressValue)}% complete</span>
            </div>
          </div>
        )}

        {/* Steps */}
        <div
          className={cn(
            "flex",
            isVertical ? "flex-col space-y-4" : "items-center justify-between",
            !isVertical && steps.length > 4 ? "flex-wrap gap-2" : ""
          )}
        >
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isUpcoming = index > currentStep;

            return (
              <div
                key={step.id}
                className={cn(
                  "flex items-center",
                  isVertical ? "w-full" : "flex-col text-center",
                  !isVertical && "flex-1 min-w-0"
                )}
              >
                {/* Step Circle */}
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full border-2 transition-all duration-200",
                    isVertical
                      ? "w-8 h-8 mr-3 flex-shrink-0"
                      : "w-10 h-10 mb-2",
                    isCompleted &&
                      "bg-primary border-primary text-primary-foreground",
                    isCurrent && "border-primary bg-primary/10 text-primary",
                    isUpcoming &&
                      "border-muted-foreground/30 text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>

                {/* Step Content */}
                <div className={cn("flex-1", isVertical ? "" : "text-center")}>
                  <div
                    className={cn(
                      "font-medium text-sm transition-colors",
                      isCurrent && "text-primary",
                      isCompleted && "text-foreground",
                      isUpcoming && "text-muted-foreground"
                    )}
                  >
                    {step.title}
                    {step.isOptional && (
                      <span className="text-xs text-muted-foreground ml-1">
                        (Optional)
                      </span>
                    )}
                  </div>
                  {step.description && variant === "default" && (
                    <div
                      className={cn(
                        "text-xs mt-1 transition-colors hidden md:block",
                        isCurrent && "text-primary/70",
                        isCompleted && "text-muted-foreground",
                        isUpcoming && "text-muted-foreground/70"
                      )}
                    >
                      {step.description}
                    </div>
                  )}
                </div>

                {/* Connector Line (for vertical) */}
                {isVertical && index < steps.length - 1 && (
                  <div className="absolute left-4 top-8 w-0.5 h-8 bg-border" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

Stepper.displayName = "Stepper";

export { Stepper };
