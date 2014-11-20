Impressify
==========
Impressify.js is a visual interactive development environment (IDE) to create stunning Impress.JS presentations on HTML5 with CSS transformations and transitions. 

It is built on top of Impressionist beta created by Harish Sivaramakrishnan [@hsivaram](https://github.com/harish-io/Impressionist) and Impress.js created by Bartek Szopka [@bartaz](https://github.com/bartaz/impress.js/).

##Features
Impressify was built as a component to an e-learning platform. The collective features of Impressify are as follows:
* Upload existing MS Powerpoint decks onto the editor
* Edit the slides created, add native Impress slides, add text and standard styling components to the added text snippets
* Add audio, video, and images stored in databases onto slides
* Add pop quizes between slides in a module
* Add a custom timer to each slide to prevent the student from moving forward too fast

The above functionalities needed some changes in Impress.JS itself, namely:
* Control of the movement through the presentation. Forward clicks depend on the timer constraint set for each slide. Back clicks are allowed without any timer constraint. 
* When the slide contains a pop quiz, the presentation does not move forward until the user selects the right answer to the question. 

###Using Impressify
Each of the AJAX calls in impressify.JS in our original project GET, POST, PUT and DELETE to servlets in an MVC architecture. Each call has been supplemented with comments to give a better understanding of the input and output data to allow for easy plug and play of the editor with your applications. 

##Demo
A demonstration of the Impressify editor can be found [here](https://www.youtube.com/watch?v=lqi51H3Zx5g&list=UUOwKiIb6UZ4bIdhZwv-gNMA)

##About the Project

Impressify is released under the MIT license. 

Copyright 2014-2015 Ila Gokarn (@ilagokarn)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
