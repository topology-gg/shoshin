import Solution from "../types/Solution";

export interface WrappedSolution {
    name: string
    solution: Solution
}

// credit: https://stackoverflow.com/questions/70436175/how-to-save-json-in-localstorage-using-reactjs

export const saveWrappedSolutionToLocal = (name: string, data: WrappedSolution) => {
    // rejecting amount
    if (name == 'namespace') {
        alert ("'namespace' is not a good name (shh)")
        return;
    }

    const namespaceStr = localStorage.getItem('namespace')
    if (!namespaceStr) { // this is the first save
        localStorage.setItem('namespace', JSON.stringify([name]));
        localStorage.setItem(name, JSON.stringify(data));
    }
    else {
        const namespace = JSON.parse(namespaceStr) as string[]
        if (namespace.includes(name)){
            alert (`${name} is already in use`)
            return;
        }
        const newNamespace = namespace.concat([name])
        localStorage.setItem(name, JSON.stringify(data));
        localStorage.setItem('namespace', JSON.stringify(newNamespace));
    }
};

export const getWrappedSolutionFromLocal = (name: string): WrappedSolution => {
    // note: does not check if name exists; rely on external safeguarding
    const data = localStorage.getItem(name);
    return JSON.parse(data) as WrappedSolution;
};

export const getNamespaceFromLocal = (): string[] => {
    if (typeof window == "undefined") return;

    const namespace = localStorage.getItem('namespace')
    return JSON.parse(namespace) as string[]
}

export const removeWrappedSolutionFromLocal = (name: string) => {
    // note: does not check if name exists; rely on external safeguarding
    localStorage.removeItem(name);

    const namespaceStr = localStorage.getItem('namespace')
    let namespace = JSON.parse(namespaceStr) as string[]
    const index = namespace.indexOf(name)
    namespace.splice(index, 1); // remove one item at index

    localStorage.setItem('namespace', JSON.stringify(namespace));
};
