declare global{
    interface String {
    capitalize(): string;
    replaceWithObject(params: { [key: string]: string }): string;
    replaceLinksInTextWithATags(): string;
    truncateWithEllipsis(maxLength: number): string;
    replaceLinksWithAHashTag(): string;
    // truncateWithEllipsisHastag(maxLength: number): string;
}
}
export {}