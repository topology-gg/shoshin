import UnitState, {BgStatus, BorderStatus} from '../src/types/UnitState';
import styles from '../styles/Unit.module.css';

export default function Unit({ state }) {

    // guardrail
    if (!state) {return <></>}

    // Compute style based on props (from parent's React state)
    let className: string = '';
    let nuclei: number = 0;
    if (state.bg_status === BgStatus.ATOM_VANILLA_FREE) {
        className += styles.atomVanillaFree + ' ';
        nuclei = 1;
    }
    else if (state.bg_status === BgStatus.ATOM_VANILLA_POSSESSED) {
        className += styles.atomVanillaPossessed + ' ';
        nuclei = 1;
    }

    else if (state.bg_status === BgStatus.ATOM_HAZELNUT_FREE) {
        className += styles.atomHazelnutFree + ' ';
        nuclei = 2;
    }
    else if (state.bg_status === BgStatus.ATOM_HAZELNUT_POSSESSED) {
        className += styles.atomHazelnutPossessed + ' ';
        nuclei = 2;
    }

    else if (state.bg_status === BgStatus.ATOM_CHOCOLATE_FREE) {
        className += styles.atomChocolateFree + ' ';
        nuclei = 3;
    }
    else if (state.bg_status === BgStatus.ATOM_CHOCOLATE_POSSESSED) {
        className += styles.atomChocolatePossessed + ' ';
        nuclei = 3;
    }

    // if (state.bg_status === BgStatus.ATOM_CHOCOLATE_FREE) {
    //     className += styles.atomChocolateFree + ' ' + styles.twoNuclei;
    //     nuclei = 2;
    // }
    // else if (state.bg_status === BgStatus.ATOM_CHOCOLATE_POSSESSED) {
    //     className += styles.atomChocolatePossessed + ' ' + styles.twoNuclei;
    //     nuclei = 2;
    // }
    // if (state.bg_status === BgStatus.ATOM_STRAWBERRY_FREE) {
    //     className += styles.atomStrawberryFree + ' ' + styles.threeNuclei;
    //     nuclei = 3;
    // }
    // else if (state.bg_status === BgStatus.ATOM_STRAWBERRY_POSSESSED) {
    //     className += styles.atomStrawberryPossessed + ' ' + styles.threeNuclei;
    //     nuclei = 3;
    // }

    if (state.border_status == BorderStatus.SINGLETON_OPEN) {
        className += styles.mechSingletonOpen + ' ';
    }
    else if (state.border_status == BorderStatus.SINGLETON_CLOSE) {
        className += styles.mechSingletonClose + ' ';
    }

    const mechId = state.unit_id && state.unit_id.includes('mech') && state.unit_id.replace('mech', '')

    // Render
    return (
        <div className={`grid ${styles.unit} ${className}`}>
            {Array.from({length: nuclei}).map((_, i) =>
                <div key={`nucleus${i}`} className={`${styles.nucleus}`} />
            )}
            {state.unit_text}
            {mechId && <div className={styles.unitId}>{mechId}</div>}
        </div>
    )
}
