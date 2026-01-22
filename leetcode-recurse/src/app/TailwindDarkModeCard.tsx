"use client";

import React from "react";
import type { CardComponentProps } from "nextstepjs";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function TailwindDarkModeCard({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  skipTour,
  arrow,
}: CardComponentProps) {
  return (
    <Card className="w-[360px] rounded-2xl shadow-xl border bg-background text-foreground">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          {step.icon && <span className="text-xl">{step.icon}</span>}
          <span>{step.title}</span>
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Step {currentStep + 1} of {totalSteps}
        </p>

        <div className="flex items-center gap-2">
          {currentStep > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={prevStep}
            >
              Previous
            </Button>
          )}

          <Button size="sm" onClick={nextStep} className="cursor-pointer">
            {currentStep === totalSteps - 1 ? "Finish" : "Next"}
          </Button>

          {step.showSkip && skipTour && (
            <Button
              variant="ghost"
              size="sm"
              className="cursor-pointer"
              onClick={skipTour}
            >
              Skip
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="text-sm text-muted-foreground leading-relaxed">
          {step.content}
        </div>

        {/* pointer arrow */}
        {/* <div className="relative">{arrow}</div> */}
      </CardContent>

      <Separator />
    </Card>
  );
}
