import { cn } from "@/lib/utils";
import { gsap } from "gsap";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import React, { useRef } from "react";

interface ButtonProps
  extends Omit<
    React.HTMLAttributes<HTMLButtonElement | HTMLAnchorElement>,
    "children"
  > {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gradient";
  size?: "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  href?: string;
  target?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
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
      type,
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
    const elementRef =
      (ref as React.RefObject<HTMLButtonElement | HTMLAnchorElement>) ||
      internalRef;

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
        "gradient-animated text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5",
    };

    const sizes = {
      sm: "text-xs px-4 py-2 gap-1.5",
      md: "text-sm px-6 py-3 gap-2",
      lg: "text-base px-8 py-4 gap-2.5",
      xl: "text-lg px-10 py-5 gap-3",
    };

    const handleMouseDown = () => {
      if (elementRef.current) {
        gsap.to(elementRef.current, {
          scale: 0.98,
          duration: 0.1,
          ease: "power2.out",
        });
      }
    };

    const handleMouseUp = () => {
      if (elementRef.current) {
        gsap.to(elementRef.current, {
          scale: 1,
          duration: 0.2,
          ease: "power2.out",
        });
      }
    };

    const content = (
      <>
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
        <Link
          href={href}
          ref={elementRef as React.Ref<HTMLAnchorElement>}
          className={cn(baseStyles, variants[variant], sizes[size], className)}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={elementRef as React.Ref<HTMLButtonElement>}
        type={type || "button"}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        disabled={isLoading || disabled}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
