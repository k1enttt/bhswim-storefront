import { getRegion } from "@lib/data"
import ProductDetail from "@modules/products/templates/product-detail"
import { notFound, useRouter } from "next/navigation"
import { getPricedProductByHandle } from "../(main)/products/[handle]/page"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"

export default async function ProductDetailPage({
  params: { countryCode, productId },
}: {
  params: { countryCode: string; productId: string }
}) {
  const region = await getRegion(countryCode)

  if (!region) {
    notFound()
  }

  const pricedProduct = await getPricedProductByHandle(productId, region)

  if (!pricedProduct) {
    notFound()
  }
  

  return (
    <div className="">
      <ProductDetail product={pricedProduct} region={region} />
    </div>
  )
}
