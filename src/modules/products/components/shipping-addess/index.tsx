'use client'
import { faChevronDown } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react"

const ShippingAddress = () => {
  const addessList = [
    "Số 1 Hoa Phượng, Q.2, Q.Phú Nhuận (chi nhánh: Rạch Miễu)",
    "139 Lê Thị Riêng, P.Bến Thành, Q.1 (chi nhánh: Lê Thị Riêng)",
    "215A Lý Thường Kiệt, P.15, Q.11 (chi nhánh: Phú Thọ)",
    "110 Quốc Hương, Thảo Điền, Q.2 (chi nhánh: Thảo Điền)",
    "101 K1 Ngõ 12 Láng Hạ, Q.Ba Đình (chi nhánh: Hà Nội)",
  ]
  return (
    <div>
      <Disclosure>
        <span>Chọn địa điểm bạn muốn chuyển phát đến</span>
        <DisclosureButton className="group-data-[open]:rotate-180">
          <FontAwesomeIcon icon={faChevronDown} className="w-4 h-4 px-1" />
        </DisclosureButton>
        <DisclosurePanel className="text-gray-500 space-y-1 pt-1">
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

export default ShippingAddress
