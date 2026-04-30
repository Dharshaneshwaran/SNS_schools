type LoadingButtonProps = {
  children: React.ReactNode;
  isLoading?: boolean;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function LoadingButton({
  children,
  isLoading = false,
  className = "",
  ...props
}: LoadingButtonProps) {
  return (
    <button
      {...props}
      className={`w-full rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
    >
      {isLoading ? "Please wait..." : children}
    </button>
  );
}
