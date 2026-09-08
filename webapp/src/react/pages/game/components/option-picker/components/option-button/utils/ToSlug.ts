/** A display name as a `data-testid` fragment: lower case, and spaces closed up into hyphens. */
export function toSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}
