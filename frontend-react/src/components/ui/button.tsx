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
        // Primary — Solid Black/White for Clean UI
        default:
          "bg-primary text-primary-foreground shadow-sm hover:opacity-90 active:scale-[0.98]",
        // Brand — Solid Blue
        brand:
          "bg-[var(--brand-blue)] text-white shadow-sm hover:opacity-90 active:scale-[0.98]",
        // Destructive
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-[0.98]",
        // Outline — Border only
        outline:
          "border border-border bg-transparent text-foreground hover:bg-muted active:scale-[0.98]",
        // Secondary
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/70 active:scale-[0.98]",
        // Ghost
        ghost:
          "bg-transparent text-foreground hover:bg-muted active:scale-[0.98]",
        // Link
        link: "text-brand-blue underline-offset-4 hover:underline p-0 h-auto active:scale-100",
      },
      size: {
        default: "h-9 px-5 py-2",
        sm:      "h-8 rounded-lg px-3 text-[11px] font-bold uppercase tracking-wider",
        lg:      "h-11 px-8 text-sm",
        xl:      "h-12 px-10 text-base",
        icon:    "h-9 w-9 rounded-lg",
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
