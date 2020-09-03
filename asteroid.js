function Asteroid(pos, d, vel, acc) {
  this.id = asteroids.length;
  if(d){
    this.r = d * 0.5;
  }else{
    this.r = random(15, 50);
  }
  this.mass = PI * this.r * this.r;

  if(pos){
    this.pos = pos.copy();
  } else {
    do{
      this.pos = createVector(random(width), random(height));
    } while(dist(ship.pos.x, ship.pos.y, this.pos.x, this.pos.y) < this.r * 2 + ship.r);
  }
  
  if(vel){
    this.vel = vel.copy();
  }else{
    this.vel = p5.Vector.random2D();
    this.vel.mult(random(0, 2));
  }

  if(acc){
    this.acc = acc.copy();
  }else{
    this.acc = createVector(0, 0);
  }
  

  
  this.total = floor(random(5, 15));
  this.offset = [];
  for (var i = 0; i < this.total; i++) {
    this.offset[i] = random(-this.r*0.5, this.r*0.5);
  }

  this.update = function(){
    // if(Math.abs((this.vel.x * this.vel.x) + (this.vel.y * this.vel.y)) < 0.01){
    //   this.vel.mult(0);
    // }

    // if(this.vel.x > 1){
    //   this.vel.x = 1;
    // }
    // if(this.vel.y > 1){
    //   this.vel.y = 1;
    // }
    // if(this.vel.x < -1){
    //   this.vel.x = -1;
    // }
    // if(this.vel.y < -1){
    //   this.vel.y = -1;
    // }
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    // var veloc = this.vel.copy();
    // this.acc = veloc.mult(-0.02); //переделать
    // this.acc.set(0, 0);
    
    this.acc.mult(0.8);
  }


  this.render = function() {
    push();
    stroke(255);
    noFill();
    translate(this.pos.x, this.pos.y)
    // ellipse(0, 0, this.r * 2)
    beginShape()
    for (var i = 0; i < this.total; i++) {
      var angle = map(i, 0, this.total, 0, TWO_PI);
      var r = this.r + this.offset[i];
      var x = r * cos(angle);
      var y = r * sin(angle);
      vertex(x, y);
    }
    endShape(CLOSE);
    if(SHOW_BOUNDING){
      stroke(0, 225, 0);
      noFill();
      ellipse(0, 0 , this.r * 2);
    }
    pop();
    if(SHOW_BOUNDING){
      velo = this.vel.copy();
      drawArrow(this.pos, velo.mult(FPS /* или this.r */), 'red'); //Показывает скорость относительно радиуса астероида, но лучше сделать относительно FPS, тоесть скорость пикселей в секунду и какое расстояние пройдёт астероид за секунду
      // push();
      // translate(this.pos.x, this.pos.y);
      // stroke('red');
      // strokeWeight(3);
      // line(0, 0, this.vel.x * this.r, this.vel.y * this.r);
      // pop();
    }

    // ellipse(this.pos.x, this.pos.y, this.r *2, this.r *2);
  }

  

  // this.breakup = function(){
  //   var newA = [];
  //   var newPosA = this.pos.copy();
  //   var newPosA = this.pos.copy();
  //   newA[0] = new Asteroid(newPosA.add(-(4 + this.r)), this.r);
  //   newA[1] = new Asteroid(newPosA.add(4 + this.r), this.r);
  //   return newA;
  // }

  this.edges = function() {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  }
//   this.hits = function(ast){
//     var d = dist(this.pos.x, this.pos.y, ast.pos.x, ast.pos.y);
//     if(d < this.r + ast.r){
//         return true;
//         console.log("HIT!");
//     } else {
//         return false;
//     }
// }

  this.applyForce = function(force) {
    let f = p5.Vector.div(force, this.mass);
    this.acc.add(f);
  }

  this.attract = function(body) {
    let force = p5.Vector.sub(this.pos, body.pos);
    let distanceSq = force.magSq();

    let strength = G * (this.mass * body.mass) / distanceSq;
    
    force.setMag(strength);

    body.applyForce(force);
  }
}
