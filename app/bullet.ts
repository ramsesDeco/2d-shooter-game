import ImageRepository from './image-repository';
import { Drawable } from './drawable';
/**
 * Creates the Bullet object which the ship fires. The bullets are
 * drawn on the "main" canvas.
 */
export class Bullet extends Drawable {

    private enemyBullet: boolean;

    constructor() {
        super();
        this.enemyBullet = false;
    }
	/*
	 * Sets the bullet values
	 */
    spawn(x: number, y: number, speed: number) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.alive = true;
    };
	/*
	 * Uses a "drity rectangle" to erase the bullet and moves it.
	 * Returns true if the bullet moved off the screen, indicating that
	 * the bullet is ready to be cleared by the pool, otherwise draws
	 * the bullet.
	 */
    draw() {
        this.context.clearRect(this.x, this.y, this.width, this.height);
        this.y -= this.speed;

        if (this.isColliding) {
            return true;
        }
        if (!this.enemyBullet && this.y <= 0 - this.height) {
            return true;
        }
        else if (this.enemyBullet && this.y >= this.canvasHeight) {
            return true;
        }
        else {
            if (!this.enemyBullet) {
                this.context.drawImage(ImageRepository.bullet, this.x, this.y);
            }
            else if (this.enemyBullet) {
                this.context.drawImage(ImageRepository.ship_enemyBullet, this.x, this.y);
            }
            return false;
        }
    };
    /*
     * Resets the bullet values
     */
    clear() {
        this.x = 0;
        this.y = 0;
        this.speed = 0;
        this.alive = false;
		this.isColliding = false;
    };

    markAsEnemyBullet() {
        this.enemyBullet = true;
    };
}