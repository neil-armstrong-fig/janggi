/**
 * The longest a player's display name may be, in characters. Shared because both ends hold a name to this: the
 * webapp refuses a longer one before asking, and the API refuses it again, never trusting that the app did.
 */
export const DISPLAY_NAME_MAX_LENGTH = 24;
