interface INode {
    label: string;
    children: Array<INode>;
    distance: number;
}
export class Elements {
    private _distances: number[][] = [];
    private _amount: number = 0;
    private _distancesNodesMap = [];
    private nextLabelIndex: number = 0;
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

    public get treeMaximum() {
        this.getTree((a, b) => a < b);
        return this._distancesNodesMap;
    }

    constructor() {
        this._amount = 3;
        this.randomizeDistances();
        this.setDebugData();
        const tree = this.treeMaximum;
    }
    public setDebugData() {
        this._amount = 4;
        this._distances = [
            [0, 5, 0.5, 2],
            [5, 0, 1, 0.6],
            [0.5, 1, 0, 2.5],
            [2, 0.6, 2.5, 0],
        ]
        this._distancesNodesMap = [
            {
                label: 'x1',
                children: []
            },
            {
                label: 'x2',
                children: []
            },
            {
                label: 'x3',
                children: []
            },
            {
                label: 'x4',
                children: []
            }
        ]
    }
    private getTree(compare: (n1: number, n2: number) => boolean) {
        let currI = 0;
        let currJ = 0;
        let distances = Array.from(this.distances);
        for (let i = 0; i < this.amount; ++i) {
            distances[i] = Array.from(this.distances[i]);
        }
        let currEl = distances[0][1];
        let tAmount = this.amount;
        while (distances.length > 0) {
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
            const newNode: INode = {
                children: [Object.assign(this._distancesNodesMap[currI]), Object.assign(this._distancesNodesMap[currJ])],
                distance: currEl,
                label: this.getNextLabel()
            }

            let minDistances = Array.from(distances[0]);
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
        this._distances = [];
        for (let i = 0; i < this.amount; ++i) {
            this.distances.push([]);
            this._distancesNodesMap.push({
                name: `x${i + 1}`,
                children: [],
            });
            for (let j = 0; j < this.amount; ++j) {
                let nextNumber = 0;
                if (i === j) {
                    nextNumber = 0;
                } else if (j < i) {
                    nextNumber = this.distances[j][i];
                } else {
                    nextNumber = this.getRandomNumber(0, 99);
                }
                this.distances[i].push(nextNumber);
            }
        }
    }

    private getRandomNumber(start: number, end: number): number {
        return Math.floor(Math.random() * (end - start + 1) + start);
    }
}