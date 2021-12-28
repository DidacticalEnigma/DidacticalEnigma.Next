export abstract class LayoutConfig<Root, Child> {
    protected abstract makeRoot(tree: Child): Root;
    protected abstract makeHSplit(left: Child, right: Child, ratio: number): Child;
    protected abstract makeVSplit(top: Child, bottom: Child, ratio: number): Child;
    protected abstract makeLeaf(identifier: string): Child;
    
    public makeTree(rawLayout: any): Root {
        if(rawLayout["Type"] === "root") {
            const child = this.makeChild(rawLayout["Tree"]);
            return this.makeRoot(child);
        }

        throw "FUCK";
    }

    private makeChild(tree: object): Child {
        const type = tree["Type"];
        if(type === "vsplit") {
            const ratio = this.makeRatio(tree["LeftDimension"], tree["RightDimension"]);
            return this.makeVSplit(
                this.makeChild(tree["First"]),
                this.makeChild(tree["Second"]),
                ratio)
        }
        if(type === "hsplit") {
            const ratio = this.makeRatio(tree["LeftDimension"], tree["RightDimension"]);
            return this.makeHSplit(
                this.makeChild(tree["First"]),
                this.makeChild(tree["Second"]),
                ratio)
        }
        if(type === "end") {
            return this.makeLeaf(tree["Content"]);
        }

        throw "FUCK";
    }

    private makeRatio(leftDimension: string, rightDimension: string) : number {
        leftDimension = leftDimension.replace("*", "");
        rightDimension = rightDimension.replace("*", "");
        const left = leftDimension.length === 0 ? 1 : parseFloat(leftDimension);
        const right = rightDimension.length === 0 ? 1 : parseFloat(rightDimension);
        return left / (left + right);
    }

    private makeLeftDimension(ratio: number) : string {
        return `${ratio}*`;
    }

    private makeRightDimension(ratio: number) : string {
        return `${100 - ratio}*`;
    }
    
    public serialize(root: Root): object {
        const result = {};
        const visitRoot = this.serializeVisitRoot(root);
        result["Tree"] = this.serializeChild(visitRoot.tree, visitRoot.treeType);
        result["Type"] = "root";
        return result;
    }

    private serializeChild(node: Child, type: "vsplit" | "hsplit" | "leaf"): object {
        const result = {};
        switch(type)
        {
            case "vsplit": {
                const visitResult = this.serializeVisitVSplit(node);
                result["First"] = this.serializeChild(visitResult.top, visitResult.topType);
                result["Second"] = this.serializeChild(visitResult.bottom, visitResult.bottomType);
                result["LeftDimension"] = this.makeLeftDimension(visitResult.ratio);
                result["RightDimension"] = this.makeRightDimension(visitResult.ratio);
                result["Type"] = "vsplit";
                break;
            }
            case "hsplit": {
                const visitResult = this.serializeVisitHSplit(node);
                result["First"] = this.serializeChild(visitResult.left, visitResult.leftType);
                result["Second"] = this.serializeChild(visitResult.right, visitResult.rightType);
                result["LeftDimension"] = this.makeLeftDimension(visitResult.ratio);
                result["RightDimension"] = this.makeRightDimension(visitResult.ratio);
                result["Type"] = "hsplit";
                break;
            }
            case "leaf": {
                const visitResult = this.serializeVisitLeaf(node);
                result["Content"] = visitResult.identifier;
                result["Type"] = "end";
                break;
            }
        }
        return result;
    }

    protected abstract serializeVisitRoot(root: Root) : { tree: Child, treeType: "vsplit" | "hsplit" | "leaf" };
    protected abstract serializeVisitHSplit(node: Child) : { left: Child, leftType: "vsplit" | "hsplit" | "leaf", right: Child, rightType: "vsplit" | "hsplit" | "leaf", ratio: number };
    protected abstract serializeVisitVSplit(node: Child) : { top: Child, topType: "vsplit" | "hsplit" | "leaf", bottom: Child, bottomType: "vsplit" | "hsplit" | "leaf", ratio: number };
    protected abstract serializeVisitLeaf(node: Child) : { identifier: string };
}