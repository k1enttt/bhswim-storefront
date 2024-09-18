import { RadioGroup } from "@headlessui/react"
import { InformationCircleSolid } from "@medusajs/icons"
import { PaymentSession } from "@medusajs/medusa"
import { Text, Tooltip, clx } from "@medusajs/ui"
import React from "react"

import Radio from "@modules/common/components/radio"

import PaymentTest from "../payment-test"
import FastDelivery from "@modules/common/icons/fast-delivery"

type PaymentContainerProps = {
  paymentSession: PaymentSession
  selectedPaymentOptionId: string | null
  disabled?: boolean
  paymentInfoMap: Record<string, { title: string; icon: JSX.Element }>
  isVietQr?: boolean
}

const MyPaymentContainer: React.FC<PaymentContainerProps> = ({
  paymentSession,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
  isVietQr = false,
}) => {
  const isDevelopment = process.env.NODE_ENV === "development"

  return (
    <>
      <RadioGroup.Option
        key={paymentSession.id}
        value={paymentSession.provider_id}
        disabled={disabled}
        className={clx(
          "flex flex-col gap-y-2 text-small-regular cursor-pointer py-4 border rounded-rounded px-8 mb-2 hover:shadow-borders-interactive-with-active",
          {
            "border-ui-border-interactive":
              selectedPaymentOptionId === paymentSession.provider_id && !isVietQr,
          }
        )}
      >
        <div className="flex items-center justify-between ">
          <div className="flex items-center gap-x-4">
            <Radio
              checked={selectedPaymentOptionId === paymentSession.provider_id && !isVietQr}
            />
            <FastDelivery size={40} />
            <div className="">
              <Text className="text-base-regular">
                {paymentInfoMap[paymentSession.provider_id]?.title ||
                  paymentSession.provider_id}
              </Text>
              <Text>Thanh toán khi nhận hàng</Text>
            </div>
          </div>
        </div>
      </RadioGroup.Option>
    </>
  )
}

export default MyPaymentContainer
