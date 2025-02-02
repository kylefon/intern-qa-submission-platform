export function slugify(text: string) {
    return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
} // ex: Ollopa App -> ollopa-app

export function deslugify(slug: string) {
    return slug.replace(/-/g, " "); // Convert back to normal name
}
