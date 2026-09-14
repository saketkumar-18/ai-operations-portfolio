const { PNG } = require("pngjs");
const fs = require("fs");
for (const f of ["08_mobile.png", "09_nowebgl.png"]) {
  const png = PNG.sync.read(fs.readFileSync("shots/" + f));
  const { width, height, data } = png;
  let sum = 0, n = 0;
  for (let y = 0; y < height; y += 12)
    for (let x = 0; x < width; x += 12) {
      const i = (y * width + x) * 4;
      sum += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
      n++;
    }
  console.log(f, "meanLum", (sum / n).toFixed(1), "size", (fs.statSync("shots/" + f).size / 1024).toFixed(0) + "KB");
}
