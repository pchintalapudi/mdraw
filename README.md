# MDraw

---

## About

A molecule drawer inspired by ChemDraw and similar drawing software, featuring free-form curved arrows, automatic hydrogen insertion, lone pairs and free radical support, and a pseudo-3D mode (activated by pressing the D key).

Using the drawer begins by placing atoms on the drawing field. Simply select the element of choice, then click the atom button and place the atom somewhere on the drawing field. Creating bonds is achieved by clicking on an atom, which then creates a bond at a standard distance to a new atom with the currently selected element type, which is confirmed by clicking on empty space. To connect two already created atoms, simply creating a bond and clicking the target atom is sufficient. Adding lone pairs and free radicals follows the same principles. Curved arrows are formed by interpolating cubic Bezier curves between points added sequentially. The drawing surface can scroll when an atom, bond, lone pair, free radical, curved arrow, or a selection box is brought near an edge. Cut, copy, and paste are also supported, as is merging two atoms by dragging one on top of the other. Also, hydrogen atoms may be inferred by clicking the big lightbulb button, which follows some simple rules to cover the vast majority of cases where a hydrogen atom would appear.

---

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run dev
```

### Compiles and minifies for production

```
npm run build
```

### Run your tests

```
npm run test
```

### Lints and fixes files

```
npm run lint
```
