"use client"
import { faCheck } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"

const FilterCheckbox = ({ label = "" }: { label?: string }) => {
  const [checkboxState, setCheckboxState] = useState(false)

  return (
    <div className="flex items-center justify-start gap-2">
      <button
        className="relative w-6 h-6 rounded-md bg-gray-300"
        onClick={() => {
          setCheckboxState(!checkboxState)
        }}
      >
        {checkboxState && (
          <div className="absolute inset-0 text-orange-500">
            <FontAwesomeIcon icon={faCheck} />
          </div>
        )}
      </button>
      <div>{label}</div>
    </div>
  )
}

export default FilterCheckbox
