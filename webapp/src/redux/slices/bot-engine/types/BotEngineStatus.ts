/**
 * Where the bot's engine has got to. It is not started until the bot is the opponent (`idle`), is being
 * fetched and given its threads (`loading`), can be searched (`ready`), or could not be started, or
 * stopped answering (`failed`).
 */
export type BotEngineStatus = "idle" | "loading" | "ready" | "failed";
