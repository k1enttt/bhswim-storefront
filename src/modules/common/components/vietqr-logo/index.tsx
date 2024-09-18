import Image from "next/image"
import React from "react"
import vietQrLogo from "../../../../../public/vietqr-logo.png"

const VietQRLogo = ({ size }: { size: number }) => {
  return <div className="flex items-center">
    <Image src={vietQrLogo} alt="VietQR" width={size} height={size/2} />
  </div>
}
export default VietQRLogo
