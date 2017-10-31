import ImageRepository from './image-repository';
import { Bullet } from './bullet';
import { EnemyShip } from './enemy-ship';
/**
 * Custom Pool object. Holds Bullet objects to be managed to prevent
 * garbage collection.
 */
export class Pool {
    size: number; // Max bullets allowed in the pool
    pool: Array<Bullet | EnemyShip>;

    context: CanvasRenderingContext2D;
    canvasHeight: number;
    canvasWidth: number;

    constructor(maxSize: number) {
        this.size = maxSize;
        this.pool = [];
    }
	/*
	 * Populates the pool array with Bullet objects
	 */
    init(type: string) {

        if (type == "bullet") {
            for (let i = 0; i < this.size; i++) {
                // Initalize the object
                let bullet = new Bullet();
                bullet.init(0, 0, ImageRepository.bullet.width, ImageRepository.bullet.height);
                bullet.context = this.context;
                bullet.canvasHeight = this.canvasHeight;
                bullet.canvasWidth = this.canvasWidth;
                this.pool[i] = bullet;
            }
        }
        else if (type == "enemyShip") {
            for (let i = 0; i < this.size; i++) {
                let enemy = new EnemyShip();
                enemy.context = this.context;
                enemy.canvasHeight = this.canvasHeight;
                enemy.canvasWidth = this.canvasWidth;
                enemy.init(0, 0, ImageRepository.ship_enemy.width, ImageRepository.ship_enemy.height);
                enemy.setAreaBulletPool(enemy.context, enemy.canvasHeight, enemy.canvasWidth);
                this.pool[i] = enemy;
            }
        }
        else if (type == "shipEnemyBullet") {
            for (let i = 0; i < this.size; i++) {
                let bullet = new Bullet();
                bullet.markAsEnemyBullet();
                bullet.init(0, 0, ImageRepository.ship_enemyBullet.width, ImageRepository.ship_enemyBullet.height);

                bullet.context = this.context;
                bullet.canvasHeight = this.canvasHeight;
                bullet.canvasWidth = this.canvasWidth;
                this.pool[i] = bullet;
            }
        }

    };
    /*
     * Grabs the last item in the list and initializes it and
     * pushes it to the front of the array.
     */
    get(x: number, y: number, speed: number) {
        if (!this.pool[this.size - 1].alive) {
            this.pool[this.size - 1].spawn(x, y, speed);
            this.pool.unshift(this.pool.pop());
        }
    };
    /*
     * Used for the ship to be able to get two bullets at once. If
     * only the get() function is used twice, the ship is able to
     * fire and only have 1 bullet spawn instead of 2.
     */
    getTwo(x1: number, y1: number, speed1: number, x2: number, y2: number, speed2: number) {
        if (!this.pool[this.size - 1].alive &&
            !this.pool[this.size - 2].alive) {
            this.get(x1, y1, speed1);
            this.get(x2, y2, speed2);
        }
    }
    /*
     * Draws any in use Bullets. If a bullet goes off the screen,
     * clears it and pushes it to the front of the array.
     */
    animate() {
        for (let i = 0; i < this.size; i++) {
            // Only draw until we find a bullet that is not alive
            if (this.pool[i].alive) {
                if (this.pool[i].draw()) {
                    this.pool[i].clear();
                    this.pool.push((this.pool.splice(i, 1))[0]);
                }
            }
            else {
                break;
            }
        }
    }
}