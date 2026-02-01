"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Option {
  value: string
  label: string
}

interface CustomSelectProps {
  options: Option[]
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function CustomSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
  className,
  disabled = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm("")
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false)
        setSearchTerm("")
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen])

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedOption = options.find(option => option.value === value)

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue)
    setIsOpen(false)
    setSearchTerm("")
  }

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
      setSearchTerm("")
    }
  }

  return (
    <div ref={dropdownRef} className={cn("relative w-full", className)}>
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={toggleDropdown}
        disabled={disabled}
        className={cn(
          "flex h-9 sm:h-10 w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-sm transition-all",
          "hover:bg-emerald-50 hover:border-emerald-300 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          isOpen && "ring-2 ring-emerald-500 ring-offset-2 border-emerald-300",
          !selectedOption && "text-gray-500"
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="block truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200 flex-shrink-0 ml-2",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden z-50">
          {/* Search Input for large lists */}
          {options.length > 8 && (
            <div className="p-2 border-b border-gray-100">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-300"
                autoFocus
              />
            </div>
          )}

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                No options found
              </div>
            ) : (
              <ul role="listbox" className="py-1">
                {filteredOptions.map((option) => (
                  <li key={option.value} role="option" aria-selected={option.value === value}>
                    <button
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm hover:bg-emerald-50 focus:bg-emerald-50 focus:outline-none transition-colors",
                        "flex items-center justify-between",
                        option.value === value && "bg-emerald-50 text-emerald-700"
                      )}
                    >
                      <span className="block truncate">{option.label}</span>
                      {option.value === value && (
                        <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}