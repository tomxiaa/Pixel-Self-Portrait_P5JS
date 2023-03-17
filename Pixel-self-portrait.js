var video;
var snapshots = [];

let slider, button;
let c;
let pixHead, pixLeftEye, pixRightEye, pixNose, pixMouth, pixRandom;
let fs;

let bx, by;
let boxSize = 40;
let overBox = false;
let locked = false;
let xOffset = 0.0;
let yOffset = 0.0;

function setup() {
  c = createCanvas(460, 640);
  pixelDensity(1);
  video = createCapture(VIDEO);
  video.size(460, 340);
  video.hide();

  //create a slider for controlling pixelation from 2 to 10 pixel cells
  slider = createSlider(2, 10, 5, 1);
  slider.position(140, 320);
  slider.style("width", "180px");

  //create five buttons with facial elements emojis
  button1 = createButton("👁");
  button1.position(180, 140);
  button1.mousePressed(crop1);

  button2 = createButton("👁");
  button2.position(250, 140);
  button2.mousePressed(crop2);

  button3 = createButton("👃");
  button3.position(215, 180);
  button3.mousePressed(crop3);

  button4 = createButton("👄");
  button4.position(215, 225);
  button4.mousePressed(crop4);

  button5 = createButton("🧢");
  button5.position(215, 80);
  button5.mousePressed(crop5);

  button6 = createButton("﹖");
  button6.position(350, 140);
  button6.mousePressed(crop6);
  
  // button7 = createButton("screenshot");
  // button7.position(width/2-50,);
  // button7.mousePressed(fs);
}

//create 5 functions to capture facial elements areas
function crop1() {
  pixLeftEye = c.get(150, 110, 75, 50);
}
function crop2() {
  pixRightEye = c.get(230, 110, 75, 50);
}
function crop3() {
  pixNose = c.get(140, 165, 160, 40);
}
function crop4() {
  pixMouth = c.get(185, 225, 100, 55);
}
function crop5() {
  pixHead = c.get(140, 50, 180, 60);
}
function crop6() {
  pixRandom = c.get(350, 130, 40, 40);  
}
//define the crop6 initial location when it's snapshotted
bx = 350;
by = 470;


function draw() {
  background(200);
  //load video with pixels
  video.loadPixels();
  loadPixels();
  strokeWeight(0.1);

  //mirror camera horizontally *doesn't work due to mirrored everything on screen
  // translate(width,0);
  // scale(-1,1);

  let w = video.width;
  let h = video.height;
  let resol = slider.value();
  //pixel reading
  for (var y = 0; y < h; y += resol) {
    for (var x = 0; x < w; x += resol) {
      var index = (x + y * w) * 4;
      var r = video.pixels[index + 0];
      var g = video.pixels[index + 1];
      var b = video.pixels[index + 2];
      fill(r, g, b);
      rect(x, y, resol, resol);
    }
  }
  
  // draw a head profile for reference
  strokeWeight(1);
  stroke(255);
  noFill();
  ellipse(w / 2, h * 1.5, 180, 240);
  textSize(20);
  text('?', 365, 465);
  rect(350, 470,41,41);

  if (pixLeftEye) {
    snapshots.push(image(pixLeftEye, 160, 457, 75, 50));
  }
  if (pixRightEye) {
    snapshots.push(image(pixRightEye, 240, 457, 75, 50));
  }
  if (pixNose) {
    snapshots.push(image(pixNose, 140, 505, 180, 40));
  }
  if (pixMouth) {
    snapshots.push(image(pixMouth, 175, 545, 120, 65));
  }
  if (pixHead) {
    snapshots.push(image(pixHead, 140, 390, 180, 60));
  }
  if (pixRandom) {
    snapshots.push(image(pixRandom, bx, by, 40, 40));
  }
  //check if mouse position is inside of the Random box
  if(mouseX > bx - boxSize && 
     mouseX < bx + boxSize && 
     mouseY > by - boxSize && 
     mouseY < by + boxSize){
    overBox = true;
    if (!locked) { }
    } else {
      overBox = false;
    }
}

//if mouse is pressed when the cursor is inside the box, recalculate the distance between mouse position and the box top left corner
function mousePressed() {
  if(overBox) {
    locked = true;
  } else {
    locked = false;
  }
  xOffset = mouseX - bx;
  yOffset = mouseY - by;
}
//when mouse is dragging, lock the distance difference relationship, thus to move the box
function mouseDragged() {
  if (locked) {
    bx = mouseX - xOffset;
    by = mouseY - yOffset;
  }
}
function mouseReleased() {
  locked = false;
}

function keyPressed(){
  if (key == ' '){
    let fs = fullscreen();
    fullscreen(!fs);
  }
  if (key == '1'){
    saveCanvas(c, 'myCanvas', 'jpg');
  }
}
