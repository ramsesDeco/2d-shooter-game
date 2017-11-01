import ImageRepository from './image-repository';
import { EnemyShip } from './enemy-ship';
import GlobalEventService from './global-events';
export class Enemy_3 extends EnemyShip {

    constructor() {
        super();
    }

    init(x: number, y: number, width?: number, height?: number) {
        super.init(x, y, ImageRepository.enemy_3.width, ImageRepository.enemy_3.height);
        super.imageEnemy = ImageRepository.enemy_3;
        this.defineNumberOfHits();
    }

    spawn(x: number, y: number, speed: number) {
        super.spawn(x, y, speed);
        this.defineNumberOfHits();
    };

    onDestroyEnemy() {
        GlobalEventService.enemyDestroyed(`${this.type}_3`);
    }

    defineNumberOfHits() {
        super.collidableHits = 0;
        super.collidableMaxHits = 6;
    }
}