import { Background } from './background';
import { Ship } from './ship';
import { Pool } from './pool';
import { Bullet } from './bullet';
import { EnemyShip } from './enemy-ship';
import { QuadTree } from './quad-tree';
import ImageRepository from './image-repository';
import GlobalEventService from './global-events';
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
    private enemyPool: Pool;
    private quadTree: QuadTree;
    private shipStartX: number;
    private shipStartY: number;
    private playerScore: number;


    constructor() {
        this.background = new Background;
        this.playerScore = 0;
        this.eventsListeners();


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

            this.shipStartX = this.shipCanvas.width / 2 - ImageRepository.spaceship.width;
            this.shipStartY = this.shipCanvas.height / 4 * 3 + ImageRepository.spaceship.height * 2;
            this.ship.init(this.shipStartX, this.shipStartY, ImageRepository.spaceship.width,
                ImageRepository.spaceship.height);

            // Initialize the background object
            this.background.init(0, 0); // Set draw point to 0,0

            // Initialize the enemy pool object
            this.enemyPool = new Pool(30);
            this.enemyPool.context = this.mainContext;
            this.enemyPool.canvasWidth = this.mainCanvas.width;
            this.enemyPool.canvasHeight = this.mainCanvas.height;
            this.enemyPool.init('enemy');
            this.spawnWave();
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

    // Spawn a new wave of enemies
    spawnWave() {
        let height = ImageRepository.enemy_1.height;
        let width = ImageRepository.enemy_1.width;
        let x = 100;
        let y = -height;
        let spacer = y * 1.5;
        for (let i = 1; i <= 18; i++) {
            this.enemyPool.get(x, y, 2);
            x += width + 25;
            if (i % 6 == 0) {
                x = 100;
                y += spacer
            }
        }
    }

    private animate() {
        this.fillQuadTree();
        this.detectCollision();

        // No more enemies
        if (this.enemyPool.getPool().length === 0) {
            this.spawnWave();
        }

        if (this.ship.alive) {
            window.requestAnimFrame(this.animate.bind(this));
            this.background.draw();
            this.ship.move()
            this.ship.bulletPool.animate();
            this.enemyPool.animate();
        }
    }


    private fillQuadTree() {
        this.quadTree.clear();
        this.quadTree.insert(this.ship);
        this.quadTree.insert(this.ship.bulletPool.getPool());
        this.quadTree.insert(this.enemyPool.getPool());

        // Pools of ships enemies alives
        this.enemyPool.getPool().map((enemy: EnemyShip) => {
            this.quadTree.insert(enemy.bulletPool.getPool());
        });

        // Pools of ships enemies dead
        this.enemyPool.getPoolAliveBulletsOfDeadEnemies().map((poolBullet: Pool) => {
            this.quadTree.insert(poolBullet);
        });
    }
    private detectCollision() {
        let objects: Array<any> = [];
        this.quadTree.getAllObjects(objects);
        for (let x = 0, len = objects.length; x < len; x++) {
            let obj: Array<any>;
            this.quadTree.findObjects(obj = [], objects[x]);
            let counter = 0;
            for (let y = 0, length = obj.length; y < length; y++) {

                if (counter === 0) {
                    // DETECT COLLISION ALGORITHM
                    if (objects[x].collidableWith === obj[y].type &&
                        (objects[x].x < obj[y].x + obj[y].width &&
                            objects[x].x + objects[x].width > obj[y].x &&
                            objects[x].y < obj[y].y + obj[y].height &&
                            objects[x].y + objects[x].height > obj[y].y)) {
                        objects[x].collidableHits++;
                        obj[y].collidableHits++;
                        if (objects[x].collidableHits >= objects[x].collidableMaxHits) {
                            objects[x].isColliding = true;
                        }
                        if (obj[y].collidableHits >= obj[y].collidableMaxHits) {
                            obj[y].isColliding = true;
                        }
                        counter++;
                        break;
                    }
                }
            }

            if (counter > 0) {
                break;
            }
        }
    }

    private gameOver() {
        document.getElementById('game-over').style.display = "block";
    };

    // Restart the game
    private restart() {
        document.getElementById('game-over').style.display = "none";
        // delete all
        this.bgContext.clearRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
        this.shipContext.clearRect(0, 0, this.shipCanvas.width, this.shipCanvas.height);
        this.mainContext.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);
        this.quadTree.clear();
        this.background.init(0, 0);

        this.ship.setAreaBulletPool(this.mainContext, this.mainCanvas.width, this.mainCanvas.height);
        this.ship.init(this.shipStartX, this.shipStartY,
            ImageRepository.spaceship.width, ImageRepository.spaceship.height);

        this.enemyPool.init("enemy");

        this.spawnWave();

        this.playerScore = 0;
        this.printScore();

        this.start();
    };


    private eventsListeners() {
        this.scoreBehavior();

        document.addEventListener(GlobalEventService.initEventName, (event: CustomEvent) => {
            this.init();
        });

        document.addEventListener(GlobalEventService.gameOverEventName, (event: CustomEvent) => {
            this.gameOver();
        });

        document.getElementById('restart').addEventListener('click', (ev) => {
            ev.stopPropagation();
            this.restart();
        });
    }

    private scoreBehavior() {
        document.addEventListener(GlobalEventService.enemyDestoyEventName, (event: CustomEvent) => {
            if (event.detail === 'enemy_1') {
                this.playerScore += 10;
            }
            if (event.detail === 'enemy_2') {
                this.playerScore += 15;
            }
            if (event.detail === 'enemy_3') {
                this.playerScore += 25;
            }
            if (event.detail === 'enemy_4') {
                this.playerScore += 35;
            }
            this.printScore();
        });
    }

    private printScore() {
        let score = document.getElementById('score');
        score.innerHTML = `${this.playerScore}`;
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
