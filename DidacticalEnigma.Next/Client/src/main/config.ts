export class Config {
    public makeTree<Root, Child>(
        rootFactory : (tree: Child) => Root,
        vsplitFactory : (left: Child, right: Child, ratio: number) => Child,
        hsplitFactory : (top: Child, bottom: Child, ratio: number) => Child,
        leafFactory: (identifier: string) => Child
    ): Root {
        const s = "{\"Tree\":{\"Type\":\"vsplit\",\"First\":{\"Type\":\"hsplit\",\"First\":{\"Type\":\"vsplit\",\"First\":{\"Type\":\"vsplit\",\"First\":{\"Type\":\"hsplit\",\"First\":{\"Content\":\"9eaf9b28-6abc-40b1-86d1-14967e0fa4da\",\"Type\":\"end\"},\"Second\":{\"Content\":\"e0b9d0e5-be75-4d1e-9f19-7795fd602836\",\"Type\":\"end\"},\"LeftDimension\":\"191.64923081038*\",\"RightDimension\":\"172.580748187074*\"},\"Second\":{\"Content\":\"0c0999f9-f361-46d3-8e24-ba3a7ca669e7|frequently-misunderstood-japanese-1\",\"Type\":\"end\"},\"LeftDimension\":\"184.378390256924*\",\"RightDimension\":\"174.870151839783*\"},\"Second\":{\"Content\":\"c04648ba-68b2-467b-87c4-33da5b9ca070\",\"Type\":\"end\"},\"LeftDimension\":\"364.248542096707*\",\"RightDimension\":\"499.251457903293*\"},\"Second\":{\"Type\":\"vsplit\",\"First\":{\"Content\":\"4c939423-463d-46e1-a8f4-685b1875fdfd\",\"Type\":\"end\"},\"Second\":{\"Type\":\"vsplit\",\"First\":{\"Type\":\"vsplit\",\"First\":{\"Content\":\"6ecf8f92-e97b-4d27-8bbf-1438e987c230\",\"Type\":\"end\"},\"Second\":{\"Content\":\"af65046c-35cb-4856-9774-943203e26979\",\"Type\":\"end\"},\"LeftDimension\":\"*\",\"RightDimension\":\"*\"},\"Second\":{\"Content\":\"4d25d667-d7fc-4f37-9ff5-364dfad46028\",\"Type\":\"end\"},\"LeftDimension\":\"422.745052770449*\",\"RightDimension\":\"188.745052770448*\"},\"LeftDimension\":\"238.009894459103*\",\"RightDimension\":\"616.490105540897*\"},\"LeftDimension\":\"369.229978997454*\",\"RightDimension\":\"290.425405617931*\"},\"Second\":{\"Type\":\"vsplit\",\"First\":{\"Type\":\"hsplit\",\"First\":{\"Content\":\"ed1b840c-b2a8-4018-87b0-d5fc64a1abc8\",\"Type\":\"end\"},\"Second\":{\"Content\":\"af9401b8-958e-4f31-8673-9b64c8a5f2cd\",\"Type\":\"end\"},\"LeftDimension\":\"529.686666666666*\",\"RightDimension\":\"187.686666666667*\"},\"Second\":{\"Content\":\"0c0999f9-f361-46d3-8e24-ba3a7ca669e7|wadai1\",\"Type\":\"end\"},\"LeftDimension\":\"572.606362076031*\",\"RightDimension\":\"458.893637923969*\"},\"LeftDimension\":\"868.5*\",\"RightDimension\":\"1036.5*\"},\"Type\":\"root\"}";
        const root = JSON.parse(s);
        if(root["Type"] === "root") {
            const child = this.makeChild(root["Tree"], vsplitFactory, hsplitFactory, leafFactory);
            return rootFactory(child);
        }

        throw "FUCK";
    }

    private makeChild<Child>(
        tree: any,
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
        const left = parseInt(leftDimension, 10);
        const right = parseInt(rightDimension, 10);
        return left / (left + right);
    }
}