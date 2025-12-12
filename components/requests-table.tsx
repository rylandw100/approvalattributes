"use client"

import { useState, useEffect, useRef } from "react"
import * as React from "react"
import { createPortal } from "react-dom"
import { Search, ChevronRight, Check, X, Info, Clock } from "lucide-react"
import { CommentIcon } from "@/components/comment-icon"
import { 
  TimeOffIcon, 
  CreditCardIcon, 
  UserSearchIcon, 
  CalendarIcon, 
  DatabaseIcon, 
  UserPlusIcon, 
  UserMinusIcon 
} from "@/components/icons"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

const allRequests = [
  // Time and attendance
  {
    category: "Time and attendance",
    date: "Dec 10, 2025",
    name: "Will Cohen",
    role: "Medical Assistant",
    description: "13.75 hrs time entry on Dec 10",
    hasComment: false,
    tooltip: {
      title: "13.75 hrs time entry on Dec 10",
      iconType: "clock",
      details: [
        { label: "Duration", value: "13.75 hours" },
        { label: "Time", value: "Dec 10, 2025, 09:35 AM - 11:20 PM PST" },
        { label: "Unpaid breaks", value: "0 minutes" },
      ],
    },
  },
  {
    category: "Time and attendance",
    date: "Dec 09, 2025",
    name: "Sarah Martinez",
    role: "Nurse",
    description: "8.5 hrs time entry on Dec 09",
    hasComment: true,
    comment: {
      author: "John Smith",
      date: "Dec 09, 2025 at 4:30 PM PST",
      text: "Please verify the break time",
      totalComments: 1,
    },
    tooltip: {
      title: "8.5 hrs time entry on Dec 09",
      iconType: "clock",
      details: [
        { label: "Duration", value: "8.5 hours" },
        { label: "Time", value: "Dec 09, 2025, 08:00 AM - 05:00 PM PST" },
        { label: "Unpaid breaks", value: "30 minutes" },
      ],
    },
  },
  {
    category: "Time and attendance",
    date: "Dec 08, 2025",
    name: "James Wilson",
    role: "Medical Assistant",
    description: "10.25 hrs time entry on Dec 08",
    hasComment: false,
    tooltip: {
      title: "10.25 hrs time entry on Dec 08",
      iconType: "clock",
      details: [
        { label: "Duration", value: "10.25 hours" },
        { label: "Time", value: "Dec 08, 2025, 07:30 AM - 06:45 PM PST" },
        { label: "Unpaid breaks", value: "15 minutes" },
      ],
    },
  },
  // Time off
  {
    category: "Time off",
    date: "Dec 08, 2025",
    name: "Annette Bear",
    role: "Web Designer",
    description: "2 vacation days from Dec 10 - 11",
    hasComment: true,
    comment: {
      author: "Ronny A. Peña",
      date: "Dec 11, 2025 at 10:51 AM PST",
      text: "testing digest 2",
      totalComments: 6,
    },
    tooltip: {
      title: "2 vacation days from Dec 10 - 11",
      iconType: "timeOff",
      details: [
        { label: "Person", value: "Annette Bear" },
        { label: "Duration", value: "2 days" },
        { label: "Dates", value: "Dec 10 - 11, 2025" },
        { label: "Reason", value: "Vacation" },
        { label: "Leave Policy", value: "Standard PTO" },
        { label: "Balance", value: "8 days remaining" },
      ],
    },
  },
  {
    category: "Time off",
    date: "Dec 07, 2025",
    name: "Michael Chen",
    role: "Software Engineer",
    description: "1 sick day on Dec 12",
    hasComment: true,
    comment: {
      author: "Maria Garcia",
      date: "Dec 07, 2025 at 11:20 AM PST",
      text: "Approved, feel better soon!",
      totalComments: 1,
    },
    tooltip: {
      title: "1 sick day on Dec 12",
      iconType: "timeOff",
      details: [
        { label: "Person", value: "Michael Chen" },
        { label: "Duration", value: "1 day" },
        { label: "Dates", value: "Dec 12, 2025" },
        { label: "Reason", value: "Sick leave" },
        { label: "Leave Policy", value: "Sick Leave Policy" },
        { label: "Balance", value: "12 days remaining" },
      ],
    },
  },
  {
    category: "Time off",
    date: "Dec 05, 2025",
    name: "Emily Rodriguez",
    role: "Product Manager",
    description: "3 personal days from Dec 20 - 22",
    hasComment: false,
    tooltip: {
      title: "3 personal days from Dec 20 - 22",
      iconType: "timeOff",
      details: [
        { label: "Person", value: "Emily Rodriguez" },
        { label: "Duration", value: "3 days" },
        { label: "Dates", value: "Dec 20 - 22, 2025" },
        { label: "Reason", value: "Personal time" },
        { label: "Leave Policy", value: "Personal Leave" },
        { label: "Balance", value: "5 days remaining" },
      ],
    },
  },
  // Reimbursements
  {
    category: "Reimbursements",
    date: "Dec 05, 2025",
    name: "Robert Fox",
    role: "Medical Assistant",
    description: "Reimburse $14.84 (Uber)",
    hasComment: false,
    tooltip: {
      title: "Reimburse $14.84 Uber",
      iconType: "creditCard",
      receiptImage: "/receipts/uber-receipt.png",
      details: [
        { label: "Amount", value: "$14.84" },
        { label: "Vendor", value: "Uber" },
        { label: "Purchaser", value: "Robert Fox" },
        { label: "Purchase date", value: "Dec 05, 2025" },
        { label: "Category", value: "Transportation" },
        { label: "Reason", value: "Client meeting travel" },
      ],
    },
  },
  {
    category: "Reimbursements",
    date: "Dec 04, 2025",
    name: "Lisa Anderson",
    role: "Sales Manager",
    description: "Reimburse $30.00 (Alaska Airlines)",
    hasComment: true,
    comment: {
      author: "Tom Wilson",
      date: "Dec 04, 2025 at 3:45 PM PST",
      text: "Receipt looks good",
      totalComments: 1,
    },
    tooltip: {
      title: "Reimburse $30.00 Alaska Airlines",
      iconType: "creditCard",
      receiptImage: "/receipts/hotel-receipt.png",
      details: [
        { label: "Amount", value: "$30.00" },
        { label: "Vendor", value: "Alaska Airlines" },
        { label: "Purchaser", value: "Lisa Anderson" },
        { label: "Purchase date", value: "Dec 04, 2025" },
        { label: "Category", value: "Travel - Airline" },
        { label: "Reason", value: "Business travel" },
      ],
    },
  },
  {
    category: "Reimbursements",
    date: "Dec 03, 2025",
    name: "David Kim",
    role: "Marketing Director",
    description: "Reimburse $41.98 (Lyft)",
    hasComment: false,
    tooltip: {
      title: "Reimburse $41.98 Lyft",
      iconType: "creditCard",
      receiptImage: "/receipts/restaurant-receipt.png",
      details: [
        { label: "Amount", value: "$41.98" },
        { label: "Vendor", value: "Lyft" },
        { label: "Purchaser", value: "David Kim" },
        { label: "Purchase date", value: "Dec 03, 2025" },
        { label: "Category", value: "Transportation" },
        { label: "Reason", value: "Client meeting travel" },
      ],
    },
  },
  // HR Management
  {
    category: "HR management",
    date: "Dec 01, 2025",
    name: "Phil Hughes",
    role: "Medical Assistant",
    description: "Change Michael Johnson's manager to Dawn Franklin",
    hasComment: false,
    tooltip: {
      title: "Change Michael Johnson's manager to Dawn Franklin",
      iconType: "userSearch",
      details: [
        { label: "Person", value: "Michael Johnson" },
        { label: "Manager", value: "Neill Black → Dawn Franklin" },
        { label: "Change effect date", value: "Dec 01, 2025" },
        { label: "Reason", value: "Department reorganization" },
      ],
    },
  },
  {
    category: "HR management",
    date: "Nov 14, 2025",
    name: "Robert Fox",
    role: "Medical Assistant",
    description: "Hire Maxine Turo (Product Designer)",
    hasComment: true,
    comment: {
      author: "Michael Chen",
      date: "Nov 14, 2025 at 9:30 AM PST",
      text: "Looks good to me",
      totalComments: 1,
    },
    tooltip: {
      title: "Hire Maxine Turo (Product Designer)",
      iconType: "userPlus",
      details: [
        { label: "Person", value: "Maxine Turo" },
        { label: "Title", value: "Product Designer" },
        { label: "Level", value: "Senior" },
        { label: "Department", value: "Product" },
        { label: "Compensation", value: "$120,000/year" },
        { label: "Start date", value: "Dec 15, 2025" },
      ],
    },
  },
  {
    category: "HR management",
    date: "Nov 12, 2025",
    name: "Christie Thomas",
    role: "Medical Assistant",
    description: "Terminate Chris Williams (Product Designer)",
    hasComment: false,
    tooltip: {
      title: "Terminate Chris Williams (Product Designer)",
      iconType: "userMinus",
      details: [
        { label: "Person", value: "Chris Williams" },
        { label: "Title", value: "Product Designer" },
        { label: "End date", value: "Nov 30, 2025" },
        { label: "Termination type", value: "Voluntary" },
        { label: "Reason", value: "Resignation" },
        { label: "Additional comments", value: "Two weeks notice provided" },
      ],
    },
  },
  {
    category: "HR management",
    date: "Nov 28, 2025",
    name: "Jennifer Lee",
    role: "HR Manager",
    description: "Change Sarah Martinez's title to Senior Nurse",
    hasComment: true,
    comment: {
      author: "David Park",
      date: "Nov 28, 2025 at 10:15 AM PST",
      text: "Promotion approved by department head",
      totalComments: 2,
    },
    tooltip: {
      title: "Change Sarah Martinez's title to Senior Nurse",
      iconType: "userSearch",
      details: [
        { label: "Person", value: "Sarah Martinez" },
        { label: "Title", value: "Nurse → Senior Nurse" },
        { label: "Change effect date", value: "Dec 01, 2025" },
        { label: "Reason", value: "Promotion" },
      ],
    },
  },
  {
    category: "HR management",
    date: "Nov 25, 2025",
    name: "Mark Thompson",
    role: "HR Director",
    description: "Hire Jessica Park (Senior Engineer)",
    hasComment: false,
    tooltip: {
      title: "Hire Jessica Park (Senior Engineer)",
      iconType: "userPlus",
      details: [
        { label: "Person", value: "Jessica Park" },
        { label: "Title", value: "Senior Engineer" },
        { label: "Level", value: "Senior" },
        { label: "Department", value: "Engineering" },
        { label: "Compensation", value: "$150,000/year" },
        { label: "Start date", value: "Jan 02, 2026" },
      ],
    },
  },
  // Scheduling
  {
    category: "Scheduling",
    date: "Dec 01, 2025",
    name: "Kelsey Matthews",
    role: "Medical Assistant",
    description: "Update East Bay Schedule on Dec 10",
    hasComment: false,
    tooltip: {
      title: "Update East Bay Schedule on Dec 10",
      iconType: "calendar",
      details: [
        { label: "Person", value: "Kelsey Matthews" },
        { label: "Schedule", value: "East Bay Schedule" },
        { label: "Current shift", value: "Dec 10, 09:00 AM - 06:00 PM PST" },
        { label: "Proposed shift", value: "Dec 10, 08:15 AM - 05:00 PM PST" },
      ],
    },
  },
  {
    category: "Scheduling",
    date: "Nov 30, 2025",
    name: "Tom Bradley",
    role: "Nurse",
    description: "Update Morning Schedule on Dec 15",
    hasComment: true,
    comment: {
      author: "Patricia Brown",
      date: "Nov 30, 2025 at 2:00 PM PST",
      text: "Shift change confirmed",
      totalComments: 1,
    },
    tooltip: {
      title: "Update Morning Schedule on Dec 15",
      iconType: "calendar",
      details: [
        { label: "Person", value: "Tom Bradley" },
        { label: "Schedule", value: "Morning Schedule" },
        { label: "Current shift", value: "Dec 15, 07:00 AM - 03:00 PM PST" },
        { label: "Proposed shift", value: "Dec 15, 06:00 AM - 02:00 PM PST" },
      ],
    },
  },
  {
    category: "Scheduling",
    date: "Nov 28, 2025",
    name: "Rachel Green",
    role: "Medical Assistant",
    description: "Update Evening Schedule on Dec 12",
    hasComment: false,
    tooltip: {
      title: "Update Evening Schedule on Dec 12",
      iconType: "calendar",
      details: [
        { label: "Person", value: "Rachel Green" },
        { label: "Schedule", value: "Evening Schedule" },
        { label: "Current shift", value: "Dec 12, 12:00 PM - 08:00 PM PST" },
        { label: "Proposed shift", value: "Dec 12, 02:00 PM - 10:00 PM PST" },
      ],
    },
  },
  // Custom objects
  {
    category: "Custom objects",
    date: "Nov 29, 2025",
    name: "Anne Wilson",
    role: "Medical Assistant",
    description: 'Create "test_record" in "object_name"',
    hasComment: true,
    comment: {
      author: "Sarah Johnson",
      date: "Nov 29, 2025 at 2:15 PM PST",
      text: "Please review this record creation",
      totalComments: 1,
    },
    tooltip: {
      title: 'Create "test_record" in "object_name"',
      iconType: "database",
      details: [
        { label: "Name", value: "John Smith" },
        { label: "Date", value: "Nov 29, 2025" },
        { label: "Location", value: "San Francisco, CA" },
        { label: "Title", value: "Senior Developer" },
        { label: "Department", value: "Engineering" },
      ],
    },
  },
  {
    category: "Custom objects",
    date: "Nov 27, 2025",
    name: "Kevin Brown",
    role: "Data Analyst",
    description: 'Create "project_alpha" in "projects"',
    hasComment: false,
    tooltip: {
      title: 'Create "project_alpha" in "projects"',
      iconType: "database",
      details: [
        { label: "Name", value: "Project Alpha" },
        { label: "Date", value: "Nov 27, 2025" },
        { label: "Location", value: "New York, NY" },
        { label: "Title", value: "Project Manager" },
        { label: "Department", value: "Operations" },
        { label: "Budget", value: "$500,000" },
        { label: "Start Date", value: "Dec 01, 2025" },
        { label: "End Date", value: "Jun 30, 2026" },
        { label: "Status", value: "Active" },
        { label: "Priority", value: "High" },
        { label: "Team Size", value: "12 members" },
        { label: "Client", value: "Acme Corporation" },
        { label: "Manager", value: "Kevin Brown" },
        { label: "Category", value: "Software Development" },
        { label: "Region", value: "North America" },
        { label: "Technology Stack", value: "React, Node.js, PostgreSQL" },
      ],
      showMoreLink: true,
    },
  },
  {
    category: "Custom objects",
    date: "Nov 25, 2025",
    name: "Amanda White",
    role: "Business Analyst",
    description: 'Create "client_xyz" in "clients"',
    hasComment: false,
    tooltip: {
      title: 'Create "client_xyz" in "clients"',
      iconType: "database",
      details: [
        { label: "Name", value: "XYZ Corporation" },
        { label: "Date", value: "Nov 25, 2025" },
        { label: "Location", value: "Chicago, IL" },
        { label: "Title", value: "Account Executive" },
        { label: "Department", value: "Sales" },
      ],
    },
  },
]

interface RequestsTableProps {
  categoryName?: string
}

export function RequestsTable({ categoryName = "Time and attendance" }: RequestsTableProps) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null)
  const [showTooltip, setShowTooltip] = useState<number | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null)
  const timeoutRefs = React.useRef<{ [key: number]: NodeJS.Timeout }>({})

  // Filter requests by category
  const requests = allRequests.filter(request => request.category === categoryName)

  const getTooltipIcon = (iconType?: string) => {
    switch (iconType) {
      case "timeOff":
        return <TimeOffIcon className="h-4 w-4 text-gray-600" />
      case "creditCard":
        return <CreditCardIcon className="h-4 w-4 text-gray-600" />
      case "userSearch":
        return <UserSearchIcon className="h-4 w-4 text-gray-600" />
      case "calendar":
        return <CalendarIcon className="h-4 w-4 text-gray-600" />
      case "database":
        return <DatabaseIcon className="h-4 w-4 text-gray-600" />
      case "userPlus":
        return <UserPlusIcon className="h-4 w-4 text-gray-600" />
      case "userMinus":
        return <UserMinusIcon className="h-4 w-4 text-gray-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden" style={{ backgroundColor: 'white' }}>
      {/* Table Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center mb-4">
          <h3 className="text-base font-semibold text-gray-900">
            {categoryName} requests to review
          </h3>
        </div>
        
        <div className="flex items-center">
          <div className="relative" style={{ width: '224px' }}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search"
              className="pl-9 h-8"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <TooltipProvider>
          <Table>
            <TableHeader>
              <TableRow className="h-10">
                <TableHead className="w-12 h-10 bg-[#FAFAFA]">
                  <Checkbox />
                </TableHead>
              <TableHead className="w-[145px] h-10 bg-[#FAFAFA]" style={{ fontSize: '14px', lineHeight: '16px' }}>
                Requested on
              </TableHead>
              <TableHead className="w-[180px] h-10 bg-[#FAFAFA]" style={{ fontSize: '14px', lineHeight: '16px' }}>
                Requested by
              </TableHead>
              <TableHead className="h-10 bg-[#FAFAFA]" style={{ fontSize: '14px', lineHeight: '16px' }}>
                Description
              </TableHead>
              <TableHead className="w-[125px] h-10 bg-[#FAFAFA]" style={{ fontSize: '14px', lineHeight: '16px' }}>Attributes</TableHead>
              <TableHead className="w-[144px] h-10 bg-[#FAFAFA]" style={{ fontSize: '14px', lineHeight: '16px' }}></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="[&_tr:last-child]:!border-b">
              {requests.map((request, index) => (
                <TableRow
                  key={index}
                  className="relative group"
                  style={{ height: '48px' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#E5E5E5'
                    setHoveredRow(index)
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = ''
                    setHoveredRow(null)
                  }}
                >
                  <TableCell className="w-12 py-2">
                    <Checkbox />
                  </TableCell>
                  <TableCell className="w-[145px] text-gray-700 py-2">
                    <div className="truncate" style={{ fontSize: '14px', lineHeight: '16px' }}>{request.date}</div>
                  </TableCell>
                  <TableCell className="w-[180px] py-2">
                    <div className="flex items-center min-w-0" style={{ gap: '4px' }}>
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage src={`/avatar-${index}.jpg`} />
                        <AvatarFallback className="text-xs bg-gray-200">
                          {request.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1" style={{ marginLeft: '4px' }}>
                        <div className="font-medium text-gray-900 truncate" style={{ fontSize: '13px', lineHeight: '16px' }}>
                          {request.name}
                        </div>
                        <div className="text-gray-500 truncate" style={{ fontSize: '11px', lineHeight: '13px' }}>
                          {request.role}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell 
                    className="min-w-0 py-2"
                    onMouseEnter={(e) => {
                      // Capture initial mouse position
                      setTooltipPosition({ x: e.clientX, y: e.clientY })
                      // Clear any existing timeout for this row
                      if (timeoutRefs.current[index]) {
                        clearTimeout(timeoutRefs.current[index])
                      }
                      // Show tooltip after 1 second delay
                      timeoutRefs.current[index] = setTimeout(() => {
                        setShowTooltip(index)
                      }, 1000)
                    }}
                    onMouseLeave={(e) => {
                      setShowTooltip(null)
                      setTooltipPosition(null)
                      // Clear timeout when leaving
                      if (timeoutRefs.current[index]) {
                        clearTimeout(timeoutRefs.current[index])
                        delete timeoutRefs.current[index]
                      }
                    }}
                  >
                    <div className="w-full">
                      <span className="text-gray-900 min-w-0 truncate" style={{ fontSize: '14px', lineHeight: '16px' }}>
                        {request.description}
                      </span>
                    </div>
                    {showTooltip === index && tooltipPosition && createPortal(
                      <div
                        className={cn(
                          "fixed z-50 p-0 bg-[#EDEBE7] border border-gray-200 shadow-lg rounded-xl pointer-events-none",
                          request.tooltip.receiptImage ? "w-auto" : "w-80"
                        )}
                        style={{
                          left: `${tooltipPosition.x + 12}px`,
                          top: `${tooltipPosition.y}px`,
                          transform: tooltipPosition.x > window.innerWidth / 2 ? 'translateX(-100%)' : 'none',
                          minHeight: request.tooltip.receiptImage ? '550px' : undefined,
                        }}
                      >
                          <div className={cn("flex", request.tooltip.receiptImage ? "gap-4" : "")} style={request.tooltip.receiptImage ? { minHeight: '550px' } : undefined}>
                            {request.tooltip.receiptImage && (
                              <div className="bg-white flex items-stretch shrink-0" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                                <div 
                                  className="relative shrink-0 cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center pointer-events-auto" 
                                  style={{ height: '550px', width: '280px', minWidth: '280px' }}
                                  onClick={() => setFullScreenImage(request.tooltip.receiptImage!)}
                                >
                                  <img 
                                    src={request.tooltip.receiptImage} 
                                    alt="Receipt" 
                                    className="pointer-events-auto"
                                    style={{ 
                                      width: '100%', 
                                      height: '100%', 
                                      objectFit: 'contain',
                                      objectPosition: 'center',
                                      maxWidth: '100%',
                                      maxHeight: '100%'
                                    }}
                                    onError={(e) => {
                                      console.error('Failed to load receipt image:', request.tooltip.receiptImage);
                                      console.error('Expected path:', request.tooltip.receiptImage);
                                      e.currentTarget.style.display = 'none';
                                    }}
                                    onLoad={() => {
                                      console.log('Successfully loaded receipt image:', request.tooltip.receiptImage);
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                            <div className={cn(
                              "flex flex-col gap-[10px] p-3",
                              request.tooltip.receiptImage ? "w-[215px]" : "w-full"
                            )} style={request.tooltip.receiptImage ? { alignSelf: 'stretch' } : {}}>
                              <div className="flex flex-col">
                                <div className="flex items-center gap-2" style={{ marginBottom: request.tooltip.receiptImage ? '0' : '10px' }}>
                                  <Avatar 
                                    className="h-8 w-8 shrink-0 bg-white rounded-full" 
                                  >
                                    <AvatarImage src={`/avatar-${index}.jpg`} className="rounded-full" />
                                    <AvatarFallback 
                                      className="text-xs bg-white flex items-center justify-center rounded-full" 
                                    >
                                      {getTooltipIcon(request.tooltip.iconType)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <span className="font-medium text-gray-900 break-words" style={{ fontSize: '14px', lineHeight: '20px' }}>
                                      {request.tooltip.title}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div style={{ borderTop: '1px solid #D5D3D0', paddingTop: '10px', paddingBottom: '0' }}>
                                {(request.tooltip.showMoreLink ? request.tooltip.details.slice(0, 8) : request.tooltip.details).map((detail, idx) => (
                                  <div key={idx} style={{ marginBottom: idx < (request.tooltip.showMoreLink ? Math.min(8, request.tooltip.details.length) : request.tooltip.details.length) - 1 ? '10px' : '0' }}>
                                    <div className="text-xs text-gray-500">
                                      {detail.label}
                                    </div>
                                    <div className="text-xs text-gray-900 font-medium">
                                      {detail.value}
                                    </div>
                                  </div>
                                ))}
                                {request.tooltip.showMoreLink && request.tooltip.details.length > 8 && (
                                  <a 
                                    href="#" 
                                    className="text-xs underline font-medium"
                                    style={{ color: '#1E4AA9', marginTop: '10px', display: 'block' }}
                                    onClick={(e) => e.preventDefault()}
                                  >
                                    See more
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                      </div>,
                      document.body
                    )}
                  </TableCell>
                  <TableCell className="w-[125px] py-2">
                    {request.hasComment && request.comment ? (
                      <Tooltip delayDuration={200}>
                        <TooltipTrigger asChild>
                          <div className="cursor-pointer">
                            <CommentIcon className="h-5 w-5" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent 
                          side="right" 
                          className="w-80 p-0 bg-[#EDEBE7] border border-gray-200 shadow-lg rounded-xl"
                          sideOffset={8}
                        >
                          <div className="p-3">
                            <div style={{ marginBottom: '10px' }}>
                              <div className="text-xs text-gray-900 font-medium">
                                {request.comment.author}
                              </div>
                              <div className="text-xs text-gray-500">
                                {request.comment.date}
                              </div>
                            </div>
                            <div 
                              className="text-xs text-gray-900 font-medium"
                              style={{ marginBottom: request.comment.totalComments > 1 ? '10px' : '0' }}
                            >
                              {request.comment.text}
                            </div>
                            {request.comment.totalComments > 1 && (
                              <a 
                                href="#" 
                                className="text-xs underline font-medium hover:underline"
                                style={{ color: '#1E4AA9' }}
                                onClick={(e) => e.preventDefault()}
                              >
                                View {request.comment.totalComments} comments
                              </a>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <span className="text-gray-400" style={{ fontSize: '14px', lineHeight: '16px' }}>--</span>
                    )}
                  </TableCell>
                  <TableCell className="w-[144px] py-2">
                    <div className="flex items-center justify-end gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-green-600 hover:text-green-700 hover:bg-green-50"
                        title="Approve"
                      >
                        <Check className="h-6 w-6" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Reject"
                      >
                        <X className="h-6 w-6" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TooltipProvider>
      </div>
      
      {/* Full Screen Image Modal */}
      {fullScreenImage && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setFullScreenImage(null)}
        >
          <div className="relative max-w-full max-h-full">
            <button
              onClick={() => setFullScreenImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full p-2"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
            <img 
              src={fullScreenImage} 
              alt="Receipt full screen" 
              className="max-w-full max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  )
}
