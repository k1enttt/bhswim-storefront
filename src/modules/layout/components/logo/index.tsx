import { clx } from "@medusajs/ui"

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <div className={clx("text-2xl font-bold text-center")}>Logo</div>
    </div>
  )
}

export default Logo
