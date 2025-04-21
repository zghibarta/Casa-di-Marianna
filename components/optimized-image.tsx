import Image from "next/image"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  priority?: boolean
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = "",
  priority = false,
}: OptimizedImageProps) {
  return (
    <Image
      src={src || "/placeholder.svg"}
      alt="Serviciile Casa di Marianna"
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      fill={fill}
      className={className}
      priority={priority}
      sizes={fill ? "(max-width: 768px) 100vw, 50vw" : undefined}
      loading={priority ? "eager" : "lazy"}
    />
  )
}
