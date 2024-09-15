import { getRegion } from "@lib/data"
import ProductDetail from "@modules/products/templates/product-detail"
import { notFound } from "next/navigation"
import { getPricedProductByHandle } from "../products/[handle]/page"

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
    <div>
      <ProductDetail product={pricedProduct} region={region} />
    </div>
  )
}
