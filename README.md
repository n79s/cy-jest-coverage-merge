# Cypress + Jest Coverage Merge

## Install

```bash
git clone aaaaa
cd aaaa
npm install -g

# uninstall
npm uninstall -g
```

## Usage

```bash
cj-merge -c ./cypress-output.json -j ./jest-output.json -o ./merge-cov/merge-output.json
```

make report sample.

```bash
nyc -t ./merge-cov report --reporter=html
```

