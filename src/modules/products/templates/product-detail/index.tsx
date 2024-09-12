import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import Slider from "@modules/common/components/slider"
import StarRating from "@modules/common/components/star-rating"
import { Region } from "@medusajs/medusa"
import AddToWishlist from "@modules/products/components/add-to-wishlist"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCheck,
  faChevronDown,
  faTruck,
} from "@fortawesome/free-solid-svg-icons"
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react"
import { create } from "lodash"
import { title } from "process"
import Review from "@modules/products/components/review"
import ViewAllButton from "@modules/products/components/view-all-button"
import WriteReviewButton from "@modules/products/components/write-review-button"

type ProductTemplateProps = {
  product: PricedProduct
  region: Region
  // countryCode: string
}

const ProductDetail: React.FC<ProductTemplateProps> = ({ product, region }) => {
  // Tìm varient được chọn
  // Sau đó lấy giá của varient đó

  return (
    <div className="space-y-4">
      <Slider images={product.images} />
      <div className="space-y-4">
        <div>
          <div className="flex items-start justify-between">
            <h1 className="text-xl flex-1 basis-0">{product.title}</h1>
            <AddToWishlist className="" />
          </div>
          <Rating />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-end">
            <span className="text-2xl text-red-500 font-semibold">
              100.000 đ
            </span>
            <p>
              <span className="text-normal leading-7 text-gray-500 font-semibold line-through">
                120.000 đ
              </span>
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <InStockStatus />
          <DeliveryDate />
          <ShippingAddress />
        </div>
        <div className="divider-line"></div>
        <div>
          <Overview content={product.description} />
        </div>
        <div className="divider-line"></div>
        <div>
          <Specifications product={product} />
        </div>
        <div className="divider-line"></div>
        <div>
          <Reviews />
        </div>
        {/* Chỉ hiển thị Mobile Actions khi nút Thêm giỏ hàng khuất khỏi tầm nhìn */}
        {/* <MobileActions />  */}
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

const InStockStatus = () => {
  return (
    <div className="flex gap-1 items-center">
      <FontAwesomeIcon icon={faCheck} color="#70e000" className="w-5 h-5" />
      <div>
        <span>Trạng thái: </span>
        <span className="font-semibold">Còn hàng</span>
      </div>
    </div>
  )
}

const DeliveryDate = () => {
  return (
    <div className="flex gap-1 items-center">
      <FontAwesomeIcon icon={faTruck} color="#0077b6" className="w-5 h-5" />
      <div>
        <span>Thời gian vận chuyển: </span>
        <span className="font-semibold">8-12 ngày</span>
      </div>
    </div>
  )
}

const ShippingAddress = () => {
  const addessList = [
    "Số 1 Hoa Phượng, Q.2, Q.Phú Nhuận (chi nhánh: Rạch Miễu)",
    "139 Lê Thị Riêng, P.Bến Thành, Q.1 (chi nhánh: Lê Thị Riêng)",
    "215A Lý Thường Kiệt, P.15, Q.11 (chi nhánh: Phú Thọ)",
    "110 Quốc Hương, Thảo Điền, Q.2 (chi nhánh: Thảo Điền)",
    "101 K1 Ngõ 12 Láng Hạ, Q.Ba Đình (chi nhánh: Hà Nội)",
  ]
  return (
    <div className="">
      <Disclosure>
        <span>Chọn địa điểm bạn muốn chuyển phát đến</span>
        <DisclosureButton className="py-2">
          <FontAwesomeIcon icon={faChevronDown} className="w-4 h-4 px-1" />
        </DisclosureButton>
        <DisclosurePanel className="text-gray-500 space-y-1">
          {addessList.map((address, index) => (
            <label
              key={index}
              className="flex items-start gap-1 px-2 py-1 border rounded-lg"
            >
              <input
                type="radio"
                name="address"
                id={`address-${index}`}
                className="mt-1 h-4 w-4"
              />
              <span>{address}</span>
            </label>
          ))}
        </DisclosurePanel>
      </Disclosure>
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
