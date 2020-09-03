/** Meteors game(Метеориты, как сказал Ваня насчёт астероидов). 
 * TODO:
 * сделать маленькие корабли разведчики.
 * сделать так, чтобы большой метеорит стал планетой.
 * сделать такб чтобы корабль сталкивался с астероидами и толкал их, а разбивался если скорость очень большая, астероиды можно разбить и разрушить(в пыль) с помощью лазеров, но долго.
 * добавить гравитацию статичных объектов, гравитацию в каких-то областях(Круглые, прямоугольныеб треугольные, овальные(капсуло-образные(нет))).
 */

var ship;
var attractor;
// var lasers = [];
// var score = 0;
// var health = 3;
// const MAX_HEALTH = 3;
// const SHIP_EXPLODE_TIME = 0.3;
var SHOW_CENTER_CIRCLE = false; //const
var asteroids = [];
SelectedBall = null;
SHOW_BOUNDING = true; //show or hide collision bounding
var FPS = 60; //const
isMouseLeft = false;
isMouseRight = false;
var CollidingPairs = [];
var offset;
var startTime, endTime;
var maxDiff = 0;
var timeDiff;
var G = 0.000006;


function setup() {
  createCanvas(windowWidth, windowHeight);
  ship = new Ship();
  attractor = new Attractor(200, 200, 12000);
  // health = MAX_HEALTH;
  

  asteroids.push(new Asteroid(createVector(windowWidth * 0.25, windowHeight * 0.5), 30, createVector(0, -4)));
  asteroids.push(new Asteroid(createVector(windowWidth * 0.75, windowHeight * 0.5), 30, createVector(-1, 0)));
  asteroids.push(new Asteroid(createVector(windowWidth * 0.8, windowHeight * 0.15), 300, createVector(0.1, 0.1)));
  asteroids.push(ship);
  asteroids.push(attractor);
  
  for(var i = 0; i < 5; i++){
  asteroids.push(new Asteroid());
  }
  frameRate(FPS);
  // noCursor();
  
  console.log(CollidingPairs);
  // NewPair = [];
  // NewPair.push(new Asteroid(createVector(100, 100)));
  // SecondPair = [];
  // SecondPair.push(new Asteroid(createVector(100, 100)));
  // console.log(NewPair);
  // CollidingPairs.push(NewPair);
  // CollidingPairs.push(SecondPair);
}
  // CollidingPairs = [
  //   [5, 70]
  // ];
  
console.log(asteroids);

function draw() {
  
  startTime = performance.now();
  background(0);
  
  for (var i = 0; i < asteroids.length; i++) {
  //   if (ship.hits(asteroids[i])){
  //     health--;
  //     if(health > 0){
        
  //         ship = new Ship();
  //         console.log("NEW SHIP");
        
       
        
  //     }else {
  //       // ship.isDismiss = true;
  //       // ship.isExploding = true;
  //     }
      
  //     console.log("Ooops!")
    asteroids[i].update();
    asteroids[i].render();
    asteroids[i].edges();
    }
    
    
    // console.log(asteroids);
      //static collisions
  for (var i = 0; i < asteroids.length; i++) {
    for( var j = 0; j < asteroids.length; j++){
      if(i != j){
        if(DoCirclesOverlap(asteroids[i].pos.x, asteroids[i].pos.y, asteroids[i].r, asteroids[j].pos.x, asteroids[j].pos.y, asteroids[j].r)){
          //Collision has occured
          if(CollidingPairs.lengt > 0){
            for(k = 0; k < CollidingPairs.length; k++) {
              if(CollidingPairs[k] != [asteroids[i], asteroids[j]]){
              newPair = [asteroids[i], asteroids[j]];
              // console.log(asteroids[i]);
              CollidingPairs.push(newPair);
              console.log("Пары: " + CollidingPairs);
              console.log("Астероиды: " + asteroids);
              }
            };
          } else {
            newPair = [asteroids[i], asteroids[j]];
            CollidingPairs.push(newPair);
          }
          
          console.log(CollidingPairs);
          //Distance between ball centers
          var distance = Math.sqrt((asteroids[i].pos.x - asteroids[j].pos.x) * (asteroids[i].pos.x - asteroids[j].pos.x) + (asteroids[i].pos.y - asteroids[j].pos.y)*(asteroids[i].pos.y - asteroids[j].pos.y));
          var overlap = 0.5 * (distance - asteroids[i].r - asteroids[j].r);

          //Displace current ball
          asteroids[i].pos.x -= overlap * (asteroids[i].pos.x - asteroids[j].pos.x) / distance;
          asteroids[i].pos.y -= overlap * (asteroids[i].pos.y - asteroids[j].pos.y) / distance;
          
          //Displace target ball
          asteroids[j].pos.x += overlap * (asteroids[i].pos.x - asteroids[j].pos.x) / distance;
          asteroids[j].pos.y += overlap * (asteroids[i].pos.y - asteroids[j].pos.y) / distance;
          console.log("collision");
        }
      }
    }
  }
if(CollidingPairs.length > 0){
  for(i = CollidingPairs.length - 1; i >= 0; i--){
    b1 = CollidingPairs[i][0];
    b2 = CollidingPairs[i][1];

    //distance between balls
    distance = sqrt((b1.pos.x - b2.pos.x) * (b1.pos.x - b2.pos.x) + (b1.pos.y - b2.pos.y) * (b1.pos.y - b2.pos.y));

    //normal
    nx = (b2.pos.x - b1.pos.x) / distance;
    ny = (b2.pos.y - b1.pos.y) / distance;

    //tangent
    tx = -ny;
    ty = nx;

    //dot product tangent
    dpTan1 = b1.vel.x * tx + b1.vel.y * ty;
    dpTan2 = b2.vel.x * tx + b2.vel.y * ty;

    //dot product normal
    dpNorm1 = b1.vel.x * nx + b1.vel.y * ny;
    dpNorm2 = b2.vel.x * nx + b2.vel.y * ny;

    //conservation of momentum in 1D
    m1 = (dpNorm1 * (b1.mass - b2.mass) + 2 * b2.mass * dpNorm2) / (b1.mass + b2.mass);
    m2 = (dpNorm2 * (b2.mass - b1.mass) + 2 * b1.mass * dpNorm1) / (b1.mass + b2.mass);

    CollidingPairs[i][0].vel = createVector(tx * dpTan1 + nx * m1, ty * dpTan1 + ny * m1);
    CollidingPairs[i][1].vel = createVector(tx * dpTan2 + nx * m2, ty * dpTan2 + ny * m2);
  }
  
  for(i = CollidingPairs.length - 1; i >= 0; i--){
    // console.log(CollidingPairs);
    if(SHOW_BOUNDING){
      push()
      stroke(255, 127)
      strokeWeight(4);
      fill(50);
      line(CollidingPairs[i][0].pos.x, CollidingPairs[i][0].pos.y, CollidingPairs[i][1].pos.x, CollidingPairs[i][1].pos.y);
      pop();
    }
    if(!DoCirclesOverlap(CollidingPairs[i][0], CollidingPairs[i][1])){
      CollidingPairs.splice(i, 1);
    }
    // CollidingPairs.splice(i,1);
    // console.log("pairs exist");
    // console.log(CollidingPairs);
    
  }

  
}
 

  // for (var i = lasers.length - 1; i >= 0; i--) {
  //   lasers[i].render();
  //   lasers[i].update();
  //   if (lasers[i].offscreen()){
  //     lasers.splice(i, 1);
  //   } else {
  //   for (var j = asteroids.length - 1; j >= 0; j--) {
  //     if(lasers[i].hits(asteroids[j])){
  //       if(asteroids[j].r > 10){
  //         var newAsteroids = asteroids[j].breakup();
  //         asteroids = asteroids.concat(newAsteroids);
  //       }else{
  //         //increase the score
  //         //score++;
  //       }
  //       asteroids.splice(j, 1);
  //       lasers.splice(i, 1);
  //       score++;
  //       break;
  //     }
     
  //   }
  // }
  // }


  // console.log(lasers.length);

  
    // ship.render();
    ship.turn();
    // ship.update();
    // ship.edges();

 

    for(i = 0; i < asteroids.length; i++) {
      for(j = 0; j < asteroids.length; j++){
        if(asteroids[j] != asteroids[i]){
          asteroids[j].attract(asteroids[i]);
        }
      }
    }
  
  // if(asteroids.length == 0){
  //   gameover();
  // }
  // if(health <= 0){
  //   ship.isRender = false;
  //   gameover();
  // }
  
  // push();
  // textSize(35);
  // fill(255);
  // textAlign(CENTER, CENTER);
  // text(score, 40, 30); //Score counter
  // pop();

  //Health counter
  // push();
  // translate((MAX_HEALTH * 0.5 * ship.r) + (health * -ship.r * 0.5) + 0.5*ship.r + 10, 60);
  // for (i = 0; i < health; i++) {
  //   push();
  //   translate(ship.r * i, 0);
  //   fill(0);
  //   stroke(255);
  //   scale(0.4);
  //   triangle(-ship.r, ship.r, ship.r, ship.r, 0, -ship.r);
  //   pop();
  // }
  // pop()

  // console.log(isMouseLeft+ " Левая");

  if(isMouseLeft){
    if(SelectedBall != null){
      SelectedBall.pos = createVector(mouseX, mouseY);
      SelectedBall.pos.add(offset);
    }
  }
  // console.log(isMouseRight + " Правая");
  if(isMouseRight == true){
    if(SelectedBall != null){
      push();
      // stroke(200, 100, 0);
      // translate(SelectedBall.pos.x, SelectedBall.pos.y);
      drawArrow(createVector(mouseX, mouseY), createVector(SelectedBall.pos.x - mouseX, SelectedBall.pos.y - mouseY), "blue");
      pop();
    }
  }

  endTime = performance.now();
  var timeDiff = endTime - startTime; //in ms 
  timeDiff /= 1000; 
  push();
  textSize(35);
  fill(255);
  textAlign(CENTER, CENTER);
  text(timeDiff, 200, 30); //Elapsed time counter
  pop();
  if(timeDiff > maxDiff){
    maxDiff = timeDiff;
  }
  textSize(35);
  fill(255);
  text(maxDiff, 10, 80);
}

// function gameover(){
//   push();
//   textSize(windowWidth * 0.1);
//   fill(255);
//   stroke(0);
//   strokeWeight(4);
//   textAlign(CENTER, CENTER);
//   text("GAME OVER",0 , height/2, width);
//   pop();
// }


function keyReleased() {
  if (keyCode == RIGHT_ARROW) {
  ship.setRotation(0);
} else if (keyCode == LEFT_ARROW) {
  ship.setRotation(0);
} else if (keyCode == UP_ARROW) {
  ship.boosting(false);
}
if(keyCode == 32){ //space
  ship.isStopping = false;
}
}

function keyPressed() {
  // if(key == " "){
  //   if(ship.isExploding == false){
  //     lasers.push(new Laser(ship.pos, ship.heading));
  //   }
  // } else 
  if (keyCode == RIGHT_ARROW) {
    ship.setRotation(0.1);
  } else if (keyCode == LEFT_ARROW) {
    ship.setRotation(-0.1);
  } else if (keyCode == UP_ARROW) {
    ship.boosting(true);
  } else if (keyCode ==76){ //asteroid cheat 'L'
    asteroids.length = 0;
  } else if (keyCode ==114){ //turn bounding 'F3'
    SHOW_BOUNDING = !SHOW_BOUNDING;
    console.log(SHOW_BOUNDING);
    return false;
  };
  if(keyCode == 32){ //space
    ship.isStopping = true;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function drawArrow(base, vec, myColor) {
  push();
  stroke(myColor);
  strokeWeight(3);
  fill(myColor);
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  let arrowSize = 7;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}

function DoCirclesOverlap(x1, y1, r1, x2, y2, r2){
  return Math.abs((x1 - x2)*(x1-x2) + (y1 - y2)*(y1-y2)) <= (r1+r2)*(r1+r2);
};

function IsPointInCircle(x1, y1, r1, px, py){
  return Math.abs((x1 - px)*(x1-px) + (y1 - py)*(y1-py)) < (r1*r1);
};

// function mousePressed(){
//   if(mouseButton === LEFT){
//     console.log("LEFT_MOUSE_PRESSED");
//     for(i = 0; i < asteroids.length; i++){
//       if(IsPointInCircle(asteroids[i].pos.x, asteroids[i].pos.y, asteroids[i].r, mouseX, mouseY)){
//         SelectedBall = asteroids[i];
//         break;
//       };
//     };
//   };
// };
// function mouseMoved(){
//   console.log("MOUSE_MOVED");
//   if(SelectedBall != null){
//     SelectedBall.pos.x += movedX;
//     SelectedBall.pos.y += movedY;
//   }
// }

function mousePressed(){
  switch (mouseButton){
    case RIGHT:
      isMouseRight = true;
      break;
    case LEFT:
      isMouseLeft = true;
      break;
  };

  if(mouseButton === LEFT || mouseButton === RIGHT){
    for(i = 0; i < asteroids.length; i++){
      if(IsPointInCircle(asteroids[i].pos.x, asteroids[i].pos.y, asteroids[i].r, mouseX, mouseY)){
        SelectedBall = asteroids[i];
        offset = createVector(asteroids[i].pos.x - mouseX, asteroids[i].pos.y - mouseY);
      }
    }
  }
  // if(mouseButton === RIGHT){
  //   isMouseRight = true;
  // }
  // if(mouseButton === LEFT){
  //   isMouseLeft = true;
  // }
  
  return false;
}

function mouseReleased(){
  console.log("Выделенный " + SelectedBall.r);
  switch(mouseButton){
    case RIGHT:
      isMouseRight = false;
      if(SelectedBall != null){
        SelectedBall.acc.add(createVector(-(mouseX - SelectedBall.pos.x), -(mouseY - SelectedBall.pos.y)).div(FPS*4));
        SelectedBall = null;
      }
      break;
    case LEFT:
      isMouseLeft = false;
      SelectedBall = null;
      break;
  }

  // if(mouseButton === LEFT){
  //   isMouseLeft = false;
  //   SelectedBall = null;
  // }
  // if(mouseButton === RIGHT){
  //   SelectedBall.acc.add(createVector(-(mouseX - SelectedBall.pos.x).div(FPS*4), -(mouseY - SelectedBall.pos.y)).div(FPS*4) );
  //   isMouseRight = false;
  //   SelectedBall = null;
  // }
  return false; //предотвращение стандартной функции браузера не работает
}
