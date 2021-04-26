# Finite State Simulator (FSS)

![FSS CI](https://github.com/shailpatels/FSS/workflows/CI/badge.svg)

FSS is a program to quickly design Finite State Machines and later simulate them
Developed using the HTML canvas and native JavaScript

![example](cover_img.png)

## Usage

- Double-click to add a new state
- Left-click & drag to move a state/connection
- Shift + left-click to add a connection between states
- Right click to delete a state

- Enter a string as input for the FSM
- A string can be submitted multiple times
- Press step to simulate the FSM against the input
- Reset will reset the simulation

## Devloping

Clone and enter the FSS directory

Run

```bash
npm install
```

then

```bash
npx serve
```

to view the project on localhost, simply make your changes and refresh the browser to see them.

```bash
npm test
```

To run the jest test suit






