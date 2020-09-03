function Ship() {
  this.pos = createVector(width / 2 - 200, height / 2 - 200);
  this.r = 20;
  this.mass = PI * this.r * this.r;
  this.heading = -PI / 2;
  this.rotation = 0;
  this.vel = createVector(0, -6);
  this.acc = createVector(0, 0);
  this.isBoosting = false;
  this.isStopping = false;
  // this.isDismiss = false;
  // this.explodeTime = 0;
  // this.isExploding = false;
  // this.isRender = true;

  this.boosting = function(b) {
    this.isBoosting = b;
  }


  this.update = function() {
    // if(this.explodeTime > 0) {
    //   this.isExploding = true;
    // }
    if (this.isBoosting) {
      this.boost();
    }

    // if(Math.abs((this.vel.x * this.vel.x) + (this.vel.y * this.vel.y)) < 0.01){
    //   this.vel.mult(0);
    // }

    // if(this.vel.x > 10){
    //   this.vel.x = 10;
    // }
    // if(this.vel.y > 10){
    //   this.vel.y = 10;
    // }
    // if(this.vel.x < -10){
    //   this.vel.x = -10;
    // }
    // if(this.vel.y < -10){
    //   this.vel.y = -10;
    // }
    // if(!this.isExploding){
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.mult(0);

      if(this.isStopping == true){
        var veloc = this.vel.copy();
        this.acc = veloc.mult(-0.05);
        console.log("WORKING");
      }
    // }
    // this.vel.mult(0.99);
    // this.explodeTime--;
  }

  
  this.boost = function() {
    // if(!this.isExploding){
      var force = p5.Vector.fromAngle(this.heading);
      force.mult(0.1);
      this.vel.add(force);
    // }
    
  }

// this.hits = function(asteroid){
//   var d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y)
//   if(d < this.r + asteroid.r){
//     this.explode;
//     return true;
    
//   } else {
//     return false;
//   }
// }

  // this.explode = function() {
  //   this.explodeTime = Math.ceil(SHIP_EXPLODE_TIME * FPS);
  // }

  this.render = function() {
    // if(this.isRender == true){
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading + PI / 2);
    // if(this.isExploding == false){
      push();
      fill(25);
      stroke(255);
      triangle(-this.r, this.r, this.r, this.r, 0, -this.r);
      push()
      translate(-this.r, this.r);
      leftTail = createVector(-this.r * 0.5, this.r);
      leftTail.mult(0.4);
      line(0, 0, leftTail.x, leftTail.y);
      pop();

      push()
      translate(this.r, this.r);
      rightTail = createVector(this.r * 0.5, this.r);
      rightTail.mult(0.4);
      line(0, 0, rightTail.x, rightTail.y);
      pop();
      
      if(SHOW_CENTER_CIRCLE == true){
        ellipse(0, 0, this.r * 0.5);
        console.log("RENDER");
      }
      pop();
      if(this.isBoosting == true){
      push();
      // translate(this.pos.x, this.pos.y);
      // rotate(this.heading + PI / 2);
      fill(50);
      stroke(255);
      triangle(-this.r * 0.5, this.r, this.r * 0.5, this.r, 0, this.r*2);
      pop();
      console.log(this.isBoosting);
      }
      
    // } else {
    //   push();
    //   noStroke();
    //   scale(1.5);
    //   fill(139, 0, 0);
    //   ellipse(0, 0 , this.r * 1.7);
    //   fill(255, 0, 0);
    //   ellipse(0, 0 , this.r * 1.4);
    //   fill(255, 165, 0);
    //   ellipse(0, 0 , this.r * 1.1);
    //   fill(255, 255, 0);
    //   ellipse(0, 0 , this.r * 0.8);
    //   fill(255, 255, 255);
    //   ellipse(0, 0 , this.r * 0.5);
    //   pop();
    // }
    pop();
  
  if(SHOW_BOUNDING){
    push();
    translate(this.pos.x, this.pos.y);
    stroke(0, 225, 0);
    noFill();
    ellipse(0, 0 , this.r * 2);
    pop();
    drawArrow(this.pos, this.vel.copy().mult(FPS), "red"); 
  }
}

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


  this.setRotation = function(a) {
    this.rotation = a
  }

  this.turn = function() {
    this.heading += this.rotation;
  }
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