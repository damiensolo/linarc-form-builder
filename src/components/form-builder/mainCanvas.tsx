"use client";

import { useFormBuilderStore } from "@/stores/form-builder-store";
import { useMemo, memo, useState, useEffect, useCallback } from "react";
import GenerateCanvasGrid from "./canvas/generate-canvas-grid";
import { cn } from "@/lib/utils";
import { CardContent } from "../ui/card";
import { Card } from "../ui/card";
import { FormComponentModel } from "@/models/FormComponent";
import { useDroppable } from "@dnd-kit/core";
// Memoize static viewport styles
const viewportEditorStyles = {
  sm: "w-[370px]",
  md: "w-[818px]",
  lg: "w-[1074px]",
} as const;


const EmptyState = memo(() => {
  const { setNodeRef, isOver } = useDroppable({
    id: "empty-state",
    data: {
      index: 0,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "p-12 text-center text-base text-muted-foreground bg-black/5 rounded-lg w-[840px] max-w-[90vw] mx-auto border-dashed border-2 border-slate-300",
        isOver && "border-primary"
      )}
    >
      Please add a new component here
    </div>
  );
});

EmptyState.displayName = "EmptyState";

export function MainCanvas() {
  // Split store selectors to minimize re-renders
  const viewport = useFormBuilderStore((state) => state.viewport);
  const selectedComponent = useFormBuilderStore(
    (state) => state.selectedComponent
  );
  const selectComponent = useFormBuilderStore((state) => state.selectComponent);
  const components = useFormBuilderStore((state) => state.components);
  const enableDragging = useFormBuilderStore((state) => state.enableDragging);
  const formTitle = useFormBuilderStore((state) => state.formTitle);
  const updateFormTitle = useFormBuilderStore((state) => state.updateFormTitle);
  const mode = useFormBuilderStore((state) => state.mode);
  const [currentComponents, setCurrentComponents] = useState<
    FormComponentModel[]
  >([]);

  useEffect(() => {
    setCurrentComponents(components);
  }, [components]);

  const GridCanvas = useCallback(() => {
    return <GenerateCanvasGrid components={currentComponents} />;
  }, [currentComponents]);


  return (
    <div className="flex flex-col h-full pt-8">
      {/* Form Title Button - Above Main Canvas - Hidden for now */}
      <div className="hidden">
        <div className={cn(
          "text-center flex flex-row items-center justify-center gap-1 border rounded-md h-9 px-4 bg-white shadow-sm",
          mode !== "editor" && "invisible"
        )}>
          <div
            className="max-w-80 overflow-y-hidden whitespace-nowrap text-sm outline-none scrollbar-hide text-gray-900"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => updateFormTitle(e.target.innerText)}
          >
            {formTitle}
          </div>
        </div>
      </div>

      {/* Main Canvas Content */}
      {components.length > 0 ? (
        <div className="flex gap-4 flex-1 flex-col 3xl:flex-row">
          <div
            className={`flex-1 w-full z-10`}
            onClick={() => {
              if (selectedComponent && enableDragging) {
                selectComponent(null);
              }
            }}
          >
            <Card
              className={cn(
                "transition-all duration-300",
                `${viewportEditorStyles[viewport]}`,
                "mx-auto scrollbar-hide z-10"
              )}
            >
              <CardContent>
                <GridCanvas />
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
