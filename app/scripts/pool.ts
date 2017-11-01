import ImageRepository from './image-repository';
import { Bullet } from './bullet';
import { EnemyShip } from './enemy/enemy-ship';
import { Enemy_1 } from './enemy/enemy-1';
import { Enemy_2 } from './enemy/enemy-2';
import { Enemy_3 } from './enemy/enemy-3';
import { Enemy_4 } from './enemy/enemy-4';
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

        if (type == 'bullet') {
            for (let i = 0; i < this.size; i++) {
                // Initalize the object
                let bullet = new Bullet();
                bullet.init(0, 0, ImageRepository.bullet.width, ImageRepository.bullet.height);
                bullet.context = this.context;
                bullet.canvasHeight = this.canvasHeight;
                bullet.canvasWidth = this.canvasWidth;
                bullet.collidableWith = 'enemy';
                bullet.type = 'bullet';
                this.pool[i] = bullet;
            }
        }
        else if (type == 'enemy') {
            for (let i = 0; i < this.size; i++) {
                let enemy = this.generateRandomEnemy();
                // let enemy = new Enemy_2();
                // enemy.context = this.context;
                // enemy.canvasHeight = this.canvasHeight;
                // enemy.canvasWidth = this.canvasWidth;
                // enemy.init(0, 0);
                // enemy.setAreaBulletPool(enemy.context, enemy.canvasHeight, enemy.canvasWidth);
                this.pool[i] = enemy;
            }
        }
        else if (type == 'enemy_bullet') {
            for (let i = 0; i < this.size; i++) {
                let bullet = new Bullet();
                bullet.markAsEnemyBullet();
                bullet.init(0, 0, ImageRepository.enemy_bullet.width, ImageRepository.enemy_bullet.height);

                bullet.collidableWith = 'ship';
                bullet.type = 'enemy_bullet';
                bullet.context = this.context;
                bullet.canvasHeight = this.canvasHeight;
                bullet.canvasWidth = this.canvasWidth;
                this.pool[i] = bullet;
            }
        }

    };

    generateRandomEnemy(): EnemyShip {
        let randomEnemyNumber = Math.floor((Math.random() * 4) + 1);
        let enemy: EnemyShip;
        switch (randomEnemyNumber) {
            case 1:
                enemy = new Enemy_1();
                break;
            case 2:
                enemy = new Enemy_2();
                break;
            case 3:
                enemy = new Enemy_3();
                break;
            case 4:
                enemy = new Enemy_4();
                break;
        }
        enemy.context = this.context;
        enemy.canvasHeight = this.canvasHeight;
        enemy.canvasWidth = this.canvasWidth;
        enemy.init(0, 0);
        enemy.setAreaBulletPool(enemy.context, enemy.canvasHeight, enemy.canvasWidth);
        return enemy;
    }

    getPool() {
        let obj: Array<any> = [];
        for (let i = 0; i < this.size; i++) {
            if (this.pool[i].alive) {
                obj.push(this.pool[i]);
            }
        }
        return obj;
    }

    /**
     * this is for Enemies that has a Pool of bullets
     */
    getPoolAliveBulletsOfDeadEnemies() {
        let obj: Array<any> = [];
        for (let i = 0; i < this.size; i++) {
            if (!this.pool[i].alive) {
                for (let j = 0; j < (<EnemyShip>this.pool[i]).bulletPool.size; j++) {
                    obj.push((<EnemyShip>this.pool[i]).bulletPool.getPool());
                }
            }
        }
        return obj;
    }


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
                // if EnemyShip is destroyed, his bulletPool will be animate if some bullet is alive.
                if ((<EnemyShip>this.pool[i]).bulletPool) {
                    if ((<EnemyShip>this.pool[i]).bulletPool.getPool().length > 0) {
                        (<EnemyShip>this.pool[i]).bulletPool.animate();
                    }
                } else {
                    break;
                }
            }
        }
    }
}