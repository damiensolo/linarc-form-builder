"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { ComponentIcon } from "../helpers/component-icon";
import { CollapsibleSection } from "./collapsible-section";

interface ExistingItem {
  id: string;
  label: string;
  description: string;
  icon: string;
}

interface ExistingGroup {
  label: string;
  items: ExistingItem[];
}

export function ExistingContent() {
  const existingGroups: ExistingGroup[] = [
    {
      label: "Project",
      items: [
        {
          id: "project-1",
          label: "Data Field/Table",
          description: "Description",
          icon: "Database",
        },
        {
          id: "project-2", 
          label: "Data Field/Table",
          description: "Description",
          icon: "Database",
        },
      ],
    },
    {
      label: "Schedule",
      items: [
        {
          id: "schedule-1",
          label: "Data Field/Table", 
          description: "Description",
          icon: "Database",
        },
        {
          id: "schedule-2",
          label: "Data Field/Table",
          description: "Description", 
          icon: "Database",
        },
      ],
    },
    {
      label: "Finance",
      items: [
        {
          id: "finance-1",
          label: "Data Field/Table",
          description: "Description",
          icon: "Database",
        },
        {
          id: "finance-2",
          label: "Data Field/Table",
          description: "Description",
          icon: "Database",
        },
        {
          id: "finance-3",
          label: "Data Field/Table",
          description: "Description",
          icon: "Database",
        },
      ],
    },
    {
      label: "Quality",
      items: [
        {
          id: "quality-1",
          label: "Data Field/Table",
          description: "Description",
          icon: "Database",
        },
        {
          id: "quality-2",
          label: "Data Field/Table",
          description: "Description",
          icon: "Database",
        },
      ],
    },
    {
      label: "Document",
      items: [
        {
          id: "document-1",
          label: "Data Field/Table",
          description: "Description",
          icon: "Database",
        },
        {
          id: "document-2",
          label: "Data Field/Table",
          description: "Description",
          icon: "Database",
        },
      ],
    },
  ];

  const ExistingItem = ({ item }: { item: ExistingItem }) => {
    return (
      <SidebarMenuItem key={item.id}>
        <SidebarMenuButton className="h-12 hover:bg-slate-100 cursor-pointer">
          <div className="flex items-center gap-2">
            <div className="bg-slate-100 p-2 rounded-md text-slate-500">
              <ComponentIcon icon={item.icon as any} className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-800">
                {item.label}
              </span>
              <span className="text-xs text-gray-500">
                {item.description}
              </span>
            </div>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <>
      {existingGroups.map((group, index) => (
        <CollapsibleSection 
          key={`${group.label}-${index}`}
          title={group.label}
          defaultExpanded={index === 0} // First section expanded by default
        >
          <SidebarMenu className="gap-2">
            {group.items.map((item) => (
              <ExistingItem key={item.id} item={item} />
            ))}
          </SidebarMenu>
        </CollapsibleSection>
      ))}
    </>
  );
}
