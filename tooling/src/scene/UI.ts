import eventsCenter from '../Game/EventsCenter';

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

        eventsCenter
            .on('timer-change', this.onTimerChange, this)
            .on('timer-reset', this.onTimerReset, this)
            .on('timer-hide', this.onTimerHide, this);

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
