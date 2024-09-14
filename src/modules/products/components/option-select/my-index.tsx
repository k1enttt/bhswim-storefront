import { ProductOption } from "@medusajs/medusa"
import { clx } from "@medusajs/ui"
import React from "react"

import { onlyUnique } from "@lib/util/only-unique"

type OptionSelectProps = {
  option: ProductOption
  current: string
  updateOption: (option: Record<string, string>) => void
  title: string
  disabled: boolean
  "data-testid"?: string
}

const MyOptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}) => {
  const filteredOptions = option.values.map((v) => v.value).filter(onlyUnique)

  return (
    <div className="flex flex-col gap-y-3">
      <span className="text-sm">Chọn {title}</span>
      <div
        className="flex flex-wrap justify-start gap-2"
        data-testid={dataTestId}
      >
        {filteredOptions.map((v) => {
          return (
            <button
              onClick={() => updateOption({ [option.id]: v })}
              key={v}
              className={clx("p-2 border rounded-md min-w-[40px]", (v === current ? "border-blue-500" : "bg-white border-gray-200"))}
              disabled={disabled}
              data-testid="option-button"
            >
              {v}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default MyOptionSelect
