import ImageRepository from '../image-repository';
import { Drawable } from '../drawable';
import { Pool } from '../pool';
import GlobalEventService from '../global-events';
/**
 * Create the Enemy ship object.
 */
export class EnemyShip extends Drawable {
    percentFire: number;
    chance: number;
    speedX: number;
    speedY: number;
    leftEdge: number;
    rightEdge: number;
    bottomEdge: number;
    bulletPool: Pool;
    collidableWith: string;
    type: string;
    imageEnemy: HTMLImageElement;

    constructor() {
        super();
        this.percentFire = 0.01;
        this.chance = 0;
        this.bulletPool = new Pool(30);
        this.collidableWith = 'bullet';
        this.type = 'enemy';
    }

    setAreaBulletPool(context: CanvasRenderingContext2D, canvasHeight: number, canvasWidth: number) {
        this.bulletPool.context = context;
        this.bulletPool.canvasHeight = canvasHeight;
        this.bulletPool.canvasWidth = canvasWidth;
        this.bulletPool.init('enemy_bullet');
    }


	/*
	 * Sets the Enemy values
	 */
    spawn(x: number, y: number, speed: number) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.speedX = 0;
        this.speedY = speed;
        this.alive = true;
        this.leftEdge = this.x - 90;
        this.rightEdge = this.x + 90;
        this.bottomEdge = this.y + (this.height * 3) + 80;
        this.collidableHits = 0;
    };
	/*
	 * Move the enemy
	 */
    draw() {
        this.context.clearRect(this.x - 1, this.y, this.width + 1, this.height);
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x <= this.leftEdge) {
            this.speedX = this.speed;
        }
        else if (this.x >= this.rightEdge + this.width) {
            this.speedX = -this.speed;
        }
        else if (this.y >= this.bottomEdge) {
            this.speed = 1.5;
            this.speedY = 0;
            this.y -= 5;
            this.speedX = -this.speed;
        }

        if (!this.isColliding) {
            this.context.drawImage(this.imageEnemy, this.x, this.y);
            // Enemy has a chance to shoot every movement
            this.chance = Math.floor(Math.random() * (100 + 1));
            if (this.chance / 100 < this.percentFire) {
                this.fire();
            }
            this.bulletPool.animate();

            return false;
        } else {
            this.onDestroyEnemy();
            return true;
        }
    };
    onDestroyEnemy() { }
    /*
     * Fires a bullet
     */
    fire() {
        this.bulletPool.get(this.x + this.width / 2, this.y + this.height, -2.5);
    }
    /*
     * Resets the enemy values
     */
    clear() {
        this.x = 0;
        this.y = 0;
        this.speed = 0;
        this.speedX = 0;
        this.speedY = 0;
        this.alive = false;
        this.alive = false;
        this.isColliding = false;
    };
}