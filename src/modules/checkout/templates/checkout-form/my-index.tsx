import {
  createPaymentSessions,
  getCustomer,
  listCartShippingMethods,
} from "@lib/data"
import { getCheckoutStep } from "@lib/util/get-checkout-step"
import MyItemsPreviewTemplate from "@modules/cart/templates/my-preview"
import MyAddresses from "@modules/checkout/components/addresses/my-index"
import MyDiscountCode from "@modules/checkout/components/discount-code/my-index"
import MyPayment from "@modules/checkout/components/payment/my-index"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { CartWithCheckoutStep } from "types/global"

export default async function MyCheckoutForm() {
  const cartId = cookies().get("_medusa_cart_id")?.value

  if (!cartId) {
    return null
  }

  // create payment sessions and get cart
  const cart = (await createPaymentSessions(cartId).then(
    (cart) => cart
  )) as CartWithCheckoutStep

  if (!cart) {
    return null
  }

  if (!cart?.items.length) {
    return notFound()
  }

  cart.checkout_step = cart && getCheckoutStep(cart)

  // get available shipping methods
  const availableShippingMethods = await listCartShippingMethods(cart.id).then(
    (methods) => methods?.filter((m) => !m.is_return)
  )

  if (!availableShippingMethods) {
    return null
  }

  // get customer if logged in
  const customer = await getCustomer()

  return (
    <div>
      <div className="w-full grid grid-cols-1 gap-y-8">
        <h1 className="heading-1">Xác nhận thanh toán</h1>
        <div className="mb-6">
          <h2 className="heading-2">Chi tiết đơn hàng</h2>
          <div>
            <MyItemsPreviewTemplate region={cart?.region} items={cart?.items} />
          </div>
        </div>
        <div className="mb-6 space-y-2">
          <h2 className="heading-2">Mã giảm giá</h2>
          <div>
            <MyDiscountCode cart={cart} />
          </div>
        </div>

        <div>
          <MyPayment cart={cart} />
        </div>

        <div className="mb-6">
          <MyAddresses cart={cart} customer={customer} />
        </div>
      </div>
    </div>
  )
}
