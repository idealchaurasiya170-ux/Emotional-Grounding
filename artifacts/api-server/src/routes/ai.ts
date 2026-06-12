import { Router, type IRouter } from "express";
import OpenAI from "openai";

const router: IRouter = Router();

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set");
  return new OpenAI({ apiKey });
}

router.post("/ai/chat", async (req, res) => {
  const { message, history } = req.body as {
    message?: string;
    history?: { role: "user" | "assistant"; content: string }[];
  };

  if (!message?.trim()) {
    res.status(400).json({ error: "message is required" });
    return;
  }

  try {
    const openai = getClient();
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content:
          "You are HeartEcho's compassionate AI assistant, dedicated to helping families preserve and celebrate the life stories, wisdom, and legacies of their elders. Be warm, thoughtful, and encouraging. Keep replies concise (2-4 sentences unless more detail is requested).",
      },
      ...(Array.isArray(history) ? history : []),
      { role: "user", content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 512,
    });

    const reply = completion.choices[0]?.message?.content ?? "I'm unable to respond right now. Please try again.";
    res.json({ reply });
  } catch (err: unknown) {
    req.log.error(err, "OpenAI chat error");
    const isQuota =
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code?: string }).code === "insufficient_quota";
    res.status(500).json({
      error: isQuota
        ? "OpenAI quota exceeded. Please add billing credits at platform.openai.com → Billing."
        : "AI service unavailable. Please try again.",
      code: isQuota ? "insufficient_quota" : "service_error",
    });
  }
});

export default router;
