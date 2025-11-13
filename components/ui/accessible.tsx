import * as React from "react"

interface AccessibleProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * The component to render
   */
  as?: React.ElementType
  /**
   * The accessible name for the component
   */
  label?: string
  /**
   * The accessible description for the component
   */
  description?: string
  /**
   * The accessible role for the component
   */
  role?: React.AriaRole
  /**
   * The tab index for keyboard navigation
   */
  tabIndex?: number
  /**
   * Whether the component can be focused
   */
  focusable?: boolean
  /**
   * Whether the component is required
   */
  required?: boolean
  /**
   * The accessible error message
   */
  errorMessage?: string
  /**
   * Child elements
   */
  children: React.ReactNode
}

export function Accessible({
  as: Component = "div",
  label,
  description,
  role,
  tabIndex,
  focusable,
  required,
  errorMessage,
  children,
  ...props
}: AccessibleProps) {
  return (
    <Component
      {...props}
      role={role}
      tabIndex={focusable ? tabIndex ?? 0 : undefined}
      aria-label={label}
      aria-description={description}
      aria-required={required}
      aria-invalid={!!errorMessage}
      aria-errormessage={errorMessage}
    >
      {children}
    </Component>
  )
}

export function AccessibleList({
  as = "ul",
  label,
  children,
  ...props
}: AccessibleProps) {
  return (
    <Accessible
      as={as}
      label={label}
      role="list"
      {...props}
    >
      {children}
    </Accessible>
  )
}

export function AccessibleListItem({
  as = "li",
  children,
  ...props
}: AccessibleProps) {
  return (
    <Accessible
      as={as}
      role="listitem"
      {...props}
    >
      {children}
    </Accessible>
  )
}

export function AccessibleButton({
  as = "button",
  label,
  children,
  ...props
}: AccessibleProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Accessible
      as={as}
      label={label}
      role="button"
      tabIndex={0}
      focusable
      {...props}
    >
      {children}
    </Accessible>
  )
}

export function AccessibleForm({
  as = "form",
  label,
  children,
  ...props
}: AccessibleProps & React.FormHTMLAttributes<HTMLFormElement>) {
  return (
    <Accessible
      as={as}
      label={label}
      role="form"
      {...props}
    >
      {children}
    </Accessible>
  )
}

export function AccessibleInput({
  label,
  description,
  required,
  errorMessage,
  ...props
}: AccessibleProps & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div role="group" aria-labelledby={`${props.id}-label`}>
      {label && (
        <label
          id={`${props.id}-label`}
          htmlFor={props.id}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        {...props}
        aria-describedby={
          description || errorMessage
            ? `${props.id}-description ${props.id}-error`
            : undefined
        }
        aria-required={required}
        aria-invalid={!!errorMessage}
      />
      {description && (
        <p
          id={`${props.id}-description`}
          className="mt-1 text-sm text-gray-500"
        >
          {description}
        </p>
      )}
      {errorMessage && (
        <p
          id={`${props.id}-error`}
          className="mt-1 text-sm text-red-500"
        >
          {errorMessage}
        </p>
      )}
    </div>
  )
}