"use client"

import {
  useSearchParams,
  useRouter,
  usePathname,
  useParams,
} from "next/navigation"
import { Cart, Customer } from "@medusajs/medusa"
import { CheckCircleSolid } from "@medusajs/icons"
import { Heading, Text, useToggleState } from "@medusajs/ui"

import Divider from "@modules/common/components/divider"
import Spinner from "@modules/common/icons/spinner"

import BillingAddress from "../billing_address"
import ShippingAddress from "../shipping-address"
import { setAddresses } from "../../actions"
import { SubmitButton } from "../submit-button"
import { useFormState } from "react-dom"
import ErrorMessage from "../error-message"
import compareAddresses from "@lib/util/compare-addresses"
import MyShippingAddress from "../shipping-address/my-index"

const MyAddresses = ({
  cart,
  customer,
}: {
  cart: Omit<Cart, "refundable_amount" | "refunded_total"> | null
  customer: Omit<Customer, "password_hash"> | null
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()

  const countryCode = params.countryCode as string

  const isOpen = searchParams.get("step") === "address"

  const { state: sameAsSBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  )

  const handleEdit = () => {
    router.push(pathname + "?step=address")
  }

  const [message, formAction] = useFormState(setAddresses, null)

  return (
    <div className="bg-white">
      <div className="mb-6">
        <h2 className="heading-2">Thông tin đặt hàng</h2>
      </div>
      <form action={formAction}>
        <div className="pb-8">
          <MyShippingAddress
            customer={customer}
            countryCode={countryCode}
            checked={sameAsSBilling}
            onChange={toggleSameAsBilling}
            cart={cart}
          />

          {!sameAsSBilling && (
            <div>
              <Heading
                level="h2"
                className="text-3xl-regular gap-x-4 pb-6 pt-8"
              >
                Billing address
              </Heading>

              <BillingAddress cart={cart} countryCode={countryCode} />
            </div>
          )}
          <SubmitButton className="mt-6" data-testid="submit-address-button">
            Continue to delivery
          </SubmitButton>
          <ErrorMessage error={message} data-testid="address-error-message" />
        </div>
      </form>
      <Divider className="mt-8" />
    </div>
  )
}

export default MyAddresses
