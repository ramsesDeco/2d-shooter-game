import ImageRepository from '../image-repository';
import { EnemyShip } from './enemy-ship';
import GlobalEventService from '../global-events';
export class Enemy_4 extends EnemyShip {

    constructor() {
        super();
    }

    init(x: number, y: number, width?: number, height?: number) {
        super.init(x, y, ImageRepository.enemy_4.width, ImageRepository.enemy_4.height);
        super.imageEnemy = ImageRepository.enemy_4;
        this.defineNumberOfHits();
    }

    spawn(x: number, y: number, speed: number) {
        super.spawn(x, y, speed);
        this.defineNumberOfHits();
    };

    onDestroyEnemy() {
        GlobalEventService.enemyDestroyed(`${this.type}_4`);
    }

    defineNumberOfHits() {
        super.collidableHits = 0;
        super.collidableMaxHits = 10;
    }
}