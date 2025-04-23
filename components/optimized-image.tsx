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
  // Convertim URL-ul Vercel Blob în URL relativ
  const convertedSrc = src.startsWith("https://nlcdtzvmqbp9oufz.public.blob.vercel-storage.com/")
    ? `/images/${src.split("/").pop()}`
    : src

  return (
    <Image
      src={convertedSrc || "/placeholder.svg"}
      alt={alt}
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
