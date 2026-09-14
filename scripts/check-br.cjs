const { PNG } = require("pngjs");
const fs = require("fs");
for (const f of ["BR_plane.png", "BR_freefall.png", "BR_ground.png"]) {
  const p = "shots/" + f;
  if (!fs.existsSync(p)) { console.log(f, "MISSING"); continue; }
  const png = PNG.sync.read(fs.readFileSync(p));
  const { width, height, data } = png;
  let sum = 0, n = 0, olive = 0;
  for (let y = 0; y < height; y += 10)
    for (let x = 0; x < width; x += 10) {
      const i = (y * width + x) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      sum += 0.2126 * r + 0.7152 * g + 0.0722 * b;
      n++;
      if (g > r && g > b && g > 25) olive++;
    }
  console.log(f, "meanLum", (sum / n).toFixed(1), "olive", olive, ((sum / n) > 8 ? "✓" : "✗"));
}
