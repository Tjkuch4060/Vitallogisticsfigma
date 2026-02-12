import * as React from "react"
import { addDays, format, subDays, startOfQuarter, subQuarters } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "../ui/utils"
import { Button } from "../ui/button"
import { Calendar } from "../ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

export function DateRangeFilter({ 
  onRangeChange 
}: { 
  onRangeChange?: (range: DateRange | undefined) => void 
}) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  })

  const [preset, setPreset] = React.useState("7d")

  const handlePresetChange = (value: string) => {
    setPreset(value)
    const today = new Date()
    let newDate: DateRange | undefined

    switch (value) {
      case "7d":
        newDate = { from: subDays(today, 7), to: today }
        break
      case "30d":
        newDate = { from: subDays(today, 30), to: today }
        break
      case "quarter":
        newDate = { from: subQuarters(today, 1), to: today }
        break
      case "custom":
        // Keep current selection or default
        newDate = date
        break
      default:
        newDate = { from: subDays(today, 7), to: today }
    }
    
    setDate(newDate)
    if (onRangeChange) onRangeChange(newDate)
  }

  const handleCalendarSelect = (newDate: DateRange | undefined) => {
    setDate(newDate)
    setPreset("custom")
    if (onRangeChange) onRangeChange(newDate)
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={preset} onValueChange={handlePresetChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7d">Last 7 days</SelectItem>
          <SelectItem value="30d">Last 30 days</SelectItem>
          <SelectItem value="quarter">Last Quarter</SelectItem>
          <SelectItem value="custom">Custom Range</SelectItem>
        </SelectContent>
      </Select>

      {preset === "custom" && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[260px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleCalendarSelect}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}
