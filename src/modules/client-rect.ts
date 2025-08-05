import { addNewLog, sha256 } from "../utils";

export async function getClientRectHash(logElement: HTMLElement): Promise<string> {
    const dimensions: [number, number, number][] = [
        [23.857, 54.32, 129.8974562],
        [22.444, 33.3, 39.8974562],
        [33.002, 5.3, 0.8974562],
        [22.684, 222.3, 99.8974562],
        [-5.4321, 8.888, 19.8974562],
        [1.00001, 0.00009, -83.215787]
    ];



    const hashs: string[] = []

    for (let i = 0; i < dimensions.length; i++) {
        const [skewX, skewY, skewZ] = dimensions[i];

        const el = document.createElement("div");

        el.textContent = `${skewX} x ${skewY}`;
        el.style.color = "#fff";
        el.style.paddingInline = "5px";
        el.style.backgroundColor = "#000";
        el.style.fontSize = "16px";
        el.style.top = "-9999px";
        el.style.left = "-9999px";
        el.style.zIndex = "";
        el.style.position = "absolute";
        el.style.visibility = "hidden";
        el.style.transform = `skewX(${skewX}deg) skewY(${skewY}deg) rotate(${skewZ}deg)`;

        document.body.appendChild(el);



        const rect = el.getBoundingClientRect();
        const hash = await sha256([
            rect.height,
            rect.width,
            rect.x,
            rect.y,
            rect.top,
            rect.right,
            rect.bottom,
            rect.left
        ]
            // .map(n => n.toFixed(5))
            .join('+'));

        hashs.push(hash)

        document.body.removeChild(el);
    }


    const fullHash = await sha256(hashs.join(""))

    const newLog = `ClientRect HASH   :  ${fullHash}` + "\n\n" + hashs.map((h, i) => `${i + 1} - ${h}`).join("\n");

    addNewLog(logElement, newLog)


    return fullHash;

}