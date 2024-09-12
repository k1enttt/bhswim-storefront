"use client"
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { clx } from "@medusajs/ui"

const AddToWishlist = ({className}:{className?: string}) => {
  const handleClick = () => {
    alert("Added to wishlist")
  }

  return (
    <button className={clx("px-2 py-1 bg-gray-200 rounded-lg", className)} onClick={handleClick}>
        <FontAwesomeIcon icon={regularHeart} className="w-4 h-4" />
    </button>
  )
}

export default AddToWishlist
