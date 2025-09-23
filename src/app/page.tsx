"use client";

import {
  closestCenter,
  DndContext,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
} from "@dnd-kit/core";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarLeft } from "@/components/form-builder/sidebar/sidebarLeft";
import { SidebarRight } from "@/components/form-builder/sidebar/sidebarRight";
import { MainCanvas } from "@/components/form-builder/mainCanvas";
import {
  Monitor,
  Tablet,
  Smartphone,
  PlayIcon,
  XIcon,
} from "lucide-react";
import { useFormBuilderStore } from "@/stores/form-builder-store";
import { Button } from "@/components/ui/button";
import { ToggleGroupNav } from "@/components/form-builder/ui/toggle-group-nav";
import { useCallback, useMemo, useState } from "react";
import { MobileNotification } from "@/components/form-builder/ui/mobile-notification";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn, getGridRows, updateColSpans } from "@/lib/utils";

export default function FormBuilderPage() {
  const isMobile = useIsMobile();
  
  // Split the store selectors to only subscribe to what we need
  const viewport = useFormBuilderStore((state) => state.viewport);
  const mode = useFormBuilderStore((state) => state.mode);
  const formTitle = useFormBuilderStore((state) => state.formTitle);
  const updateViewport = useFormBuilderStore((state) => state.updateViewport);
  const updateMode = useFormBuilderStore((state) => state.updateMode);
  const updateFormTitle = useFormBuilderStore((state) => state.updateFormTitle);
  const components = useFormBuilderStore((state) => state.components);
  const selectComponent = useFormBuilderStore((state) => state.selectComponent);


  const [draggingDOMElement, setDraggingDOMElement] =
    useState<HTMLElement | null>(null);

  // Memoize static values
  const viewportItems = useMemo(
    () => [
      { value: "lg", icon: Monitor },
      { value: "md", icon: Tablet },
      { value: "sm", icon: Smartphone },
    ],
    []
  );

  const updateComponent = useFormBuilderStore((state) => state.updateComponent);
  const moveComponent = useFormBuilderStore((state) => state.moveComponent);
  const addComponent = useFormBuilderStore((state) => state.addComponent);
  const gridRows = getGridRows(components, viewport);
  const editor = useFormBuilderStore((state) => state.editor);

  // Create sensors outside of callback
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 20,
    },
  });

  // Memoize sensors array
  const sensors = useMemo(() => [pointerSensor], [pointerSensor]);

  // Memoize drag end handler
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const action: "move" | "add" = active.data.current.action;
    let activeComponent = active.data.current.component;
    const overComponent = over.data.current.component;
    const position = over.data.current.position;
    const activeIndex = active.data.current.index;
    const overIndex = over.data.current.index;

    if (action === "add") {
      activeComponent = addComponent(active.data.current.component);
    }

    if (
      (activeIndex === overIndex &&
        (position === "left" || position === "right")) ||
      // Or the diff between active and over is 1
      (activeIndex - overIndex === 1 && position === "bottom") ||
      (overIndex - activeIndex === 1 && position === "top")
    ) {
      return;
    }

    if (activeComponent && overComponent) {
      const overRowItems =
        gridRows.find((row) =>
          row.some((item) => item.id === over.data.current?.component.id)
        ) || [];

      const overRowFirstItemIndex = components.findIndex(
        (component) => component.id === overRowItems[0].id
      );

      const overRowLastItemIndex = components.findIndex(
        (component) => component.id === overRowItems[overRowItems.length - 1].id
      );

      let activeRowItems =
        gridRows.find((row) =>
          row.some((item) => item.id === active.data.current?.component.id)
        ) || [];

      let draggingInSameRow = overRowItems === activeRowItems;

      // Don´t update the spans if the component is being dragged in the same row
      activeRowItems = activeRowItems.filter(
        (item) => item.id !== activeComponent.id
      );
      let updatedOverItems = [];

      if (position === "top" || position === "bottom") {
        updatedOverItems = updateColSpans([activeComponent]);
      } else {
        updatedOverItems = updateColSpans([...overRowItems, activeComponent]);
      }

      if (
        (!draggingInSameRow && (position === "left" || position === "right")) ||
        position === "top" ||
        position === "bottom"
      ) {
        updatedOverItems.forEach((item) => {
          updateComponent(
            item.id,
            "properties.style.colSpan",
            `${item.span}`,
            false,
            true
          );
        });

        const updatedActiveItems = updateColSpans([...activeRowItems]);

        updatedActiveItems.forEach((item) => {
          updateComponent(
            item.id,
            "properties.style.colSpan",
            `${item.span}`,
            false,
            true
          );
        });
      }

      const oldIndex = active.data.current.index;
      let newIndex =
        position === "left"
          ? overIndex
          : activeIndex < overIndex
            ? overIndex
            : overIndex + 1;

      if (position === "top") {
        newIndex =
          activeIndex < overIndex
            ? overRowFirstItemIndex - 1
            : overRowFirstItemIndex;
      }

      if (position === "bottom") {
        newIndex =
          activeIndex < overIndex
            ? overRowLastItemIndex
            : overRowLastItemIndex + 1;
      }

      moveComponent(oldIndex, newIndex);
    }
  };

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      selectComponent(null);
      const element = document.querySelector(
        `[data-item-id="${event.active.data.current?.component.id}"]`
      );
      if (element) {
        setDraggingDOMElement(element as HTMLElement);
      }
    },
    [selectComponent]
  );

  return (
    <div>
      {/* Main Header - Full Width */}
      <div className="fixed top-0 left-0 right-0 z-40">
        {/* Full Header Navigation - Exact Figma Implementation */}
        <div className="h-[90px] bg-[#06152b] w-full flex relative">
          {/* Left Brand Section */}
          <div className="w-[90px] flex items-center justify-center bg-[#06152b] relative">
            <div className="w-[50px] h-[50px] flex items-center justify-center">
              <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 7C0 5.89543 0.89543 5 2 5H48C49.1046 5 50 5.89543 50 7V37.5L46.8624 40.6376L41.25 46.25L37.5 50H2C0.895431 50 0 49.1046 0 48V7Z" fill="#FDBA74"/>
                <path d="M3.33301 9.33301C3.33301 8.78072 3.78072 8.33301 4.33301 8.33301H45.6663C46.2186 8.33301 46.6663 8.78072 46.6663 9.33301V37.2647C46.6663 37.5334 46.5582 37.7909 46.3662 37.9789L37.7913 46.3806C37.6044 46.5638 37.3531 46.6663 37.0914 46.6663H4.33301C3.78072 46.6663 3.33301 46.2186 3.33301 45.6663V9.33301Z" fill="#F97316"/>
                <path d="M27.422 13.3058L34.7553 16.3669C35.1277 16.5224 35.3701 16.8863 35.3701 17.2898V39.9997H26.0368V14.2286C26.0368 13.5147 26.7632 13.0308 27.422 13.3058Z" fill="#FDBA74"/>
                <path d="M26.3603 10.4198L15.027 14.0626C14.6134 14.1955 14.333 14.5802 14.333 15.0146V39.9994H27.6663V11.3718C27.6663 10.6938 27.0058 10.2123 26.3603 10.4198Z" fill="white"/>
                <path d="M19.4676 16.8184H17.201C17.0905 16.8184 17.001 16.9079 17.001 17.0184V19.3456C17.001 19.456 17.0905 19.5456 17.201 19.5456H19.4676C19.5781 19.5456 19.6676 19.456 19.6676 19.3456V17.0184C19.6676 16.9079 19.5781 16.8184 19.4676 16.8184Z" fill="#F97316"/>
                <path d="M30.2374 19.5439H32.5041C32.6146 19.5439 32.7041 19.6335 32.7041 19.7439V22.0712C32.7041 22.1816 32.6146 22.2712 32.5041 22.2712H30.2374C30.127 22.2712 30.0374 22.1816 30.0374 22.0712V19.7439C30.0374 19.6335 30.127 19.5439 30.2374 19.5439Z" fill="white"/>
                <path d="M19.4676 22.2725H17.201C17.0905 22.2725 17.001 22.362 17.001 22.4725V24.7997C17.001 24.9101 17.0905 24.9997 17.201 24.9997H19.4676C19.5781 24.9997 19.6676 24.9101 19.6676 24.7997V22.4725C19.6676 22.362 19.5781 22.2725 19.4676 22.2725Z" fill="#F97316"/>
                <path d="M19.4676 27.7275H17.201C17.0905 27.7275 17.001 27.8171 17.001 27.9275V30.2548C17.001 30.3652 17.0905 30.4548 17.201 30.4548H19.4676C19.5781 30.4548 19.6676 30.3652 19.6676 30.2548V27.9275C19.6676 27.8171 19.5781 27.7275 19.4676 27.7275Z" fill="#F97316"/>
                <path d="M30.2374 25H32.5041C32.6146 25 32.7041 25.0895 32.7041 25.2V27.5272C32.7041 27.6377 32.6146 27.7272 32.5041 27.7272H30.2374C30.127 27.7272 30.0374 27.6377 30.0374 27.5272V25.2C30.0374 25.0895 30.127 25 30.2374 25Z" fill="white"/>
                <path d="M30.2374 30.4541H32.5041C32.6146 30.4541 32.7041 30.5436 32.7041 30.6541V32.9813C32.7041 33.0918 32.6146 33.1813 32.5041 33.1813H30.2374C30.127 33.1813 30.0374 33.0918 30.0374 32.9813V30.6541C30.0374 30.5436 30.127 30.4541 30.2374 30.4541Z" fill="white"/>
                <path d="M22.6663 33.1807H19.333C18.7807 33.1807 18.333 33.6284 18.333 34.1807V38.6351H23.6663V34.1807C23.6663 33.6284 23.2186 33.1807 22.6663 33.1807Z" fill="#F97316"/>
                <path d="M24.8007 16.8184H22.534C22.4235 16.8184 22.334 16.9079 22.334 17.0184V19.3456C22.334 19.456 22.4235 19.5456 22.534 19.5456H24.8007C24.9111 19.5456 25.0007 19.456 25.0007 19.3456V17.0184C25.0007 16.9079 24.9111 16.8184 24.8007 16.8184Z" fill="#F97316"/>
                <path d="M24.8007 22.2725H22.534C22.4235 22.2725 22.334 22.362 22.334 22.4725V24.7997C22.334 24.9101 22.4235 24.9997 22.534 24.9997H24.8007C24.9111 24.9997 25.0007 24.9101 25.0007 24.7997V22.4725C25.0007 22.362 24.9111 22.2725 24.8007 22.2725Z" fill="#F97316"/>
                <path d="M24.8007 27.7275H22.534C22.4235 27.7275 22.334 27.8171 22.334 27.9275V30.2548C22.334 30.3652 22.4235 30.4548 22.534 30.4548H24.8007C24.9111 30.4548 25.0007 30.3652 25.0007 30.2548V27.9275C25.0007 27.8171 24.9111 27.7275 24.8007 27.7275Z" fill="#F97316"/>
                <path d="M11.667 39.333C11.667 38.7807 12.1147 38.333 12.667 38.333H37.3337C37.8859 38.333 38.3337 38.7807 38.3337 39.333V40.6663C38.3337 41.2186 37.8859 41.6663 37.3337 41.6663H12.667C12.1147 41.6663 11.667 41.2186 11.667 40.6663V39.333Z" fill="#EA580C"/>
                <path d="M43.75 43.75L50 37.5H39.5C38.3954 37.5 37.5 38.3954 37.5 39.5V50L43.75 43.75Z" fill="#FDBA74"/>
                <path d="M13.333 2C13.333 0.895431 14.2284 0 15.333 0H34.6663C35.7709 0 36.6663 0.895431 36.6663 2V8.33333H13.333V2Z" fill="#F97316"/>
              </svg>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-px bg-[#809fb8] opacity-20"></div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Top Row: Navigation Tabs */}
            <div className="flex h-[60px] items-stretch">
              {/* Project Tab */}
              <div className="flex flex-col items-center justify-center w-[72px] bg-[#06152b] text-white font-lato font-bold">
                <div className="w-[22px] h-[22px] mb-1 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-[10px] leading-[14px] text-white">Project</span>
              </div>

              {/* Plans Tab */}
              <div className="flex flex-col items-center justify-center w-[64px] bg-[#06152b] text-white/80 hover:text-white cursor-pointer font-lato">
                <div className="w-[22px] h-[22px] mb-1 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a2 2 0 002 2h8a2 2 0 002-2V3a2 2 0 012 2v6h-3a3 3 0 00-3 3v3H6a2 2 0 01-2-2V5zm11 11a1 1 0 10-2 0v2a1 1 0 102 0v-2z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-[10px] leading-[14px]">Plans</span>
              </div>

              {/* Schedule Tab */}
              <div className="flex flex-col items-center justify-center w-[80px] bg-[#06152b] text-white/80 hover:text-white cursor-pointer font-lato">
                <div className="w-[22px] h-[22px] mb-1 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-[10px] leading-[14px]">Schedule</span>
              </div>

              {/* Budget Tab */}
              <div className="flex flex-col items-center justify-center w-[72px] bg-[#06152b] text-white/80 hover:text-white cursor-pointer font-lato">
                <div className="w-[22px] h-[22px] mb-1 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-[10px] leading-[14px]">Budget</span>
              </div>

              {/* RFI Tab */}
              <div className="flex flex-col items-center justify-center w-[62px] bg-[#06152b] text-white/80 hover:text-white cursor-pointer font-lato">
                <div className="w-[24px] h-[24px] mb-1 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-[10px] leading-[14px]">RFI</span>
              </div>

              {/* CO Tab */}
              <div className="flex flex-col items-center justify-center w-[62px] bg-[#06152b] text-white/80 hover:text-white cursor-pointer font-lato">
                <div className="w-[22px] h-[22px] mb-1 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </div>
                <span className="text-[10px] leading-[14px]">CO</span>
              </div>

              {/* Submittals Tab */}
              <div className="flex flex-col items-center justify-center w-[86px] bg-[#06152b] text-white/80 hover:text-white cursor-pointer font-lato">
                <div className="w-[22px] h-[22px] mb-1 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-[10px] leading-[14px]">Submittals</span>
              </div>

              {/* Punchlist Tab */}
              <div className="flex flex-col items-center justify-center w-[81px] bg-[#06152b] text-white/80 hover:text-white cursor-pointer font-lato">
                <div className="w-[22px] h-[22px] mb-1 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a2 2 0 002 2h8a2 2 0 002-2V3a2 2 0 012 2v6h-3a3 3 0 00-3 3v3H6a2 2 0 01-2-2V5z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-[10px] leading-[14px]">Punchlist</span>
              </div>

              {/* Spacer to push action icons to the right */}
              <div className="flex-1"></div>

              {/* Right side - Action icons */}
              <div className="flex items-center gap-4 pr-6">
                {/* Search Icon */}
                <button className="w-[22px] h-[22px] flex items-center justify-center text-white/80 hover:text-white transition-colors">
                  <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                
                {/* Messages Icon */}
                <button className="w-[22px] h-[22px] flex items-center justify-center text-white/80 hover:text-white transition-colors">
                  <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </button>
                
                {/* Bell Alert Icon */}
                <button className="w-[22px] h-[22px] flex items-center justify-center text-white/80 hover:text-white transition-colors relative">
                  <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7C18 6.279 15.458 4 12.25 4H11.75C8.542 4 6 6.279 6 9.05v.7a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                  </svg>
                  {/* Optional notification dot */}
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                </button>
                
                {/* Help Icon */}
                <button className="w-[22px] h-[22px] flex items-center justify-center text-white/80 hover:text-white transition-colors">
                  <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                
                {/* User Avatar */}
                <div className="w-[32px] h-[32px] rounded-full bg-white/20 flex items-center justify-center overflow-hidden ml-2">
                  <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiNEOUQ5RDkiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNOCA3QTMgMyAwIDEgMCA4IDNBM0EgMyAwIDAgMCA4IDdaTTIgMTNBNiA2IDAgMSAxIDE0IDEzSDJaIiBmaWxsPSIjNjY2NjY2Ii8+Cjwvc3ZnPgo8L3N2Zz4K" alt="User Avatar" className="w-full h-full" />
                </div>
              </div>
            </div>

            {/* Bottom Row: Project Information - Left Aligned */}
            <div className="h-[30px] flex items-center px-[10px] bg-[#06152b] relative">
              <div className="flex items-center gap-2.5 text-white font-lato font-medium text-[12px] leading-[16px]">
                <span>Big Mall</span>
                <div className="w-0 h-4 border-l border-[#809fb8] opacity-20"></div>
                <span>4010 Moorpark Ave #228, San Jose, CA 95117, USA</span>
                <div className="w-0 h-4 border-l border-[#809fb8] opacity-20"></div>
                <span>Owner - Build Enterprises</span>
                <div className="w-0 h-4 border-l border-[#809fb8] opacity-20"></div>
                <span>GC - A to Z construction</span>
                <div className="w-0 h-4 border-l border-[#809fb8] opacity-20"></div>
                <span>PM - Matt Anderson</span>
                <div className="w-0 h-4 border-l border-[#809fb8] opacity-20"></div>
                <span>+1 56565 - 7878</span>
              </div>
              {/* Horizontal separator line */}
              <div className="absolute top-0 left-[90px] right-0 h-px bg-[#809fb8] opacity-20"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Title Bar Sub-Header - Positioned to the right of sidebar */}
      <div className="fixed top-[90px] left-[90px] right-0 z-30">
        <div
          className={cn(
            "w-full flex flex-row gap-2 justify-between bg-white border-b"
          )}
        >
          <div className="p-2 flex-1 flex items-center">
            {mode === "editor" && (
              <>
                {/* Custom Form Title with Back Arrow - Left Anchored */}
                <div className="flex items-center gap-3">
                  <button className="flex items-center justify-center w-6 h-6 text-gray-600 hover:text-gray-900 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <span className="text-base font-semibold text-gray-900">Custom Form</span>
                </div>
                
                {/* Center - Form Title */}
                <div className="flex-1 flex justify-center">
                  <div className="text-center flex flex-row items-center justify-center gap-1 border rounded-md h-9 px-4">
                    <div
                      className="max-w-80 overflow-y-hidden whitespace-nowrap text-sm outline-none scrollbar-hide"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => updateFormTitle(e.target.innerText)}
                    >
                      {formTitle}
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {/* Right - Preview Controls */}
            <div
              className={cn(
                "hidden md:flex justify-end gap-4",
                mode === "preview" && "justify-center"
              )}
            >
              <ToggleGroupNav
                name="viewport"
                items={viewportItems}
                defaultValue={viewport}
                onValueChange={(value) =>
                  updateViewport(value as "sm" | "md" | "lg")
                }
              />
            </div>
          </div>
          <div className="hidden md:flex flex-row gap-2 py-2 px-4">
            {mode === "editor" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => {
                    updateMode("preview");
                    selectComponent(null);
                  }}
                >
                  <PlayIcon className="h-4 w-4" />
                  Preview
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    // TODO: Implement save functionality
                    console.log("Save form");
                  }}
                  className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Save
                </Button>
              </>
            )}
            {mode === "preview" && (
              <Button
                variant="default"
                size="sm"
                className="cursor-pointer w-full"
                onClick={() => updateMode("editor")}
              >
                <XIcon className="h-4 w-4" />
                Exit Preview
              </Button>
            )}
          </div>
        </div>
      </div>

      {!isMobile && (
        <>
          {/* Left Navigation Sidebar */}
          <div className="fixed left-0 top-[90px] bottom-0 w-[90px] bg-white border-r border-gray-200 z-30 flex flex-col pt-4">
            {/* Dashboard Icon */}
            <div className="flex flex-col items-center justify-center h-[60px] text-gray-600 hover:text-gray-900 cursor-pointer mb-4">
              <div className="w-[22px] h-[22px] mb-1 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V3a2 2 0 012-2h4a2 2 0 012 2v4" />
                </svg>
              </div>
              <span className="text-[10px] font-lato">Dashboard</span>
            </div>

            {/* Log Icon */}
            <div className="flex flex-col items-center justify-center h-[60px] text-gray-600 hover:text-gray-900 cursor-pointer mb-4">
              <div className="w-[22px] h-[22px] mb-1 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-[10px] font-lato">Log</span>
            </div>

            {/* Completed Icon */}
            <div className="flex flex-col items-center justify-center h-[60px] text-gray-600 hover:text-gray-900 cursor-pointer">
              <div className="w-[22px] h-[22px] mb-1 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-[10px] font-lato">Completed</span>
            </div>
          </div>

          {/* Main Content Area with Left Sidebar Offset */}
          <div className="ml-[90px]">
            <SidebarProvider
              className="relative hidden md:block"
              style={{ "--sidebar-width": "300px" } as React.CSSProperties}
              open={mode === "editor"}
            >
              <DndContext
                id="form-builder"
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                onDragStart={handleDragStart}
              >
                <div className="flex w-full h-screen justify-between">
                  <SidebarLeft />

                  <div className="flex-1 flex flex-col">
                    {/* Spacer for fixed headers */}
                    <div className="h-[calc(90px+3.25rem)] flex-shrink-0"></div>
                    
                    <main
                      className={cn(
                        "flex-1 transition-all duration-300 overflow-auto relative bg-dotted scrollbar-hide",
                        mode === "preview" && "bg-slate-50"
                      )}
                    >
                      <MainCanvas />
      </main>
                  </div>
                  <SidebarRight />
                </div>
                <DragOverlay>
                  {draggingDOMElement && (
                    <div className="bg-white p-2 rounded-md shadow opacity-80">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: draggingDOMElement.innerHTML,
                        }}
                        className="max-h-52 overflow-hidden"
                      />
                    </div>
                  )}
                </DragOverlay>
              </DndContext>
            </SidebarProvider>
          </div>
        </>
      )}

      {/* Show mobile notification for mobile users */}
      {isMobile && <MobileNotification />}
    </div>
  );
}
