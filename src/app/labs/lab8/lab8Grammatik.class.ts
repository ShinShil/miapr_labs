import { NumberUtils } from "../../number.util";

interface ILab8Node {
    word: string;
    letter: string;
    next: ILab8Node;
    parents: ILab8Node[];
    recursiveFunc: boolean;
}

export class Lab8Grammatik {
    private res: string;
    private existingNodes: { [key: string]: ILab8Node };
    private tails: ILab8Node[];
    private notTails: ILab8Node[];
    private tailLength = 2;
    private nextLabel = 1;
    private terminalNodes: ILab8Node[] = [];
    private tree: ILab8Node;

    constructor() {

    }

    generate(amount: number, terms: string[]) {
        this.res = '';
        this.existingNodes = {};
        this.tails = [];
        this.notTails = [];
        this.terminalNodes = [];
        for (let i = 0; i < terms.length; ++i) {
            this.addToTree(terms[i]);
        }
        this.updateRecursiveState();
        console.log(this.existingNodes);
        for (let i = 0; i < amount; ++i) {

        }
        return this.res;
    }

    private generateWord(): string {
        const tailIndex = NumberUtils.getRandomNumber(0, this.tails.length - 1);
        const notTailIndex = NumberUtils.getRandomNumber(0, this.notTails.length - 1);
        return '';
    }

    private addToTree(term: string, parent: ILab8Node = null): ILab8Node {
        let newItem = null;
        let existingNode = this.existingNodes[term];
        if (!existingNode && term) {
            newItem = {
                letter: term.substr(0, 1),
                parents: [],
                word: term,
                recursiveFunc: false
            } as any;
            if (parent) {
                newItem.parents.push(parent);
            }
            const existingNewNode = this.existingNodes[term.substr(1)];
            newItem.next = existingNewNode || this.addToTree(term.substr(1), newItem);
            if (existingNewNode) {
                    existingNewNode.parents.push(newItem);
            }

            if(newItem.next == null) {
                this.terminalNodes.push(newItem);
            }
            this.existingNodes[term] = newItem;
        }
        if (existingNode && parent) {
            existingNode.parents.push(parent);
        }
        return newItem;
    }

    private updateRecursiveState(nodes: ILab8Node[] = null) {
        nodes = nodes || this.terminalNodes;
        for (let node of nodes) {
            for (let i = 0; i < node.parents.length; ++i) {
                let recursive = node.parents[i].letter === node.letter;
                let max = 3;
                while (node.parents[i].letter === node.letter && max-- > 1) {
                    for (let grandParent of node.parents[i].parents) {
                        grandParent.next = node;
                        node.parents[i] = grandParent;
                        delete this.existingNodes[node.parents[i].word];
                    }
                }
                node.recursiveFunc = node.recursiveFunc || recursive;
                this.updateRecursiveState(node.parents);
            }
        }
    }
}