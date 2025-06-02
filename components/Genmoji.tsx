import Image from "next/image"
import { cn } from "@/lib/utils"

export type GenmojiName = 
  | "confident-teen-smile"
  | "cool-investor-teen"
  | "focused-learning-face"
  | "teen-thinking"
  | "dad-thumbs-up"
  | "graduation-money"
  | "happy-graduate"
  | "mind-blown-teen"
  | "mom-supportive"
  | "parent-approval"
  | "teen-girl-success"
  | "parent-peace-mind"
  | "parent-proud-face"
  | "piggy-bank-happy"
  | "proud-parent-smile"
  | "rocket-money"
  | "shocked-happy-parent"
  | "teen-focused"
  | "teen-girl-focused"
  | "teen-investor"
  | "teen-success"

interface GenmojiProps {
  name: GenmojiName
  size: number
  className?: string
}

export default function Genmoji({ name, size, className }: GenmojiProps) {
  return (
    <Image
      src={`/genmojis/${name}.png`}
      alt={name}
      width={size}
      height={size}
      className={cn("inline-block", className)}
      unoptimized
    />
  )
} 