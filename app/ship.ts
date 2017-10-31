import ImageRepository from './image-repository';
import { Drawable } from './drawable';
import { Pool } from './pool';
import { KEY_STATUS, KEY_CODES } from './key-codes';
/**
 * Create the Ship object that the player controls. The ship is
 * drawn on the "ship" canvas and uses dirty rectangles to move
 * around the screen.
 */
export class Ship extends Drawable {
    bulletPool: Pool;
    fireRate: number;
    counter: number;

    constructor() {
        super();
        super.speed = 3;
        this.bulletPool = new Pool(30);
        this.fireRate = 15;
        this.counter = 0;
    }

    draw() {
        this.context.drawImage(ImageRepository.spaceship, this.x, this.y);
    }

    setAreaBulletPool(context: CanvasRenderingContext2D, canvasHeight: number, canvasWidth: number) {
        this.bulletPool.context = context;
        this.bulletPool.canvasHeight = canvasHeight;
        this.bulletPool.canvasWidth = canvasWidth;
        this.bulletPool.init('bullet');
    }

    move() {
        this.counter++;
        // Determine if the action is move action
        if (KEY_STATUS.left || KEY_STATUS.right ||
            KEY_STATUS.down || KEY_STATUS.up) {
            // The ship moved, so erase it's current image so it can
            // be redrawn in it's new location
            this.context.clearRect(this.x, this.y, this.width, this.height);
            // Update x and y according to the direction to move and
            // redraw the ship. Change the else if's to if statements
            // to have diagonal movement.
            if (KEY_STATUS.left) {
                this.x -= this.speed
                if (this.x <= 0) // Keep player within the screen
                    this.x = 0;
            } else if (KEY_STATUS.right) {
                this.x += this.speed
                if (this.x >= this.canvasWidth - this.width)
                    this.x = this.canvasWidth - this.width;
            } else if (KEY_STATUS.up) {
                this.y -= this.speed
                if (this.y <= this.canvasHeight / 4 * 3)
                    this.y = this.canvasHeight / 4 * 3;
            } else if (KEY_STATUS.down) {
                this.y += this.speed
                if (this.y >= this.canvasHeight - this.height)
                    this.y = this.canvasHeight - this.height;
            }
            // Finish by redrawing the ship
            this.draw();
        }
        if (KEY_STATUS.space && this.counter >= this.fireRate) {
            this.fire();
            this.counter = 0;
        }
    };
    /*
     * Fires two bullets
     */
    fire() {
        this.bulletPool.getTwo(this.x + 6, this.y, 3,
            this.x + 33, this.y, 3);
    };
}