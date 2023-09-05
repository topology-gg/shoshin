import useSWR from 'swr';
import { SearchType } from '../src/components/OnlineMenu/Search';

//@ts-ignore
const fetcher = (...args) => fetch(...args).then((res) => res.json());

export function useAgents() {
    return useSWR('/api/agents/submitted', fetcher);
}

export function useLeagueAgents() {
    return useSWR('/api/agents/league', fetcher);
}

export function useWhitelist() {
    return useSWR('/api/whitelist/whitelist', fetcher);
}

export function useStardiscRegistryByAccount(account) {
    return useSWR(`/api/stardisc_registry/${account}`, fetcher);
}

// Helper function to perform the API request.
async function updateMindRequest(url, requestBody) {
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return await response.json();
}

export function useUpdateMind(username, character, mindName, mind) {
    return useSWR<any, any>(
        `/api/minds/${username}/${character}/${mindName}`,
        () =>
            updateMindRequest(
                `/api/minds/${username}/${character}/${mindName}`,
                mind
            )
    );
}

export function useListMinds(searchType: SearchType, searchTerm: string) {
    let url = '/api/minds/list';

    if (searchType == SearchType.MindName && searchTerm.length) {
        url += '?';
        url += `mindName=${searchTerm}`;
    } else if (searchType == SearchType.PlayerName && searchTerm.length) {
        url += '?';
        url += `playerName=${searchTerm}`;
    }
    return useSWR(url, fetcher);
}

async function getMindRequest(url) {
    const response = await fetch(url, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return await response.json();
}
export function useGetMind(username, character, mindName) {
    return useSWR<any, any>(
        `/api/minds/${username}/${character}/${mindName}`,
        () => getMindRequest(`/api/minds/${username}/${character}/${mindName}`)
    );
}

export function useGetScoresForOpponents(indexes, max = 999999) {
    return useSWR(
        `/api/campaign/list?opponentIndex=${indexes}&max=${max}`,
        fetcher
    );
}

async function submitCampaignMindRequest(url, requestBody) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return await response.json();
}

export function useSubmitCampaignMind(index, mind, address) {
    const reqBody = {
        mind,
        address,
    };
    return useSWR<any, any>(`/api/campaign/${index}}`, () =>
        submitCampaignMindRequest(`/api/campaign/${index}`, reqBody)
    );
}

export function useGetMindFromId(id) {
    return useSWR(`/api/minds/id?id=${id}`, fetcher);
}
