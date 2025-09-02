import { PathConstants } from "../../Router/PathConstants";

if(typeof window !== "undefined"){
Object.defineProperty(String.prototype, 'capitalize', {
    value: function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    },
    enumerable: false
});

String.prototype.replaceWithObject = function(params: { [key: string]: string }): string {
    const regex = /:(\w+)/g;

    return this.replace(regex, (match, paramName) => {
        return params[paramName] !== undefined ? params[paramName] : match;
    });
};

String.prototype.replaceLinksWithAHashTag = function (): string {
    const urlRegex =/#[^\s#]*/g;
    
    return this.replace(urlRegex, (url) => {
        return `<a href="${PathConstants.HashTag.replaceWithObject({hashtag:url.replace(`#`,'')})}">${url}</a>`;
    });
};
String.prototype.replaceLinksInTextWithATags = function (): string {
    const urlRegex = /(?:https?|ftp):\/\/[^\s/$.?#].[^\s]*|www\.[^\s/$.?#].[^\s]*/gi;
    
    return this.replace(urlRegex, (url) => {
        return `<a href="${url}" target="_blank">${url}</a>`;
    });
};
String.prototype.truncateWithEllipsis = function (maxLength: number): string {
   
    if (this.length > maxLength) {
        return this.slice(0, maxLength - 3) + '...';
    }
    return this as string;
};
}

    // String.prototype.truncateWithEllipsisHastag = function (maxLength: number): string {
    //     const urlRegex =/#[^\s#]*/g;
    //     if (this.length > maxLength)
    //         {
    //             return this.slice(0, maxLength - 3) + '...';
               
    //         }
          
    //         return this.replace(urlRegex, (url) => {
    //             return `<a href="${PathConstants.HashTag.replaceWithObject({hashtag:url.replace(`#`,'')})}">${url}</a>`;
    //         });
    // };