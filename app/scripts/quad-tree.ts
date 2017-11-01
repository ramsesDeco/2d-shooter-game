/**
 * QuadTree object.
 *
 * The quadrant indexes are numbered as below:
 *     |
 *  1  |  0
 * —-+—-
 *  2  |  3
 *     |
 */
export class QuadTree {
    maxObjects: number;
    bounds: any;
    objects: Array<any>;
    nodes: Array<any>;
    level: any;
    maxLevels: number;
    constructor(boundBox?: any, lvl?: number) {
        this.maxObjects = 10;
        this.bounds = boundBox || {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        }
        this.objects = [];
        this.nodes = [];
        this.level = lvl || 0
        this.maxLevels = 5;
    }
    /*
     * Clears the quadTree and all nodes of objects
     */
    clear() {
        this.objects = [];
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].clear();
        }
        this.nodes = [];
    };
    /*
     * Get all objects in the quadTree
     */
    getAllObjects(returnedObjects: Array<any>) {
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].getAllObjects(returnedObjects);
        }
        for (let i = 0, len = this.objects.length; i < len; i++) {
            returnedObjects.push(this.objects[i]);
        }
        return returnedObjects;
    };
    /*
     * Return all objects that the object could collide with
     */
    findObjects(returnedObjects: Array<any>, obj: any) {
        if (typeof obj === "undefined") {
            console.log("UNDEFINED OBJECT");
            return;
        }
        let index = this.getIndex(obj);
        if (index != -1 && this.nodes.length) {
            this.nodes[index].findObjects(returnedObjects, obj);
        }
        for (let i = 0, len = this.objects.length; i < len; i++) {
            returnedObjects.push(this.objects[i]);
        }
        return returnedObjects;
    };
    /*
     * Insert the object into the quadTree. If the tree
     * excedes the capacity, it will split and add all
     * objects to their corresponding nodes.
     */
    insert(obj: any) {
        if (typeof obj === "undefined") {
            return;
        }
        if (obj instanceof Array) {
            for (let i = 0, len = obj.length; i < len; i++) {
                this.insert(obj[i]);
            }
            return;
        }
        if (this.nodes.length) {
            let index = this.getIndex(obj);
            // Only add the object to a subnode if it can fit completely
            // within one
            if (index != -1) {
                this.nodes[index].insert(obj);
                return;
            }
        }
        this.objects.push(obj);
        // Prevent infinite splitting
        if (this.objects.length > this.maxObjects && this.level < this.maxLevels) {
            if (this.nodes[0] == null) {
                this.split();
            }
            let i = 0;
            while (i < this.objects.length) {
                let index = this.getIndex(this.objects[i]);
                if (index != -1) {
                    this.nodes[index].insert((this.objects.splice(i, 1))[0]);
                }
                else {
                    i++;
                }
            }
        }
    };
    /*
     * Determine which node the object belongs to. -1 means
     * object cannot completely fit within a node and is part
     * of the current node
     */
    getIndex(obj: any) {
        let index = -1;
        let verticalMidpoint = this.bounds.x + this.bounds.width / 2;
        let horizontalMidpoint = this.bounds.y + this.bounds.height / 2;
        // Object can fit completely within the top quadrant
        let topQuadrant = (obj.y < horizontalMidpoint && obj.y + obj.height < horizontalMidpoint);
        // Object can fit completely within the bottom quandrant
        let bottomQuadrant = (obj.y > horizontalMidpoint);
        // Object can fit completely within the left quadrants
        if (obj.x < verticalMidpoint &&
            obj.x + obj.width < verticalMidpoint) {
            if (topQuadrant) {
                index = 1;
            }
            else if (bottomQuadrant) {
                index = 2;
            }
        }
        // Object can fix completely within the right quandrants
        else if (obj.x > verticalMidpoint) {
            if (topQuadrant) {
                index = 0;
            }
            else if (bottomQuadrant) {
                index = 3;
            }
        }
        return index;
    };
    /*
     * Splits the node into 4 subnodes
     */
    split() {
        // Bitwise or [html5rocks]
        let subWidth = (this.bounds.width / 2) | 0;
        let subHeight = (this.bounds.height / 2) | 0;
        this.nodes[0] = new QuadTree({
            x: this.bounds.x + subWidth,
            y: this.bounds.y,
            width: subWidth,
            height: subHeight
        }, this.level + 1);
        this.nodes[1] = new QuadTree({
            x: this.bounds.x,
            y: this.bounds.y,
            width: subWidth,
            height: subHeight
        }, this.level + 1);
        this.nodes[2] = new QuadTree({
            x: this.bounds.x,
            y: this.bounds.y + subHeight,
            width: subWidth,
            height: subHeight
        }, this.level + 1);
        this.nodes[3] = new QuadTree({
            x: this.bounds.x + subWidth,
            y: this.bounds.y + subHeight,
            width: subWidth,
            height: subHeight
        }, this.level + 1);
    };
}