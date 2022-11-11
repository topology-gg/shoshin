import Solution from "../types/Solution";


// credit: https://stackoverflow.com/questions/70436175/how-to-save-json-in-localstorage-using-reactjs

export const saveSolutionToLocal = (name: string, data: Solution) => {
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

export const getSolutionFromLocal = (name: string): Solution => {
    // note: does not check if name exists; rely on external safeguarding
    const data = localStorage.getItem(name);
    return JSON.parse(data) as Solution;
};

export const getNamespaceFromLocal = (): string[] => {
    if (typeof window == "undefined") return;

    const namespaceStr = localStorage.getItem('namespace')
    const namespace = JSON.parse(namespaceStr) as string[]
    return namespace.filter(name => name!=='');
}

export const removeSolutionFromLocal = (name: string) => {
    // note: does not check if name exists; rely on external safeguarding
    localStorage.removeItem(name);

    const namespaceStr = localStorage.getItem('namespace')
    let namespace = JSON.parse(namespaceStr) as string[]
    const index = namespace.indexOf(name)
    namespace.splice(index, 1); // remove one item at index

    localStorage.setItem('namespace', JSON.stringify(namespace));
};
