interface IGrammatikNode {
    line: number,
    nodes: IGrammatikNode[],
    code?: string;
}
export class Grammatik {
    nodes = [
        {
            line: 111,
            nodes: [
                {
                    line: 101,
                    nodes: [
                        {
                            line: 111,
                            nodes: [],
                            code: 'О'
                        }
                    ],
                    code: 'П'
                }
            ]
        }
    ]

    public translate(lines: number[]) {
        return this._translate(lines, 0, this.nodes);
    }

    private _translate(lines: number[], index: number, nodes: IGrammatikNode[]): string {
        let res = null;
        nodes = nodes.filter(node => node.line === lines[index]);
        if(nodes && nodes.length > 0) {
            for(let i = 0; i<nodes.length; ++i) {
                res = this._translate(lines, index + 1, nodes[i].nodes) || nodes[i].code;
            }
        }
        return res;
    }
}
