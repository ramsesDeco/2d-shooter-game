import { Background } from './background';
import { Ship } from './ship';
import { Pool } from './pool';
import { Bullet } from './bullet';
import { EnemyShip } from './enemy-ship';
import { QuadTree } from './quad-tree';
import ImageRepository from './image-repository';
/**
 * Creates the Game object which will hold all objects and data for
 * the game.
 */
export class Game {

    private bgCanvas: HTMLCanvasElement;
    private shipCanvas: HTMLCanvasElement;
    private mainCanvas: HTMLCanvasElement;

    private bgContext: CanvasRenderingContext2D;
    private shipContext: CanvasRenderingContext2D;
    private mainContext: CanvasRenderingContext2D;

    private background: Background;
    private ship: Ship;
    private enemyShipPool: Pool;
    private quadTree: QuadTree;

    constructor() {
        this.background = new Background;
    }
	/*
	 * Gets canvas information and context and sets up all game
	 * objects. 
	 * Returns true if the canvas is supported and false if it
	 * is not. This is to stop the animation script from constantly
	 * running on older browsers.
	 */
    init() {
        // Get the canvas element
        this.bgCanvas = <HTMLCanvasElement>document.getElementById('background');
        this.shipCanvas = <HTMLCanvasElement>document.getElementById('ship');
        this.mainCanvas = <HTMLCanvasElement>document.getElementById('main');

        // Test to see if canvas is supported
        if (this.bgCanvas.getContext) {
            this.bgContext = this.bgCanvas.getContext('2d');
            this.shipContext = this.shipCanvas.getContext('2d');
            this.mainContext = this.mainCanvas.getContext('2d');

            this.quadTree = new QuadTree(
                {
                    x: 0,
                    y: 0,
                    width: this.mainCanvas.width,
                    height: this.mainCanvas.height
                }
            );

            // Initialize objects to contain their context and canvas
            // information
            this.background = new Background();
            this.background.context = this.bgContext;
            this.background.canvasWidth = this.bgCanvas.width;
            this.background.canvasHeight = this.bgCanvas.height;

            this.ship = new Ship();
            this.ship.context = this.shipContext;
            this.ship.canvasWidth = this.shipCanvas.width;
            this.ship.canvasHeight = this.shipCanvas.height;
            this.ship.setAreaBulletPool(this.mainContext, this.mainCanvas.width, this.mainCanvas.height);

            // Bullet.prototype.context = this.mainContext;
            // Bullet.prototype.canvasWidth = this.mainCanvas.width;
            // Bullet.prototype.canvasHeight = this.mainCanvas.height;

            // Initialize the background object
            this.background.init(0, 0); // Set draw point to 0,0

            let shipStartX = this.shipCanvas.width / 2 - ImageRepository.spaceship.width;
            let shipStartY = this.shipCanvas.height / 4 * 3 + ImageRepository.spaceship.height * 2;
            this.ship.init(shipStartX, shipStartY, ImageRepository.spaceship.width,
                ImageRepository.spaceship.height);



            // Initialize the enemy pool object
            this.enemyShipPool = new Pool(30);
            this.enemyShipPool.context = this.mainContext;
            this.enemyShipPool.canvasWidth = this.mainCanvas.width;
            this.enemyShipPool.canvasHeight = this.mainCanvas.height;
            this.enemyShipPool.init('enemyShip');
            let height = ImageRepository.ship_enemy.height;
            let width = ImageRepository.ship_enemy.width;
            let x = 100;
            let y = -height;
            let spacer = y * 1.5;
            for (let i = 1; i <= 18; i++) {
                this.enemyShipPool.get(x, y, 2);
                x += width + 25;
                if (i % 6 == 0) {
                    x = 100;
                    y += spacer
                }
            }
            // this.enemyBulletPool = new Pool(50);
            // this.enemyBulletPool.init("enemyBullet");
            return true;
        } else {
            return false;
        }
    };

    // Start the animation loop
    start() {
        this.ship.draw();
        this.animate();
    };

    private animate() {

        this.quadTree.clear();
        this.quadTree.insert(this.ship);

        this.quadTree.insert(this.ship.bulletPool.getPool());

        this.quadTree.insert(this.enemyShipPool.getPool());

        // Pools of ships enemies alives
        this.enemyShipPool.getPool().map((enemy: EnemyShip) => {
            this.quadTree.insert(enemy.bulletPool.getPool());
        });

        // Pools of ships enemies dead
        this.enemyShipPool.getPoolAliveBulletsOfDeadEnemies().map((poolBullet: Pool) => {
            this.quadTree.insert(poolBullet);
        });
        this.detectCollision();

        window.requestAnimFrame(this.animate.bind(this));
        this.background.draw();
        this.ship.move()
        this.ship.bulletPool.animate();
        this.enemyShipPool.animate();
    }

    private detectCollision() {
        let objects: Array<any> = [];
        this.quadTree.getAllObjects(objects);
        for (let x = 0, len = objects.length; x < len; x++) {
            let obj: Array<any>;
            this.quadTree.findObjects(obj = [], objects[x]);

            for (let y = 0, length = obj.length; y < length; y++) {

                // DETECT COLLISION ALGORITHM
                if (objects[x].collidableWith === obj[y].type &&
                    (objects[x].x < obj[y].x + obj[y].width &&
                        objects[x].x + objects[x].width > obj[y].x &&
                        objects[x].y < obj[y].y + obj[y].height &&
                        objects[x].y + objects[x].height > obj[y].y)) {
                    objects[x].isColliding = true;
                    obj[y].isColliding = true;
                }
            }
        }
    }
}

declare global {
    interface Window {
        init: any;
        requestAnimFrame: any;
        mozRequestAnimationFrame: FrameRequestCallback;
        oRequestAnimationFrame: FrameRequestCallback;
        msRequestAnimationFrame: FrameRequestCallback;
    }
}

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback: () => any, element: HTMLElement) {
            window.setTimeout(callback, 1000 / 60);
        };
})();