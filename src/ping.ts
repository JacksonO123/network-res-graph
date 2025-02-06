import { $ } from "bun";

const args = process.argv.slice(2);
const statusBarLength = 15;
const argSeconds = +args[1];
const seconds = isNaN(argSeconds) ? 5 : argSeconds;
const endpoint = args[0] ?? "google.com";

let times: number[] = [];
const buf = Buffer.alloc(2048);

onInput();
const id = setInterval(onInput, 1000);

await $`ping -c ${seconds} ${endpoint} > ${buf}`.quiet();

function onInput() {
  const str = buf.toString();
  const lines = str
    .split("\n\n")[0]
    .split("\n")
    .slice(1)
    .filter((line) => !line.startsWith("\u0000"));

  times = lines
    .map((line) => line.slice(line.indexOf("time=") + 5, line.indexOf(" ms")))
    .map(Number);

  printProgress();

  if (times.length == seconds) endPing();
}

function endPing() {
  clearInterval(id);
  console.log("update output file");
  Bun.write("data/times.json", JSON.stringify({ times }));
}

function printProgress() {
  console.clear();
  const ratio = times.length / seconds;
  const percentage = ratio * 100;
  let bar = `pinging ${endpoint}\n`;
  bar += `${times.length}/${seconds} `;
  bar += renderBar(ratio) + " ";
  bar += percentage.toFixed(2) + "% ";
  bar += times.length > 0 ? times[times.length - 1] + "ms" : "loading...";
  console.log(bar);
}

function renderBar(t: number) {
  const numEquals = Math.floor(t * statusBarLength);
  return `[${"=".repeat(numEquals) + "-".repeat(statusBarLength - numEquals)}]`;
}
