import AtomState, { AtomStatus, AtomType } from '../src/types/AtomState';
import Unit from './unit';
import UnitState, {BgStatus, BorderStatus, UnitText} from '../src/types/UnitState';
import styles from '../styles/Delivery.module.css'
import { useTranslation } from 'react-i18next';

export default function Delivery({ delivered, cost_accumulated }) {

    const { t } = useTranslation();

    if (!delivered) {
        return <>{t('delivery.accumulatedCost')}: n/a | {t('delivery.delivered')}: n/a</>
    }
    else if (delivered.length == 0) {
        return <>{t('delivery.accumulatedCost')}: {cost_accumulated} / {t('delivery.delivered')}: 0</>
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
            {t('delivery.accumulatedCost')}: {cost_accumulated} | {t('delivery.delivered')}
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
                        case AtomType.SAFFRON:
                            bg_status = BgStatus.ATOM_SAFFRON_FREE
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
                                handleMouseOut={() => {}}
                                handleMouseOver={() => {}}
                            />
                        </div>
                    )
                })
            }
        </>
    )
}
