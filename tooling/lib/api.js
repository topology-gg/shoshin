import useSWR from "swr"

const fetcher = (...args) => fetch(...args).then(res => res.json())

export function useSolutions () {
    return useSWR('/api/solutions', fetcher)
}

export function useStardiscRegistryByAccount (account) {
    return useSWR(`/api/stardisc_registry/${account}`, fetcher)
}