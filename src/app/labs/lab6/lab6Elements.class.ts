import * as d3 from 'd3';

export interface INode {
    label: string;
    children: Array<INode>;
    distance: number;
    posX: number;
}
export class Elements {
    private _distances: number[][] = [];
    private _amount: number = 0;
    private _distancesNodesMap: INode[] = [];
    private nextLabelIndex: number = 0;
    private scaleX: any;
    private scaleY: any;
    private getNextLabel = () => {
        return 'abcdefghijklmnopqarstuv'[this.nextLabelIndex++];
    }

    public get distances() {
        return this._distances;
    }
    public set amount(a: number) {
        this._amount = a;
    }

    public get amount() {
        return this._amount;
    }

    public get treeMaximum(): INode {
        this.getTree((a, b) => a < b);
        return this._distancesNodesMap[0];
    }

    constructor() {
        this._amount = 3;
        this.randomizeDistances();
        this.setDebugData();
        const tree = this.treeMaximum;
    }
    public updateTree() {
        this.randomizeDistances();
    }
    public setDebugData() {
        this._amount = 4;
        this._distances = [
            [0, 5, 0.5, 2],
            [5, 0, 1, 0.6],
            [0.5, 1, 0, 2.5],
            [2, 0.6, 2.5, 0],
        ]
        this._distancesNodesMap = [];
        for (let i = 0; i < this.amount; ++i) {
            this._distancesNodesMap.push({
                label: `x${i + 1}`,
                children: [],
                posX: i + 1,
                distance: 0
            })
        }
    }
    private getTree(compare: (n1: number, n2: number) => boolean) {
        let currI = 0;
        let currJ = 0;
        let distances = Array.from(this.distances);
        this.nextLabelIndex = 0;
        for (let i = 0; i < this.amount; ++i) {
            distances[i] = Array.from(this.distances[i]);
        }
        let currEl = distances[0][1];
        let tAmount = this.amount;
        while (this._distancesNodesMap.length != 1) {
            currI = 1;
            currJ = 0;
            let currEl = distances[1][0];
            for (let i = 0; i < this.amount; ++i) {
                for (let j = 0; j < this.amount; ++j) {
                    if (j !== i) {
                        if (currEl > distances[i][j]) {
                            currEl = distances[i][j];
                            currI = i;
                            currJ = j;
                        }
                    }
                }
            }
            let posX = (this._distancesNodesMap[currI].posX + this._distancesNodesMap[currJ].posX) / 2;
            if(posX === this._distancesNodesMap[currI].posX) {
                posX *= 1.25;
            }
            const newNode: INode = {
                children: [Object.assign(this._distancesNodesMap[currI]), Object.assign(this._distancesNodesMap[currJ])],
                distance: currEl,
                label: this.getNextLabel(),
                posX: posX
            }

            let minDistances = Array.from(distances[currI]);
            for (let i = 0; i < this.amount; ++i) {
                if (i === currI || i === currJ) {
                    for (let j = 0; j < this.amount; ++j) {
                        if (i !== j) {
                            if (minDistances[j] > distances[i][j]) {
                                minDistances[j] = distances[i][j];
                            }
                        }
                    }
                }
            }
            minDistances = minDistances.filter((val, i) => i !== currI && i !== currJ);

            for (let j = 0; j < this.amount; ++j) {
                distances[j] = distances[j].filter((val, i) => i !== currI && i !== currJ);
            }
            distances = distances.filter((val, i) => i !== currI && i !== currJ);
            this._distancesNodesMap = this._distancesNodesMap.filter((val, i) => i !== currI && i !== currJ);
            this._distancesNodesMap.push(newNode);

            if (distances.length > 0) {
                for (let i = 0, j = 0; i < this.amount - 2; ++i, ++j) {
                    distances[i].push(minDistances[i])
                }
                distances.push([]);
                for (let j = 0; j < this.amount - 2; ++j) {
                    distances[this.amount - 2].push(distances[j][this.amount - 2]);
                }
                distances[this.amount - 2].push(0);

                this.amount -= 1;
            }
        }
        this.amount = tAmount;
    }

    private randomizeDistances() {
        if (this.amount && this.amount < 20 && this.amount > 0) {
            this._distances = [];
            this._distancesNodesMap = [];
            for (let i = 0; i < this.amount; ++i) {
                this.distances.push([]);
                this._distancesNodesMap.push({
                    label: `x${i + 1}`,
                    children: [],
                    distance: 0,
                    posX: i + 1
                });
                for (let j = 0; j < this.amount; ++j) {
                    let nextNumber = 0;
                    if (i === j) {
                        nextNumber = 0;
                    } else if (j < i) {
                        nextNumber = this.distances[j][i];
                    } else {
                        nextNumber = this.getRandomNumber(1, 99);
                    }
                    this.distances[i].push(nextNumber);
                }
            }
        }
    }

    private getRandomNumber(start: number, end: number): number {
        return Math.floor(Math.random() * (end - start + 1) + start);
    }
}