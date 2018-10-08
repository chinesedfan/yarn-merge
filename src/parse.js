// @flow
import { parse } from '@yarnpkg/lockfile';

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

type DepItem = {
    ...FileParseItem,
    id: PkgWithScope,
    name: string,
    parent?: DepItem
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

function parseFile(content: string): Array<DepItem> {
    const directDeps: Array<DepItem> = [];
    const result: FileParseResult = parse(content);
    const parents: {[key: PkgWithScope]: FileParseItem} = {};

    Object.keys(result.object).forEach((pkgWithScope) => {
        const item = result.object[pkgWithScope];
        if (item.dependencies) {
            for (const pkg in item.dependencies) {
                parents[`${pkg}@${item.dependencies[pkg]}`] = item;
            }
        }

        const dep = {
            ...item,
            id: pkgWithScope,
            name: pkgWithScope.substr(0, pkgWithScope.lastIndexOf('@')),
            parent: parents[pkgWithScope]
        };
        if (!dep.parent) {
            directDeps.push(dep);
        }
    });

    return directDeps;
}

function drawSamePkg(pkg: string, result: FileParseResult): GraphInput {
}
function drawPathToRoot(pkg: string, result: FileParseResult): GraphInput {
}
function drawSubDepsTree(pkg: string, result: FileParseResult): GraphInput {
}
