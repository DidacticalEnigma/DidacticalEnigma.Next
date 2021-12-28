export class Config {
    private _rawLayout: any;
    
    constructor(rawLayout: any) {
        this._rawLayout = rawLayout;

    }

    public makeTree<Root, Child>(
        rootFactory : (tree: Child) => Root,
        vsplitFactory : (left: Child, right: Child, ratio: number) => Child,
        hsplitFactory : (top: Child, bottom: Child, ratio: number) => Child,
        leafFactory: (identifier: string) => Child
    ): Root {
        if(this._rawLayout["Type"] === "root") {
            const child = this.makeChild(this._rawLayout["Tree"], vsplitFactory, hsplitFactory, leafFactory);
            return rootFactory(child);
        }

        throw "FUCK";
    }

    private makeChild<Child>(
        tree: object,
        vsplitFactory : (left: Child, right: Child, ratio: number) => Child,
        hsplitFactory : (top: Child, bottom: Child, ratio: number) => Child,
        leafFactory: (identifier: string) => Child
    ): Child {
        const type = tree["Type"];
        if(type === "vsplit") {
            const ratio = this.makeRatio(tree["LeftDimension"], tree["RightDimension"]);
            return vsplitFactory(
                this.makeChild(tree["First"], vsplitFactory, hsplitFactory, leafFactory),
                this.makeChild(tree["Second"], vsplitFactory, hsplitFactory, leafFactory),
                ratio)
        }
        if(type === "hsplit") {
            const ratio = this.makeRatio(tree["LeftDimension"], tree["RightDimension"]);
            return hsplitFactory(
                this.makeChild(tree["First"], vsplitFactory, hsplitFactory, leafFactory),
                this.makeChild(tree["Second"], vsplitFactory, hsplitFactory, leafFactory),
                ratio)
        }
        if(type === "end") {
            return leafFactory(tree["Content"]);
        }

        throw "FUCK";
    }

    private makeRatio(leftDimension: string, rightDimension: string) : number {
        leftDimension = leftDimension.replace("*", "");
        rightDimension = rightDimension.replace("*", "");
        const left = parseFloat(leftDimension);
        const right = parseFloat(rightDimension);
        return left / (left + right);
    }
}