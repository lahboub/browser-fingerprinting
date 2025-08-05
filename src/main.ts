(async () => {
  const dimensions: [number, number, number][] = [
    [23.857, 54.32, 129.8974562],
    [22.444, 33.3, 39.8974562],
    [33.002, 5.3, 0.8974562],
    [22.684, 222.3, 99.8974562],
    [-5.4321, 8.888, 19.8974562],
    [1.00001, 0.00009, -83.215787]
  ];

  const logsDiv = document.getElementById("logs");

  if (!logsDiv) {
    console.error("Missing #logs or #views elements.");
    return;
  }


  const hashs: string[] = []

  for (let i = 0; i < dimensions.length; i++) {
    const [skewX, skewY, skewZ] = dimensions[i];

    // }

    // for (const [skewX, skewY, skewZ] of dimensions ) {
    const el = document.createElement("div");

    el.textContent = `${skewX} x ${skewY}`;
    el.style.color = "#fff";
    el.style.paddingInline = "5px";
    el.style.backgroundColor = "#000";
    el.style.fontSize = "16px";
    el.style.top = "-9999px";
    el.style.left = "-9999px";
    el.style.zIndex = "";
    el.style.position = "absolute"; // ensure it's rendered off-layout but measurable
    el.style.visibility = "hidden"; // hide from user but still render
    el.style.transform = `skewX(${skewX}deg) skewY(${skewY}deg) rotate(${skewZ}deg)`;

    document.body.appendChild(el); // needs to be in DOM to render

    // Wait for layout flush
    await new Promise(r => requestAnimationFrame(r));

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
    ].map(n => n.toFixed(5)).join('+'));

    hashs.push(hash)

    console.log([hash.slice(0, 36)])

    const logEntry = document.createElement("pre");
    logEntry.style.fontFamily = "monospace";
    logEntry.style.whiteSpace = "pre-wrap";
    logEntry.innerText = `
|-------------------------------------------------|
| HASH ${i + 1} :  ${hash.slice(0, 36).toUpperCase()}  |
|-------------------------------------------------|
  transform: skewX(${skewX}), skewY(${skewY}), rotate(${skewZ})
  height:   ${rect.height.toFixed(5)}
  width:    ${rect.width.toFixed(5)}
  x:        ${rect.x.toFixed(5)}
  y:        ${rect.y.toFixed(5)}
  top:      ${rect.top.toFixed(5)}
  right:    ${rect.right.toFixed(5)}
  bottom:   ${rect.bottom.toFixed(5)}
  left:     ${rect.left.toFixed(5)}
`.trim();

    logsDiv.appendChild(logEntry);
    document.body.removeChild(el);
  }

  const fullHash = await sha256(hashs.join(""))

  const logEntry = document.createElement("pre");
  logEntry.style.fontFamily = "monospace";
  logEntry.style.whiteSpace = "pre-wrap";
  logEntry.innerText = `
Full HASH :   ${fullHash}
`.trim();

  if (logsDiv.firstChild) logsDiv.insertBefore(logEntry, logsDiv.firstChild)

})();

async function sha256(message: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
