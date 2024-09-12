"use client"
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"

// Import Swiper styles
import "swiper/css"
import "swiper/css/pagination"

// import required modules
import { Pagination } from "swiper/modules"
import { Image as MedusaImage } from "@medusajs/medusa"
import Image from "next/image"

const Slider = ({ images }: { images?: MedusaImage[] }) => {
  if (!images) {
    return (
      <>
        <Swiper pagination={true} modules={[Pagination]} className="mySwiper">
          <SwiperSlide>Slide 1</SwiperSlide>
          <SwiperSlide>Slide 2</SwiperSlide>
          <SwiperSlide>Slide 3</SwiperSlide>
          <SwiperSlide>Slide 4</SwiperSlide>
          <SwiperSlide>Slide 5</SwiperSlide>
          <SwiperSlide>Slide 6</SwiperSlide>
          <SwiperSlide>Slide 7</SwiperSlide>
          <SwiperSlide>Slide 8</SwiperSlide>
          <SwiperSlide>Slide 9</SwiperSlide>
        </Swiper>
      </>
    )
  }

  return (
    <>
      <Swiper pagination={true} modules={[Pagination]} className="mySwiper">
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="w-full aspect-[1/1] rounded-lg overflow-hidden">
              <Image
                fill={true}
                src={image.url}
                alt={`Slide ${index}`}
                className="absolute inset-0 object-cover object-center"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}

export default Slider
