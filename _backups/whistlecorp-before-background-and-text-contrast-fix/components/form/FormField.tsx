"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type BaseProps = {
  label: string;
  error?: string;
  hint?: string;
  id: string;
};

type InputProps = BaseProps &
  React.InputHTMLAttributes<HTMLInputElement> & {
    as?: "input";
  };

type TextareaProps = BaseProps &
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    as: "textarea";
  };

type SelectProps = BaseProps &
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    as: "select";
    options: { value: string; label: string }[];
  };

type RadioProps = BaseProps & {
  as: "radio";
  name: string;
  value?: string;
  options: { value: string; label: string }[];
  onChange?: (value: string) => void;
  onBlur?: () => void;
};

type Props = InputProps | TextareaProps | SelectProps | RadioProps;

const inputClasses =
  "w-full rounded-lg border border-white/15 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 disabled:bg-white/[0.02] aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-500/30";

function FieldShell({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-[var(--color-text-strong)]"
      >
        {label}
      </label>
      {children}
      {hint && !error && (
        <p className="mt-1.5 text-xs text-[var(--color-text)]">{hint}</p>
      )}
      {error && (
        <p
          id={`${id}-error`}
          className="mt-1.5 text-xs font-medium text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export const FormField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  Props
>(function FormField(props, ref) {
  const { label, error, hint, id } = props;
  const ariaDescribedBy = error ? `${id}-error` : undefined;

  if (props.as === "textarea") {
    const {
      as: _as,
      id: _id,
      label: _label,
      error: _error,
      hint: _hint,
      ...rest
    } = props;
    void _as;
    void _id;
    void _label;
    void _error;
    void _hint;
    return (
      <FieldShell id={id} label={label} error={error} hint={hint}>
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          id={id}
          rows={4}
          aria-invalid={!!error}
          aria-describedby={ariaDescribedBy}
          className={cn(inputClasses, "resize-y")}
          {...rest}
        />
      </FieldShell>
    );
  }

  if (props.as === "select") {
    const {
      as: _as,
      id: _id,
      label: _label,
      error: _error,
      hint: _hint,
      options,
      ...rest
    } = props;
    void _as;
    void _id;
    void _label;
    void _error;
    void _hint;
    return (
      <FieldShell id={id} label={label} error={error} hint={hint}>
        <select
          ref={ref as React.Ref<HTMLSelectElement>}
          id={id}
          aria-invalid={!!error}
          aria-describedby={ariaDescribedBy}
          className={inputClasses}
          {...rest}
        >
          <option value="">Selecciona una opción</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </FieldShell>
    );
  }

  if (props.as === "radio") {
    const { name, value, options, onChange, onBlur } = props;
    return (
      <FieldShell id={id} label={label} error={error} hint={hint}>
        <div className="space-y-2" role="radiogroup" aria-invalid={!!error}>
          {options.map((o) => {
            const checked = value === o.value;
            return (
              <label
                key={o.value}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition-colors",
                  checked
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5"
                    : "border-[var(--color-border)] hover:bg-[var(--color-bg-alt)]"
                )}
              >
                <input
                  type="radio"
                  name={name}
                  value={o.value}
                  checked={checked}
                  onChange={(e) => onChange?.(e.target.value)}
                  onBlur={onBlur}
                  className="h-4 w-4 accent-[var(--color-accent)]"
                />
                <span className="text-[var(--color-text-strong)]">
                  {o.label}
                </span>
              </label>
            );
          })}
        </div>
      </FieldShell>
    );
  }

  const {
    as: _as,
    id: _id,
    label: _label,
    error: _error,
    hint: _hint,
    ...rest
  } = props;
  void _as;
  void _id;
  void _label;
  void _error;
  void _hint;
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <input
        ref={ref as React.Ref<HTMLInputElement>}
        id={id}
        aria-invalid={!!error}
        aria-describedby={ariaDescribedBy}
        className={inputClasses}
        {...rest}
      />
    </FieldShell>
  );
});
