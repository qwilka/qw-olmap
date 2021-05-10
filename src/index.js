/*
Copyright (C) 2021 Qwilka Limited - All Rights Reserved.
Proprietary and confidential.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Written by Stephen McEntee <apps@qwilka.com>, May 2021.
*/

import example_img from '../assets/example.png';
import './test.css';


if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => {
        console.log("Registered sw.js successfully.", reg);
      }).catch(err => {
        console.log("Failure sw.js not registered.", err);
      });   
}

console.log('Interesting!')

// Create a class property without a constructor
class Game {
    name = 'Violin Charades'
}

const myGame = new Game()
// Create paragraph node
const p = document.createElement('p')
p.textContent = `I like ${myGame.name}.`
p.setAttribute("class", "ybg");

// Create heading node
const heading = document.createElement('h1')
heading.textContent = 'Interesting!'

const img1 = document.createElement('img');
img1.setAttribute("id", "plimg");
img1.src = example_img
img1.alt = "img1"

const img2 = document.createElement('img');
//img2.setAttribute("id", "plimg");
img2.src = '/assets/vn-icon-152.png';
img2.alt = "img2"


// Append SVG and heading nodes to the DOM
const app = document.querySelector('#root')
app.append(heading, p, img1, img2)
