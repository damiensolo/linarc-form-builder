import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DesignPropertiesViews } from "@/types/form-builder.types";
import { FormComponentModel } from "@/models/FormComponent";
import { HtmlGroup } from "../sidebar/groups/html-group";
import { GridGroup } from "../sidebar/groups/grid-group";
import { LabelGroup } from "../sidebar/groups/label-group";
import { InputGroup } from "../sidebar/groups/input-group";
import { cn, generateTWClassesForAllViewports, escapeHtml } from "@/lib/utils";
import { ControllerRenderProps } from "react-hook-form";
import { UseFormReturn, FieldValues } from "react-hook-form";
import { ValidationGroup } from "../sidebar/groups/validation-group";
import { FormLabel } from "@/components/ui/form";

export function FormSwitch(component: FormComponentModel, form: UseFormReturn<FieldValues, undefined>, field: ControllerRenderProps) {
  const asCardClasses = generateTWClassesForAllViewports(component, "asCard");

  return (
    <FormLabel
      key={component.id}
      className={cn(asCardClasses, "flex justify-between items-center w-full has-[[data-state=checked]]:border-primary")}
      htmlFor={component.getField("attributes.id")}
    >
      <div className="grid gap-1 leading-none">
        <FormLabel>
          {component.getField("label")}
        </FormLabel>
        <p className="text-sm text-muted-foreground">
          {component.getField("label_description")}
        </p>
      </div>
      <Switch id={component.getField("attributes.id")} {...field} checked={field.value} onCheckedChange={field.onChange} />
    </FormLabel>
  );
}

type ReactCode = {
  code: string;
  dependencies: Record<string, string[]>;
};

export function getReactCode(component: FormComponentModel): ReactCode {
  const asCardClasses = generateTWClassesForAllViewports(component, "asCard");
  return {
    code: `
    <FormLabel
      key="${component.id}"
      className="${escapeHtml(cn(asCardClasses, "w-full flex justify-between items-center has-[[data-state=checked]]:border-primary"))}"
      htmlFor="${escapeHtml(component.getField("attributes.id"))}"
    >
      <div className="grid gap-1.5 leading-none">
        <FormLabel>
          ${escapeHtml(component.getField("label"))}
        </FormLabel>
        <p className="text-sm text-muted-foreground">
          ${escapeHtml(component.getField("label_description"))}
        </p>
      </div>
      <Switch id="${escapeHtml(component.getField("attributes.id"))}" {...field} checked={field.value} onCheckedChange={field.onChange} />
    </FormLabel>
    `,
    dependencies: {
      "@/components/ui/switch": ["Switch"],
      "@/components/ui/form": ["FormLabel"],

    },
  };
}

export const SwitchDesignProperties: DesignPropertiesViews = {
  base: null,
  grid: <GridGroup />,
  html: <HtmlGroup />,
  label: <LabelGroup whitelist={["label", "label_description"]} />,
  input: <InputGroup whitelist={["description", "asCard", "checked"]} />,
  options: null,
  button: null,
  validation: <ValidationGroup />,
};
