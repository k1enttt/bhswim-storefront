"use client"

import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { clx } from "@medusajs/ui"
import { useRouter } from "next/navigation"

const BackButton = ({ size, className }: { size?: string, className?: string }) => {
  const router = useRouter()

  return (
    <button
      className={clx(
        `bg-gray-200 flex items-center justify-center px-1 rounded-lg`,
        size ? `w-[${size}] h-[${size}]` : "w-8 h-8",
        className
      )}
      onClick={() => router.back()}
    >
      <FontAwesomeIcon
        icon={faArrowLeft}
        className="text-black w-4 h-4"
      />
    </button>
  )
}

export default BackButton
