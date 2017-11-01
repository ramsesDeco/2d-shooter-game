import ImageRepository from './image-repository';
import { EnemyShip } from './enemy-ship';
import GlobalEventService from './global-events';
export class Enemy_2 extends EnemyShip {

    constructor() {
        super();
    }

    init(x: number, y: number, width?: number, height?: number) {
        super.init(x, y, ImageRepository.enemy_2.width, ImageRepository.enemy_2.height);
        super.imageEnemy = ImageRepository.enemy_2;
        this.defineNumberOfHits();
    }

    spawn(x: number, y: number, speed: number) {
        super.spawn(x, y, speed);
        this.defineNumberOfHits();
    };

    onDestroyEnemy() {
        GlobalEventService.enemyDestroyed(`${this.type}_2`);
    }

    defineNumberOfHits() {
        super.collidableHits = 0;
        super.collidableMaxHits = 3;
    }
}