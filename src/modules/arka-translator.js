export default class ArkaTranslator {
    constructor({ api, config, block, data }) {
        // Built-in
        this.api = api;
        this.config = config;
        this.block = block;
        this.data = data;

        this.wrapper = {};
        this.settingsButton = {};
        // console.log('data: ', this.data);
    }

    render() {
        this.settingsButton = document.createElement('button');

        this.settingsButton.classList.add(this.api.styles.settingsButton, 'arka-button');
        this.settingsButton.textContent = 'g';
        if (this.data && this.data.arka) {
            this.settingsButton.classList.add(this.api.styles.settingsButtonActive);
        }

        // console.log(this.block.holder);
        this.settingsButton.addEventListener('click', e => {
            e.preventDefault();
            e.target.classList.toggle(this.api.styles.settingsButtonActive);
            this.wrapper.classList.toggle('arka');
            console.log(this.block.holder);
        })

        return this.settingsButton;
    }

    wrap(block_content) {
        this.wrapper = document.createElement('div');
        this.wrapper.appendChild(block_content);

        if (this.data && this.data.arka) {
            this.wrapper.classList.add('arka');
        }

        return this.wrapper;
    }

    save() {
        if (this.wrapper.classList.contains('arka')) {
            return {
                arka: true
            };
        } else {
            return {
                arka: false
            };
        }
    }

    static get isTune() {
        return true;
    }
}
