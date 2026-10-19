"use client";

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  as?: "input" | "textarea";
  rows?: number;
  autoComplete?: string;
  min?: string;
};

const inputClasses =
  "w-full rounded-xl border border-line-dark bg-graphite px-4 py-3 text-sm text-white placeholder:text-muted-dark/70 transition-colors focus:border-lime focus:outline-none focus-visible:ring-2 focus-visible:ring-lime/30";

export function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  required,
  as = "input",
  rows = 4,
  autoComplete,
  min,
}: FieldProps) {
  const id = `field-${name}`;
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-dark">
        {label}
        {required ? <span className="text-lime"> *</span> : null}
      </label>
      {as === "textarea" ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={rows}
          required={required}
          aria-required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={inputClasses}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
          aria-required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          autoComplete={autoComplete}
          min={min}
          className={inputClasses}
        />
      )}
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}
