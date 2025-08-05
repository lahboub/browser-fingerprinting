import { getCanvasHash } from "./modules/canvas";
import { getClientRectHash } from "./modules/client-rect";

(async () => {


  const logsDiv = document.getElementById("logs");

  if (!logsDiv) {
    console.error("Missing #logs or #views elements.");
    return;
  }

  // Wait for layout flush
  await new Promise(r => requestAnimationFrame(r));

  await getClientRectHash(logsDiv)
  await getCanvasHash(logsDiv)


})();

