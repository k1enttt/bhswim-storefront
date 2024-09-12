import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStar } from "@fortawesome/free-solid-svg-icons"

const StarRating = ({ score }: { score: number }) => {
  if (score < 0 || score > 5) {
    return null
  }
  const fullStars = Math.floor(score)
  const hasHalfStar = score % 1 !== 0
  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, index) => (
        <FontAwesomeIcon key={index} icon={faStar} className="text-[#f5d547] w-4 h-4" />
      ))}
      {hasHalfStar && (
        <div className="relative flex items-center">
          <FontAwesomeIcon icon={faStar} className="text-gray-300 w-4 h-4" />
          <div
            className="absolute top-0 left-0 overflow-hidden flex items-center"
            style={{ width: `${(score % 1) * 100}%` }}
          >
            <FontAwesomeIcon icon={faStar} className="text-[#f5d547] w-4 h-4" />
          </div>
        </div>
      )}
      {[...Array(5 - Math.ceil(score))].map((_, index) => (
        <FontAwesomeIcon key={index + fullStars + 1} icon={faStar} className="text-gray-300 w-4 h-4" />
      ))}
    </div>
  )
}
export default StarRating
