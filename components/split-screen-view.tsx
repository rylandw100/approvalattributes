"use client"

import { useState, useMemo } from "react"
import { ViewModeToggle } from "@/components/view-mode-toggle"
import { CategoryFilter } from "@/components/category-filter"
import { RequestsTable } from "@/components/requests-table"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { allRequests } from "@/components/requests-table"

type ViewMode = "full-width" | "split"

interface SplitScreenViewProps {
  categoryName?: string
}

export function SplitScreenView({ categoryName = "Time and attendance" }: SplitScreenViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("full-width")
  const [selectedItem, setSelectedItem] = useState<number | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>(categoryName)

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
    // When switching from split to full-width, clear selection
    if (mode === "full-width") {
      setSelectedItem(null)
    }
  }

  // Get the selected request data
  const selectedRequest = useMemo(() => {
    if (selectedItem === null) return null
    const requests = allRequests.filter(request => request.category === activeCategory)
    return requests[selectedItem] || null
  }, [selectedItem, activeCategory])

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white rounded-2xl border border-gray-200">
      {/* Header with controls */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative" style={{ width: '224px' }}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search"
              className="pl-9 h-8"
            />
          </div>
        </div>
        <ViewModeToggle viewMode={viewMode} onViewModeChange={handleViewModeChange} />
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-hidden transition-all duration-300">
        {viewMode === "split" ? (
          <div className="flex flex-row h-full">
            {/* Grid on left */}
            <div className="flex-1 border-r border-gray-200 overflow-hidden transition-all duration-300" style={{ minWidth: '340px' }}>
              <div className="flex h-full">
                <CategoryFilter onCategoryChange={setActiveCategory} />
                <div className="flex-1 overflow-auto">
                  <RequestsTable 
                    categoryName={activeCategory}
                    viewMode={viewMode}
                    selectedItem={selectedItem}
                    onItemSelect={setSelectedItem}
                  />
                </div>
              </div>
            </div>
            {/* Detail panel on right */}
            <div className="flex-1 border-l border-gray-200 overflow-auto bg-white transition-all duration-300">
              {selectedRequest ? (
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4 text-gray-900">{selectedRequest.tooltip.title}</h2>
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Date</div>
                      <div className="text-sm text-gray-900 font-medium">{selectedRequest.date}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Requested by</div>
                      <div className="text-sm text-gray-900 font-medium">{selectedRequest.name}</div>
                      <div className="text-xs text-gray-500">{selectedRequest.role}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Description</div>
                      <div className="text-sm text-gray-900 font-medium">{selectedRequest.description}</div>
                    </div>
                    {selectedRequest.tooltip.details && selectedRequest.tooltip.details.length > 0 && (
                      <div>
                        <div className="text-xs text-gray-500 mb-2">Details</div>
                        <div className="space-y-3">
                          {selectedRequest.tooltip.details.map((detail, idx) => (
                            <div key={idx}>
                              <div className="text-xs text-gray-500">{detail.label}</div>
                              <div className="text-sm text-gray-900 font-medium">{detail.value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedRequest.hasComment && selectedRequest.comment && (
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Comment</div>
                        <div className="text-sm text-gray-900">
                          <div className="font-medium">{selectedRequest.comment.author}</div>
                          <div className="text-xs text-gray-500">{selectedRequest.comment.date}</div>
                          <div className="mt-1">{selectedRequest.comment.text}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <p className="text-sm">Select an item to view details</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex h-full">
            <CategoryFilter onCategoryChange={setActiveCategory} />
            <div className="flex-1 overflow-auto">
              <RequestsTable 
                categoryName={activeCategory}
                viewMode={viewMode}
                selectedItem={selectedItem}
                onItemSelect={setSelectedItem}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

