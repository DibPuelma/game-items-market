import { useState } from "react"

type status = {
  loading: boolean,
  error: boolean,
  success: boolean,
}

export default function useQueryStatus() {
  const [status, setStatus] =  useState<status>({
    loading: false,
    error: false,
    success: false,
  })

  const changeStatusAttribute = (attribute: keyof status, value: boolean) => {
    setStatus((oldValue) => ({ ...oldValue, [attribute]: value }))
  }

  const replaceStatus = (newStatus: status) => {
    setStatus(newStatus)
  }

  return {
    status,
    changeStatusAttribute,
    replaceStatus,
  }
}