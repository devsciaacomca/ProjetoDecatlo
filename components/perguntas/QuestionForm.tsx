"use client"

import { FormEvent, useEffect, useState } from "react"

import type {Pergunta} from "@/types/perguntas";



type QuestionFormProps = {
    pergunta?: Pergunta|null;
    modo?:"criacao" | "edicao";
    onCancel?: ()=> void;
    onSuccess?: ()=>void;
}

export default function QuestionForm({
    pergunta,
    modo="criacao",
    onCancel,
    onSuccess,
}:QuestionFormProps){
    const [enunciado,setEnunciado] = useState("");
    const [alternativas, setAlternativas] = useState(["","","",""]);
    const[respostaCorreta,setRespostaCorreta] = useState("");
    const [explicacao,setExplicacao] = useState("");
    const [salvando,setSalvando] = useState(false);
    const[erro, setErro] = useState("");

    useEffect(()=>{
        if(pergunta){
            // Este efeito hidrata o formulário quando a pergunta selecionada muda.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setEnunciado(pergunta.enunciado?? "");
            setAlternativas(
                pergunta.alternativas?.length?pergunta.alternativas.map((alternativa)=> alternativa.texto):["","","",""]);
            setRespostaCorreta(pergunta.respostaCorreta?? "")
            setExplicacao(pergunta.explicacao ?? "");

        }
    },[pergunta])

    const alterarAlternativa = (index: number, valor: string)=>{
        setAlternativas((atual)=>
        atual.map((alternativa, i)=>
        i === index ? valor : alternativa
        )
        )
    }

    const salvar = async (event:FormEvent)=>{
        event.preventDefault();

        setErro("")

        if(!enunciado.trim()){
            setErro("Informe o enunciado da pergunta.")
            return
        }
        if(alternativas.some((alternativa)=> !alternativa.trim())){
            setErro("Preencha todas as alternativas.");
            return
        }

        try{
            setSalvando(true)

            const dados = {
                enunciado,
                alternativas:alternativas.map((texto, index)=>({id:index + 1, texto,})),
                respostaCorreta,
                explicacao: explicacao.trim() || null,
            };

            const url = 
            modo ==="edicao" && pergunta?.id? `/api/perguntas/${pergunta.id}`:"/api/perguntas";

            const response = await fetch(url,{
                method:modo ==="edicao"? "PUT" : "POST",
                headers:{
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dados),
            })
            const resultado = await response.json().catch(()=>null);

            if(!response.ok){
                throw new Error(
                    resultado?.error || "Não foi possível salvar a pergunta."
                )
            }
            onSuccess?.();
        
        } catch(error){
            setErro(
                error instanceof Error? error.message: "Erro ao salvar a pergunta."
            )
        }finally{
            setSalvando(false)
        }   

    }
    return(
        <form onSubmit={salvar} className="space-y-5">
            {erro &&(
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {erro}
                </div>
            
            )}

            <div>
                <label className="mb-2 block text-sm font-semibold text-slate-200">
                    Enunciado
                </label>
            
                <textarea value={enunciado} onChange={(e)=> setEnunciado(e.target.value)} rows={4} placeholder="Digite o enunciado da pergunta ..." className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-400"/>
            </div>
            <div>
                <label className="mb-3 block text-sm font-semibold text-slate-200">
                    Alternativas
                </label>
                <div className="space-y-3">
                    {alternativas.map((alternativa, index)=>(
                        <div key={index} className="flex items-center gap-3">
                            <input type="radio" name="respostaCorreta" checked={respostaCorreta === alternativas[index]}
                            onChange={()=> setRespostaCorreta(alternativas[index])} className="h-4 w-4 accent-yellow-400"/>
                            <input type="text" value={alternativa} onChange={(e)=>alterarAlternativa(index, e.target.value)}
                            placeholder={`Alternativa ${String.fromCharCode(65 + index)}`} className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white outline-none trasition focus:border-yellow-400"/> 

                        </div>
                    ))}
                </div>
                <p className="mt-2 text-xs text-slate-500">
                    Selecione a alternativa correta.
                </p>
            </div>

            <div>
                <label className="mb-2 block-sm font-semibold text-slate-200">
                    Explicação
                </label>

                <textarea value={explicacao} onChange={(e)=> setExplicacao(e.target.value)} rows={3} placeholder="Digite uma explicação para a resposta ..." className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition facus:border-yellow-400"/>
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
                {onCancel &&(
                    <button type="button" onClick={onCancel} disabled={salvando} className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800">
                        Cancelar
                    </button>
                )}

                <button type="submit" disabled={salvando} className="rounded-lg bg-yellow-400 px-5 py-2 text-sm font-bold text-slate-950 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50">
                    {salvando?"Salvando...": modo ==="edicao"? "Salvar alterações": "Cadastrar Pergunta"}
                </button>
            </div>
        </form>
    )

}