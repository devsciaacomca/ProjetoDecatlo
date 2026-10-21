import { NextResponse } from "next/server";

// Importa o gerenciador singleton da máquina de quiz
const { quizMachine } = require("@/lib/quiz-machine-backend");

export async function GET() {
  try {
    return NextResponse.json(quizMachine.getStatus());
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { action, player, partidaId } = body;

    if (action === "press") {
      const result = quizMachine.triggerBuzzer(player || "P1", "api", partidaId);
      return NextResponse.json(result);
    }

    if (action === "reset") {
      const result = quizMachine.triggerReset("api", partidaId);
      return NextResponse.json(result);
    }

    return NextResponse.json(quizMachine.getStatus());
  } catch (error: any) {
    console.error("Erro no POST /api/quiz-machine:", error);
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}
