import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import Slider from "@modules/common/components/slider"
import StarRating from "@modules/common/components/star-rating"
import { Region } from "@medusajs/medusa"
import Review from "@modules/products/components/review"
import ViewAllButton from "@modules/products/components/view-all-button"
import WriteReviewButton from "@modules/products/components/write-review-button"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import MyProductActions from "@modules/products/components/product-actions/my-index"
import MyProductActionsWrapper from "../product-actions-wrapper/my-index"

type ProductTemplateProps = {
  product: PricedProduct
  region: Region
  // countryCode: string
}

const ProductDetail: React.FC<ProductTemplateProps> = ({ product, region }) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <div className="space-y-4">
      <Slider images={product.images} />
      <div className="content-container space-y-4">
        <div>
          <div className="flex items-start justify-between">
            <h1 className="text-2xl flex-1 basis-0">{product.title}</h1>
          </div>
        </div>

        <Suspense
          fallback={
            <MyProductActions
              disabled={true}
              product={product}
              region={region}
            />
          }
        >
          <MyProductActionsWrapper id={product.id} region={region} />
        </Suspense>
        <div className="divider-line"></div>
        <div>
          <Overview content={product.description} />
        </div>
        <div className="divider-line"></div>
        <div>
          <Specifications product={product} />
        </div>
      </div>
    </div>
  )
}

export default ProductDetail

const Rating = () => {
  return (
    <div className="flex items-center gap-1">
      <StarRating score={3.7} />
      <span className="text-sm">161 đánh giá</span>
    </div>
  )
}

const Overview = ({ content }: { content?: string | null }) => {
  if (!content) {
    return null
  }

  return (
    <div className="space-y-2">
      <div className="heading-2">Tổng quát</div>
      <p className="normal-text">{content}</p>
    </div>
  )
}

const Specifications = ({ product }: { product: PricedProduct }) => {
  return (
    <div className="space-y-2">
      <div className="heading-2">Thông số kỹ thuật</div>
      <div className="grid grid-cols-2 gap-x-8">
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold">Chất liệu</span>
            <p>{product.material ? product.material : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">Xuất xứ</span>
            <p>{product.origin_country ? product.origin_country : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">Loại</span>
            <p>{product.type ? product.type.value : "-"}</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold">Cân nặng</span>
            <p>{product.weight ? `${product.weight} g` : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">Kích thước</span>
            <p>
              {product.length && product.width && product.height
                ? `${product.length}L x ${product.width}W x ${product.height}H`
                : "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const Reviews = () => {
  const reviewList = [
    {
      id: 1,
      userId: 1,
      username: "John Doe",
      rating: 4,
      title: "Sản phẩm rất tốt",
      content:
        "Sản phẩm vượt quá mong đợi của tôi. Rất khuyến khích cho mọi người đang tìm kiếm chất lượng và độ tin cậy.",
      createdAt: "12/9/2024",
    },
    {
      id: 2,
      userId: 2,
      username: "Jane Doe",
      rating: 3,
      title: "Sản phẩm không tốt",
      content:
        "Không hài lòng với sản phẩm. Nó không đáp ứng được mong đợi của tôi và có nhiều vấn đề.",
      createdAt: "12/9/2024",
    },
    {
      id: 3,
      userId: 3,
      username: "Alice Doe",
      rating: 5,
      title: "Sản phẩm rất tốt",
      content:
        "Sản phẩm tuyệt vời! Chất lượng và hiệu suất tuyệt hảo. Chắc chắn sẽ mua lại.",
      createdAt: "12/9/2024",
    },
  ]
  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between">
        <div>
          <div className="heading-2">Đánh giá</div>
          <Rating />
        </div>
        <div>
          <ViewAllButton />
        </div>
      </div>

      <div className="space-y-3">
        {reviewList.map((review) => (
          <Review key={review.id} review={review} />
        ))}
      </div>
      <div>
        <WriteReviewButton />
      </div>
    </div>
  )
}
