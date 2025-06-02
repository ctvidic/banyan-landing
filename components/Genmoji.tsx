import Image from "next/image"
import { cn } from "@/lib/utils"

type GenmojiName = 
  | "confident-teen-smile"
  | "proud-parent-smile"
  | "teen-thinking"
  | "teen-success"
  | "parent-approval"
  | "teen-focused"
  | "happy-graduate"
  | "teen-wink"
  | "teen-girl-confident"
  | "mom-supportive"
  | "teen-girl-success"
  | "dad-thumbs-up"
  | "teen-girl-focused"
  | "teen-boy-excited"
  | "parent-peace-mind"
  | "teen-girl-wink"
  // Old ones if they still exist
  | "teen-money-eyes"
  | "parent-proud-face"
  | "mind-blown-teen"
  | "cool-investor-teen"
  | "celebration-face"
  | "focused-learning-face"
  | "shocked-happy-parent"
  | "money-mouth-teen"

interface GenmojiProps {
  name: GenmojiName
  size?: number
  className?: string
}

export default function Genmoji({ name, size = 40, className }: GenmojiProps) {
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