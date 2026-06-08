"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

function Form({
  form,
  className,
  ...props
}: React.ComponentProps<"form"> & { form?: unknown }) {
  void form
  return <form className={cn("space-y-4", className)} {...props} />
}

function FormField({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="form-field" className={cn("space-y-2", className)} {...props} />
}

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="form-item" className={cn("space-y-2", className)} {...props} />
}

function FormLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  return <Label data-slot="form-label" className={cn(className)} {...props} />
}

function FormControl({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="form-control" className={cn(className)} {...props} />
}

function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="form-message"
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    />
  )
}

export { Form, FormControl, FormField, FormItem, FormLabel, FormMessage }