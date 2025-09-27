import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FormBuilderStore, Viewports } from "@/types/form-builder.types";
import { FormComponentModel } from "@/models/FormComponent";
import { Editor } from "@tiptap/react";

const generateComponentId = (
  component: FormComponentModel,
  components: FormComponentModel[]
): string => {
  const existingTypes = components.filter((comp) =>
    comp.getField("type").startsWith(component.getField("type"))
  );

  let counter = existingTypes.length;
  let newId = `${component.getField("id")}-${counter}`;

  return newId;
};

export const useFormBuilderStore = create<FormBuilderStore>()(
    (set, get) => ({
      mode: "editor",
      components: [],
      selectedRow: null,
      selectedComponent: null,
      viewport: "lg",
      showJson: false,
      formTitle: "MyForm",
      editor: null,
      enableDragging: true,
      activeTab: "new" as "new" | "existing",
      updateMode: (mode: FormBuilderStore['mode']) => set({ mode }),
      updateViewport: (viewport: Viewports) => set({ viewport }),
      toggleJsonPreview: () => set((state) => ({ showJson: !state.showJson })),
      updateFormTitle: (title: string) => set({ formTitle: title }),
      updateEnableDragging: (enableDragging: boolean) =>
        set({ enableDragging }),
      setEditor: (editor: Editor | null) => set({ editor }),
      updateActiveTab: (activeTab: "new" | "existing") => set({ activeTab }),
      addComponent: (component: FormComponentModel) => {
        const newComponent = new FormComponentModel({ ...component });
        let newId = generateComponentId(newComponent, get().components);
        newComponent.id = newId;
        newComponent.attributes = {
          ...newComponent.attributes,
          id: newComponent.id,
        };
        set((state) => {
          return { components: [...state.components, newComponent] };
        });

        return newComponent;
      },
      removeComponent: (componentId: string) => {
        set((state) => {
          return {
            components: state.components.filter(
              (component) => component.id !== componentId
            ),
            selectedComponent: state.selectedComponent?.id === componentId ? null : state.selectedComponent,
          };
        });
      },
      updateComponent: (
        componentId: string,
        field: string,
        value: any,
        isValidForAllViewports: boolean = false,
        isDragging: boolean = false
      ) => {
        set((state) => {
          const updateNestedField = (
            obj: any,
            path: string[],
            value: any
          ): any => {
            if (path.length === 1) {
              return { ...obj, [path[0]]: value };
            }
            const [current, ...rest] = path;
            return {
              ...obj,
              [current]: updateNestedField(obj[current] || {}, rest, value),
            };
          };

          const fieldPath = field.split(".");
          const viewport = state.viewport;
          let updatedComponent = null;

          return {
            components: state.components.map((component) => {
              if (component.id !== componentId) return component;

              updatedComponent = component;

              // If viewport is not 'sm', update the overrides
              if (viewport !== "sm" && !isValidForAllViewports) {
                const overrides =
                  component.overrides || ({} as Record<Viewports, any>);
                const viewportOverrides = overrides[viewport] || {};

                updatedComponent = new FormComponentModel({
                  ...component,
                  overrides: {
                    ...overrides,
                    [viewport]: updateNestedField(
                      viewportOverrides,
                      fieldPath,
                      value
                    ),
                  },
                });
                return updatedComponent;
              }

              // For 'sm' viewport, update the base component

              const nestedField = updateNestedField(
                component,
                fieldPath,
                value
              );

              updatedComponent = new FormComponentModel({
                ...component,
                ...nestedField,
              });
              return updatedComponent;
            }),
            selectedComponent: isDragging ? null : updatedComponent,
          };
        });
      },
      updateComponents: (components: FormComponentModel[]) =>
        set({ components }),
      selectComponent: (component: FormComponentModel | null) =>
        set(() => {
          return {
            selectedComponent: component
              ? new FormComponentModel(component)
              : null,
            editor: component === null || component.category === "form" ? null : get().editor,
          };
        }),
      moveComponent: (oldIndex: number, newIndex: number) =>
        set((state) => {
          const components = [...state.components];

          if (oldIndex === undefined) {
            oldIndex = components.length - 1;
          }

          const [movedComponent] = components.splice(oldIndex, 1);
          components.splice(newIndex, 0, movedComponent);

          return { components, selectedComponent: null };
        }),
    })
);
