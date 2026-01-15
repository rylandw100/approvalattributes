"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { createRoot } from "react-dom/client"
import React from "react"
import dynamic from "next/dynamic"
import { allRequests } from "@/components/requests-table"
import Badge from "@rippling/pebble/Atoms/Badge"
import PebbleThemeProvider from "@/components/pebble-theme-provider"
import Tabs from "@rippling/pebble/Tabs"
import Tab from "@rippling/pebble/Tabs/Tab"

const AppNavBar = dynamic(() => import("@rippling/pebble/AppNavBar").then(mod => ({ default: mod.AppNavBar })), { ssr: false })
const CategoryFilter = dynamic(() => import("@/components/category-filter").then(mod => ({ default: mod.CategoryFilter })), { ssr: false })
const RequestsTable = dynamic(() => import("@/components/requests-table").then(mod => ({ default: mod.RequestsTable })), { ssr: false })

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string>("Time and attendance")
  const [activeTab, setActiveTab] = useState<string>("needs-review")
  const [viewModeIndex, setViewModeIndex] = useState<number>(0) // 0 = Long, 1 = Medium, 2 = Short

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    allRequests.forEach(request => {
      counts[request.category] = (counts[request.category] || 0) + 1
    })
    return counts
  }, [])

  const allApprovalsCount = allRequests.length
  const navBarRef = useRef<HTMLDivElement>(null)

  // Sync viewModeIndex with activeTab when it's a view mode page
  useEffect(() => {
    if (activeTab === 'long') {
      setViewModeIndex(0)
    } else if (activeTab === 'medium') {
      setViewModeIndex(1)
    } else if (activeTab === 'short') {
      setViewModeIndex(2)
    }
  }, [activeTab])

  const navLinks = [
    { title: "Needs my review", path: "needs-review" },
    { title: "Reviewed", path: "reviewed" },
    { title: "My requests", path: "my-requests" },
    { title: "All requests", path: "all-requests" },
    { title: "Approval policies", path: "policies" },
  ]

  // Add badge to "Needs my review" link after AppNavBar renders
  useEffect(() => {
    if (!navBarRef.current || allApprovalsCount === 0) return

    let isAddingBadge = false
    let timeoutIds: NodeJS.Timeout[] = []
    let isInternalChange = false

    const addNavBadge = () => {
      if (!navBarRef.current || isAddingBadge) return
      isAddingBadge = true

      try {
        // Check if badge already exists with correct count
        const existingBadge = navBarRef.current.querySelector('.nav-badge')
        if (existingBadge && existingBadge.textContent?.trim() === allApprovalsCount.toString()) {
          isAddingBadge = false
          return // Badge already exists and is correct
        }
        
        // Remove existing badge only if it needs updating
        if (existingBadge) {
          isInternalChange = true
          existingBadge.remove()
        }

        // Try multiple selectors to find the "Needs my review" link
        const selectors = [
          'a[href*="needs-review"]',
          '[href*="needs-review"]'
        ]

        let needsReviewLink: HTMLElement | null = null

        for (const selector of selectors) {
          try {
            const found = navBarRef.current.querySelector(selector) as HTMLElement
            if (found) {
              needsReviewLink = found
              break
            }
          } catch (e) {
            // Selector might not be supported, continue
          }
        }

        // If not found by selector, search by text content
        if (!needsReviewLink) {
          const allLinks = Array.from(navBarRef.current.querySelectorAll('a, button, [role="link"]')) as HTMLElement[]
          needsReviewLink = allLinks.find(link => {
            const text = link.textContent?.trim() || ''
            return text.includes('Needs my review')
          }) || null
        }

        if (needsReviewLink && !needsReviewLink.querySelector('.nav-badge')) {
          try {
            const badgeContainer = document.createElement('span')
            badgeContainer.className = 'nav-badge'
            badgeContainer.style.cssText = 'display: inline-flex; align-items: center; margin-left: 8px;'
            needsReviewLink.appendChild(badgeContainer)
            const root = createRoot(badgeContainer)
            root.render(
              React.createElement(PebbleThemeProvider, null,
                React.createElement(Badge, { 
                  text: allApprovalsCount.toString(),
                  appearance: "PRIMARY_DARK"
                })
              )
            )
          } catch (error) {
            console.error('Error rendering badge:', error)
            // Fallback to simple text if React rendering fails
            const badgeContainer = document.createElement('span')
            badgeContainer.className = 'nav-badge'
            badgeContainer.textContent = allApprovalsCount.toString()
            badgeContainer.style.cssText = 'display: inline-flex; align-items: center; justify-content: center; margin-left: 8px; height: 20px; min-width: 20px; padding: 0 6px; font-size: 12px; font-weight: 600; border-radius: 9999px; background-color: #E5E7EB; color: #374151; line-height: 1;'
            needsReviewLink.appendChild(badgeContainer)
          }
        }
      } finally {
        isAddingBadge = false
        // Reset flag after a short delay to allow DOM to settle
        setTimeout(() => {
          isInternalChange = false
        }, 200)
      }
    }

    // Use MutationObserver to watch for AppNavBar rendering, but ignore our own badge additions
    let observerTimeout: NodeJS.Timeout | null = null
    const observer = new MutationObserver((mutations) => {
      // Ignore mutations we caused ourselves
      if (isInternalChange) return
      
      // Only react to mutations that add/remove nav elements, not badge elements
      const relevantMutations = mutations.filter(mutation => {
        const target = mutation.target as HTMLElement
        // Ignore changes to badge containers or their children
        if (target.classList?.contains('nav-badge') || 
            target.closest('.nav-badge') ||
            Array.from(mutation.addedNodes).some((node: any) => 
              node.classList?.contains('nav-badge') || node.closest?.('.nav-badge')
            )) {
          return false
        }
        return true
      })
      
      if (relevantMutations.length > 0) {
        if (observerTimeout) clearTimeout(observerTimeout)
        observerTimeout = setTimeout(() => {
          addNavBadge()
        }, 100)
      }
    })

    if (navBarRef.current) {
      observer.observe(navBarRef.current, {
        childList: true,
        subtree: true,
        characterData: true
      })
    }

    // Also try immediately and after delays
    timeoutIds.push(setTimeout(addNavBadge, 100))
    timeoutIds.push(setTimeout(addNavBadge, 500))
    timeoutIds.push(setTimeout(addNavBadge, 1000))

    return () => {
      observer.disconnect()
      timeoutIds.forEach(id => clearTimeout(id))
      if (observerTimeout) clearTimeout(observerTimeout)
    }
  }, [allApprovalsCount])

  // Create a router object that AppNavBar expects
  const router = {
    replace: (url: string) => {
      const path = url.includes('/') ? url.split('/').pop() || url : url
      setActiveTab(path)
    },
    push: (url: string) => {
      const path = url.includes('/') ? url.split('/').pop() || url : url
      setActiveTab(path)
    },
  }

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: '#F9F7F6' }}>
      <div ref={navBarRef} style={{ marginBottom: '-24px', position: 'relative' }}>
        <AppNavBar
          title="Approvals"
          links={navLinks}
          activeUrl={activeTab}
          router={router}
        />
        <div style={{ position: 'absolute', right: '24px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}>
          <Tabs
            activeIndex={viewModeIndex}
            onChange={(index) => {
              setViewModeIndex(index)
              // Change page based on view mode
              if (index === 0) {
                router.push('long')
              } else if (index === 1) {
                router.push('medium')
              } else if (index === 2) {
                router.push('short')
              }
            }}
          >
            <Tab title="Long" />
            <Tab title="Medium" />
            <Tab title="Short" />
          </Tabs>
        </div>
      </div>
      <main className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: '#F9F7F6' }}>
        <div className="px-14" style={{ backgroundColor: '#F9F7F6', paddingTop: '24px', paddingBottom: '32px' }}>
          {(activeTab === "needs-review" || activeTab === "reviewed" || activeTab === "my-requests" || activeTab === "all-requests" || activeTab === "policies" || activeTab === "long" || activeTab === "medium" || activeTab === "short") && (
            <div className="flex h-[calc(100vh-240px)]" style={{ gap: '24px' }}>
              <CategoryFilter 
                onCategoryChange={setActiveCategory} 
                categoryCounts={categoryCounts}
                allApprovalsCount={allApprovalsCount}
              />
              <RequestsTable categoryName={activeCategory} viewMode={activeTab === "long" ? "long" : activeTab === "medium" ? "medium" : "short"} />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
