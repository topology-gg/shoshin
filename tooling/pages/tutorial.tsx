import Unit from './unit';
import UnitState, {BgStatus, BorderStatus, UnitText} from '../src/types/UnitState';
import { CSSProperties } from 'react';

export default function Tutorial() {

    const FORMULA_LI_STYLE: CSSProperties = {display:'flex', flexDirection:'row', alignItems:'center'}

    return (
        <div style={{borderBottom:'1px solid #333333', marginBottom: '2rem'}}>
            <p style={{fontSize:'0.9rem',marginTop:'0',marginBottom:'0'}}>Makeshift tutorial</p>
            <ol style={{width:'30rem', marginTop:'0.5rem', marginBottom:'2rem'}}>
                <li>Only Singleton mechanism ("mech") is available, whose instruction set is [W,A,S,D] for movement, Z for pick-up, X for put-down.</li>
                <li>_ as instruction means no-operation.</li>
                <li>During simulation, each mech cycles through its own program (sequence of instructions) on repeat.</li>
                <li>On operator placement: operands and product must be contiguous grids i.e. for a+b=c, a&b and b&c must both be neighbors. When the contiguity rule is violated, operator symbols are not rendered.</li>
            </ol>

            <p style={{fontSize:'0.9rem',marginTop:'0',marginBottom:'0'}}>Formula list</p>
            <ol style={{width:'30rem', marginTop:'0.5rem', marginBottom:'2rem'}}>
                <li style={FORMULA_LI_STYLE}>
                    <Unit
                        state={{bg_status: BgStatus.ATOM_VANILLA_FREE, border_status: null, unit_text: UnitText.EMPTY, unit_id: null}}
                    /> +
                    <Unit
                        state={{bg_status: BgStatus.ATOM_VANILLA_FREE, border_status: null, unit_text: UnitText.EMPTY, unit_id: null}}
                    /> =
                    <Unit
                        state={{bg_status: BgStatus.ATOM_HAZELNUT_FREE, border_status: null, unit_text: UnitText.EMPTY, unit_id: null}}
                    />
                </li>
                <li style={FORMULA_LI_STYLE}>
                    <Unit
                        state={{bg_status: BgStatus.ATOM_HAZELNUT_FREE, border_status: null, unit_text: UnitText.EMPTY, unit_id: null}}
                    /> +
                    <Unit
                        state={{bg_status: BgStatus.ATOM_HAZELNUT_FREE, border_status: null, unit_text: UnitText.EMPTY, unit_id: null}}
                    /> =
                    <Unit
                        state={{bg_status: BgStatus.ATOM_CHOCOLATE_FREE, border_status: null, unit_text: UnitText.EMPTY, unit_id: null}}
                    />
                </li>
            </ol>
        </div>
    )
}
