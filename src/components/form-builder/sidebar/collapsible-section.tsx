"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export function CollapsibleSection({ 
  title, 
  children, 
  defaultExpanded = true 
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="box-border content-stretch flex flex-col items-start p-[8px] relative shrink-0 w-full">
      {/* Header */}
      <div 
        className="box-border content-stretch flex gap-[8px] h-[32px] items-center px-[8px] py-0 relative shrink-0 w-full cursor-pointer hover:bg-slate-50/50 rounded-md transition-colors duration-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="relative shrink-0 size-[24px] flex items-center justify-center">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-slate-600" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-600" />
          )}
        </div>
        <div className="basis-0 flex flex-col grow justify-center leading-[0] min-h-px min-w-px relative shrink-0">
          <p className="text-sm font-medium text-slate-800">{title}</p>
        </div>
      </div>
      
      {/* Content */}
      <div 
        className={cn(
          "content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full transition-all duration-300 ease-in-out overflow-hidden",
          isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        {children}
      </div>
    </div>
  );
}
