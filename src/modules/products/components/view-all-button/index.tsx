"use client"

import { faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const ViewAllButton = ({
  className,
}: {
  className?: string
}) => {
  return (
    <button
      onClick={() => {
        alert("Xem thêm")
      }}
      className="px-2 rounded-lg text-gray-500 flex items-center"
    >
      <span>Xem thêm</span>
      <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
    </button>
  )
}

export default ViewAllButton
