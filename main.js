title = "Rad-Crunch";

description = `
[Mouse] Move
[Tap] Change Shooting Direction
`;

// Define pixel arts of characters
// Each letter represents a pixel color
// l - Black    L - Light Black
// r - Red      R - Light Red
// g - Green    G - Light Green
// b - Blue     B - Light Blue
// y - Yellow   Y - Light Yellow
// p - Purple   P - Light Purple
// c - Cyan     C - Light Cyan

characters = [
  `
pppppp
plpplp
pppppp
pp  pp
pp  pp
`,
  `
yyyyyy
yyyyyy
yyyyyy
yyyyyy
yyyyyy
yyyyyy
`,
  `
LLLLLL
LLLLLL
LLLLLL
LLLLLL
LLLLLL
LLLLLL
`,
];

options = {
  theme: "crt",
  viewSize: { x: 200, y: 100 },
  isReplayEnabled: true,
  isPlayingBgm: true,
  seed: 2,
};

/**
 * @typedef {{
 * pos: Vector
 * }} Box
 */

/**
 * @type { Box }
 */
let upBoxes;
let rightBoxes;
let bottomBoxes;
let leftBoxes;

/**
 * @typedef {{
 * pos: Vector,
 * firingCooldown: number
 * }} Player
 */

/**
 * @type { Player }
 */

let player;

/**
 * @typedef{{
 * pos: Vector
 * }} FBullet
 */

/**
 * @type { FBulllet [] }
 */
let fBullets;

/**
 * @typedef {{
 * pos: Vector,
 * angle: number,
 * rotation: number
 * }} EBullet
 */

/**
 * @type { EBullet [] }
 */

let eBullets;

/**
 * @typedef {{
 * pos: Vector,
 * firingCooldown: number
 * }} Enemy
 */

/**
 * @type { Enemy [] }
 */
let enemies;

let up = true;
let down = false;
let left = false;
let right = false;
let begin = true;
let playerFiringCooldown = 20;
let playerFiringSpeed = 5;
let enemyFiringCooldown = 250;
let topBottomWallSpeed = 0.025;
let topBottomHitWallSpeed = 1.5;
let leftRightWallSpeed = 0.025;
let leftRightWallHitSpeed = 1;

// The game loop
function update() {
  if (!ticks) {
    begin = true;
    player = {
      pos: vec(100, 50),
      firingCooldown: playerFiringCooldown,
    };

    //setting up all the arrays
    fBullets = [];
    eBullets = [];
    enemies = [];
    upBoxes = [];
    rightBoxes = [];
    bottomBoxes = [];
    leftBoxes = [];
  }

  //all the movement and input stuff

  //mouse movement
  player.pos = vec(input.pos.x, input.pos.y);
  player.pos.clamp(5, 195, 15, 95);

  //adding the player
  color("black");
  char("a", player.pos);

  //player shooting
  player.firingCooldown--;
  if (player.firingCooldown <= 0) {
    fBullets.push({
      pos: vec(player.pos.x, player.pos.y),
    });
    player.firingCooldown = playerFiringCooldown;
  }

  //checking to see what direction to shoot in

  //actually changing where bullets are shot from
  if (input.isJustPressed) {
    if (up) {
      up = false;
      right = true;
    } else if (right) {
      right = false;
      down = true;
    } else if (down) {
      down = false;
      left = true;
    } else if (left) {
      left = false;
      up = true;
    }
  }

  //moving the bullets
  fBullets.forEach((fb) => {
    if (up) {
      fb.pos.y -= playerFiringSpeed;
    }
    if (down) {
      fb.pos.y += playerFiringSpeed;
    }
    if (left) {
      fb.pos.x -= playerFiringSpeed;
    }
    if (right) {
      fb.pos.x += playerFiringSpeed;
    }
    color("yellow");
    box(fb.pos, 2);
  });

  //spawning the enemies on all sides

  if (enemies.length === 0) {
    //spawn on the left side
    for (let i = 0; i < 2; i++) {
      const posX = 0;
      const posY = rnd(0, 100);
      enemies.push({
        pos: vec(posX, posY),
        firingCooldown: enemyFiringCooldown,
      });
    }
    //spawn on the right side
    for (let i = 0; i < 2; i++) {
      const posX = 200;
      const posY = rnd(0, 100);
      enemies.push({
        pos: vec(posX, posY),
        firingCooldown: enemyFiringCooldown,
      });
    }
    //spawn on the top side
    for (let i = 0; i < 2; i++) {
      const posX = rnd(0, 200);
      const posY = 0;
      enemies.push({
        pos: vec(posX, posY),
        firingCooldown: enemyFiringCooldown,
      });
    }
    //spawn on the bottom side
    for (let i = 0; i < 2; i++) {
      const posX = rnd(0, 200);
      const posY = 100;
      enemies.push({
        pos: vec(posX, posY),
        firingCooldown: enemyFiringCooldown,
      });
    }
  }

  //spawning all the boxes
  if (begin) {
    begin = false;
    //spawning top wall
    for (let i = 0; i < 200; i += 6) {
      upBoxes.push({ pos: vec(i, 5) });
    }
    //spawning right wall
    for (let i = 0; i < 100; i += 6) {
      rightBoxes.push({ pos: vec(195, i) });
    }
    //spawning bottom wall
    for (let i = 0; i < 200; i += 6) {
      bottomBoxes.push({ pos: vec(i, 95) });
    }
    //spawning right wall
    for (let i = 0; i < 100; i += 6) {
      leftBoxes.push({ pos: vec(0, i) });
    }
  }

  //moving the top box down
  upBoxes.forEach((b) => {
    b.pos.y += topBottomWallSpeed;
  });

  //moving the right box left
  rightBoxes.forEach((b) => {
    b.pos.x -= leftRightWallSpeed;
  });

  //moving the bottom box up
  bottomBoxes.forEach((b) => {
    b.pos.y -= topBottomWallSpeed;
  });

  //moving the left box right
  leftBoxes.forEach((b) => {
    b.pos.x += leftRightWallSpeed;
  });

  //colission with the walls

  //bullet collision with top wall
  const collideTop = char("b", 100, 15).isColliding.rect.yellow;
  if (collideTop) {
    score++;
    upBoxes.forEach((b) => {
      b.pos.y -= topBottomHitWallSpeed;
    });
  }

  //bullet collision with right wall
  const collideRight = char("b", 190, 50).isColliding.rect.yellow;
  if (collideRight) {
    score++;
    rightBoxes.forEach((b) => {
      b.pos.x += leftRightWallHitSpeed;
    });
  }

  //bullet collision with bottom wall
  const collideBottom = char("b", 100, 85).isColliding.rect.yellow;
  if (collideBottom) {
    score++;
    bottomBoxes.forEach((b) => {
      b.pos.y += topBottomHitWallSpeed;
    });
  }

  //bullet collision with left wall
  const collideLeft = char("b", 10, 50).isColliding.rect.yellow;
  if (collideLeft) {
    score++;
    leftBoxes.forEach((b) => {
      b.pos.x -= leftRightWallHitSpeed;
    });
  }

  //all the removing functions

  //removing the top wall
  remove(upBoxes, (b) => {
    color("cyan");
    char("c", b.pos);
    //check if player is touching it
    const isCollidingWithPlayer = char("c", b.pos, {
      rotation: b.rotation,
    }).isColliding.char.a;
    if (isCollidingWithPlayer) {
      begin = true;
      end();
    }
  });

  //removing right wall
  remove(rightBoxes, (b) => {
    color("cyan");
    char("c", b.pos);
    //check if player is touching it
    const isCollidingWithPlayer = char("c", b.pos, {
      rotation: b.rotation,
    }).isColliding.char.a;
    if (isCollidingWithPlayer) {
      begin = true;
      end();
    }
  });

  //removing the bottom wall
  remove(bottomBoxes, (b) => {
    color("cyan");
    char("c", b.pos);
    //check if player is touching it
    const isCollidingWithPlayer = char("c", b.pos, {
      rotation: b.rotation,
    }).isColliding.char.a;
    if (isCollidingWithPlayer) {
      begin = true;
      end();
    }
  });

  //removing left wall
  remove(leftBoxes, (b) => {
    color("cyan");
    char("c", b.pos);
    //check if player is touching it
    const isCollidingWithPlayer = char("c", b.pos, {
      rotation: b.rotation,
    }).isColliding.char.a;
    if (isCollidingWithPlayer) {
      begin = true;
      end();
    }
  });

  //"removing" enemies
  remove(enemies, (e) => {
    e.firingCooldown--;
    if (e.firingCooldown <= 0) {
      eBullets.push({
        pos: vec(e.pos.x, e.pos.y),
        angle: e.pos.angleTo(player.pos),
        rotation: rnd(),
      });
      e.firingCooldown = enemyFiringCooldown;
    }
    color("black");
    char("c", e.pos);
    return e.pos.y > 100;
  });

  //removing player shot bullets
  remove(fBullets, (fb) => {
    const isCollidingWithTargets = box(fb.pos, 2).isColliding.char.b;
    return (
      fb.pos.y < 0 || fb.pos.y > 100 || fb.pos.x > 200 || fb.pos.x < 0 || isCollidingWithTargets
    );
  });

  //removing the projectiles
  remove(eBullets, (eb) => {
    eb.pos.x += 1 * Math.cos(eb.angle);
    eb.pos.y += 1 * Math.sin(eb.angle);
    eb.rotaion += 20;

    color("red");
    const isCollidingWithPlayer = char("c", eb.pos, {
      rotation: eb.rotation,
    }).isColliding.char.a;

    if (isCollidingWithPlayer) {
      begin = true;
      end();
    }

    return !eb.pos.isInRect(0, 0, 200, 100);
  });
}