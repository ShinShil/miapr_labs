import { NumberUtils } from "../../number.util";
import { forOwn, values } from 'lodash';
import { D3Utils } from "../../d3.utils";

interface ILab8Node {
    word: string;
    letter: string;
    next: ILab8Node;
    parents: ILab8Node[];
    recursiveFunc: boolean;
    getVal?(): string;
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
        this.cleanTheTree();
        const rules = values(this.existingNodes);
        this.res = '';
        for (let i = 0; i < amount; ++i) {
            const index = NumberUtils.getRandomNumber(0, rules.length - 1);
            this.res += `${rules[index].getVal()} `;
        }
        return this.res;
    }

    private addToTree(term: string, parent: ILab8Node = null): ILab8Node {
        let newItem = null;
        const existingNode = this.existingNodes[term];
        if (!existingNode && term) {
            newItem = {
                letter: term.substr(0, 1),
                parents: [],
                word: term,
                recursiveFunc: false,
            } as any;
            if (parent) {
                newItem.parents.push(parent);
            }
            const existingNewNode = this.existingNodes[term.substr(1)];
            newItem.getVal = () => {
                return newItem.next ? newItem.letter + newItem.next.getVal() : newItem.letter;
            }
            newItem.next = existingNewNode || this.addToTree(term.substr(1), newItem);
            if (existingNewNode) {
                existingNewNode.parents.push(newItem);
            }

            if (newItem.next == null) {
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
        for (const node of nodes) {
            for (let i = 0; i < node.parents.length; ++i) {
                const max = 5;
                for (let j = 0; j < node.parents[i].parents.length; ++j) {
                    if (node.parents[i].parents[j].letter === node.parents[i].letter && node.parents[i].parents[j].parents.length !== 0) {
                        for (let k = 0; k < node.parents[i].parents[j].parents.length; ++k) {
                            node.parents[i].parents[j].parents[k].next = node.parents[i];
                            node.parents[i].parents.push(node.parents[i].parents[j].parents[k]);
                        }
                        node.parents[i].getVal = () => {
                            return node.parents[i].letter.repeat(NumberUtils.getRandomNumber(0, 7)) + node.getVal();
                        }
                        node.parents[i].recursiveFunc = true;
                        node.parents[i].parents.splice(j, 1);
                        --j;
                    }
                }
                this.updateRecursiveState(node.parents);
            }
        }
    }

    private cleanTheTree() {
        const uniqChars = [];
        forOwn(this.existingNodes, (node, key) => {
            if (node.parents.length > 0 || uniqChars.indexOf(node.letter) !== -1) {
                delete this.existingNodes[key];
            } else {
                uniqChars.push(node.letter);
            }
        });
    }
}
