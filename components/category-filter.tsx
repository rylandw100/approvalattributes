"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

const categories = [
  "Time off",
  "Reimbursements",
  "HR management",
  "Scheduling",
  "Custom objects",
]

interface CategoryFilterProps {
  onCategoryChange?: (category: string) => void
}

export function CategoryFilter({ onCategoryChange }: CategoryFilterProps) {
  const [activeIndex, setActiveIndex] = useState<number | null | -1>(-1)

  // Set default to "All approvals" on mount
  useEffect(() => {
    if (onCategoryChange) {
      onCategoryChange("All approvals")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="w-[220px] border-l border-gray-200 flex flex-col shrink-0">
      <div
        className={cn(
          "flex items-center justify-start min-h-[40px] relative w-full",
          activeIndex === -1 && "border-l-2 border-black"
        )}
      >
        <button
          onClick={() => {
            setActiveIndex(-1)
            if (onCategoryChange) {
              onCategoryChange("All approvals")
            }
          }}
          className={cn(
            "flex gap-1 items-center min-h-px min-w-px px-4 py-2 relative w-full text-left hover:bg-gray-50 transition-colors",
          )}
        >
          <p className={cn(
            "text-sm",
            activeIndex === -1 ? "font-medium text-black" : "font-normal text-[#716f6c]"
          )}>
            All approvals
          </p>
        </button>
      </div>
      <div
        className={cn(
          "flex items-center justify-start min-h-[40px] relative w-full",
          activeIndex === null && "border-l-2 border-black"
        )}
      >
        <button
          onClick={() => {
            setActiveIndex(null)
            if (onCategoryChange) {
              onCategoryChange("Time and attendance")
            }
          }}
          className={cn(
            "flex gap-1 items-center min-h-px min-w-px px-4 py-2 relative w-full text-left hover:bg-gray-50 transition-colors",
          )}
        >
          <p className={cn(
            "text-sm",
            activeIndex === null ? "font-medium text-black" : "font-normal text-[#716f6c]"
          )}>
            Time and attendance
          </p>
        </button>
      </div>
      {categories.map((category, index) => (
        <div
          key={index}
          className={cn(
            "flex items-center justify-start min-h-[40px] relative w-full",
            activeIndex === index && "border-l-2 border-black"
          )}
        >
          <button
            onClick={() => {
              setActiveIndex(index)
              if (onCategoryChange) {
                onCategoryChange(category)
              }
            }}
            className={cn(
              "flex gap-1 items-center min-h-px min-w-px px-4 py-2 relative w-full text-left",
              "hover:bg-gray-50 transition-colors"
            )}
          >
            <p
              className={cn(
                "text-sm relative shrink-0",
                activeIndex === index
                  ? "text-black font-medium"
                  : "text-[#716f6c] font-normal"
              )}
            >
              {category}
            </p>
          </button>
        </div>
      ))}
    </div>
  )
}

