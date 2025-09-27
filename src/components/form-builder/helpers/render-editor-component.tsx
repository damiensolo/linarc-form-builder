"use client";

import { useFormBuilderStore } from "@/stores/form-builder-store";

import { Button } from "@/components/ui/button";
import * as Icons from "lucide-react";
import {
  FormField,
  FormItem,
  FormControl,
  FormDescription,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { cn, generateTWClassesForAllViewports } from "@/lib/utils";
import { renderComponent } from "@/config/available-components";
import { FormComponentModel } from "@/models/FormComponent";
import { FormWysiwygEditor } from "../form-components/wysiwyg/form-wysiwyg-editor";

export interface FormComponentProps {
  form: UseFormReturn<FieldValues, undefined>;
  component: FormComponentModel;
}

export function RenderEditorComponent({ form, component }: FormComponentProps) {
  const {
    selectedComponent,
    viewport,
    updateComponent,
    updateEnableDragging,
    selectComponent,
  } = useFormBuilderStore();
  const mode = useFormBuilderStore((state) => state.mode);

  const labelPositionClasses = generateTWClassesForAllViewports(
    component,
    "labelPosition"
  );

  const labelAlignClasses = generateTWClassesForAllViewports(
    component,
    "labelAlign"
  );

  const showLabel = component.getField("properties.style.showLabel", viewport) === "yes";
  const visible = component.getField("properties.style.visible", viewport) === "yes";

  return component.category === "form" ? (
    <FormField
      key={component.id}
      control={form.control}
      name={component.id}
      render={({ field }) => {
        const renderedComponent = renderComponent(component, form, field);
        return (
          <FormItem
            className={cn(
              mode === "editor" && "group/component",
              "flex flex-col",
              labelPositionClasses,
              labelAlignClasses
            )}
            data-item-id={component.id}
          >
            <FormLabel
              className={cn(
                "shrink-0 flex items-center gap-2 ",
                mode === "editor" && "cursor-pointer",
                !showLabel && visible && "hidden"
              )}
            >
              {showLabel && component.getField("label", viewport)}
              {!visible && (
                <span className="text-xs text-muted-foreground">Hidden</span>
              )}
            </FormLabel>
            <FormControl>{renderedComponent}</FormControl>
            {component.description && (
              <FormDescription>{component.description}</FormDescription>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  ) : component.type === "text" ? (
    <div
      className={cn(
        "relative flex flex-col h-full",
        selectedComponent?.id === component.id &&
          mode === "editor" &&
          "cursor-text bg-white"
      )}
      key={component.id}
      data-item-id={component.id}
    >
      <FormWysiwygEditor
        value={component.content || ""}
        isEditable={selectedComponent?.id === component.id && mode === "editor"}
        showBorder={component.getField("properties.style.showBorder", viewport) === "yes"}
        onChange={(content: string) => {
          updateComponent(component.id, "content", content, true);
          selectComponent(null);
        }}
        onFocus={() => {
          updateEnableDragging(false);
        }}
        onBlur={(editor: any) => {
          updateEnableDragging(true);
        }}
      />
    </div>
  ) : (
    <div
      className={cn(
        "relative flex flex-col h-full",
        selectedComponent?.id === component.id &&
          mode === "editor" &&
          "cursor-text bg-white"
      )}
      key={component.id}
      data-item-id={component.id}
    >
      {renderComponent(component, form, { name: component.id, value: component.content || "", onChange: () => {}, onBlur: () => {}, ref: () => {} })}
    </div>
  );
}
