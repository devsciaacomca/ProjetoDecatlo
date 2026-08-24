import type { FormEvent } from "react";
import type { LoginErrors } from "@/utils/validation";

export type AuthenticationData = {
  usuario: string;
  senha: string;
  nome: string;
};

export type LoginMessage = { tipo: "sucesso" | "erro"; texto: string } | null;

export type LoginFormProps = {
  usuario: string;
  senha: string;
  erros: LoginErrors;
  mensagem: LoginMessage;
  carregando: boolean;
  onUsuarioChange: (value: string) => void;
  onSenhaChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};
