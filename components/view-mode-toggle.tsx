"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PanelLeft, Menu } from "lucide-react"

type ViewMode = "full-width" | "split"

interface ViewModeToggleProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}

export function ViewModeToggle({ viewMode, onViewModeChange }: ViewModeToggleProps) {
  const handleToggle = () => {
    const newMode = viewMode === "full-width" ? "split" : "full-width"
    onViewModeChange(newMode)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      className="gap-2"
    >
      {viewMode === "full-width" ? (
        <>
          <PanelLeft className="h-4 w-4" />
          Split
        </>
      ) : (
        <>
          <Menu className="h-4 w-4" />
          No split
        </>
      )}
    </Button>
  )
}

