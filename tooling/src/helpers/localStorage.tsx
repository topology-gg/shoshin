import Solution from "../types/Solution";

export interface WrappedSolution {
    name: string
    solution: Solution
}

// credit: https://stackoverflow.com/questions/70436175/how-to-save-json-in-localstorage-using-reactjs

export const saveWrappedSolutionToLocal = (key: string, data: WrappedSolution) => {
    // rejecting amount
    if (key == 'amount') {
        alert ("'amount' is not a good name")
        return;
    }

    // save the wrapped solution
    localStorage.setItem(key, JSON.stringify(data));

    // update amount
    const amountStr = localStorage.getItem('amount')
    if (!amountStr) {
        localStorage.setItem('amount', JSON.stringify(1));
    }
    else {
        const amount = JSON.parse(amountStr)
        localStorage.setItem('amount', JSON.stringify(amount+1));
    }
};

export const getWrappedSolutionFromLocal = (key: string): WrappedSolution => {
    const data = localStorage.getItem(key);
    return JSON.parse(data) as WrappedSolution;
};

export const getAmountFromLocal = (): number => {
    if (typeof window == "undefined") return;

    const amountStr = localStorage.getItem('amount')
    return JSON.parse(amountStr) as number
}

export const removeWrappedSolutionFromLocal = (key: string) => {
    localStorage.removeItem(key);

    const amountStr = localStorage.getItem('amount')
    const amount = JSON.parse(amountStr)
    localStorage.setItem('amount', JSON.stringify(amount-1));
};
