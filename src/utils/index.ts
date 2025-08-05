export async function sha256(message: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}


export function addNewLog(logElement: HTMLElement, message: string) {
    const newLogEntry = document.createElement("p");
    newLogEntry.style.fontFamily = "monospace";
    newLogEntry.style.whiteSpace = "pre-wrap";
    newLogEntry.innerText = `${message} \n\n`;


    logElement.appendChild(newLogEntry)
}