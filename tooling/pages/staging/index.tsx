import dynamic from 'next/dynamic';

const Staging = dynamic(() => import("../../src/Game/StagingGame.tsx"), {
    ssr: false,
});

export default function Home() {
    return(<div>
        <Staging />
    </div>)

}