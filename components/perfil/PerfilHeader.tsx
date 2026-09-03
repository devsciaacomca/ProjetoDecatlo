interface PerfilHeaderProps {
  nome?: string | null;
}

export function PerfilHeader({ nome }: PerfilHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-xl font-semibold sm:text-2xl">Meu perfil</h1>

      <p className="mt-1 text-sm text-slate-500">
        {nome
          ? `Olá, ${nome}. Gerencie suas informações pessoais e credenciais de acesso.`
          : "Gerencie suas informações pessoais e credenciais de acesso."}
      </p>
    </div>
  );
}
