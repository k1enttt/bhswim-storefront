"use client"

import { formatAmount } from "@lib/util/prices"
import { Cart, Customer } from "@medusajs/medusa"
import { useEffect, useState } from "react"
import MyAddresses from "../addresses/my-index"
import { useParams } from "next/navigation"
import {
  placeMyOrder,
  placeOrder,
  setMyAddresses,
  setShippingMethod,
} from "@modules/checkout/actions"
import { clx } from "@medusajs/ui"
import { PricedShippingOption } from "@medusajs/medusa/dist/types/pricing"

const CheckoutActions = ({
  cart,
  customer,
  availableShippingMethods,
}: {
  cart: Omit<Cart, "refundable_amount" | "refunded_total"> | null
  customer: Omit<Customer, "password_hash"> | null
  availableShippingMethods: PricedShippingOption[] | null
}) => {
  const params = useParams()
  const countryCode = params.countryCode as string
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    "shipping_address.first_name": cart?.shipping_address?.first_name || "",
    "shipping_address.address_1": cart?.shipping_address?.address_1 || "",
    email: cart?.email || "",
    "shipping_address.phone": cart?.shipping_address?.phone || "",
    "shipping_address.metadata": cart?.shipping_address?.metadata || {},
    // The below fields are not used, just let them be empty
    "shipping_address.last_name": cart?.shipping_address?.last_name || "",
    "shipping_address.company": cart?.shipping_address?.company || "",
    "shipping_address.postal_code": cart?.shipping_address?.postal_code || "",
    "shipping_address.city": cart?.shipping_address?.city || "",
    "shipping_address.country_code":
      cart?.shipping_address?.country_code || countryCode || "",
    "shipping_address.province": cart?.shipping_address?.province || "",
  })

  useEffect(() => {
    setFormData(formData => ({
      ...formData,
      "shipping_address.metadata": cart?.shipping_address?.metadata || {},
    }))
  }, [cart])

  if (!cart) {
    return null
  }

  const getAmount = (amount: number | null | undefined) => {
    return formatAmount({
      amount: amount || 0,
      region: cart.region,
      includeTaxes: false,
    })
  }

  const handlePayment = async (isCOD: boolean, isVietQr: boolean) => {
    try {
      await setMyAddresses(formData).then(async () => {
        if (
          !availableShippingMethods ||
          availableShippingMethods.length === 0
        ) {
          console.log("Không tồn tại phương thức vận chuyển")
          setIsLoading(false)
          return
        }
        if (!availableShippingMethods[0].id) {
          console.log("Không tồn tại phương thức vận chuyển")
          setIsLoading(false)
          return
        }
        await setShippingMethod(availableShippingMethods[0].id).then(
          async () => {
            const paymentId = isVietQr ? "vietqr" : isCOD ? "cod" : ""
            await placeMyOrder(paymentId)

            setIsLoading(false)
            return
          }
        )
      })
    } catch (error) {
      console.error(error)
      setIsLoading(false)
    }
  }

  const handleCheckout = () => {
    // Check if VietQR payment is completed
    const isVietQRCheckoutCompleted =
      cart.shipping_address?.metadata?.isPaymentCompleted == true

    // Check if COD payment is completed
    const isCODPaymentCompleted =
      !cart.shipping_address?.metadata?.isVietQRPayment &&
      cart.payment_session?.provider_id == "manual"

    // Check if payment is completed
    const isPaymentCompleted = !!(
      isCODPaymentCompleted || isVietQRCheckoutCompleted
    )

    if (!isPaymentCompleted) {
      console.log("Thanh toán chưa hoàn tất")
      return
    }

    // Check if shipping info is filled
    const isShippingInfoFilled = !!(
      formData["shipping_address.first_name"] &&
      formData["shipping_address.address_1"] &&
      formData.email &&
      formData["shipping_address.phone"]
    )

    if (!isShippingInfoFilled) {
      console.log("Chưa điền thông tin giao hàng")
      return
    }

    setIsLoading(true)
    handlePayment(isCODPaymentCompleted, isVietQRCheckoutCompleted)
  }

  

  return (
    <>
      <MyAddresses
        cart={cart}
        customer={customer}
        formData={formData}
        setFormData={setFormData}
      />
      <div className="fixed inset-x-0 w-full bottom-0 h-14 border-t border-t-gray-200 bg-white z-50 drop-shadow-lg">
        <div className="h-full w-full flex items-center justify-around">
          <div className="flex gap-1 items-end">
            <span>Tổng</span>
            <div className="text-red-500 text-2xl font-semibold text-end">
              {getAmount(cart.total || 0)}
            </div>
          </div>
          <div>
            <button
              className={clx(
                "w-[10em] h-[2em] text-white bg-red-500 rounded-lg",
                isLoading && "opacity-50 pointer-events-none"
              )}
              onClick={handleCheckout}
            >
              Thanh toán
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default CheckoutActions
