"use client"

import {
  useParams,
} from "next/navigation"
import { Cart, Customer } from "@medusajs/medusa"
import { Heading, useToggleState } from "@medusajs/ui"

import BillingAddress from "../billing_address"
import { setAddresses } from "../../actions"
import { useFormState } from "react-dom"
import ErrorMessage from "../error-message"
import compareAddresses from "@lib/util/compare-addresses"
import MyShippingAddress from "../shipping-address/my-index"
import { Dispatch } from "react"

const MyAddresses = ({
  cart,
  customer,
  formData, 
  setFormData,
}: {
  cart: Omit<Cart, "refundable_amount" | "refunded_total"> | null
  customer: Omit<Customer, "password_hash"> | null
  formData: any
  setFormData: Dispatch<any>
}) => {
  const params = useParams()

  const countryCode = params.countryCode as string

  const { state: sameAsSBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  )

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
            formData={formData}
            setFormData={setFormData}
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
          <ErrorMessage error={message} data-testid="address-error-message" />
        </div>
      </form>
    </div>
  )
}

export default MyAddresses
