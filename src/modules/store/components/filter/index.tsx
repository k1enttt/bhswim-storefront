"use client"
import { useState } from "react"
import { SheetSide } from "../sheet-side"

const Filter = ({ className }: { className?: string }) => {
  const [isOpen, setIsOpen] = useState(false)
  const handleFilterClick = () => {
    setIsOpen(!isOpen)
  }
  return (
    <div>
      <button
        className="w-full h-12 rounded-md bg-black text-white text-xl"
        onClick={handleFilterClick}
      >
        Lọc
      </button>
      {isOpen && <SheetSide close={handleFilterClick} />}
    </div>
  )
}

export default Filter
