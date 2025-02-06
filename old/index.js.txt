const { exec } = require('child_process');
const { writeFileSync } = require('fs');
const args = process.argv.slice(2);
let bar;
let resArr = [];

function getOutput(output) {
  output = output
    .substring(0, output.indexOf('---'))
    .replace(/\n$/gm, '');
  output = output.substring(output.indexOf('time=') + 5);
  return +output.match(/([\d\.]*)/g)[0] || 0;
}

function log(error, stdout, stderr) {
  return getOutput(stdout);
}

class StatusBar {
  constructor(width, max) {
    this.width = width;
    this.max = max
  }
  equal(current, text = null) {
    const percent = current / this.max;
    let barStatus = Math.floor(this.width * percent);
    console.log(`${current}/${this.max}\t[${'='.repeat(barStatus)}${'-'.repeat(this.width - barStatus)}] ${(percent * 100).toFixed(2)}%${text !== null ? ` ${text}` : ''}`);
  }
}

function logIntroStatus() {
  console.log('Gathering data. This might take a moment...');
}

function pingLoop(num, time) {
  let resNum = 0;
  exec(`ping -c 1 ${args[0]}`, (error, stdout, stderr) => {
    resNum = log(error, stdout, stderr);
    resArr.push(resNum);
    console.clear();
    logIntroStatus();
    bar.equal(num, `(${resNum} ms)`);
    setTimeout(() => {
      if (num < time) {
        pingLoop(num+1, time);
      } else {
        const obj = { times: resArr };
        writeFileSync('output.json', JSON.stringify(obj));
        console.log('Done!');
        exec('npm run serve');
      }
    }, 1000);
  });
}

if (args[0]) {
  let time = 15;
  if (args[1]) {
    try {
      time = +args[1];
    } catch (e) { }
  }
  logIntroStatus();
  bar = new StatusBar(15, time);
  pingLoop(0, time);
} else {
  console.log('Invalid endpoint. Provide an endpoint as an argument.');
}
