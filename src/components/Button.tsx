import { cn } from "@/lib/utils";
import { HTMLMotionProps, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import React from "react";

const MotionLink = motion(Link);

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gradient";
  size?: "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  href?: string;
  target?: string;
}

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      href,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-full font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group cursor-pointer";

    const variants = {
      primary:
        "bg-white text-black hover:bg-gray-100 shadow-lg hover:shadow-xl hover:-translate-y-0.5",
      secondary:
        "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/10",
      outline:
        "bg-transparent border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40",
      ghost: "bg-transparent text-white hover:bg-white/5",
      gradient:
        "bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5",
    };

    const sizes = {
      sm: "text-xs px-4 py-2 gap-1.5",
      md: "text-sm px-6 py-3 gap-2",
      lg: "text-base px-8 py-4 gap-2.5",
      xl: "text-lg px-10 py-5 gap-3",
    };

    const content = (
      <>
        {/* Gradient overlay for primary/gradient buttons */}
        {(variant === "primary" || variant === "gradient") && (
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out z-10" />
        )}

        {isLoading && (
          <Loader2 className="w-4 h-4 mr-2 animate-spin relative z-20" />
        )}
        
        {!isLoading && leftIcon && (
          <span className="relative z-20 transition-transform group-hover:-translate-x-0.5">
            {leftIcon}
          </span>
        )}
        
        <span className="relative z-20">{children}</span>
        
        {!isLoading && rightIcon && (
          <span className="relative z-20 transition-transform group-hover:translate-x-0.5">
            {rightIcon}
          </span>
        )}
      </>
    );

    if (href) {
      return (
        <MotionLink
          href={href}
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={cn(baseStyles, variants[variant], sizes[size], className)}
          whileTap={{ scale: 0.98 }}
          {...(props as any)}
        >
          {content}
        </MotionLink>
      );
    }

    return (
      <motion.button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        whileTap={{ scale: 0.98 }}
        disabled={isLoading || disabled}
        {...props}
      >
        {content}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;
