// @flow
import { parse } from '@yarnpkg/lockfile';

type PkgWithScope = string; // pkg@scope
type VersionScope = string;
type FileParseItem = {
    version: string,  // certain version
    resolved: string, // url
    dependencies?: {[key: string]: VersionScope}
};
type FileParseResult = {
    type: string,
    object: {[key: PkgWithScope]: FileParseItem}
};

type DepItem = {
    ...FileParseItem,
    id: PkgWithScope,
    name: string,
    parents: Array<DepItem>,
    children: Array<DepItem>
};

type GraphInput = {
    nodes: Array<{
        id: string,
        group: number
    }>,
    links: Array<{
        source: string, // id
        target: string, // id
        value: number
    }>
};

export function parseFile(content: string): DepItem {
    const result: FileParseResult = parse(content);
    const depMap: {[key: PkgWithScope]: DepItem} = {};

    // build map first
    Object.keys(result.object).forEach((pkgWithScope) => {
        const item = result.object[pkgWithScope];
        depMap[pkgWithScope] = {
            ...item,
            id: pkgWithScope,
            name: pkgWithScope.substr(0, pkgWithScope.lastIndexOf('@')),
            parents: [],
            children: []
        };
    });

    // then set up connections
    Object.keys(depMap).forEach((pkgWithScope) => {
        const item = depMap[pkgWithScope];
        if (item.dependencies) {
            for (const pkg in item.dependencies) {
                const child = depMap[`${pkg}@${item.dependencies[pkg]}`];
                child.parents.push(item);
                item.children.push(child);
            }
        }
    });

    // extract direct deps at last
    const root: DepItem = {
        id: 'yarn-merge@0.1.0',
        name: 'yarn-merge',
        version: '0.1.0',
        resolved: '// TODO',
        parents: [],
        children: []
    };
    Object.keys(depMap).forEach((pkgWithScope) => {
        const item = depMap[pkgWithScope];
        if (!item.parents.length) {
            item.parents.push(root);
            root.children.push(item);
        }
    });

    return root;
}

export function drawSamePkg(root: DepItem, name: string): GraphInput {
    const q = [root];
    const input: GraphInput = {
        nodes: [],
        links: []
    };
    while (q.length) {
        const item = q.shift();
        input.nodes.push({
            id: item.id,
            group: item.name === name ? 1 : 2
        });

        item.children.forEach((child) => {
            input.links.push({
                source: item.id,
                target: child.id,
                value: 1
            });
        });
        q.push(...item.children);
    }

    return input;
}
function drawPathToRoot(pkg: string, result: FileParseResult): GraphInput {
}
function drawSubDepsTree(pkg: string, result: FileParseResult): GraphInput {
}
