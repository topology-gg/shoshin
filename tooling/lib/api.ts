import useSWR from 'swr';

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
    console.log('updateMindRequest', url, requestBody);
    const response = await fetch(url, {
        method: 'PUT', // Adjust the method based on your API endpoint requirements.
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
