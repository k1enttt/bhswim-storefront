'use client'
const WriteReviewButton = () => {
  return (
    <button className="w-full p-2 border rounded-lg"
    onClick={() => {
      alert("Viết đánh giá")
    }}>
      <div className="font-semibold">Viết đánh giá</div>
    </button>
  )
}

export default WriteReviewButton
