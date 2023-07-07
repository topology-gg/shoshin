import eventsCenter from '../Game/EventsCenter';
import {
    PHASER_CANVAS_W,
    PHASER_CANVAS_H,
    bodyStateNumberToName,
} from '../constants/constants';
import { Action, CHARACTERS_ACTIONS } from '../types/Action';
import { Frame, FrameLike } from '../types/Frame';

const HP_BAR_COLOR = 0xf7a08c;
const STAMINA_BAR_COLOR = 0xadd8e6;
const STATS_BAR_W = 410;
const STATS_BAR_H = 26;
const STATS_BAR_X_OFFSET = 30;
const STATS_BAR_Y_OFFSET = 30;
const STATA_BAR_Y_SPACING = 15;
const STATS_BAR_P1_LEFT_BOUND = STATS_BAR_X_OFFSET + STATS_BAR_W / 2;
const STATS_BAR_P2_LEFT_BOUND =
    PHASER_CANVAS_W - STATS_BAR_X_OFFSET - STATS_BAR_W / 2;
const STATS_BAR_HP_Y = STATS_BAR_Y_OFFSET;
const STATS_BAR_STAMINA_Y = STATS_BAR_HP_Y + STATS_BAR_H + STATA_BAR_Y_SPACING;
const STATS_BAR_BG_BORDER_STROKEWIDTH = 1;

export interface statsInfo {
    hp: number;
    stamina: number;
}

export default {
    key: 'ui',

    plugins: ['InputPlugin'],

    create: function () {
        //
        // Create hp and stamina bar
        //
        this.stats_bars = {};
        [0, 1].forEach((playerIndex) => {
            this.stats_bars[playerIndex] = {};
            const x =
                playerIndex == 0
                    ? STATS_BAR_P1_LEFT_BOUND
                    : STATS_BAR_P2_LEFT_BOUND;
            this.stats_bars[playerIndex]['hp_bg'] = this.add
                .rectangle(
                    x,
                    STATS_BAR_HP_Y,
                    STATS_BAR_W + STATS_BAR_BG_BORDER_STROKEWIDTH,
                    STATS_BAR_H + STATS_BAR_BG_BORDER_STROKEWIDTH
                )
                .setStrokeStyle(STATS_BAR_BG_BORDER_STROKEWIDTH, 0x0)
                .setFillStyle(0x111111, 0.7)
                .setVisible(false);

            this.stats_bars[playerIndex]['hp'] = this.add
                .rectangle(x, STATS_BAR_HP_Y, STATS_BAR_W, STATS_BAR_H)
                .setFillStyle(HP_BAR_COLOR)
                .setVisible(false);

            this.stats_bars[playerIndex]['stamina_bg'] = this.add
                .rectangle(
                    x,
                    STATS_BAR_STAMINA_Y,
                    STATS_BAR_W + STATS_BAR_BG_BORDER_STROKEWIDTH,
                    STATS_BAR_H + STATS_BAR_BG_BORDER_STROKEWIDTH
                )
                .setStrokeStyle(STATS_BAR_BG_BORDER_STROKEWIDTH, 0x0)
                .setFillStyle(0x111111, 0.7)
                .setVisible(false);

            this.stats_bars[playerIndex]['stamina'] = this.add
                .rectangle(x, STATS_BAR_STAMINA_Y, STATS_BAR_W, STATS_BAR_H)
                .setFillStyle(STAMINA_BAR_COLOR)
                .setVisible(false);
        });

        //
        // Create timer countdown text
        //
        this.timerText = this.add
            .text(PHASER_CANVAS_W / 2, 50, '', {
                fontSize: 62,
                fontFamily: 'Oswald',
                // fill: '#FF7E00',
                fill: '#FEEEAA',
                stroke: '#111111',
                strokeThickness: 5,
            })
            .setOrigin(0.5, 0.5)
            .setVisible(false);
        this.timerFractionalText = this.add
            .text(PHASER_CANVAS_W / 2 + 36, 60, '', {
                fontSize: 24,
                fontFamily: 'Oswald',
                // fill: '#FF7E00',
                fill: '#FEEEAA',
                stroke: '#000000',
                strokeThickness: 4,
            })
            .setOrigin(0.5, 0.5)
            .setVisible(false);

        //
        // Event alert for player 1
        //
        this.PlayerOneEvent = this.add
            .text(25, 140, '', {
                fontFamily: 'Oswald',
                fontSize: '36px',
                color: '#FFFB37',
                fontStyle: 'italic',
                stroke: '#000000',
                strokeThickness: 4,
                // shadow: {
                //     stroke: false,
                //     offsetX: 10,
                //     color: '#000000bb',
                //     fill: true,
                //     offsetY: 7,
                //     blur: 6,
                // },
                padding: { left: null, right: 30 },
            })
            .setAlpha(0.8);

        //
        // Event alert for player 2
        //
        this.PlayerTwoEvent = this.add
            .text(600, 140, '', {
                fontFamily: 'Oswald',
                fontSize: '36px',
                color: '#FFFB37',
                fontStyle: 'italic',
                stroke: '#000000',
                strokeThickness: 4,
                // shadow: {
                //     stroke: false,
                //     offsetX: 10,
                //     color: '#00000022',
                //     fill: true,
                //     offsetY: 7,
                //     blur: 6,
                // },
                padding: { left: null, right: 30 },
            })
            .setAlpha(0.8);

        //
        // Frame data shown under debug mode
        //
        this.debug_info_objects = {};
        const borderWidth = 250;
        const borderHeight = 86.5;
        const borderStrokeWidth = 4;
        const topMargin = 10;
        const topPadding = 5;
        const leftMargin = 5;
        [0, 1].forEach((index) => {
            const x = index == 0 ? 10 : PHASER_CANVAS_W - borderWidth - 5;
            this.debug_info_objects[index] = {};

            this.debug_info_objects[index]['border'] = this.add
                .rectangle(
                    x + borderWidth / 2 - leftMargin,
                    borderHeight / 2 + topMargin,
                    borderWidth,
                    borderHeight
                )
                .setStrokeStyle(borderStrokeWidth, 0x0, 0.2)
                .setVisible(false);

            ['body_state', 'body_counter', 'action', 'position'].forEach(
                (stats, stats_i) => {
                    const rowHeight = 20.5;
                    const y = rowHeight * stats_i + topMargin + topPadding;
                    const descWidth = 120;

                    this.debug_info_objects[index][stats] = {};

                    this.debug_info_objects[index][stats]['bg'] = this.add
                        .rectangle(
                            x + borderWidth / 2 - 5,
                            y + 7.5,
                            borderWidth - 5,
                            rowHeight
                        )
                        .setFillStyle(0x0, stats_i % 2 == 0 ? 0.6 : 0.7)
                        .setStrokeStyle(0, 0x0, 0.0)
                        .setVisible(false);

                    this.debug_info_objects[index][stats]['desc'] =
                        this.add.text(x, y, '', {
                            fontFamily: 'sans-serif',
                            fontSize: '15px',
                            color: '#fff',
                        });

                    this.debug_info_objects[index][stats]['data'] =
                        this.add.text(x + descWidth, y, '', {
                            fontFamily: 'sans-serif',
                            fontSize: '15px',
                            fontStyle: 'bold',
                            color: '#fff',
                        });
                }
            );
        });

        //
        // End game message
        //
        this.endTextBg = this.add
            .rectangle(
                PHASER_CANVAS_W / 2,
                PHASER_CANVAS_H / 2,
                PHASER_CANVAS_W,
                300
            )
            .setFillStyle(0x222222, 0.95)
            .setVisible(false);
        this.endText = this.add
            .text(PHASER_CANVAS_W / 2, PHASER_CANVAS_H / 2 - 20, '', {
                fontSize: 30,
                color: '#fff',
            })
            .setOrigin(0.5);
        this.endTextFootnote = this.add
            .text(PHASER_CANVAS_W / 2, PHASER_CANVAS_H / 2 + 20, '', {
                fontSize: 18,
                color: '#fff',
            })
            .setOrigin(0.5);

        //
        // Register event handlers at events center
        //
        eventsCenter
            .on('timer-change', this.onTimerChange, this)
            .on('timer-reset', this.onTimerReset, this)
            .on('timer-hide', this.onTimerHide, this)
            .on('player-event-create', this.onPlayerEventCreate, this)
            .on('player-event-remove', this.onPlayerEventRemove, this)
            .on('frame-data-show', this.onFrameDataShow, this)
            .on('frame-data-hide', this.onFrameDataHide, this)
            .on('end-text-show', this.onEndTextShow, this)
            .on('end-text-hide', this.onEndTextHide, this)
            .on('update-stats', this.onStatsUpdate, this)
            .on('reset-stats', this.onStatsReset, this);

        // this.scene.get('play').events
        // eventsCenter
        //     .on('pause', this.showPauseText, this)
        //     .on('resume', this.hidePauseText, this)
        //     .on('shutdown', this.hidePauseText, this);

        // this.input.keyboard
        //   .on('keydown-SPACE', this.togglePause, this)
        //   .on('keydown-R', this.restartPlay, this)
        //   .on('keydown-Q', this.quitPlay, this)
        //   .on('keydown-Z', this.toggleZoom, this);
    },

    extend: {
        //
        // Timer countdown handlers
        //
        onTimerChange: function (whole, fractional) {
            this.timerText.setText(`${whole}`);
            this.timerFractionalText.setText(`.${fractional}`);
        },
        onTimerReset: function () {
            this.timerText.setVisible(true);
            this.timerText.setText('');
            this.timerFractionalText.setVisible(true);
            this.timerFractionalText.setText('');
        },
        onTimerHide: function () {
            this.timerText.setVisible(false);
            this.timerFractionalText.setVisible(false);
        },

        //
        // Stats handlers
        //
        onStatsUpdate: function (stats: statsInfo[]) {
            // render P1 stats
            this.stats_bars[0]['hp_bg'].setVisible(true);
            this.stats_bars[0]['stamina_bg'].setVisible(true);
            this.stats_bars[0]['hp']
                .setSize((stats[0]['hp'] / 1000) * STATS_BAR_W, STATS_BAR_H)
                .setPosition(
                    STATS_BAR_P1_LEFT_BOUND +
                        (1 - stats[0]['hp'] / 1000) * STATS_BAR_W,
                    STATS_BAR_HP_Y
                )
                .setVisible(true);
            this.stats_bars[0]['stamina']
                .setSize(
                    (stats[0]['stamina'] / 1000) * STATS_BAR_W,
                    STATS_BAR_H
                )
                .setPosition(
                    STATS_BAR_P1_LEFT_BOUND +
                        (1 - stats[0]['stamina'] / 1000) * STATS_BAR_W,
                    STATS_BAR_STAMINA_Y
                )
                .setVisible(true);

            // render P2 stats
            this.stats_bars[1]['hp_bg'].setVisible(true);
            this.stats_bars[1]['stamina_bg'].setVisible(true);
            this.stats_bars[1]['hp']
                .setSize((stats[1]['hp'] / 1000) * STATS_BAR_W, STATS_BAR_H)
                .setVisible(true);
            this.stats_bars[1]['stamina']
                .setSize(
                    (stats[1]['stamina'] / 1000) * STATS_BAR_W,
                    STATS_BAR_H
                )
                .setVisible(true);
        },

        onStatsReset: function () {
            this.onStatsUpdate([
                { hp: 1000, stamina: 1000 },
                { hp: 1000, stamina: 1000 },
            ]);
        },

        //
        // Event alert handlers
        // Note: Next JS Hot/Fast reloading nullifies these text boxes, we should create new one rather than edit existing
        //
        onPlayerEventCreate: function (
            playerIndex: number,
            eventText: string,
            eventCount: number
        ) {
            if (playerIndex == 1) {
                this.PlayerOneEvent?.setText(
                    eventCount > 0
                        ? `${eventText} x${eventCount + 1}`
                        : eventText
                );
            } else {
                this.PlayerTwoEvent?.setText(
                    eventCount > 0
                        ? `${eventText} x${eventCount + 1}`
                        : eventText
                );
            }
        },
        onPlayerEventRemove: function (playerIndex: number) {
            console.log('remove event ', playerIndex);

            if (playerIndex == 1) {
                this.PlayerOneEvent?.setText(``);
            } else {
                this.PlayerTwoEvent?.setText(``);
            }
        },

        //
        // Frame data handlers
        //
        onFrameDataShow: function (frames: FrameLike[]) {
            [0, 1].forEach((index) => {
                this.debug_info_objects[index]['border'].setVisible(true);

                // body state
                const state = frames[index].body_state.state;
                const isAntoc = state > 1000;
                const stateName =
                    bodyStateNumberToName[isAntoc ? 'antoc' : 'jessica'][state];
                this.debug_info_objects[index]['body_state']['data'].setText(
                    stateName
                );
                this.debug_info_objects[index]['body_state']['desc'].setText(
                    'Body State'
                );
                this.debug_info_objects[index]['body_state']['bg'].setVisible(
                    true
                );

                // body counter (display value+1 to start from 1)
                this.debug_info_objects[index]['body_counter']['data'].setText(
                    `${frames[index].body_state.counter + 1}`
                );
                this.debug_info_objects[index]['body_counter']['desc'].setText(
                    'Body Frame'
                );
                this.debug_info_objects[index]['body_counter']['bg'].setVisible(
                    true
                );

                // action
                console.log('frame', frames[index]);
                const action = (frames[index] as Frame).action;
                const characterActions = CHARACTERS_ACTIONS[isAntoc ? 1 : 0];
                const actionMatched: Action = characterActions.find(
                    (value) => value.id == action
                );
                const actionName = actionMatched
                    ? actionMatched.display.name
                    : '-';
                this.debug_info_objects[index]['action']['data'].setText(
                    actionName
                );
                this.debug_info_objects[index]['action']['desc'].setText(
                    'Action'
                );
                this.debug_info_objects[index]['action']['bg'].setVisible(true);

                // position
                this.debug_info_objects[index]['position']['data'].setText(
                    `(${frames[index].physics_state.pos.x},${frames[index].physics_state.pos.y})`
                );
                this.debug_info_objects[index]['position']['desc'].setText(
                    'Position'
                );
                this.debug_info_objects[index]['position']['bg'].setVisible(
                    true
                );
            });
        },

        onFrameDataHide: function () {
            [0, 1].forEach((index) => {
                this.debug_info_objects[index]['border'].setVisible(false);

                ['body_state', 'body_counter', 'action', 'position'].forEach(
                    (stats) => {
                        this.debug_info_objects[index][stats]['bg'].setVisible(
                            false
                        );
                        ['data', 'desc'].forEach((item) => {
                            this.debug_info_objects[index][stats][item].setText(
                                ''
                            );
                        });
                    }
                );
            });
        },

        //
        // End game message handlers
        //
        onEndTextShow: function (text: string, footnote?: string) {
            if (footnote) {
                this.endTextFootnote.setText(footnote);
            }
            this.endText.setText(text);
            this.endTextBg.setVisible(true);
        },
        onEndTextHide: function () {
            this.endTextFootnote.setText('');
            this.endText.setText('');
            this.endTextBg.setVisible(false);
        },

        //
        // keyboard event handlers
        //
        // quitPlay: function () {
        //   this.scene
        //     .stop('play')
        //     .run('menu');

        //   // Don't sleep a scene that hasn't started!
        //   if (this.scene.isActive('end')) {
        //     this.scene.sleep('end');
        //   }
        // },

        // restartPlay: function () {
        //   this.scene.launch('play');

        //   // Don't sleep a scene that hasn't started!
        //   if (this.scene.isActive('end')) {
        //     this.scene.sleep('end');
        //   }
        // },

        // togglePause: function () {
        //   if (this.scene.isActive('play')) {
        //     this.scene.pause('play');
        //   } else if (this.scene.isPaused('play')) {
        //     this.scene.resume('play');
        //   }
        // },

        // toggleZoom: function () {
        //   const camera = this.scene.get('play').cameras.main;

        //   camera.setZoom(camera.zoom === 2 ? 1 : 2);
        // }
    },
};
