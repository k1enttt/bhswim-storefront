'use client'
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const Alert = ({ message, close }: { message: string, close: () => void }) => {
  return (
    <div className="bg-black/30 fixed inset-0 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col justify-center gap-4">

        <FontAwesomeIcon icon={faTriangleExclamation} size="3x" color="red"/>
        <div>{message}</div>
        <button className="w-full h-8 bg-blue-500 text-white rounded-lg" onClick={close}>
          OK
        </button>
      </div>
    </div>
  )
}

export default Alert
