import StarRating from "@modules/common/components/star-rating"

const Review = ({ review }: { review: any }) => {
  return (
    <div className="space-y-1 text-gray-500 font-semibold p-2 border rounded-lg">
      <StarRating score={review.rating} />
      <h3 className="heading-3">{review.title}</h3>

      <p>{review.content}</p>
      <div className="flex items-center gap-1">
        <span>{review.username}</span>
        {"-"}
        <div>{review.createdAt}</div>
      </div>
    </div>
  )
}

export default Review
