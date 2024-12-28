export function generateAnthropicPrompt(
  userRoster: string,
  format?: string
): string {
  return `This is a user's team in a dynasty fantasy football league in ${format ?? 'QB 1RB 2WR 1TE 1K 5FLEX'} format: ${userRoster}.
     Could you recommend trades this user could make in the context of whether or not this user seems to be rebuilding or competing?`;
}
