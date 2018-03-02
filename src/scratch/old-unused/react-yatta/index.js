import React, {Component} from 'react';
import blessed from 'blessed';
import {render} from 'react-blessed';

import Yatta from "./Yatta";

// Creating our screen
const screen = blessed.screen({
    autoPadding: false,
    smartCSR: true,
    dockBorders: true,
    title: 'Yatta'
});

// Adding a way to quit the program
screen.key(['escape', 'q', 'C-c'], function (ch, key) {
    return process.exit(0);
});

// Rendering the React app using our screen
const component = render(<Yatta/>, screen);

