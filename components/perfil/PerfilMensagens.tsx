import { CheckCircle2 } from "lucide-react";

interface PerfilMensagensProps {
  mensagem: string | null;
  erro: string | null;
}

export function PerfilMensagens({ mensagem, erro }: PerfilMensagensProps) {
  return (
    <>
      {mensagem && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-5 py-4">
          <CheckCircle2 size={20} className="shrink-0 text-green-600" />

          <p className="text-sm text-green-700">{mensagem}</p>
        </div>
      )}

      {erro && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4">
          <p className="text-sm text-red-700">{erro}</p>
        </div>
      )}
    </>
  );
}
