import eventsCenter from '../Game/EventsCenter';
import { Frame, FrameLike } from '../types/Frame';

export default {
    key: 'ui',

    plugins: ['InputPlugin'],

    create: function () {
        this.timerText = this.add
            .text(400, 30, '--', {
                fontSize: 24,
                fontFamily: 'sans-serif',
                fill: 'black',
            })
            .setOrigin(0.5, 0.5)
            .setVisible(false);

        this.PlayerOneEvent = this.add.text(25, 60, '', {
            fontFamily: 'Oswald',
            fontSize: '48px',
            color: '#FFFB37',
            fontStyle: 'italic',
            stroke: '#000000',
            strokeThickness: 3,
            shadow: {
                stroke: false,
                offsetX: 10,
                color: '#0000008F',
                fill: true,
                offsetY: 7,
                blur: 6,
            },
            padding: { left: null, right: 30 },
        });

        this.PlayerTwoEvent = this.add.text(600, 60, '', {
            fontFamily: 'Oswald',
            fontSize: '48px',
            color: '#FFFB37',
            fontStyle: 'italic',
            stroke: '#000000',
            strokeThickness: 3,
            shadow: {
                stroke: false,
                offsetX: 10,
                color: '#0000008F',
                fill: true,
                offsetY: 7,
                blur: 6,
            },
            padding: { left: null, right: 30 },
        });

        this.debug_info_objects = {};
        [0,1].forEach(index => {
            this.debug_info_objects[index] = {};
            ['body_state', 'body_counter', 'action', 'position'].forEach( (stats, stats_i) => {
                this.debug_info_objects[index][stats] = {};
                const x = index == 0 ? 10 : 600;
                const y = 10 * stats_i;
                this.debug_info_objects[index][stats]['text'] = this.add.text(x, y, '', {
                    fontFamily: 'sans-serif',
                    fontSize: '18px',
                    color: '#333333',
                    // padding: { left: null, right: 30 },
                });
            })
        });

        eventsCenter
            .on('timer-change', this.onTimerChange, this)
            .on('timer-reset', this.onTimerReset, this)
            .on('timer-hide', this.onTimerHide, this)
            .on('player-event-create', this.onPlayerEventCreate, this)
            .on('player-event-remove', this.onPlayerEventRemove, this)
            .on('frame-data-show', this.onFrameDataShow, this)
            .on('frame-data-hide', this.onFrameDataHide, this);

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
        onTimerChange: function (value) {
            this.timerText.setText(`${value}`);
        },

        onTimerReset: function () {
            this.timerText.setVisible(true);
            this.timerText.setText('--');
        },

        onTimerHide: function () {
            this.timerText.setVisible(false);
        },

        // Note Next JS Hot/Fast reloading nullifies these text boxes, we should create new one rather than edit existing
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

        onFrameDataShow: function (frames: FrameLike[]) {
            [0,1].forEach(index => {
                this.debug_info_objects[index]['body_state']['text'].setText(`${frames[index].body_state.state}`);
                this.debug_info_objects[index]['body_counter']['text'].setText(`${frames[index].body_state.counter}`);
                this.debug_info_objects[index]['action']['text'].setText(`${ (frames[index] as Frame).action }`);
                this.debug_info_objects[index]['position']['text'].setText(`(${frames[index].physics_state.pos.x},${frames[index].physics_state.pos.y})`);
            })
        },

        onFrameDataHide: function () {
            [0,1].forEach(index => {
                this.debug_info_objects[index]['body_state']['text'].setText('');
                this.debug_info_objects[index]['body_counter']['text'].setText('');
                this.debug_info_objects[index]['action']['text'].setText('');
                this.debug_info_objects[index]['position']['text'].setText('');
            })
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
