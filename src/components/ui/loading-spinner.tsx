import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg" | "xl"
}

const sizeClasses = {
  sm: "h-4 w-4",
  default: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12"
}

export function LoadingSpinner({ 
  size = "default", 
  className,
  ...props 
}: LoadingSpinnerProps) {
  return (
    <div 
      role="status" 
      className={cn("flex items-center justify-center", className)} 
      {...props}
    >
      <Loader2 
        className={cn(
          "animate-spin text-muted-foreground",
          sizeClasses[size]
        )} 
      />
      <span className="sr-only">Loading...</span>
    </div>
  )
}