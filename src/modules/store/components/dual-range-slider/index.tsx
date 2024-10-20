"use client"
import * as React from "react"
import Slider from "@mui/material/Slider"
import { styled } from "@mui/material/styles"

const DualRangeSlider = ({
  min,
  max,
  step = 1,
  minDistance = 10,
}: {
  min: number
  max: number
  step?: number
  minDistance?: number
}) => {
  const [value1, setValue1] = React.useState<number[]>([0, 9000000])

  const handleChange1 = (
    event: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    if (!Array.isArray(newValue)) {
      return
    }

    if (activeThumb === 0) {
      setValue1([Math.min(newValue[0], value1[1] - minDistance), value1[1]])
    } else {
      setValue1([value1[0], Math.max(newValue[1], value1[0] + minDistance)])
    }
  }

  const CustomSlider = styled(Slider)({
    height: 10,
    "& .MuiSlider-thumb": {
      height: 20,
      width: 20,
      backgroundColor: "#fff",
      border: "2px solid currentColor",
    },
  })

  function formatPrice(value: number) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  } 

  return (
    <div className="w-full">
      <div className="px-2">
        <Slider
          min={min}
          max={max}
          step={step}
          getAriaLabel={() => "Minimum distance"}
          aria-label="slider"
          value={value1}
          onChange={handleChange1}
          valueLabelDisplay="auto"
          // getAriaValueText={(value: number) => `${value}°C`}
          valueLabelFormat={(value) =>
            `${formatPrice(value)}đ`
          }
          disableSwap
        />
      </div>

      <div className="w-full flex items-center justify-between">
        <div className="minValue">{formatPrice(value1[0])}</div>
        <div className="maxValue">{formatPrice(value1[1])}</div>
      </div>
    </div>
  )
}

export default DualRangeSlider
