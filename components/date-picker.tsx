"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DayPicker, SelectSingleEventHandler } from "react-day-picker"

// Import the default DayPicker styles
import "react-day-picker/dist/style.css"

type DatePickerProps = {
  value?: Date
  onChange?: SelectSingleEventHandler
  disabled?: boolean
}

export function DatePicker({ value, onChange, disabled }: DatePickerProps) {
  // Local state to open/close our popover
  const [open, setOpen] = React.useState(false)

  // Format the display text (or show "Pick a date" if none is selected)
  const displayText = value ? format(value, "PPP") : "Pick a date"

  return (
    <div className="relative inline-block text-left">
      {/* The "Trigger" button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        disabled={disabled}
        className="inline-flex items-center space-x-2 rounded-md border bg-white px-3 py-2 text-sm"
      >
        <CalendarIcon className="h-4 w-4" />
        <span>{displayText}</span>
      </button>

      {/* The Popover content (calendar) */}
      {open && (
        <div
          className="absolute z-10 mt-2 rounded-md border bg-white p-2 shadow"
          // Close if user clicks outside
          onBlur={(e) => {
            // If focus moves outside, close popover
            if (!e.currentTarget.contains(e.relatedTarget)) {
              setOpen(false)
            }
          }}
          tabIndex={-1} // make it focusable so onBlur works
        >
          <DayPicker
            mode="single"
            selected={value}
            onSelect={(date) => {
              // If user clicks a day, call parent's onChange
              onChange?.(date!)
              // Also close popover
              setOpen(false)
            }}
            initialFocus // automatically focus calendar on open
          />
        </div>
      )}
    </div>
  )
}
