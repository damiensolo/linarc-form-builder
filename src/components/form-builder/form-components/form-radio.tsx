import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DesignPropertiesViews, Viewports } from "@/types/form-builder.types";
import { FormComponentModel } from "@/models/FormComponent";
import { HtmlGroup } from "../sidebar/groups/html-group";
import { GridGroup } from "../sidebar/groups/grid-group";
import { LabelGroup } from "../sidebar/groups/label-group";
import { InputGroup } from "../sidebar/groups/input-group";
import { OptionsGroup } from "../sidebar/groups/options-group";
import { cn, escapeHtml, generateTWClassesForAllViewports } from "@/lib/utils";
import {
  ControllerRenderProps,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";
import { ValidationGroup } from "../sidebar/groups/validation-group";
import { FormLabel } from "@/components/ui/form";
import { useFormBuilderStore } from "@/stores/form-builder-store";

export function FormRadio(
  component: FormComponentModel,
  form: UseFormReturn<FieldValues, undefined>,
  field: ControllerRenderProps
) {
  const oneOptionHasLabelDescription = component.options?.some(
    (option) => option.labelDescription
  );
  const asCardClasses = generateTWClassesForAllViewports(component, "asCard");
  const cardLayoutClasses = component.getField("properties.style.cardLayout");

  return (
    <RadioGroup
      key={component.id}
      id={component.getField("attributes.id")}
      className={cn("w-full", component.getField("attributes.class"), cardLayoutClasses === "horizontal" && "@3xl:grid-cols-2")}
      {...field}
      onValueChange={field.onChange}
    >
      {component.options?.map((option) => (
        <FormLabel
          key={option.value}
          className={cn(asCardClasses, "flex items-start has-[[data-state=checked]]:border-primary")}
          htmlFor={`${component.getField("attributes.id")}-${option.value}`}
        >
          <RadioGroupItem
            value={option.value}
            id={`${component.getField("attributes.id")}-${option.value}`}
          />
          <div className="grid gap-1 leading-none">
            <FormLabel
              htmlFor={`${component.getField("attributes.id")}-${option.value}`}
              className={cn(
                "font-normal",
                oneOptionHasLabelDescription && "font-medium"
              )}
            >
              {option.label}
            </FormLabel>
            {option.labelDescription && (
              <p className="text-sm text-muted-foreground">
                {option.labelDescription}
              </p>
            )}
          </div>
        </FormLabel>
      ))}
    </RadioGroup>
  );
}

type ReactCode = {
  code: string;
  dependencies: Record<string, string[]>;
};

export function getReactCode(component: FormComponentModel): ReactCode {
  const oneOptionHasLabelDescription = component.options?.some(
    (option) => option.labelDescription
  );
  const asCardClasses = generateTWClassesForAllViewports(component, "asCard");
  const cardLayoutClasses = component.getField("properties.style.cardLayout");
  return {
    code: `
    <RadioGroup
      key="${component.id}"
      id="${escapeHtml(component.getField("attributes.id"))}"
      className="${escapeHtml(cn("w-full", component.getField("attributes.class"), cardLayoutClasses === "horizontal" && "@3xl:grid-cols-2"))}"
      {...field}
      onValueChange={field.onChange}
    > 
      ${component.options
        ?.map(
          (option) => `
        <FormLabel key="${escapeHtml(option.value)}" className="${escapeHtml(cn(asCardClasses, "flex items-center has-[[data-state=checked]]:border-primary"))}" htmlFor="${escapeHtml(component.getField("attributes.id"))}-${escapeHtml(option.value)}">
          <RadioGroupItem value="${escapeHtml(option.value)}" id="${escapeHtml(component.getField("attributes.id"))}-${escapeHtml(option.value)}" />
          <div className="grid gap-2 leading-none">
            <FormLabel htmlFor="${escapeHtml(component.getField("attributes.id"))}-${escapeHtml(option.value)}" className="${oneOptionHasLabelDescription ? "font-medium" : "font-normal"}">
              ${escapeHtml(option.label)}
            </FormLabel>  
            ${option.labelDescription ? `<p className="text-sm text-muted-foreground">${escapeHtml(option.labelDescription)}</p>` : ""}
          </div>
        </FormLabel>
      `
        )
        .join("\n")}
    </RadioGroup>
    `,
    dependencies: {
      "@/components/ui/radio-group": ["RadioGroup", "RadioGroupItem"],
      "@/components/ui/form": ["FormLabel"],
    },
  };
}

export const RadioDesignProperties: DesignPropertiesViews = {
  base: null,
  grid: <GridGroup />,
  html: <HtmlGroup />,
  label: (
    <LabelGroup
      whitelist={["label", "labelPosition", "labelAlign", "showLabel"]}
    />
  ),
  input: <InputGroup whitelist={["placeholder", "description", "value", "asCard", "cardLayout"]} />,
  options: <OptionsGroup />,
  button: null,
  validation: <ValidationGroup />,
};
