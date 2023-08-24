import useSWR from 'swr';

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

export function useListMinds() {
    return useSWR('/api/minds/list', fetcher);
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
