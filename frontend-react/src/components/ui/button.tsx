import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Plixa Design System — Button
 * ─────────────────────────────
 * Base radius: rounded-xl (12px) — matches card, input, badge radii.
 * Transition: colors + transform so hover feels alive.
 * Focus: uses ring-ring with 2px offset — accessible, on-brand blue.
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center whitespace-nowrap",
    "rounded-xl text-sm font-semibold tracking-tight",
    "transition-all duration-200 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-40",
    "active:-translate-y-px",
  ].join(" "),
  {
    variants: {
      variant: {
        // Primary — solid brand blue
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md",
        // Destructive
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        // Outline — border only, muted fill on hover
        outline:
          "border border-border bg-transparent text-foreground hover:bg-muted hover:border-primary/40",
        // Secondary — subtle filled
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/70",
        // Ghost — no border, subtle fill on hover
        ghost:
          "bg-transparent text-foreground hover:bg-muted hover:text-foreground",
        // Link
        link: "text-primary underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm:      "h-8 rounded-lg px-3 text-xs",
        lg:      "h-11 px-6 text-base",
        xl:      "h-12 px-8 text-base",
        icon:    "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
