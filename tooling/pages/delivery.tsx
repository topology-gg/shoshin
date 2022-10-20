import AtomState, { AtomStatus, AtomType } from '../src/types/AtomState';
import Unit from './unit';
import UnitState, {BgStatus, BorderStatus, UnitText} from '../src/types/UnitState';
import styles from '../styles/Delivery.module.css'

export default function Delivery({ delivered, cost_accumulated }) {

    if (!delivered) {
        return <>Accumulated cost: 0 / Delivered: 0</>
    }
    else if (delivered.length == 0) {
        return <>Accumulated cost: {cost_accumulated} / Delivered: 0</>
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
            Accumulated cost: {cost_accumulated} / Delivered
            {
                Object.keys(counts).map(function(key: string,i: number){
                    // const bg_status = key == AtomType.HAZELNUT ? BgStatus.ATOM_HAZELNUT_FREE : BgStatus.ATOM_VANILLA_FREE
                    let bg_status: BgStatus
                    switch(key) {
                        case AtomType.VANILLA:
                            bg_status = BgStatus.ATOM_VANILLA_FREE
                            break;
                        case AtomType.HAZELNUT:
                            bg_status = BgStatus.ATOM_HAZELNUT_FREE
                            break;
                        case AtomType.CHOCOLATE:
                            bg_status = BgStatus.ATOM_CHOCOLATE_FREE
                            break;
                        case AtomType.TRUFFLE:
                            bg_status = BgStatus.ATOM_TRUFFLE_FREE
                            break;
                        default:
                            throw `invalid atom type encountered: ${key}`
                    }
                    return (
                        <div
                            key={`delivery-${key}`}
                            className={styles.deliveryUnit}
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
