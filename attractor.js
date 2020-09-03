class Attractor {
    constructor(x, y, m){
        this.pos = createVector(x, y);
        this.vel = createVector(1, 1);
        this.mass = m;
        this.r = sqrt(this.mass);
        this.acc = createVector(0, 0);
    }

    render() {
        fill(255);
        ellipse(this.pos.x, this.pos.y, this.r *2);

        if(SHOW_BOUNDING){
            velo = this.vel.copy();
            drawArrow(this.pos, velo.mult(FPS /* или this.r */), 'red');
        }
    }
    attract(body) {
        let force = p5.Vector.sub(this.pos, body.pos);
        console.log()
        let distanceSq = constrain(force.magSq(), 1, 10);
        console.log(force.magSq())

        let strength = G * (this.mass * body.mass) / distanceSq;
        
        force.setMag(strength);

        body.applyForce(force);
    }

    update() {
        var veloc = this.vel.copy();
        this.acc = veloc.mult(-1);
        
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        // this.acc.set(0, 0);

        this.acc.mult(0.8);

        

        // this.pos.x = windowWidth / 2;
        // this.pos.y = windowHeight / 2;
        // this.vel.set(0.1, 0.1);
    }
    edges() {
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
    applyForce(){
        
    }
}