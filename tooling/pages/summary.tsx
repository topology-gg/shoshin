import AtomState, { AtomStatus, AtomType } from '../src/types/AtomState';
import Unit from './unit';
import { UnitText } from '../src/types/UnitState';
import { BgStatus } from '../src/types/UnitState';
import Frame from '../src/types/Frame';
import styles from '../styles/Home.module.css'
import { useTranslation } from 'react-i18next';

export default function Summary ({ frames, n_cycles }) {

    const { t } = useTranslation();

    if (!frames) {
        return <>{t('summary.title')}: n/a</>
    }

    const target_type: AtomType = AtomType.SAFFRON
    const target_bg: BgStatus = BgStatus.ATOM_SAFFRON_FREE
    const last_frame: Frame = frames[frames.length-1]

    // Get total delivery
    const total_delivery = last_frame.delivered_accumulated.filter(t => t == target_type).length;

    // Get static cost
    const static_cost = frames[0].cost_accumulated

    // Calculate average latency & average dynamic cost per delivery
    // 1. mark the frame index and accumulated cost at each devliery
    // 2. find average dynamic cost and average latency
    let frame_indices_at_delivery = []
    let costs_accumulated_at_delivery = []
    for (var frame_i = 1; frame_i < frames.length; frame_i++){
        const prev_count = frames[frame_i-1].delivered_accumulated.filter(t => t == target_type).length;
        const curr_count = frames[frame_i  ].delivered_accumulated.filter(t => t == target_type).length;
        if (curr_count > prev_count) { // delivery at this frame
            frame_indices_at_delivery.push(frame_i)
            costs_accumulated_at_delivery.push(frames[frame_i].cost_accumulated)
        }
    }
    const n_deliveries = frame_indices_at_delivery.length
    const average_latency_str = n_deliveries == 0 ? `>${n_cycles}` : (
        frame_indices_at_delivery[n_deliveries-1] / n_deliveries
    ).toString();
    const average_dynamic_cost_str = n_deliveries == 0 ? `n/a` : (
        costs_accumulated_at_delivery[n_deliveries-1] / n_deliveries
    ).toString();

    // Calculate average latency & average dynamic cost per delivery
    // 1. find the duration from start to first delivery, if any
    // 2. find the latency between all subsequent deliveries
    // 3. compute average
    // let have_found_first = false
    // let frames_of_delivery = []
    // let latencies = []
    // let dynamic_costs = []
    // for (const [frame_i, frame] of frames.entries()) {
    //     // find if there's a delivery of truffle atom at this frame - 1 or 0, given there's only one sink for now
    //     if (frame_i == 0) continue;
    //     const prev_count = frames[frame_i-1].delivered_accumulated.filter(t => t == target_type).length;
    //     const curr_count = frames[frame_i  ].delivered_accumulated.filter(t => t == target_type).length;
    //     if (curr_count > prev_count) {
    //         if (!have_found_first) { // is first delivery
    //             // record sum of dynamic cost up to this delivery
    //             dynamic_costs.push (frame.cost_accumulated - static_cost)

    //             // record latency up to this delivery
    //             latencies.push (frame_i)

    //             // record this frame number
    //             frames_of_delivery.push (frame_i)
    //         }
    //         else {
    //             const frame_i_at_last_delivery = frames_of_delivery[frames_of_delivery.length-1]

    //             // record sum of dynamic cost accrued between previous and this delivery
    //             dynamic_costs.push (frame.cost_accumulated - frames[frame_i_at_last_delivery].cost_accumulated)

    //             // record latency between previous and this delivery
    //             latencies.push (frame_i - frame_i_at_last_delivery)

    //             // record this frame number
    //             frames_of_delivery.push (frame_i)
    //         }
    //     }
    // }
    // const sum_latencies = latencies.reduce((a, b) => a + b, 0);
    // const sum_dynamic_costs = dynamic_costs.reduce((a, b) => a + b, 0);
    // const average_latency_str = latencies.length == 0 ? `>${n_cycles}` : (sum_latencies / latencies.length).toString();
    // const average_dynamic_cost_str = latencies.length == 0 ? `n/a` : (sum_dynamic_costs / dynamic_costs.length).toString();

    // Makeshift styling the reported numbers
    const makeshift_number_style = {
        textDecoration: 'underline',
        marginLeft: '0.2rem'
    }

    return (
        <>
            <p style={{textDecoration: 'underline'}}>{t('summary.title')}</p>

            <div style={{display:'flex',flexDirection:'row'}}>
                <p>{t('summary.total')}</p>
                <Unit
                    state={{
                        bg_status: target_bg,
                        border_status: null,
                        unit_text: UnitText.EMPTY,
                        unit_id: null,
                    }}
                    handleMouseOut={() => {}}
                    handleMouseOver={() => {}}
                />
                <p>{t('summary.inFrames', { frames: n_cycles })}:</p>
                <p style={makeshift_number_style}>{total_delivery}</p>
            </div>

            <div style={{display:'flex',flexDirection:'row'}}>
                <p>{t('summary.averageLatency')}</p>
                <Unit
                    state={{
                        bg_status: target_bg,
                        border_status: null,
                        unit_text: UnitText.EMPTY,
                        unit_id: null,
                    }}
                    handleMouseOut={() => {}}
                    handleMouseOver={() => {}}
                />
                <p>{t('summary.delivery')}:</p>
                <p style={makeshift_number_style}>{average_latency_str}</p>
            </div>

            <div style={{display:'flex',flexDirection:'row'}}>
                <p>{t('summary.averageDynamicCost')}</p>
                <Unit
                    state={{
                        bg_status: target_bg,
                        border_status: null,
                        unit_text: UnitText.EMPTY,
                        unit_id: null,
                    }}
                    handleMouseOut={() => {}}
                    handleMouseOver={() => {}}
                />
                <p>{t('summary.delivery')}:</p>
                <p style={makeshift_number_style}>{average_dynamic_cost_str}</p>
            </div>

            <div style={{display:'flex',flexDirection:'row'}}>
                <p>{t('summary.staticCost')}:</p>
                <p style={makeshift_number_style}>{static_cost}</p>
            </div>
        </>
    )
}
