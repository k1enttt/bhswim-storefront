"use client"

import { useEffect, useState } from "react"
import { RadioGroup } from "@headlessui/react"
import ErrorMessage from "@modules/checkout/components/error-message"
import { Cart } from "@medusajs/medusa"
import { CreditCard } from "@medusajs/icons"
import { clx, Container, Text, Tooltip } from "@medusajs/ui"

import Divider from "@modules/common/components/divider"
import Spinner from "@modules/common/icons/spinner"
import {
  createVietQRPaymentLink,
  setPaymentMethod,
  updatePaymentStatus,
} from "@modules/checkout/actions"
import { paymentInfoMap } from "@lib/constants"
import MyPaymentContainer from "../payment-container/my-index"
import Radio from "@modules/common/components/radio"
import VietQRLogo from "@modules/common/components/vietqr-logo"
import { PayOSConfig, usePayOS } from "payos-checkout"
import { useParams } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons"
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons"

const MyPayment = ({
  cart,
}: {
  cart: Omit<Cart, "refundable_amount" | "refunded_total"> | null
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isVietQr, setIsVietQr] = useState(
    !!cart?.shipping_address?.metadata?.isVietQRPayment
  )
  // These below variables are used for VietQR payment method
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [isCreatingLink, setIsCreatingLink] = useState(false)
  const countryCode = useParams().country_code || "vn"
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(
    cart?.shipping_address?.metadata?.isPaymentCompleted || false
  )

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const paymentReady =
    (cart?.payment_session && cart?.shipping_methods.length !== 0) ||
    paidByGiftcard

  const set = async (providerId: string) => {
    setIsLoading(true)
    await setPaymentMethod(providerId)
      .catch((err) => setError(err.toString()))
      .finally(async () => {
        if (providerId === "paypal") return
        if (providerId === "vietqr") {
          await handlePayment()
        } else {
          setIsLoading(false)
        }
      })
  }

  const handleChange = (providerId: string) => {
    setError(null)
    if (providerId == "vietqr") {
      setIsVietQr(true)
    } else {
      setIsVietQr(false)
      setIsOpen(false)
      exit()
    }
    set(providerId)
  }

  const onCheckoutSuccess = async () => {
    await updatePaymentStatus(true)
  }

  const [payOSConfig, setPayOSConfig] = useState<PayOSConfig>({
    RETURN_URL:
      typeof window !== "undefined"
        ? `${window.location.origin}/${countryCode}/checkout`
        : "", // required
    ELEMENT_ID: "embbed-checkout-form", // required
    CHECKOUT_URL: "", // required
    embedded: true, // Nếu dùng giao diện nhúng
    onSuccess: () => {
      setIsOpen(false)
      setIsPaymentSuccess(true)
      onCheckoutSuccess()
      setMessage("Thanh toán thành công")
    },
    onExit: () => {
      setIsOpen(false)
    },
    onCancel: () => {
      setIsOpen(false)
      setMessage("Thanh toán bị hủy")
    },
  })

  const { open, exit } = usePayOS(payOSConfig)

  const handlePayment = async () => {
    exit()
    setIsCreatingLink(true)

    const items = cart
      ? cart.items.map((item) => {
          return {
            name: item.title,
            quantity: item.quantity,
            price: item.total || 0,
          }
        })
      : []

    const response = await createVietQRPaymentLink({
      amount: 10000,
      description: "Thanh toan don hang",
      items: items,
    })

    setPayOSConfig((config) => ({
      ...config,
      CHECKOUT_URL: response.checkoutUrl,
    }))

    setIsOpen(true)
    setIsCreatingLink(false)
    setIsLoading(false)
  }

  useEffect(() => {
    if (payOSConfig.CHECKOUT_URL != "") {
      open()
    }
  }, [payOSConfig])

  useEffect(() => {
    if (!isPaymentSuccess && isVietQr && !isOpen && !isCreatingLink) {
      handlePayment()
    }
  }, [])

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <h2 className="heading-2">Hình thức thanh toán</h2>
      </div>
      <div>
        <div
          className={clx(
            isLoading || isPaymentSuccess
              ? "pointer-events-none opacity-50"
              : ""
          )}
        >
          {!paidByGiftcard && cart?.payment_sessions?.length ? (
            <>
              <RadioGroup
                value={
                  isVietQr ? "vietqr" : cart.payment_session?.provider_id || ""
                }
                onChange={(value: string) => handleChange(value)}
              >
                {cart.payment_sessions
                  .sort((a, b) => {
                    return a.provider_id > b.provider_id ? 1 : -1
                  })
                  .map((paymentSession) => {
                    return (
                      <MyPaymentContainer
                        paymentInfoMap={paymentInfoMap}
                        paymentSession={paymentSession}
                        key={paymentSession.id}
                        selectedPaymentOptionId={
                          cart.payment_session?.provider_id || null
                        }
                        isVietQr={isVietQr}
                      />
                    )
                  })}
                <RadioGroup.Option
                  value="vietqr"
                  className={clx(
                    "flex flex-col gap-y-2 text-small-regular cursor-pointer py-4 border rounded-rounded px-8 mb-2 hover:shadow-borders-interactive-with-active",
                    {
                      "border-ui-border-interactive": isVietQr,
                    }
                  )}
                >
                  <div className="flex items-center justify-between ">
                    <div className="flex items-center gap-x-4">
                      <Radio checked={isVietQr} />
                      <VietQRLogo size={60} />
                      <div className="">
                        <Text className="text-base-regular">VietQR</Text>
                        <Text>QR Code thanh toán qua ngân hàng</Text>
                      </div>
                    </div>
                  </div>
                </RadioGroup.Option>
              </RadioGroup>
            </>
          ) : paidByGiftcard ? (
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                Payment method
              </Text>
              <Text
                className="txt-medium text-ui-fg-subtle"
                data-testid="payment-method-summary"
              >
                Gift card
              </Text>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-4 py-16 text-ui-fg-base">
              <Spinner />
            </div>
          )}

          <ErrorMessage
            error={error}
            data-testid="payment-method-error-message"
          />
        </div>

        {message ? (
          <div className="text-green-600 border border-green-600 bg-green-100 rounded-lg p-2 w-full space-x-1">
            <FontAwesomeIcon icon={faCircleCheck} />
            <span>{message}</span>
          </div>
        ) : null}
        {isPaymentSuccess && (
          <div className="text-blue-700 border border-blue-700 bg-blue-100 rounded-lg p-2 w-full mt-2">
            <div className="flex items-start gap-1">
              <div>
                <FontAwesomeIcon icon={faCircleInfo} />
              </div>

              <div>
                Sau khi hoàn tất thanh toán, vui lòng <b>chờ 5-10 giây</b> để hệ
                thống cập nhật đơn hàng.
              </div>
            </div>
          </div>
        )}
        <div
          id="embbed-checkout-form"
          className={clx(
            (isOpen || isCreatingLink) && !isPaymentSuccess ? "h-[37em]" : ""
          )}
        >
          {!isOpen && isCreatingLink ? (
            <div className="h-full flex items-center justify-center">
              <Spinner size={40} />
            </div>
          ) : null}
        </div>

        <div>
          {cart && paymentReady && cart.payment_session ? (
            <div className="flex items-start gap-x-1 w-full">
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Phương thức thanh toán
                </Text>
                <Text
                  className="txt-medium text-ui-fg-subtle"
                  data-testid="payment-method-summary"
                >
                  {paymentInfoMap[cart.payment_session.provider_id]?.title ||
                    cart.payment_session.provider_id}
                </Text>
                {process.env.NODE_ENV === "development" &&
                  !Object.hasOwn(
                    paymentInfoMap,
                    cart.payment_session.provider_id
                  ) && (
                    <Tooltip content="You can add a user-friendly name and icon for this payment provider in 'src/modules/checkout/components/payment/index.tsx'" />
                  )}
              </div>
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Chi tiết thanh toán
                </Text>
                <div
                  className="flex gap-2 txt-medium text-ui-fg-subtle items-center"
                  data-testid="payment-details-summary"
                >
                  <Container className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
                    {paymentInfoMap[cart.payment_session.provider_id]?.icon || (
                      <CreditCard />
                    )}
                  </Container>
                </div>
              </div>
            </div>
          ) : paidByGiftcard ? (
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                Phương thức thanh toán
              </Text>
              <Text
                className="txt-medium text-ui-fg-subtle"
                data-testid="payment-method-summary"
              >
                Thẻ quà tặng
              </Text>
            </div>
          ) : null}
        </div>
      </div>
      
    </div>
  )
}

export default MyPayment
