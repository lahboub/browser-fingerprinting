import { addNewLog, sha256 } from "../utils";

export async function getCanvasHash(logElement: HTMLElement): Promise<string> {


    const canvas = document.createElement("canvas")

    canvas.width = 240
    canvas.height = 60

    canvas.style.position = "fixed";
    canvas.style.border = "1px solid #000"
    // canvas.style.top = "-9999px";
    // canvas.style.left = "-9999px";
    // canvas.style.pointerEvents = "none";
    // canvas.style.opacity = "0";

    document.body.appendChild(canvas)

    const ctx = canvas.getContext("2d")

    if (!ctx) {
        addNewLog(logElement, "<canvas> ERROR: No 2D context available");
        canvas.remove();
        return "NoContext";
    }

    const emoji = String.fromCharCode(55357, 56835);
    const text = `Cwm fjordbank gly ${emoji}`;

    // === Basic Shapes ===
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#f60";
    ctx.fillRect(100, 1, 62, 20);

    ctx.fillStyle = "#000";
    ctx.fillRect(10, 25, 200, 2);

    // === Text + Shadow ===
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 2;

    ctx.fillStyle = "#069";
    ctx.font = '11pt "Times New Roman"';
    ctx.fillText(text, 2, 15);

    ctx.shadowColor = "transparent"; // reset shadow

    ctx.fillStyle = "rgba(102, 204, 0, 0.2)";
    ctx.font = "18pt Arial";
    ctx.fillText(text, 4, 45);

    // === Custom Pattern ===
    const patternCanvas = document.createElement("canvas");
    patternCanvas.width = patternCanvas.height = 10;
    const pCtx = patternCanvas.getContext("2d");

    if (pCtx) {
        pCtx.fillStyle = "#ccc";
        pCtx.fillRect(0, 0, 10, 10);
        pCtx.strokeStyle = "#666";
        pCtx.beginPath();
        pCtx.moveTo(0, 0);
        pCtx.lineTo(10, 10);
        pCtx.stroke();

        const pattern = ctx.createPattern(patternCanvas, "repeat");

        if (pattern) {
            ctx.fillStyle = pattern;
            ctx.fillRect(150, 30, 60, 20);
        }
    }

    // === Global Composite Operation ===
    ctx.globalCompositeOperation = "xor";
    ctx.fillStyle = "#f0f";
    ctx.beginPath();
    ctx.arc(180, 30, 10, 0, Math.PI * 2);
    ctx.fill();

    // Reset composite operation
    ctx.globalCompositeOperation = "source-over";



    const dataUrl1 = canvas.toDataURL("image/png")
    const dataUrl2 = canvas.toDataURL("image/png")

    // canvas.remove()

    if (dataUrl1 !== dataUrl2) {
        addNewLog(logElement, "<canvas> HASH   :  Not Reliable! toDataURL mismatch");
        return "";
    }

    const canvasHash = await sha256(dataUrl1)

    const newLog = `<canvas> HASH   :  ${canvasHash}`
    addNewLog(logElement, newLog)


    return canvasHash
}