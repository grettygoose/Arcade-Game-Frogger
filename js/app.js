"use strict";
// define edges of canvas, constants
var CANVAS_RIGHT = 505;
var CANVAS_BOTTOM = 404;
var CANVAS_WIDTH = 101;
var CANVAS_HEIGHT = 83;

// for scoring player reset
var REACHED_WATER = false;

// Enemies our player must avoid
var Enemy = function(x, y) {
    // load image
    this.sprite = 'images/enemy-bug.png';
    // assign changing x and y coordinates table(allEnemies);
    this.x = x;
    this.y = y;
    // assign Enemy speed, returns a random number between the specified values but no lower than 1
    this.speed = Math.floor(Math.random() * (150 + 100)) + 1;
};


// Parameter: dt, a time delta between ticks defined in engine.js, ensures smooth run across devices
Enemy.prototype.update = function(dt) {
    // if the enemy x position on the canvas is less than 505 multiply dt by the speed above and apply the value to the x position
    // if it is greater than 505, reset it to 0
    // This creates a looping features and the bug move across the screen
    if (this.x < CANVAS_RIGHT) {
        this.x += dt * this.speed;
    } else {
        this.x = 0;
    }
};


// Draw the enemy on the screen, required method for game. Resources defined in Resources.js
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// player class requires an update(), render() and a handleInput() method. There is only one player so define all params here
var Player = function(x, y) {
    // load image
    this.sprite = 'images/char-horn-girl.png';
    // assign x and y coordinates
    this.x = 100;
    this.y = 400;
    // starting score
    this.score = 0;
    //number of lives a player has
    this.lives = 3;
};

// used in several places to reset the player to the starting x, y coordinates
Player.prototype.resetPlayer = function() {
    this.x = 100;
    this.y = 400;
};


// Update the player's position, required method for game
Player.prototype.update = function() {
    // draw lives and score
    this.drawText();
    this.increaseScore();
    this.enemyCollision();
    if (this.score === 4) {
        this.resetPlayer();
        alert("YOU WON!!");
        document.location.reload();
    }

};

//Draw the score and the number of lives of the player on the canvas
Player.prototype.drawText = function() {
    ctx.clearRect(0, 0, 120, 20);
    ctx.clearRect(400, 0, 100, 20);
    ctx.font = "20px Lato";
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + this.score, 0, 20);
    ctx.fillText("Lives: " + this.lives, 430, 20);
};

// when player has reached the water (500), add to the score & reset the player to the start
Player.prototype.increaseScore = function() {
    if (REACHED_WATER) {
        this.score++;
        this.resetPlayer();
        REACHED_WATER = false;
    }
};

//Player and enemy collision
Player.prototype.enemyCollision = function() {
    var bug = this.checkCollisions(allEnemies);
    //if collision detected, reduce a player life.
    //Game over if all lives lost.
    if (bug) {
        if (this.lives - 1) {
            this.lives--;
            this.resetPlayer();
        } else {
            alert("YOU LOST");
            document.location.reload();
        }
    }
};

//Method for Collision detection between entities, 
// https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
Player.prototype.checkCollisions = function(targetArray) {
    for (var i = 0; i < targetArray.length; i++) {
        if (this.x < targetArray[i].x + 50 &&
            this.x + 50 > targetArray[i].x &&
            this.y < targetArray[i].y + 40 &&
            this.y + 40 > targetArray[i].y) {
            return targetArray[i];
        }
    }
};


// Draw the player on the screen, required method for game. Resources defined in Resources.js
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// move the player around
Player.prototype.handleInput = function(key) {
    switch (key) {
        case 'left':
            if (this.x - CANVAS_WIDTH < 0) {
                this.x = 0;
            } else {
                this.x -= CANVAS_WIDTH;
            }
            break;

        case 'right':
            if (this.x + CANVAS_WIDTH >= CANVAS_RIGHT) {
                this.x = 404;
            } else {
                this.x += CANVAS_WIDTH;
            }
            break;

        case 'up':
            if (this.y - CANVAS_HEIGHT < 0) {
                this.y = 0;
                REACHED_WATER = true;
            } else {
                this.y -= CANVAS_HEIGHT;
            }
            break;

        case 'down':
            if (this.y + CANVAS_HEIGHT >= CANVAS_BOTTOM) {
                this.y = 404;
            } else {
                this.y += CANVAS_HEIGHT;
            }
            break;
    }
};

// Now invoking the constructor functions above and instantiate your objects enemy and player
// Place all enemy objects in an array called allEnemies (multiple enemies). enemy is an instance of the Enemy Class
// Place the player object in a variable called player (single player)
var allEnemies = [
    new Enemy(0, 60),
    new Enemy(101, 150),
    new Enemy(202, 235),
    new Enemy(0, 321)
];
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});