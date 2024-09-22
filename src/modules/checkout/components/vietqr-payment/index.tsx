"use client"
import { RadioGroup } from "@headlessui/react"
import Radio from "@modules/common/components/radio"
import VietQRLogo from "@modules/common/components/vietqr-logo"
import { clx, Text } from "@medusajs/ui"

const VietQrPayment = ({
  isVietQr,
  handlePayment,
}: {
  isVietQr: boolean
  handlePayment: () => void
}) => {
  return (
    <RadioGroup.Option
      value="vietqr"
      className={clx(
        "flex flex-col gap-y-2 text-small-regular cursor-pointer py-4 border rounded-rounded px-8 mb-2 hover:shadow-borders-interactive-with-active",
        {
          "border-ui-border-interactive": isVietQr,
        }
      )}
      onClick={(event) => {
        event.preventDefault()
        handlePayment()
      }}
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
  )
}

export default VietQrPayment
