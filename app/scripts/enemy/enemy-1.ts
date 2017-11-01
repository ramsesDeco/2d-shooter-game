import ImageRepository from '../image-repository';
import { EnemyShip } from './enemy-ship';
import GlobalEventService from '../global-events';
export class Enemy_1 extends EnemyShip {

    constructor() {
        super();
    }

    init(x: number, y: number, width?: number, height?: number) {
        super.init(x, y, ImageRepository.enemy_1.width, ImageRepository.enemy_1.height);
        super.imageEnemy = ImageRepository.enemy_1;
    }

    onDestroyEnemy() {
        GlobalEventService.enemyDestroyed(`${this.type}_1`);
    }
}