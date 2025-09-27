"use client";

import { cn } from "@/lib/utils";

interface TabNavigationProps {
  activeTab: "new" | "existing";
  onTabChange: (tab: "new" | "existing") => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="relative h-10 w-full">
      {/* Bottom border line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-neutral-200" />
      
      {/* Sliding Indicator */}
      <div 
        className={cn(
          "absolute bottom-0 h-[2px] w-1/2 bg-[#f55a08] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          activeTab === "new" ? "left-0" : "left-1/2"
        )}
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
              "flex flex-col h-[22px] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center w-[120px] font-bold transition-all duration-300 ease-in-out",
              activeTab === "new" ? "text-neutral-900" : "text-neutral-400"
            )}>
              <p className="leading-[18px]">New</p>
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
              "flex flex-col h-[22px] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center w-[120px] font-bold transition-all duration-300 ease-in-out",
              activeTab === "existing" ? "text-neutral-900" : "text-neutral-400"
            )}>
              <p className="leading-[18px]">Existing</p>
            </div>
            {/* Invisible placeholder for spacing */}
            <div className="h-[2px] w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
