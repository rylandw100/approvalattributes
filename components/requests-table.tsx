"use client"

import { useState, useEffect, useRef } from "react"
import * as React from "react"
import { createPortal } from "react-dom"
import { Search, ChevronRight, Check, X, Info, Clock, AlertTriangle, ChevronUp, ChevronDown } from "lucide-react"
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
import TableBasic from "@rippling/pebble/TableBasic"
import { cn } from "@/lib/utils"

export const allRequests = [
  // Time and attendance
  {
    category: "Time and attendance",
    actionType: "TIME_ENTRY",
    date: "Dec 10, 2025",
    name: "Will Cohen",
    role: "Medical Assistant",
    description: "Approve logged time: 13.75 hours on Dec 10",
    hasComment: false,
    tooltip: {
      title: "13.75 hrs time entry on Dec 10",
      iconType: "clock",
      details: [
        { label: "Person", value: "Will Cohen" },
        { label: "Start time", value: "Dec 10, 2025, 09:35 AM PST" },
        { label: "End time", value: "Dec 10, 2025, 11:20 PM PST" },
        { label: "Duration", value: "13.75 hours" },
      ],
    },
  },
  // Time off
  {
    category: "Time off",
    actionType: "LEAVE_REQUEST_APPROVAL",
    date: "Dec 08, 2025",
    name: "Annette Bear",
    role: "Web Designer",
    description: "Approve 2.00 vacation days (Dec 10–11)",
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
        { label: "Start date", value: "Dec 10, 2025" },
        { label: "End date", value: "Dec 11, 2025" },
        { label: "Duration", value: "2.00 days" },
      ],
    },
  },
  // Spend
  {
    category: "Spend",
    actionType: "SPEND_REQUEST",
    date: "Dec 05, 2025",
    name: "Robert Fox",
    role: "Medical Assistant",
    description: "Approve reimbursement of $37.95 (Uber)",
    hasComment: false,
    tooltip: {
      title: "Reimburse $14.84 Uber",
      iconType: "creditCard",
      receiptImage: "/receipts/uber-receipt.png",
      details: [
        { label: "Amount", value: "$37.95" },
        { label: "Vendor", value: "Uber" },
        { label: "Purchaser", value: "Robert Fox" },
        { label: "Purchase date", value: "Dec 05, 2025" },
      ],
    },
  },
  // HR Management
  {
    category: "HRIS",
    actionType: "TERMINATE",
    date: "Nov 12, 2025",
    name: "Christie Thomas",
    role: "Medical Assistant",
    description: "Approve termination of Michael Johnson (Product Designer)",
    hasComment: false,
    tooltip: {
      title: "Terminate Chris Williams (Product Designer)",
      iconType: "userMinus",
      details: [
        { label: "Person", value: "Michael Johnson" },
        { label: "Title", value: "Product Designer" },
        { label: "Termination type", value: "Voluntary" },
        { label: "Termination reason", value: "Resignation" },
        { label: "Start date", value: "Nov 12, 2025" },
        { label: "End date", value: "Nov 30, 2025" },
      ],
    },
  },
  {
    category: "HRIS",
    actionType: "TRANSITION",
    date: "Nov 28, 2025",
    name: "Jennifer Lee",
    role: "HR Manager",
    description: "Approve update to Michael Johnson's position → Product Design Lead",
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
        { label: "Person", value: "Michael Johnson" },
        { label: "Change", value: "Position → Product Design Lead" },
        { label: "Reason", value: "Promotion" },
        { label: "Change effect date", value: "Dec 01, 2025" },
      ],
    },
  },
  // Scheduling
  {
    category: "Scheduling",
    actionType: "SCHEDULING_EDIT_SHIFT",
    date: "Nov 30, 2025",
    name: "Tom Bradley",
    role: "Nurse",
    description: "Approve shift update to Dec 15, 06:00 AM - 02:00 PM PST",
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
  // Custom objects
  {
    category: "Custom objects",
    actionType: "CUSTOM_OBJECT_DATA_ROW_CREATE",
    date: "Nov 25, 2025",
    name: "Amanda White",
    role: "Business Analyst",
    description: "Approve creation of record_1 in object_1",
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
  // Apps - APPS_REQUEST
  {
    category: "Apps",
    actionType: "APPS_REQUEST",
    date: "Dec 11, 2025",
    name: "Jennifer Martinez",
    role: "IT Administrator",
    description: "Approve access update for Michael Johnson (3 apps)",
    hasComment: false,
    tooltip: {
      title: "Update Michael Johnson's access to 3 apps",
      iconType: "database",
      details: [
        { label: "Person", value: "Michael Johnson" },
        { label: "Apps", value: "Salesforce, Slack, GitHub" },
        { label: "Reason", value: "New role requires additional access" },
        { label: "Effective date", value: "Dec 15, 2025" },
      ],
    },
  },
  // Apps - APP_INSTALL_REQUEST
  {
    category: "Apps",
    actionType: "APP_INSTALL_REQUEST",
    date: "Dec 10, 2025",
    name: "David Chen",
    role: "IT Manager",
    description: "Approve access grant for Michael Johnson (3 apps)",
    hasComment: true,
    comment: {
      author: "Lisa Anderson",
      date: "Dec 10, 2025 at 2:30 PM PST",
      text: "Please verify app compatibility",
      totalComments: 1,
    },
    tooltip: {
      title: "Grant Sarah Martinez access to 5 apps",
      iconType: "database",
      details: [
        { label: "Person", value: "Sarah Martinez" },
        { label: "Apps", value: "Figma, Notion, Jira, Confluence, Asana" },
        { label: "Reason", value: "Design team onboarding" },
        { label: "Effective date", value: "Dec 12, 2025" },
      ],
    },
  },
  // Banking - BANKING_NEW_PAYMENT_REQUEST
  {
    category: "Banking",
    actionType: "BANKING_NEW_PAYMENT_REQUEST",
    date: "Dec 09, 2025",
    name: "Robert Kim",
    role: "Finance Manager",
    description: "Approve transfer of $100 to Michael Johnson",
    hasComment: false,
    tooltip: {
      title: "Transfer $2,500 to Michael Johnson",
      iconType: "creditCard",
      details: [
        { label: "Amount", value: "$2,500" },
        { label: "Currency", value: "USD" },
        { label: "Transfer type", value: "ACH" },
      ],
    },
  },
  // Contractor hub - CONTRACT_CREATION
  {
    category: "Contractor hub",
    actionType: "CONTRACT_CREATION",
    date: "Dec 08, 2025",
    name: "Patricia Brown",
    role: "HR Manager",
    description: "Approve contract for Michael Johnson (Product Designer)",
    hasComment: false,
    tooltip: {
      title: "Create a contract for Emily Rodriguez (Product Designer)",
      iconType: "userPlus",
      details: [
        { label: "Contractor", value: "Michael Johnson" },
        { label: "Contract type", value: "Contractor" },
        { label: "Department", value: "Design" },
        { label: "Total contract amount", value: "$60,000" },
        { label: "Start date", value: "Jan 01, 2026" },
        { label: "End date", value: "Dec 31, 2026" },
      ],
    },
  },
  // Custom objects - CUSTOM_OBJECT_DATA_ROW_DELETE
  {
    category: "Custom objects",
    actionType: "CUSTOM_OBJECT_DATA_ROW_DELETE",
    date: "Dec 07, 2025",
    name: "Mark Thompson",
    role: "Data Administrator",
    description: "Approve deletion of record_1 in object_1",
    hasComment: true,
    comment: {
      author: "Kevin Brown",
      date: "Dec 07, 2025 at 11:15 AM PST",
      text: "Confirm deletion is approved",
      totalComments: 1,
    },
    tooltip: {
      title: 'Delete "project_beta" in "projects"',
      iconType: "database",
      details: [
        { label: "Record name", value: "project_beta" },
        { label: "Object", value: "projects" },
        { label: "Action", value: "Delete" },
      ],
    },
  },
  // Custom objects - CUSTOM_OBJECT_DATA_ROW_UPDATE
  {
    category: "Custom objects",
    actionType: "CUSTOM_OBJECT_DATA_ROW_UPDATE",
    date: "Dec 05, 2025",
    name: "Tom Bradley",
    role: "Data Analyst",
    description: "Approve update to record _1: name → new_record",
    hasComment: false,
    tooltip: {
      title: 'Update "client_123" name to "Acme Corporation"',
      iconType: "database",
      details: [
        { label: "Record name", value: "client_123" },
        { label: "Field", value: "name" },
        { label: "New value", value: "Acme Corporation" },
      ],
    },
  },
  // Devices - DEVICES_REQUEST
  {
    category: "Devices",
    actionType: "DEVICES_REQUEST",
    date: "Dec 04, 2025",
    name: "Rachel Green",
    role: "IT Administrator",
    description: "Approve device assignment and order for Michael Johnson",
    hasComment: true,
    comment: {
      author: "David Kim",
      date: "Dec 04, 2025 at 3:20 PM PST",
      text: "Device specifications confirmed",
      totalComments: 1,
    },
    tooltip: {
      title: "Assign and order James Wilson's device",
      iconType: "database",
      details: [
        { label: "Person", value: "Michael Johnson" },
        { label: "New purchases", value: "MacBook Pro 16-inch" },
        { label: "Item cost", value: "$2,399" },
        { label: "Reason", value: "New hire equipment" },
        { label: "Effect date", value: "Dec 15, 2025" },
      ],
    },
  },
  // Headcount - BACKFILL_HEADCOUNT
  {
    category: "Headcount",
    actionType: "BACKFILL_HEADCOUNT",
    date: "Dec 03, 2025",
    name: "Kelsey Matthews",
    role: "HR Manager",
    description: "Approve backfill for Michael Johnson",
    hasComment: false,
    tooltip: {
      title: "Backfill for Chris Williams",
      iconType: "userSearch",
      details: [
        { label: "Previous employee", value: "Michael Johnson" },
        { label: "Number of new headcount", value: "1" },
        { label: "Annualized cash impact", value: "$120,000" },
        { label: "Memo", value: "Replacing terminated Product Designer" },
      ],
    },
  },
  // Headcount - NEW_HEADCOUNT
  {
    category: "Headcount",
    actionType: "NEW_HEADCOUNT",
    date: "Dec 02, 2025",
    name: "Anne Wilson",
    role: "HR Director",
    description: "Approve addition of 1 headcount for Product Design Lead (L7) in Design",
    hasComment: true,
    comment: {
      author: "Mark Thompson",
      date: "Dec 02, 2025 at 10:45 AM PST",
      text: "Budget approved for this position",
      totalComments: 2,
    },
    tooltip: {
      title: "Add 1 headcount for Product Design Lead (L7) in Design",
      iconType: "userPlus",
      details: [
        { label: "Number of new headcount", value: "1" },
        { label: "Annualized cash impact", value: "$120,000" },
        { label: "Memo", value: "Budget approved for this position" },
        { label: "Headcount owner", value: "Anne Wilson" },
        { label: "Title", value: "Product Design Lead" },
        { label: "Work location", value: "San Francisco, CA" },
        { label: "Department", value: "Design" },
        { label: "Level", value: "L7" },
        { label: "Job Family", value: "Product Design" },
      ],
    },
  },
  // Headcount - EDIT_HEADCOUNT
  {
    category: "Headcount",
    actionType: "EDIT_HEADCOUNT",
    date: "Dec 01, 2025",
    name: "Jennifer Lee",
    role: "HR Manager",
    description: 'Approve updates to "new designer" (level → L8, +3 changes)',
    hasComment: false,
    tooltip: {
      title: 'Update "Senior Engineer Req" level to L8 and 3 other changes',
      iconType: "userSearch",
      details: [
        { label: "Memo", value: "Level adjustment approved" },
        { label: "Changed by", value: "Jennifer Lee" },
        { label: "Change", value: "level → L8, +3 other changes" },
      ],
    },
  },
  // Headcount - CLOSE_HEADCOUNT
  {
    category: "Headcount",
    actionType: "CLOSE_HEADCOUNT",
    date: "Nov 30, 2025",
    name: "Christie Thomas",
    role: "HR Manager",
    description: 'Approve closure of "new designer"',
    hasComment: true,
    comment: {
      author: "Patricia Brown",
      date: "Nov 30, 2025 at 4:00 PM PST",
      text: "Position filled internally",
      totalComments: 1,
    },
    tooltip: {
      title: 'Close "Marketing Manager Req"',
      iconType: "userMinus",
      details: [
        { label: "Memo", value: "Position filled internally" },
        { label: "Closed by", value: "Christie Thomas" },
        { label: "Headcount owner", value: "Anne Wilson" },
      ],
    },
  },
  // HRIS - HIRE
  {
    category: "HRIS",
    actionType: "HIRE",
    date: "Nov 28, 2025",
    name: "Robert Fox",
    role: "HR Manager",
    description: "Approve hire of Michael Johnson (Product Designer)",
    hasComment: true,
    comment: {
      author: "Michael Chen",
      date: "Nov 28, 2025 at 9:30 AM PST",
      text: "Offer letter signed",
      totalComments: 1,
    },
    tooltip: {
      title: "Hire Maxine Turo (Product Designer)",
      iconType: "userPlus",
      details: [
        { label: "Person", value: "Michael Johnson" },
        { label: "Start date", value: "Dec 15, 2025" },
        { label: "Title", value: "Product Designer" },
        { label: "Department", value: "Design" },
        { label: "Level", value: "L5" },
        { label: "Compensation", value: "$120,000" },
      ],
    },
  },
  // HRIS - PERSONAL_INFO_CHANGES
  {
    category: "HRIS",
    actionType: "PERSONAL_INFO_CHANGES",
    date: "Nov 26, 2025",
    name: "Emily Rodriguez",
    role: "HR Administrator",
    description: "Approve update to Michael Johnson's address → 123 Main Street",
    hasComment: false,
    tooltip: {
      title: "Update Michael Johnson's address to 123 Main Street",
      iconType: "userSearch",
      details: [
        { label: "Person", value: "Michael Johnson" },
        { label: "Change", value: "Address → 123 Main Street" },
        { label: "Reason", value: "Relocation" },
        { label: "Change effect date", value: "Dec 01, 2025" },
      ],
    },
  },
  // Permissions - GRANT_DEVELOPER_PERMISSION
  {
    category: "Permissions",
    actionType: "GRANT_DEVELOPER_PERMISSION",
    date: "Nov 25, 2025",
    name: "David Park",
    role: "IT Manager",
    description: "Approve developer permission grant for Michael Johnson",
    hasComment: true,
    comment: {
      author: "Lisa Anderson",
      date: "Nov 25, 2025 at 2:15 PM PST",
      text: "Security review completed",
      totalComments: 1,
    },
    tooltip: {
      title: "Grant developer permissions to Michael Johnson",
      iconType: "database",
      details: [
        { label: "Employee", value: "Michael Johnson" },
        { label: "Permission type", value: "Developer permissions" },
      ],
    },
  },
  // Procurement - PROCUREMENT_REQUEST
  {
    category: "Procurement",
    actionType: "PROCUREMENT_REQUEST",
    date: "Nov 24, 2025",
    name: "Amanda White",
    role: "Procurement Manager",
    description: "Approve Figma license purchase ($1,000)",
    hasComment: false,
    tooltip: {
      title: "Figma License Purchase ($1,000)",
      iconType: "creditCard",
      details: [
        { label: "Amount", value: "$1,000" },
        { label: "Vendor", value: "Figma" },
        { label: "Payment method", value: "Credit Card" },
        { label: "Memo", value: "Annual license renewal" },
      ],
    },
  },
  // Recruiting - ATS_OFFER_LETTER_REQUEST
  {
    category: "Recruiting",
    actionType: "ATS_OFFER_LETTER_REQUEST",
    date: "Nov 23, 2025",
    name: "Mark Thompson",
    role: "Recruiter",
    description: "Approve offer letter for Michael Johnson (Product Designer)",
    hasComment: true,
    comment: {
      author: "Jennifer Martinez",
      date: "Nov 23, 2025 at 11:00 AM PST",
      text: "Compensation package approved",
      totalComments: 1,
    },
    tooltip: {
      title: "Offer letter for Michael Johnson (Product Designer)",
      iconType: "userPlus",
      details: [
        { label: "Application", value: "Michael Johnson - Product Designer" },
        { label: "Job req name", value: "Product Designer - Design" },
        { label: "Employment type", value: "Full-time" },
        { label: "Job title", value: "Product Designer" },
      ],
    },
  },
  // Recruiting - ATS_JOB_REQUISITION_CREATE_REQUEST
  {
    category: "Recruiting",
    actionType: "ATS_JOB_REQUISITION_CREATE_REQUEST",
    date: "Nov 22, 2025",
    name: "Jessica Park",
    role: "Recruiter",
    description: 'Approve creation of requisition "new designer" (Design)',
    hasComment: false,
    tooltip: {
      title: "Create Senior Engineer Req (Engineering)",
      iconType: "userPlus",
      details: [
        { label: "Job req name", value: "Senior Engineer Req" },
        { label: "Hiring manager", value: "Jessica Park" },
        { label: "Employment type", value: "Full-time" },
        { label: "Job title", value: "Senior Engineer" },
      ],
    },
  },
  // Recruiting - ATS_JOB_REQUISITION_EDIT_REQUEST
  {
    category: "Recruiting",
    actionType: "ATS_JOB_REQUISITION_EDIT_REQUEST",
    date: "Nov 21, 2025",
    name: "Tom Bradley",
    role: "Recruiter",
    description: 'Approve update to requisition "new designer": level → L6',
    hasComment: false,
    tooltip: {
      title: "Update Product Manager Req's level to L6",
      iconType: "userSearch",
      details: [
        { label: "Job req name", value: "Product Manager Req" },
        { label: "Hiring manager", value: "Tom Bradley" },
        { label: "Change", value: "level → L6" },
        { label: "Changed by", value: "Tom Bradley" },
      ],
    },
  },
  // Recruiting - ATS_DECISION_TO_HIRE_REQUEST
  {
    category: "Recruiting",
    actionType: "ATS_DECISION_TO_HIRE_REQUEST",
    date: "Nov 20, 2025",
    name: "Rachel Green",
    role: "Recruiter",
    description: "Approve offer to Michael Johnson",
    hasComment: true,
    comment: {
      author: "Kelsey Matthews",
      date: "Nov 20, 2025 at 3:45 PM PST",
      text: "Hiring manager approved",
      totalComments: 1,
    },
    tooltip: {
      title: "Make an offer to Sarah Martinez",
      iconType: "userPlus",
      details: [
        { label: "Application", value: "Sarah Martinez - Product Designer" },
        { label: "Job req name", value: "Product Designer - Design" },
        { label: "Employment type", value: "Full-time" },
        { label: "Job title", value: "Product Designer" },
      ],
    },
  },
  // Scheduling - SCHEDULING_CHANGE_REQUEST
  {
    category: "Scheduling",
    actionType: "SCHEDULING_CHANGE_REQUEST",
    date: "Nov 19, 2025",
    name: "Anne Wilson",
    role: "Scheduler",
    description: "Approve shift change to Dec 10, 08:15 AM - 05:00 PM PST",
    hasComment: false,
    tooltip: {
      title: "Change shift to Dec 10, 08:15 AM - 05:00 PM PST",
      iconType: "calendar",
      details: [
        { label: "Requested time", value: "Dec 10, 08:15 AM - 05:00 PM PST" },
        { label: "Action", value: "Change shift" },
      ],
    },
  },
  // Scheduling - SCHEDULING_COVER_OFFER
  {
    category: "Scheduling",
    actionType: "SCHEDULING_COVER_OFFER",
    date: "Nov 17, 2025",
    name: "Christie Thomas",
    role: "Scheduler",
    description: "Approve shift coverage for Dec 15, 10:00 AM - 07:00 PM PST",
    hasComment: true,
    comment: {
      author: "Phil Hughes",
      date: "Nov 17, 2025 at 1:30 PM PST",
      text: "Coverage approved",
      totalComments: 1,
    },
    tooltip: {
      title: "Request to cover shift (Dec 15, 10:00 AM - 07:00 PM PST)",
      iconType: "calendar",
      details: [
        { label: "Proposed time", value: "Dec 15, 10:00 AM - 07:00 PM PST" },
        { label: "Action", value: "Cover shift" },
      ],
    },
  },
  // Scheduling - SCHEDULING_DROP_SHIFT
  {
    category: "Scheduling",
    actionType: "SCHEDULING_DROP_SHIFT",
    date: "Nov 16, 2025",
    name: "Robert Fox",
    role: "Scheduler",
    description: "Approve dropped shift (Dec 20, 08:00 AM - 05:00 PM PST)",
    hasComment: false,
    tooltip: {
      title: "Dropping Dec 20, 08:00 AM - 05:00 PM PST shift",
      iconType: "calendar",
      details: [
        { label: "Dropped time", value: "Dec 20, 08:00 AM - 05:00 PM PST" },
        { label: "Action", value: "Drop shift" },
      ],
    },
  },
  // Scheduling - SCHEDULING_SWAP_OFFER
  {
    category: "Scheduling",
    actionType: "SCHEDULING_SWAP_OFFER",
    date: "Nov 15, 2025",
    name: "Sarah Martinez",
    role: "Scheduler",
    description: "Approve shift swap: Dec 18, 09:00 AM - 06:00 PM PST with Michael Johnson",
    hasComment: false,
    tooltip: {
      title: "Swap Dec 18, 09:00 AM - 06:00 PM PST with Michael Johnson",
      iconType: "calendar",
      details: [
        { label: "Swapped time", value: "Dec 18, 09:00 AM - 06:00 PM PST" },
        { label: "Impacted name", value: "Michael Johnson" },
        { label: "Action", value: "Swap shift" },
      ],
    },
  },
  // Scheduling - SCHEDULING_EMPLOYEE_SHIFT_CONFIRM
  {
    category: "Scheduling",
    actionType: "SCHEDULING_EMPLOYEE_SHIFT_CONFIRM",
    date: "Nov 14, 2025",
    name: "Emily Rodriguez",
    role: "Scheduler",
    description: "Approve confirmation of Michael Johnson working Dec 22, 08:00 AM - 05:00 PM PST shift",
    hasComment: false,
    tooltip: {
      title: "Confirmation of James Wilson working Dec 22, 08:00 AM - 05:00 PM PST shift",
      iconType: "calendar",
      details: [
        { label: "Person", value: "James Wilson" },
        { label: "Time", value: "Dec 22, 08:00 AM - 05:00 PM PST" },
        { label: "Action", value: "Shift confirmation" },
      ],
    },
  },
  // Travel - FLIGHT_APPROVAL_REQUEST
  {
    category: "Travel",
    actionType: "FLIGHT_APPROVAL_REQUEST",
    date: "Nov 13, 2025",
    name: "David Kim",
    role: "Travel Coordinator",
    description: 'Approve flight for "Team offsite" (LGA->SFO, Roundtrip)',
    hasComment: true,
    comment: {
      author: "Lisa Anderson",
      date: "Nov 13, 2025 at 10:20 AM PST",
      text: "Budget approved for this trip",
      totalComments: 1,
    },
    tooltip: {
      title: 'Flight for "Team offsite": LGA->SFO, Roundtrip',
      iconType: "creditCard",
      details: [
        { label: "Details", value: "LGA->SFO, Roundtrip" },
        { label: "Amount", value: "$850.00" },
        { label: "Trip date", value: "Dec 15, 2025" },
        { label: "Selection", value: "Economy class" },
      ],
    },
  },
  // Contractor hub - CONTRACT_NEGOTIATION
  {
    category: "Contractor hub",
    actionType: "CONTRACT_NEGOTIATION",
    date: "Nov 11, 2025",
    name: "Jennifer Lee",
    role: "HR Manager",
    description: "Approve proposed contract changes for Michael Johnson (Product Designer)",
    hasComment: true,
    comment: {
      author: "David Park",
      date: "Nov 11, 2025 at 2:30 PM PST",
      text: "Contract terms reviewed",
      totalComments: 1,
    },
    tooltip: {
      title: "Approve proposed contract changes for Michael Johnson (Product Designer)",
      iconType: "userSearch",
      details: [
        { label: "Impacted contractor", value: "Michael Johnson" },
        { label: "Contract type", value: "Contractor" },
        { label: "Change", value: "Rate increase, extended term" },
      ],
    },
  },
  // Global payroll - GLOBAL_PAYROLL_PROCESS_REQUEST_APPROVAL
  {
    category: "Global payroll",
    actionType: "GLOBAL_PAYROLL_PROCESS_REQUEST_APPROVAL",
    date: "Nov 10, 2025",
    name: "Robert Kim",
    role: "Payroll Manager",
    description: "Approve payroll of $923,688.28 for Lopez Ltd (Jun 16–30)",
    hasComment: false,
    tooltip: {
      title: "$923,688.28 for Lopez Ltd (Jun 16–30)",
      iconType: "creditCard",
      details: [
        { label: "Pay period: start date", value: "Jun 16, 2025" },
        { label: "Pay period: end date", value: "Jun 30, 2025" },
        { label: "Take action deadline", value: "Jul 05, 2025" },
        { label: "Pay run memo", value: "Monthly payroll processing" },
      ],
    },
  },
  // IT automations - APP_ACCESS_REQUEST
  {
    category: "IT automations",
    actionType: "APP_ACCESS_REQUEST",
    date: "Nov 08, 2025",
    name: "David Chen",
    role: "IT Manager",
    description: "Approve access request to Salesforce",
    hasComment: false,
    tooltip: {
      title: "Approve access request to Salesforce",
      iconType: "database",
      details: [
        { label: "Person", value: "Michael Johnson" },
        { label: "Department", value: "Engineering" },
        { label: "Requested resource", value: "Salesforce" },
        { label: "Reason", value: "New role requires additional access" },
      ],
    },
  },
  // Payroll - PAYROLL_RUN_REQUEST_APPROVAL
  {
    category: "Payroll",
    actionType: "PAYROLL_RUN_REQUEST_APPROVAL",
    date: "Nov 07, 2025",
    name: "Robert Kim",
    role: "Payroll Manager",
    description: "Approve payroll of $923,688.28 for Lopez Ltd (Jun 16–30)",
    hasComment: true,
    comment: {
      author: "Lisa Anderson",
      date: "Nov 07, 2025 at 9:15 AM PST",
      text: "Payroll run verified",
      totalComments: 1,
    },
    tooltip: {
      title: "$923,688.28 for Lopez Ltd (Jun 16–30)",
      iconType: "creditCard",
      details: [
        { label: "Pay period: start date", value: "Jun 16, 2025" },
        { label: "Pay period: end date", value: "Jun 30, 2025" },
        { label: "Take action deadline", value: "Jul 05, 2025" },
        { label: "Pay run memo", value: "Payroll run verified" },
      ],
    },
  },
  // RPass - RPASS_REQUEST
  {
    category: "RPass",
    actionType: "RPASS_REQUEST",
    date: "Nov 06, 2025",
    name: "Jennifer Martinez",
    role: "IT Administrator",
    description: "Approve access grant for Michael Johnson (5 RPass items)",
    hasComment: false,
    tooltip: {
      title: "Approve access grant for Michael Johnson (5 RPass items)",
      iconType: "database",
      details: [
        { label: "Person", value: "Michael Johnson" },
        { label: "Items", value: "5 RPass items" },
        { label: "Reason", value: "New role requires additional access" },
        { label: "Effective date", value: "Nov 06, 2025" },
      ],
    },
  },
  // Travel - FLIGHT_PRE_APPROVAL_REQUEST
  {
    category: "Travel",
    actionType: "FLIGHT_PRE_APPROVAL_REQUEST",
    date: "Nov 05, 2025",
    name: "David Kim",
    role: "Travel Coordinator",
    description: 'Approve flight for "Q4 Planning" (JFK->LAX, Roundtrip) — pre-approval required',
    hasComment: true,
    comment: {
      author: "Lisa Anderson",
      date: "Nov 05, 2025 at 3:00 PM PST",
      text: "Pre-approval requested for budget planning",
      totalComments: 1,
    },
    tooltip: {
      title: 'Flight for "Q4 Planning": JFK->LAX, Roundtrip — pre-approval required',
      iconType: "creditCard",
      details: [
        { label: "Details", value: "JFK->LAX, Roundtrip" },
        { label: "Amount", value: "$650.00" },
        { label: "Trip date", value: "Dec 20, 2025" },
        { label: "Selection", value: "Economy class" },
      ],
    },
  },
  // Variable Comp - VARIABLE_COMPENSATION_PAYEE_PAYOUT_V1
  {
    category: "Variable Comp",
    actionType: "VARIABLE_COMPENSATION_PAYEE_PAYOUT_V1",
    date: "Nov 04, 2025",
    name: "Robert Kim",
    role: "Finance Manager",
    description: "Approve payout of $101,200 to jessica Garcia (December 01 -15)",
    hasComment: false,
    tooltip: {
      title: "$101,200 payout for jessica Garcia (December 01 -15)",
      iconType: "creditCard",
      details: [
        { label: "Payout amount", value: "$101,200" },
        { label: "Payee", value: "jessica Garcia" },
        { label: "Period", value: "December 01 -15" },
      ],
    },
  },
]

interface RequestsTableProps {
  categoryName?: string
  viewMode?: "long" | "medium" | "short"
}

export function RequestsTable({ categoryName = "Time and attendance", viewMode = "long" }: RequestsTableProps) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null)
  const [openTooltipIndex, setOpenTooltipIndex] = useState<number | null>(null)
  const [hoveredCommentIndex, setHoveredCommentIndex] = useState<number | null>(null)
  const [sortColumn, setSortColumn] = useState<'date' | 'name' | 'category' | 'description'>('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const commentTooltipTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  // Check if a detail value is a person name
  const isPersonName = (label: string, value: string): boolean => {
    const personLabels = ['Person', 'Manager', 'Purchaser']
    return personLabels.includes(label) && value.trim().length > 0
  }

  // Extract person names from a value (handles "Name1 → Name2" format)
  const extractPersonNames = (value: string): string[] => {
    if (value.includes('→')) {
      return value.split('→').map(name => name.trim()).filter(name => name.length > 0)
    }
    return [value.trim()].filter(name => name.length > 0)
  }


  // Filter requests by category (or show all if "All approvals")
  const filteredRequests = categoryName === "All approvals" 
    ? allRequests 
    : allRequests.filter(request => request.category === categoryName)

  // Sort requests
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    let comparison = 0

    switch (sortColumn) {
      case 'date':
        // Parse dates for comparison (format: "Dec 10, 2025")
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        comparison = dateA.getTime() - dateB.getTime()
        break
      case 'name':
        comparison = a.name.localeCompare(b.name)
        break
      case 'category':
        comparison = a.category.localeCompare(b.category)
        break
      case 'description':
        comparison = a.description.localeCompare(b.description)
        break
    }

    return sortDirection === 'asc' ? comparison : -comparison
  })

  const requests = sortedRequests

  // Handle column header click for sorting
  const handleSort = (column: 'date' | 'name' | 'category' | 'description') => {
    if (sortColumn === column) {
      // Toggle direction if clicking the same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // Set new column and default to ascending
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  // Format description based on view mode
  const formatDescription = (description: string): string => {
    if (viewMode === "long") {
      // Keep the "Approve..." format for long view
      return description
    } else if (viewMode === "medium") {
      // For medium view, transform to match CSV "Details copy" format
      let result = description
        // Remove "Approve" prefix
        .replace(/^Approve\s+/i, '')
        // Handle specific complex patterns first
        .replace(/^access update for\s+([^(]+)\s*\((\d+)\s+apps\)/i, 'Update $1\'s access to $2 apps')
        .replace(/^access grant for\s+([^(]+)\s*\((\d+)\s+apps\)/i, 'Grant $1 access to $2 apps')
        .replace(/^access grant for\s+([^(]+)\s*\((\d+)\s+RPass items\)/i, 'Grant $1 access to $2 RPass items')
        .replace(/^update to\s+([^:]+):\s*([^→]+)\s*→\s*(.+)/i, 'Update $1 $2 to $3')
        .replace(/^updates to\s+"([^"]+)"\s*\(([^→]+)\s*→\s*([^,]+),\s*\+(\d+)\s+changes\)/i, 'Update "$1" $2 to $3 and $4 other changes')
        .replace(/^update to requisition\s+"([^"]+)":\s*([^→]+)\s*→\s*(.+)/i, 'Update "$1"\'s $2 to $3')
        .replace(/^device assignment and order for\s+(.+)/i, 'Assign and order $1\'s device')
        .replace(/^creation of requisition\s+"([^"]+)"\s*\(([^)]+)\)/i, 'Create "$1" ($2)')
        // Transform simpler patterns
        .replace(/^logged time:\s*/i, '')
        .replace(/^reimbursement of\s+/i, 'Reimburse ')
        .replace(/^termination of\s+/i, 'Terminate ')
        .replace(/^update to\s+/i, 'Update ')
        .replace(/^hire of\s+/i, 'Hire ')
        .replace(/^shift update to\s+/i, 'Update shift to ')
        .replace(/^shift change to\s+/i, 'Change shift to ')
        .replace(/^shift coverage for\s+/i, 'Request to cover shift (')
        .replace(/^dropped shift\s*\(/i, 'Dropping ')
        .replace(/^shift swap:\s*/i, 'Swap ')
        .replace(/^confirmation of\s+/i, 'Confirmation of ')
        .replace(/\s+working\s+/i, ' working ')
        .replace(/\s+shift$/i, ' shift')
        .replace(/^creation of\s+/i, 'Create ')
        .replace(/^deletion of\s+/i, 'Delete ')
        .replace(/^transfer of\s+/i, 'Transfer ')
        .replace(/^contract for\s+/i, 'Create a contract for ')
        .replace(/^proposed contract changes for\s+/i, 'Suggested changes to contract for ')
        .replace(/^backfill for\s+/i, 'Backfill for ')
        .replace(/^addition of\s+/i, 'Add ')
        .replace(/^closure of\s+/i, 'Close ')
        .replace(/^developer permission grant for\s+/i, 'Grant developer permissions to ')
        .replace(/^license purchase\s*\(/i, 'license purchase (')
        .replace(/^offer letter for\s+/i, 'Offer letter for ')
        .replace(/^offer to\s+/i, 'Make an offer to ')
        .replace(/^flight for\s+/i, 'Flight for ')
        .replace(/^new\s+/i, 'New ')
        .replace(/^request\s*\(/i, 'request (')
        .replace(/^payroll of\s+/i, '')
        .replace(/^access request to\s+/i, 'Requesting access to ')
        .replace(/^payout of\s+/i, '')
        // Fix date format
        .replace(/\(Dec 10–11\)/g, 'from Dec 10 -11')
        // Fix arrow symbols
        .replace(/→/g, 'to')
        .trim()
      
      return result
    } else if (viewMode === "short") {
      // For short view, make it very concise by removing "Approve" and verbose action phrases
      let result = description
        // Remove "Approve" prefix
        .replace(/^Approve\s+/i, '')
        // Remove verbose action phrases that add no value
        .replace(/^logged time:\s*/i, '')
        .replace(/^reimbursement of\s+/i, '')
        .replace(/^termination of\s+/i, '')
        .replace(/^update to\s+/i, '')
        .replace(/^hire of\s+/i, '')
        .replace(/^shift update to\s+/i, '')
        .replace(/^shift change to\s+/i, '')
        .replace(/^shift coverage for\s+/i, '')
        .replace(/^dropped shift\s*\(/i, '')
        .replace(/^shift swap:\s*/i, '')
        .replace(/^confirmation of\s+/i, '')
        .replace(/\s+working\s+/i, ': ')
        .replace(/\s+shift$/i, '')
        .replace(/^creation of\s+/i, '')
        .replace(/^deletion of\s+/i, '')
        .replace(/^access update for\s+/i, '')
        .replace(/^access grant for\s+/i, '')
        .replace(/^transfer of\s+/i, '')
        .replace(/^contract for\s+/i, '')
        .replace(/^proposed contract changes for\s+/i, '')
        .replace(/^device assignment and order for\s+/i, '')
        .replace(/^backfill for\s+/i, '')
        .replace(/^addition of\s+/i, '')
        .replace(/^updates to\s+/i, '')
        .replace(/^closure of\s+/i, '')
        .replace(/^developer permission grant for\s+/i, '')
        .replace(/^license purchase\s*\(/i, 'license (')
        .replace(/^offer letter for\s+/i, '')
        .replace(/^creation of requisition\s+/i, '')
        .replace(/^update to requisition\s+/i, '')
        .replace(/^offer to\s+/i, '')
        .replace(/^flight for\s+/i, '')
        .replace(/^new\s+/i, '')
        .replace(/^request\s*\(/i, '(')
        .replace(/^payroll of\s+/i, '')
        .replace(/^access request to\s+/i, '')
        .replace(/^payout of\s+/i, '')
        .replace(/\s+to\s+([A-Za-z\s]+)\s*\(/i, ' to $1 (')
        .trim()
      
      return result
    } else {
      // Medium view: Remove "Approve" prefix but keep the rest
      return description.replace(/^Approve\s+/i, '').trim()
    }
  }

  // Format action type to readable label that prefaces the description
  const formatActionType = (actionType: string): string => {
    // Convert SNAKE_CASE to Title Case and make it readable
    const formatted = actionType
      .split('_')
      .map(word => {
        // Handle special cases
        if (word === 'ATS') return 'ATS'
        if (word === 'RPass') return 'RPass'
        if (word === 'V1') return 'V1'
        // Capitalize first letter, lowercase rest
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      })
      .join(' ')
      // Clean up common patterns
      .replace(/Request Approval/g, '')
      .replace(/Request$/g, '')
      .replace(/\s+/g, ' ')
      .trim()
    
    // Special formatting with specific replacements
    let result = formatted
      // Specific changes requested
      .replace(/Variable Compensation Payee Payout V1/g, 'Variable compensation')
      .replace(/Contract Negotiation/g, 'Contract negotiation')
      .replace(/ATS Decision To Hire/g, 'Decision to hire')
      .replace(/ATS Job Requisition Edit/g, 'Requisition update')
      .replace(/ATS Job Requisition Create/g, 'Job requisition')
      .replace(/ATS Offer Letter/g, 'Offer letter')
      .replace(/Personal Info Changes/g, 'Personal info change')
      .replace(/Transition/g, 'Transition')
      .replace(/Spend Request/g, 'Reimbursements')
      .replace(/\bSpend\b/g, 'Reimbursements')
      .replace(/Device Assignment/g, 'Device assignment')
      .replace(/\bDevices\b/g, 'Device assignment')
      .replace(/Contract Creation/g, 'Contract creation')
      .replace(/App Install/g, 'Grant access')
      .replace(/App Access/g, 'Grant access')
      .replace(/Apps Request/g, 'Access update')
      .replace(/Apps$/g, 'Access update')
      // Other formatting
      .replace(/Time Entry/g, 'Time entry')
      .replace(/Leave Request/g, 'Time off')
      .replace(/Banking New Payment/g, 'Bank transfer')
      .replace(/Custom Object Data Row/g, 'Custom object')
      .replace(/Delete/g, 'Deletion')
      .replace(/Create/g, 'Creation')
      .replace(/Update/g, 'Update')
      .replace(/Backfill Headcount/g, 'Backfill')
      .replace(/New Headcount/g, 'New position')
      .replace(/Edit Headcount/g, 'Position update')
      .replace(/Close Headcount/g, 'Position close')
      .replace(/Headcount$/g, 'Position')
      .replace(/Terminate/g, 'Termination')
      .replace(/Hire/g, 'Hiring')
      .replace(/Grant Developer Permission/g, 'Developer access')
      .replace(/Procurement Request/g, 'Procurement')
      .replace(/Scheduling Change/g, 'Shift change')
      .replace(/Scheduling Edit Shift/g, 'Shift update')
      .replace(/Scheduling Cover Offer/g, 'Shift coverage')
      .replace(/Scheduling Drop Shift/g, 'Shift drop')
      .replace(/Scheduling Swap Offer/g, 'Shift swap')
      .replace(/Scheduling Employee Shift Confirm/g, 'Shift confirmation')
      .replace(/Flight Approval/g, 'Flight')
      .replace(/Flight Pre Approval/g, 'Flight pre-approval')
      .replace(/Global Payroll Process/g, 'Global payroll')
      .replace(/Payroll Run/g, 'Payroll')
      .replace(/Benefits Carrier/g, 'New carrier')
    
    // Convert to sentence case (first letter capitalized, rest lowercase)
    return result.charAt(0).toUpperCase() + result.slice(1).toLowerCase()
  }

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

      {/* Table Header - Fixed outside scrollable container */}
      <div style={{ border: 'none', borderRadius: 0, borderWidth: 0, backgroundColor: '#F9F7F6', borderBottom: '1px solid #E5E7EB' }} className="table-header-wrapper">
        <TooltipProvider>
          <TableBasic style={{ width: '100%', minWidth: 0, maxWidth: '100%', border: 'none', borderRadius: 0, borderWidth: 0, backgroundColor: '#F9F7F6', tableLayout: 'fixed', borderCollapse: 'separate', borderSpacing: 0 }} className="requests-table">
            <TableBasic.THead style={{ border: 'none', borderWidth: 0, borderRadius: 0, backgroundColor: '#F9F7F6' }}>
              <TableBasic.Tr style={{ height: '40px', backgroundColor: '#F9F7F6', border: 'none', borderWidth: 0, borderRadius: 0 }}>
              <TableBasic.Th style={{ width: '48px', padding: '8px', backgroundColor: '#F9F7F6', border: 'none', borderWidth: 0, borderRadius: 0 }}>
                <Checkbox />
              </TableBasic.Th>
              <TableBasic.Th 
                style={{ width: '145px', fontSize: '14px', lineHeight: '16px', padding: '8px', cursor: 'pointer', backgroundColor: '#F9F7F6', border: 'none', borderWidth: 0, borderRadius: 0 }}
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center gap-1">
                  Requested on
                  {sortColumn === 'date' && (
                    sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                  )}
                </div>
              </TableBasic.Th>
              <TableBasic.Th 
                style={{ width: '180px', fontSize: '14px', lineHeight: '16px', padding: '8px', cursor: 'pointer', backgroundColor: '#F9F7F6', border: 'none', borderWidth: 0, borderRadius: 0 }}
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1">
                  Requested by
                  {sortColumn === 'name' && (
                    sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                  )}
                </div>
              </TableBasic.Th>
              <TableBasic.Th 
                style={{ width: '150px', fontSize: '14px', lineHeight: '16px', padding: '8px', cursor: 'pointer', backgroundColor: '#F9F7F6', border: 'none', borderWidth: 0, borderRadius: 0 }}
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center gap-1">
                  Request type
                  {sortColumn === 'category' && (
                    sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                  )}
                </div>
              </TableBasic.Th>
              <TableBasic.Th 
                style={{ fontSize: '14px', lineHeight: '16px', padding: '8px', cursor: 'pointer', backgroundColor: '#F9F7F6', border: 'none', borderWidth: 0, borderRadius: 0, minWidth: 0, overflow: 'hidden' }}
                onClick={() => handleSort('description')}
              >
                <div className="flex items-center gap-1">
                  Description
                  {sortColumn === 'description' && (
                    sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                  )}
                </div>
              </TableBasic.Th>
              <TableBasic.Th style={{ width: '125px', fontSize: '14px', lineHeight: '16px', padding: '8px', backgroundColor: '#F9F7F6', border: 'none', borderWidth: 0, borderRadius: 0 }}>
                Attributes
              </TableBasic.Th>
              <TableBasic.Th style={{ width: '144px', fontSize: '14px', lineHeight: '16px', padding: '8px', backgroundColor: '#F9F7F6', border: 'none', borderWidth: 0, borderRadius: 0 }}></TableBasic.Th>
              </TableBasic.Tr>
            </TableBasic.THead>
          </TableBasic>
        </TooltipProvider>
      </div>

      {/* Table Body - Scrollable */}
      <div className="flex-1 overflow-auto requests-table-container" style={{ position: 'relative', border: 'none', borderRadius: 0, borderWidth: 0, width: '100%', minWidth: 0, maxWidth: '100%' }}>
        <TooltipProvider>
          <TableBasic style={{ width: '100%', minWidth: 0, maxWidth: '100%', border: 'none', borderRadius: 0, tableLayout: 'fixed', borderCollapse: 'separate', borderSpacing: 0 }} className="requests-table">
            <TableBasic.TBody>
              {requests.map((request, index) => (
                <TableBasic.Tr
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
                  <TableBasic.Td style={{ width: '48px', padding: '8px' }}>
                    <Checkbox />
                  </TableBasic.Td>
                  <TableBasic.Td style={{ width: '145px', color: '#374151', padding: '8px' }}>
                    <div className="truncate" style={{ fontSize: '14px', lineHeight: '16px' }}>{request.date}</div>
                  </TableBasic.Td>
                  <TableBasic.Td style={{ width: '180px', padding: '8px' }}>
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
                  </TableBasic.Td>
                  <TableBasic.Td style={{ width: '150px', padding: '8px' }}>
                    <div className="min-w-0 flex-1">
                      {'actionType' in request && (request as any).actionType && (
                        <div className="font-medium text-gray-900 truncate" style={{ fontSize: '13px', lineHeight: '16px' }}>
                          {formatActionType((request as any).actionType)}
                        </div>
                      )}
                      {(() => {
                        const actionType = (request as any).actionType
                        const hideSubtitle = actionType && [
                          'VARIABLE_COMPENSATION_PAYEE_PAYOUT_V1',
                          'RPASS_REQUEST',
                          'PAYROLL_RUN_REQUEST_APPROVAL',
                          'GLOBAL_PAYROLL_PROCESS_REQUEST_APPROVAL',
                          'APPS_REQUEST',
                          'APP_INSTALL_REQUEST',
                          'PROCUREMENT_REQUEST'
                        ].includes(actionType)
                        return !hideSubtitle && (
                          <div className="text-gray-500 truncate" style={{ fontSize: '11px', lineHeight: '13px' }}>{request.category}</div>
                        )
                      })()}
                    </div>
                  </TableBasic.Td>
                  <TableBasic.Td style={{ minWidth: 0, padding: '8px', overflow: 'hidden' }}>
                      <div className="text-gray-900 truncate" style={{ fontSize: '14px', lineHeight: '16px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%', display: 'block' }}>
                        {formatDescription(request.description)}
                      </div>
                  </TableBasic.Td>
                  <TableBasic.Td style={{ width: '125px', padding: '8px' }}>
                      <div className="flex items-center gap-2">
                        {/* Warning icon - always shown */}
                        {'warning' in request && (request as any).warning ? (
                          <Tooltip delayDuration={200}>
                            <TooltipTrigger asChild>
                              <div className="cursor-pointer">
                                <AlertTriangle 
                                  className="h-4 w-4" 
                                  style={{ color: '#106A63' }}
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent 
                              side="right" 
                              className="w-80 p-0 bg-[#EDEBE7] border border-gray-200 shadow-lg rounded-xl"
                              sideOffset={8}
                            >
                              <div className="p-3">
                                <div className="text-xs text-gray-900 font-medium">
                                  {(request as any).warning}
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <div>
                            <AlertTriangle 
                              className="h-4 w-4" 
                              style={{ color: '#9CA3AF', opacity: 0.5 }}
                            />
                          </div>
                        )}
                        
                        {/* Info icon - always shown */}
                        {request.tooltip && request.tooltip.details && request.tooltip.details.length > 0 ? (
                          <Tooltip 
                            delayDuration={200}
                            onOpenChange={(open) => {
                              if (open) {
                                setOpenTooltipIndex(index)
                              } else {
                                setOpenTooltipIndex(null)
                              }
                            }}
                          >
                            <TooltipTrigger asChild>
                              <div className="cursor-pointer">
                                <Info 
                                  className="h-4 w-4" 
                                  style={{ color: '#106A63' }}
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent 
                              side="right" 
                              className={cn(
                                "p-0 bg-[#EDEBE7] border border-gray-200 shadow-lg rounded-xl",
                                request.tooltip.receiptImage ? "w-auto" : "w-80"
                              )}
                              sideOffset={8}
                              style={request.tooltip.receiptImage ? { minHeight: '550px' } : undefined}
                              onPointerDownOutside={(e) => {
                                // Prevent closing if clicking on the employee card tooltip or comment tooltip
                                const target = e.target as HTMLElement
                                if (target.closest('[data-employee-card-tooltip]') || target.closest('[data-radix-tooltip-content]')) {
                                  e.preventDefault()
                                }
                              }}
                              onEscapeKeyDown={(e) => {
                                // Allow escape to close
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
                              "flex flex-col p-3",
                              request.tooltip.receiptImage ? "w-[215px]" : "w-full"
                            )} style={request.tooltip.receiptImage ? { alignSelf: 'stretch' } : {}}>
                              <div className="flex flex-col" style={{ marginBottom: '10px' }}>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-900 break-words" style={{ fontSize: '14px', lineHeight: '20px' }}>
                                    {request.tooltip.title}
                                  </span>
                                </div>
                              </div>
                              <div style={{ borderTop: '1px solid #D5D3D0', paddingTop: '10px', paddingBottom: '0' }}>
                                {(request.tooltip.showMoreLink ? request.tooltip.details.slice(0, 8) : request.tooltip.details).map((detail, idx) => {
                                  const isPerson = isPersonName(detail.label, detail.value)
                                  const personNames = isPerson ? extractPersonNames(detail.value) : []
                                  
                                  return (
                                    <div key={idx} style={{ marginBottom: idx < (request.tooltip.showMoreLink ? Math.min(8, request.tooltip.details.length) : request.tooltip.details.length) - 1 ? '10px' : '0' }}>
                                      <div className="text-xs text-gray-500">
                                        {detail.label}
                                      </div>
                                      <div className="text-xs text-gray-900 font-medium">
                                        {isPerson ? (
                                          <>
                                            {personNames.map((name, nameIdx) => (
                                              <span key={nameIdx}>
                                                {name}
                                                {nameIdx < personNames.length - 1 && <span> → </span>}
                                              </span>
                                            ))}
                                          </>
                                        ) : (
                                          detail.value
                                        )}
                                      </div>
                                    </div>
                                  )
                                })}
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
                        </TooltipContent>
                      </Tooltip>
                        ) : (
                          <div>
                            <Info 
                              className="h-4 w-4" 
                              style={{ color: '#9CA3AF', opacity: 0.5 }}
                            />
                          </div>
                        )}
                        
                        {/* Comments icon - always shown */}
                        {request.hasComment && request.comment ? (
                          <Tooltip delayDuration={200}>
                            <TooltipTrigger asChild>
                              <div className="cursor-pointer">
                                <CommentIcon className="h-4 w-4" color="#106A63" />
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
                          <div style={{ opacity: 0.5 }}>
                            <CommentIcon className="h-4 w-4" color="#9CA3AF" />
                          </div>
                        )}
                      </div>
                  </TableBasic.Td>
                  <TableBasic.Td style={{ width: '144px', padding: '8px' }}>
                    <div className="flex items-center justify-end gap-3">
                      <div className="approve-button-wrapper">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-green-600 hover:text-green-700 hover:bg-green-50"
                          title="Approve"
                        >
                          <Check className="h-6 w-6" />
                        </Button>
                      </div>
                      <div className="reject-button-wrapper">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Reject"
                        >
                          <X className="h-6 w-6" />
                        </Button>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableBasic.Td>
                </TableBasic.Tr>
              ))}
            </TableBasic.TBody>
          </TableBasic>
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
