"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

type FloatingDownloadButtonProps = {
  href?: string
  label?: string
}

export function FloatingDownloadButton({ href = "/downloads/village-vitals.apk", label = "Download" }: FloatingDownloadButtonProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button asChild size="lg" className="shadow-lg">
        <Link href={href} download>
          <Download className="w-4 h-4 mr-2" />
          {label}
        </Link>
      </Button>
    </div>
  )
}
