import Medusa from "@medusajs/medusa-js"
import PayOS from "@payos/node";

// Defaults to standard port for Medusa server
let MEDUSA_BACKEND_URL = "http://localhost:9000"

if (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
}

export const medusaClient = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  maxRetries: 3,
})

export const payOS = new PayOS(
  process.env.PAYOS_CLIENT_ID || "27259cc3-09e7-48bf-8043-b709a09c8a44",
  process.env.PAYOS_API_KEY || "ecff25dc-fe0c-46f0-8935-f50bf481927d",
  process.env.PAYOS_CHECKSUM_KEY || "6697b6e3e3de4e517f22208eadc4c53f591f15d90157a91e621afd4cdf578734"
);
