type FooterProps = {
  variant?: "light" | "dark";
};

export default function Footer({ variant = "light" }: FooterProps) {
  const isDark = variant === "dark";

  return (
    <footer
      className={`border-t px-4 py-4 text-center ${
        isDark ? "border-white/10" : "border-slate-200"
      }`}
    >
      <p className={`text-xs ${isDark ? "text-white/40" : "text-slate-500"}`}>
        Sistema de Arguição — Decatlo
      </p>

      <p
        className={`mt-1 text-[10px] ${
          isDark ? "text-white/25" : "text-slate-400"
        }`}
      >
        Centro de Instrução Almirante Alexandrino • © {new Date().getFullYear()}
      </p>
    </footer>
  );
}
