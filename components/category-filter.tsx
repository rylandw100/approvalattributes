"use client"

import { useState, useEffect, useRef } from "react"
import { createRoot } from "react-dom/client"
import React from "react"
import Tabs from "@rippling/pebble/Tabs"
import Tab from "@rippling/pebble/Tabs/Tab"
import Badge from "@rippling/pebble/Atoms/Badge"
import PebbleThemeProvider from "@/components/pebble-theme-provider"

// All categories from the data, sorted alphabetically
const categories = [
  "Apps",
  "Banking",
  "Contractor hub",
  "Custom objects",
  "Devices",
  "Global payroll",
  "Headcount",
  "HRIS",
  "IT automations",
  "Payroll",
  "Permissions",
  "Procurement",
  "RPass",
  "Recruiting",
  "Scheduling",
  "Spend",
  "Time and attendance",
  "Time off",
  "Travel",
  "Variable Comp",
].sort()

interface CategoryFilterProps {
  onCategoryChange?: (category: string) => void
}

export function CategoryFilter({ onCategoryChange, categoryCounts = {}, allApprovalsCount = 0 }: CategoryFilterProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0) // 0 = "All approvals", then categories
  const tabsRef = useRef<HTMLDivElement>(null)

  // Set default to "All approvals" on mount
  useEffect(() => {
    if (onCategoryChange) {
      onCategoryChange("All approvals")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Add badges to tabs after they render
  useEffect(() => {
    if (!tabsRef.current) return

    let isAddingBadges = false
    let timeoutIds: NodeJS.Timeout[] = []
    let isInternalChange = false

    const addBadges = () => {
      if (!tabsRef.current || isAddingBadges) return
      isAddingBadges = true

      try {
        // Only remove badges if they don't have the correct count
        const existingBadges = tabsRef.current.querySelectorAll('.tab-badge')
        let needsUpdate = false
        
        // Check if badges need updating
        if (existingBadges.length === 0) {
          needsUpdate = true
        } else {
          // Check if "All approvals" badge exists and has correct count
          const allApprovalsBadge = Array.from(existingBadges).find(badge => {
            const parent = badge.closest('button, [role="tab"]')
            if (parent) {
              const text = parent.textContent?.trim() || ''
              return text.includes('All approvals')
            }
            return false
          })
          if (!allApprovalsBadge || allApprovalsBadge.textContent?.trim() !== allApprovalsCount.toString()) {
            needsUpdate = true
          }
        }

        if (needsUpdate) {
          // Remove existing badges only if we need to update
          isInternalChange = true
          existingBadges.forEach(badge => badge.remove())
        } else {
          // Badges already exist and are correct, no need to update
          isAddingBadges = false
          return
        }

        // Try multiple selectors to find tabs - Pebble might use different structures
        let allTabs: HTMLElement[] = []
        
        // Try various selectors
        const selectors = [
          'button[role="tab"]',
          '[role="tab"]',
          'button',
          '[class*="Tab"]',
          'div[class*="Tab"]',
          'a[class*="Tab"]'
        ]
        
        for (const selector of selectors) {
          const found = Array.from(tabsRef.current.querySelectorAll(selector)) as HTMLElement[]
          if (found.length >= categories.length + 1) { // +1 for "All approvals"
            allTabs = found
            break
          }
        }
        
        // If still no tabs found, try getting all interactive elements
        if (allTabs.length === 0) {
          allTabs = Array.from(tabsRef.current.querySelectorAll('button, a, [role="button"], [tabindex]')) as HTMLElement[]
        }

        if (allTabs.length === 0) {
          isAddingBadges = false
          return
        }

        // Add badge to "All approvals" tab - find by text content first, then fall back to index
        let allApprovalsTab = allTabs.find(tab => {
          const text = tab.textContent?.trim() || ''
          return text.includes('All approvals') && !text.match(/\d+$/)
        }) || allTabs[0]
        
        if (allApprovalsTab && allApprovalsCount > 0) {
          if (!allApprovalsTab.querySelector('.tab-badge')) {
            try {
                  const badgeContainer = document.createElement('span')
                  badgeContainer.className = 'tab-badge'
                  badgeContainer.style.cssText = 'display: inline-flex; align-items: center; margin-left: 8px;'
                  allApprovalsTab.appendChild(badgeContainer)
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
              badgeContainer.className = 'tab-badge'
              badgeContainer.textContent = allApprovalsCount.toString()
              badgeContainer.style.cssText = 'display: inline-flex; align-items: center; justify-content: center; margin-left: 8px; height: 20px; min-width: 20px; padding: 0 6px; font-size: 12px; font-weight: 600; border-radius: 9999px; background-color: #E5E7EB; color: #374151; line-height: 1;'
              allApprovalsTab.appendChild(badgeContainer)
            }
          }
        }

        // Add badges to category tabs - find by text content
        categories.forEach((category) => {
          const count = categoryCounts[category] || 0
          if (count > 0) {
            // Find tab by matching the category name in text content
            const categoryTab = allTabs.find(tab => {
              const text = tab.textContent?.trim() || ''
              // Remove any existing badge number to get clean text
              const cleanText = text.replace(/\s*\d+\s*$/, '').trim()
              // Match exact category name
              return cleanText === category || text.startsWith(category)
            })
            
            if (categoryTab && !categoryTab.querySelector('.tab-badge')) {
              try {
                const badgeContainer = document.createElement('span')
                badgeContainer.className = 'tab-badge'
                badgeContainer.style.cssText = 'display: inline-flex; align-items: center; margin-left: 8px;'
                categoryTab.appendChild(badgeContainer)
                const root = createRoot(badgeContainer)
                root.render(
                  React.createElement(PebbleThemeProvider, null,
                    React.createElement(Badge, { 
                      text: count.toString(),
                      appearance: "PRIMARY_DARK"
                    })
                  )
                )
              } catch (error) {
                // Fallback to styled badge that matches Pebble's appearance
                const badgeContainer = document.createElement('span')
                badgeContainer.className = 'tab-badge'
                badgeContainer.textContent = count.toString()
                badgeContainer.style.cssText = 'display: inline-flex; align-items: center; justify-content: center; margin-left: 8px; height: 20px; min-width: 20px; padding: 0 6px; font-size: 12px; font-weight: 600; border-radius: 9999px; background-color: #E5E7EB; color: #374151; line-height: 1;'
                categoryTab.appendChild(badgeContainer)
              }
            }
          }
        })
      } finally {
        isAddingBadges = false
        // Reset flag after a short delay to allow DOM to settle
        setTimeout(() => {
          isInternalChange = false
        }, 200)
      }
    }

    // Use MutationObserver to watch for tab rendering, but ignore our own badge additions
    let observerTimeout: NodeJS.Timeout | null = null
    
    const observer = new MutationObserver((mutations) => {
      // Ignore mutations we caused ourselves
      if (isInternalChange) return
      
      // Only react to mutations that add/remove tab elements, not badge elements
      const relevantMutations = mutations.filter(mutation => {
        const target = mutation.target as HTMLElement
        // Ignore changes to badge containers or their children
        if (target.classList?.contains('tab-badge') || 
            target.closest('.tab-badge') ||
            Array.from(mutation.addedNodes).some((node: any) => 
              node.classList?.contains('tab-badge') || node.closest?.('.tab-badge')
            )) {
          return false
        }
        return true
      })
      
      if (relevantMutations.length > 0) {
        if (observerTimeout) clearTimeout(observerTimeout)
        observerTimeout = setTimeout(() => {
          addBadges()
        }, 100)
      }
    })

    if (tabsRef.current) {
      observer.observe(tabsRef.current, {
        childList: true,
        subtree: true,
        characterData: true
      })
    }

    // Try immediately and after delays
    timeoutIds.push(setTimeout(addBadges, 100))
    timeoutIds.push(setTimeout(addBadges, 500))
    timeoutIds.push(setTimeout(addBadges, 1000))

    return () => {
      observer.disconnect()
      timeoutIds.forEach(id => clearTimeout(id))
      if (observerTimeout) clearTimeout(observerTimeout)
    }
  }, [categoryCounts, allApprovalsCount])

  const handleChange = (index: number) => {
    setActiveIndex(index)
    
    if (index === 0) {
      onCategoryChange?.("All approvals")
    } else {
      onCategoryChange?.(categories[index - 1])
    }
  }

  return (
    <div ref={tabsRef} className="w-[220px] flex flex-col shrink-0" style={{ backgroundColor: '#F9F7F6' }}>
      <Tabs
        isVertical={true}
        activeIndex={activeIndex}
        onChange={handleChange}
      >
        <Tab title="All approvals" />
        {categories.map((category) => (
          <Tab key={category} title={category} />
        ))}
      </Tabs>
    </div>
  )
}

