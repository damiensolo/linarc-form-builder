import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useFormBuilderStore } from "@/stores/form-builder-store";
import { ViewportOverrideIndicator } from "@/components/form-builder/helpers/ViewportOverrideIndicator";

type propertiesWhitelist = "showBorder";

export type TextGroupProps = {
  whitelist?: propertiesWhitelist[];
};

export function TextGroup({
  whitelist = ["showBorder"],
}: TextGroupProps) {
  const { updateComponent, selectedComponent, viewport } =
    useFormBuilderStore();

  if (!selectedComponent) {
    return null;
  }

  const defaultShowBorder = selectedComponent.getField(
    "properties.style.showBorder",
    viewport
  ) === "yes";

  const handleChange = (
    field: string,
    value: any,
    isValidForAllViewports: boolean = false
  ) => {
    updateComponent(selectedComponent.id, field, value, isValidForAllViewports);
  };

  return (
    <div className="space-y-4">
      {whitelist.includes("showBorder") && (
        <div className="grid grid-cols-2 gap-2 items-center">
          <Label className="text-xs text-gray-400">Show Border</Label>
          <div className="flex flex-row items-center gap-2">
            <Switch
              checked={defaultShowBorder}
              onCheckedChange={(checked) =>
                handleChange(
                  `properties.style.showBorder`,
                  checked ? "yes" : "no",
                  true
                )
              }
            />
            <ViewportOverrideIndicator
              component={selectedComponent}
              field="properties.style.showBorder"
            />
          </div>
        </div>
      )}
    </div>
  );
}
