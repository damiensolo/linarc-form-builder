"use client";

import { cn } from "@/lib/utils";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

interface TabNavigationProps {
  activeTab: "new" | "existing";
  onTabChange: (tab: "new" | "existing") => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const newLabelRef = useRef<HTMLParagraphElement | null>(null);
  const existingLabelRef = useRef<HTMLParagraphElement | null>(null);

  const [indicator, setIndicator] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });

  const updateIndicator = () => {
    const root = rootRef.current;
    const newLabel = newLabelRef.current;
    const existingLabel = existingLabelRef.current;
    if (!root || !newLabel || !existingLabel) return;

    const rootRect = root.getBoundingClientRect();
    const target = activeTab === "new" ? newLabel : existingLabel;
    const labelRect = target.getBoundingClientRect();

    // Center-align indicator with equal 8px padding on both sides
    const left = labelRect.left - rootRect.left - 8;
    const width = labelRect.width + 16;

    setIndicator((prev) =>
      prev.left !== left || prev.width !== width ? { left, width } : prev
    );
  };

  useLayoutEffect(() => {
    updateIndicator();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    const handle = () => updateIndicator();
    window.addEventListener("resize", handle);
    const id = window.setTimeout(handle, 0);
    return () => {
      window.removeEventListener("resize", handle);
      window.clearTimeout(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={rootRef} className="relative h-10 w-full">
      {/* Bottom border line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-neutral-200" />
      
      {/* Sliding Indicator (dynamically sized to label) */}
      <div
        className="absolute bottom-0 h-[3px] bg-[#f55a08] transition-[left,width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ left: `${indicator.left}px`, width: `${indicator.width}px` }}
      />
      
      {/* Tab Container */}
      <div className="absolute bottom-0 left-0 right-0 flex h-10">
        {/* New Tab */}
        <div 
          className={cn(
            "absolute bottom-0 left-0 right-1/2 flex flex-col items-center justify-end gap-1 cursor-pointer transition-all duration-200",
            "hover:bg-slate-50/50 rounded-t-md"
          )}
          onClick={() => onTabChange("new")}
        >
          <div className="flex flex-col items-center gap-2 relative shrink-0 w-full">
            <div className={cn(
              "flex flex-col h-[22px] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center font-bold transition-all duration-300 ease-in-out",
              "px-2",
              activeTab === "new" ? "text-neutral-900" : "text-neutral-400"
            )}>
              <p ref={newLabelRef} className="inline-block leading-[18px]">New</p>
            </div>
            {/* Invisible placeholder for spacing */}
            <div className="h-[2px] w-full" />
          </div>
        </div>

        {/* Existing Tab */}
        <div 
          className={cn(
            "absolute bottom-0 left-1/2 right-0 flex flex-col items-center justify-end gap-1 cursor-pointer transition-all duration-200",
            "hover:bg-slate-50/50 rounded-t-md"
          )}
          onClick={() => onTabChange("existing")}
        >
          <div className="flex flex-col items-center gap-2 relative shrink-0 w-full">
            <div className={cn(
              "flex flex-col h-[22px] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center font-bold transition-all duration-300 ease-in-out",
              "px-2",
              activeTab === "existing" ? "text-neutral-900" : "text-neutral-400"
            )}>
              <p ref={existingLabelRef} className="inline-block leading-[18px]">Existing</p>
            </div>
            {/* Invisible placeholder for spacing */}
            <div className="h-[2px] w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
