"use client";

import { useFormBuilderStore } from "@/stores/form-builder-store";
import { AVAILABLE_COMPONENTS } from "@/config/available-components";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { ComponentIcon } from "../helpers/component-icon";
import { DragOverlay, useDraggable } from "@dnd-kit/core";

interface ComponentGroup {
  label: string;
  components: typeof AVAILABLE_COMPONENTS;
}

export function SidebarLeft() {
  const { addComponent } = useFormBuilderStore();

  const componentGroups: ComponentGroup[] = [
    {
      label: "Typography",
      components: AVAILABLE_COMPONENTS.filter(
        (comp) => comp.category === "content"
      ),
    },
    {
      label: "Input Fields",
      components: AVAILABLE_COMPONENTS.filter((comp) =>
        [
          "input",
          "textarea",
          "number",
          "email",
          "password",
          "tel",
          "url",
          "file",
        ].includes(comp.type)
      ),
    },
    {
      label: "Selection Fields",
      components: AVAILABLE_COMPONENTS.filter((comp) =>
        ["select", "checkbox", "checkbox-group", "radio", "switch"].includes(
          comp.type
        )
      ),
    },
    {
      label: "Date & Time",
      components: AVAILABLE_COMPONENTS.filter((comp) =>
        ["date"].includes(comp.type)
      ),
    },
    {
      label: "Buttons",
      components: AVAILABLE_COMPONENTS.filter((comp) =>
        ["button", "submit-button", "reset-button"].includes(comp.type)
      ),
    },
  ];

  const ComponentItem = ({
    component,
    index,
  }: {
    component: (typeof AVAILABLE_COMPONENTS)[0];
    index: number;
  }) => {
    const {
      attributes: columnAttributes,
      listeners: columnListeners,
      setNodeRef,
    } = useDraggable({
      id: component.id,
      data: {
        component,
        action: "add",
      },
    });

    return (
      <SidebarMenuItem key={component.id} ref={setNodeRef}>
        <SidebarMenuButton
          onClick={() => addComponent(component)}
          className="h-12 hover:bg-slate-100 cursor-pointer"
          data-item-id={component.id}
        >
          <div
            {...columnAttributes}
            {...columnListeners}
            className="flex items-center gap-2"
          >
            <div className="bg-slate-100 p-2 rounded-md text-slate-500">
              <ComponentIcon icon={component.icon} className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-800">
                {component.label}
              </span>
              <span className="text-xs text-gray-500">
                {component.label_info}
              </span>
            </div>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar className="bg-white top-13 z-20">
      <SidebarContent className="gap-0">
        {componentGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarMenu className="gap-2">
              {group.components.map((component, index) => (
                <ComponentItem
                  key={component.id}
                  component={component}
                  index={index}
                />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
