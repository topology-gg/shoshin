import useSWR from "swr"

const fetcher = (...args) => fetch(...args).then(res => res.json())

export function useAgents () {
    return useSWR('/api/agents/submitted', fetcher)
}

export function useLeagueAgents () {
    return useSWR('/api/agents/league', fetcher)
}

export function useWhitelist () {
    return useSWR('/api/whitelist/whitelist', fetcher)
}

export function useStardiscRegistryByAccount (account) {
    return useSWR(`/api/stardisc_registry/${account}`, fetcher)
}