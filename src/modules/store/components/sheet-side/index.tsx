"use client"

import DualRangeSlider from "../dual-range-slider"

export function SheetSide({ close }: { close: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex bg-black/40 backdrop-blur-sm">
      <div className="h-full left-0 w-[62em] text-base bg-orange-100 space-y-2 p-2">
        <div className="w-full rounded-lg h-12 flex items-center justify-between bg-white p-4">
          <div className="text-xl">Filter</div>
          <button>Clear all</button>
        </div>
        <div className="relative w-full rounded-lg h-fit flex flex-col items-start justify-center bg-white p-4">
          <div className="text-lg">Mức giá</div>
          <div className="w-full flex items-center justify-between">
            <div>Từ: 0đ</div>
            <div>Đến: 1.000.000đ</div>
          </div>
          <div className="w-full">
            <DualRangeSlider
              min={0}
              max={9000000}
              step={10000}
              minDistance={1000000}
            />
          </div>
          <div className="flex items-center justify-between">
            <div></div>
            <div></div>
          </div>
        </div>
        <div className="w-full rounded-lg h-12 flex items-center justify-between bg-white p-4"></div>
        <div className="w-full rounded-lg h-12 flex items-center justify-between bg-white p-4"></div>
      </div>
      <button
        className="bg-blue-500 text-white h-fit aspect-square p-2 m-2"
        onClick={close}
      >
        Đóng
      </button>
    </div>
  )
}
