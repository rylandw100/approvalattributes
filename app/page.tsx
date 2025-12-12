"use client"

import { useState } from "react"
import { CategoryFilter } from "@/components/category-filter"
import { RequestsTable } from "@/components/requests-table"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string>("Time and attendance")

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: '#F9F7F6' }}>
      <main className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: '#F9F7F6' }}>
        <div className="px-14 py-8" style={{ backgroundColor: '#F9F7F6' }}>
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Approvals</h1>
          <Tabs defaultValue="needs-review" className="w-full">
            <div className="w-screen bg-white border-b border-gray-200" style={{ marginLeft: '-56px', marginRight: '-56px', marginBottom: '32px' }}>
              <TabsList className="bg-white p-0 h-auto rounded-none w-full justify-start" style={{ paddingLeft: '56px', paddingRight: '56px' }}>
              <TabsTrigger
                value="needs-review"
                className="px-4 py-2 rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent"
              >
                Needs my review
              </TabsTrigger>
              <TabsTrigger
                value="reviewed"
                className="px-4 py-2 rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent"
              >
                Reviewed
              </TabsTrigger>
              <TabsTrigger
                value="my-requests"
                className="px-4 py-2 rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent"
              >
                My requests
              </TabsTrigger>
              <TabsTrigger
                value="all-requests"
                className="px-4 py-2 rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent"
              >
                All requests
              </TabsTrigger>
              <TabsTrigger
                value="policies"
                className="px-4 py-2 rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent"
              >
                Approval policies
              </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="needs-review" className="mt-0">
              <div className="flex h-[calc(100vh-240px)]" style={{ gap: '24px' }}>
                <CategoryFilter onCategoryChange={setActiveCategory} />
                <RequestsTable categoryName={activeCategory} />
              </div>
            </TabsContent>
            <TabsContent value="reviewed" className="mt-0">
              <div className="flex h-[calc(100vh-240px)]" style={{ gap: '24px' }}>
                <CategoryFilter onCategoryChange={setActiveCategory} />
                <RequestsTable categoryName={activeCategory} />
              </div>
            </TabsContent>
            <TabsContent value="my-requests" className="mt-0">
              <div className="flex h-[calc(100vh-240px)]" style={{ gap: '24px' }}>
                <CategoryFilter onCategoryChange={setActiveCategory} />
                <RequestsTable categoryName={activeCategory} />
              </div>
            </TabsContent>
            <TabsContent value="all-requests" className="mt-0">
              <div className="flex h-[calc(100vh-240px)]" style={{ gap: '24px' }}>
                <CategoryFilter onCategoryChange={setActiveCategory} />
                <RequestsTable categoryName={activeCategory} />
              </div>
            </TabsContent>
            <TabsContent value="policies" className="mt-0">
              <div className="flex h-[calc(100vh-240px)]" style={{ gap: '24px' }}>
                <CategoryFilter onCategoryChange={setActiveCategory} />
                <RequestsTable categoryName={activeCategory} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
