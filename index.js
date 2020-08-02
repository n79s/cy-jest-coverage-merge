#!/usr/bin/env node
const fs = require("fs");
const path = require('path');
const { program } = require("commander");
program.version("1.0.0");

program
  .option("-c, --cypress <cypressJson>", "Cypress coverage json file path")
  .option("-j, --jest <jestJson>", "Jest coverage json file path")
  .option("-o, --output <outDir>", "Output file path")
  .parse(process.argv);


if (!program.cypress) {
  console.log("require --cypress=<path>");
  return;
}
if (!program.jest) {
  console.log("require --jest=<path>");
  return;
}
if (!program.output) {
  console.log("require --output=<path>");
  return;
}

if(!fs.existsSync(program.cypress))
{
    console.log(`cypress coverage json not exists : ${program.cypress}`)
    return;
}
if(!fs.existsSync(program.jest))
{
    console.log(`jest coverage json not exists : ${program.jest}`)
    return;
}

console.log(`Cypress: ${program.cypress}`)
console.log(`Jest   : ${program.jest}`)
console.log(`Output : ${program.output}`)

// cov1 must be Cypress
let cov1 = require(program.cypress);
let cov2 = require(program.jest);

//////////////////////////////////////////////////////////////////////////////////
// add not exists keys
for (let key in cov2) {
  if (!cov1[key]) {
    cov1[key] = cov2[key];
  }
}

//////////////////////////////////////////////////////////////////////////////////
// StatementMap
for (let key in cov1) {
  let maxKeyNum = Object.keys(cov1[key].statementMap).length;
  for (let skey1 in cov1[key].statementMap) {
    for (let skey2 in cov2[key].statementMap) {
      if (
        cov1[key].statementMap[skey1].start.line ===
        cov2[key].statementMap[skey2].start.line
      ) {
        if (cov2[key].s[skey2]) {
          cov1[key].s[skey1] += cov2[key].s[skey2];
        }
      }
    }
  }
  if (cov2[key]) {
    for (let skey2 in cov2[key].statementMap) {
      let isExists = false;
      for (let skey1 in cov1[key].statementMap) {
        if (
          cov1[key].statementMap[skey1].start.line ===
          cov2[key].statementMap[skey2].start.line
        ) {
          isExists = true;
          break;
        }
      }
      if (!isExists) {
        if (cov2[key].statementMap[skey2].start) {
          const newKey = String(maxKeyNum);
          cov1[key].statementMap[newKey] = cov2[key].statementMap[skey2];
          cov1[key].s[newKey] = cov2[key].s[skey2];
          maxKeyNum++;
        }
      }
    }
  }
}

//////////////////////////////////////////////////////////////////////////////////
// fnMap
for (let key in cov1) {
  let maxKeyNum = Object.keys(cov1[key].fnMap).length;
  for (let skey1 in cov1[key].fnMap) {
    for (let skey2 in cov2[key].fnMap) {
      if (
        cov1[key].fnMap[skey1].decl.start.line ===
          cov2[key].fnMap[skey2].decl.start.line &&
        cov1[key].fnMap[skey1].loc.end.line ===
          cov2[key].fnMap[skey2].loc.end.line
      ) {
        if (cov2[key].f[skey2]) {
          cov1[key].f[skey1] += cov2[key].f[skey2];
        }
      }
    }
  }
  if (cov2[key]) {
    for (let skey2 in cov2[key].fnMap) {
      let isExists = false;
      for (let skey1 in cov1[key].fnMap) {
        if (
          cov1[key].fnMap[skey1].decl.start.line ===
            cov2[key].fnMap[skey2].decl.start.line &&
          cov1[key].fnMap[skey1].loc.end.line ===
            cov2[key].fnMap[skey2].loc.end.line
        ) {
          isExists = true;
          break;
        }
      }
      if (!isExists) {
        if (cov2[key].fnMap[skey2].decl) {
          const newKey = String(maxKeyNum);
          cov1[key].fnMap[newKey] = cov2[key].fnMap[skey2];
          cov1[key].f[newKey] = cov2[key].f[skey2];
          maxKeyNum++;
        }
      }
    }
  }
}

//////////////////////////////////////////////////////////////////////////////////
// branchMap
for (let key in cov1) {
  let maxKeyNum = Object.keys(cov1[key].branchMap).length;
  for (let skey1 in cov1[key].branchMap) {
    for (let skey2 in cov2[key].branchMap) {
      if (
        cov1[key].branchMap[skey1].loc.start.line ===
          cov2[key].branchMap[skey2].loc.start.line &&
        cov1[key].branchMap[skey1].loc.end.line ===
          cov2[key].branchMap[skey2].loc.end.line &&
        cov1[key].branchMap[skey1].type === cov2[key].branchMap[skey2].type
      ) {
        if (cov2[key].b[skey2]) {
          cov1[key].b[skey1][0] += cov2[key].b[skey2][0];
          cov1[key].b[skey1][1] += cov2[key].b[skey2][1];
        }
      }
    }
  }
  if (cov2[key]) {
    for (let skey2 in cov2[key].branchMap) {
      let isExists = false;
      for (let skey1 in cov1[key].branchMap) {
        if (
          cov1[key].branchMap[skey1].loc.start.line ===
            cov2[key].branchMap[skey2].loc.start.line &&
          cov1[key].branchMap[skey1].loc.end.line ===
            cov2[key].branchMap[skey2].loc.end.line &&
          cov1[key].branchMap[skey1].type === cov2[key].branchMap[skey2].type
        ) {
          isExists = true;
          break;
        }
      }
      if (!isExists) {
        if (cov2[key].branchMap[skey2].type) {
          const newKey = String(maxKeyNum);
          cov1[key].branchMap[newKey] = cov2[key].branchMap[skey2];
          cov1[key].b[newKey] = cov2[key].b[skey2];
          maxKeyNum++;
        }
      }
    }
  }
}
// check
for (let key in cov1) {
  for (let skey1 in cov1[key].s) {
    if (!cov1[key].statementMap[skey1]) {
      console.log(`st : ${key}-${skey1}`);
    }
  }
  for (let skey1 in cov1[key].f) {
    if (!cov1[key].fnMap[skey1]) {
      console.log(`fn : ${key}-${skey1}`);
    }
  }
  for (let skey1 in cov1[key].b) {
    if (!cov1[key].branchMap[skey1]) {
      console.log(`br : ${key}-${skey1}`);
    }
  }
}

fs.writeFileSync(program.output, JSON.stringify(cov1));
