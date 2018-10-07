type PkgWithScope = string; // pkg@scope
type VersionScope = string;
type FileParseItem = {
    version: string,  // certain version
    resolved: string, // url
    dependencies: {[key: string]: VersionScope}
};
type FileParseResult = {
    type: string,
    object: {[key: PkgWithScope]: FileParseItem}
};

type GraphInput = {
    nodes: {
        id: string,
        group: number
    },
    links: {
        source: string, // id
        target: string, // id
        value: number
    }
};

function parseFile(content: string): FileParseResult {
}

function drawSamePkg(pkg: string, result: FileParseResult): GraphInput {
}
function drawPathToRoot(pkg: string, result: FileParseResult): GraphInput {
}
function drawSubDepsTree(pkg: string, result: FileParseResult): GraphInput {
}
