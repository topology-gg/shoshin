import AtomState, { AtomStatus, AtomType } from '../src/types/AtomState';
import Unit from './unit';
import UnitState, {BgStatus, BorderStatus, UnitText} from '../src/types/UnitState';

export default function Delivery({ delivered }) {

    if (!delivered || delivered.length == 0) {
        return <></>
    }

    let counts: { [key: string] : number } = {}
    for (let typ in AtomType){
        const count = delivered.filter(t => t == typ).length;
        if (count == 0) {
            continue;
        }
        counts[typ as string] = count
    }

    return (
        <>
            Delivered:
            {
                Object.keys(counts).map(function(key: string,i: number){
                    const bg_status = key == AtomType.HAZELNUT ? BgStatus.ATOM_HAZELNUT_FREE : BgStatus.ATOM_VANILLA_FREE
                    return (
                        <div
                            key={`delivery-${key}`}
                            style={{display:'flex', flexDirection:'row', marginLeft:'1rem', marginRight:'1rem'}}
                        >
                            <p>{counts[key]} x</p>
                            <Unit
                                state={{
                                    bg_status: bg_status,
                                    border_status: null,
                                    unit_text: UnitText.EMPTY,
                                    unit_id: null
                                }}
                            />
                        </div>
                    )
                })
            }
        </>
    )
}
