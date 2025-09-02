export function copyToClipboard(text: string): void {
    if (typeof document !== 'undefined') {
        const textarea = document.createElement('textarea');
        textarea.value = text;

        // Make sure to make the textarea out of the viewport
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';

        document.body.appendChild(textarea);

        // Select and copy the text
        textarea.select();
        document.execCommand('copy');

        // Clean up
        document.body.removeChild(textarea);
    }
}