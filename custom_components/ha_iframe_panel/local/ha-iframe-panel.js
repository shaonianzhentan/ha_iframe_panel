/**
 * 
 * 作者QQ：635147515
 * 日期：2019-12-26
 * 版本：1.2
 * 项目地址：https://github.com/shaonianzhentan/lovelace-ha-iframe-panel
 */

class HaIframePanel extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({ mode: 'open' });
        const div = document.createElement('div');
        div.className = 'ha-iframe-panel'
        div.innerHTML = `
            <div class="header">
                <app-toolbar>
                </app-toolbar>
            </div>
            <iframe></iframe>
        `
        shadow.appendChild(div)

        const style = document.createElement('style')
        style.textContent = `
            app-header, app-toolbar {
                background-color: var(--primary-color);
                font-weight: 400;
                color: var(--text-primary-color, white);
            }
            .ha-iframe-panel{    
                position: relative;
                width: 100%;
                overflow: hidden;
                height: 100vh;
                z-index: 0;}
            .ha-iframe-panel iframe{width:100%;height:calc(100vh - 64px);border:none;}

            .ha-iframe-panel.fullscreen app-toolbar{display:none;}
            .ha-iframe-panel.fullscreen iframe{height:100vh;}
            .hide{display:none;}

            .tabs{       
                position: relative;
                margin-top: -64px;
                left: 60px;
                height: 64px;
                line-height: 64px;
                font-size: 18px;
                color:#d6edfd;display: flex;}
            .tabs div{display: flex;
                align-items: center;
                padding:0 10px;cursor:pointer;white-space: nowrap;}
            .tabs div ha-icon{margin-right:5px;}
            .tabs div.active{color:white;}
        `
        shadow.appendChild(style);

        this.shadow = shadow

        // console.log('%O', this)
    }

    get panel() {
        return this._panel
    }

    set panel(value) {
        this._panel = value

        this.init(value.config, value.title)
    }

    init({ url, fullscreen, blank, hass, list }, title) {
        const { shadow } = this
        if (Array.isArray(list)) {
            this.setTitle('')

            let tabs = document.createElement('div')
            tabs.className = 'tabs'
            list.forEach((ele, index) => {
                let tab = document.createElement('div')
                tab.innerHTML = `<ha-icon icon="${ele.icon}"></ha-icon>${ele.name}`
                tab.dataset['url'] = ele.url
                tab.onclick = function () {
                    let ac = shadow.querySelector('.tabs div.active')
                    ac && ac.classList.remove('active')
                    this.classList.add('active')
                    shadow.querySelector('iframe').src = this.dataset['url']
                }
                if (index === 0) {
                    tab.className = 'active'
                    shadow.querySelector('iframe').src = ele.url
                }
                tabs.appendChild(tab)
            })

            let header = shadow.querySelector('.header')
            header.appendChild(tabs)

            return
        }
        this.setTitle(title)
        if (blank) {
            window.open(url)
            history.back()
            return
        }
        if (hass) {
            document.querySelector('home-assistant')._route = {
                prefix: '',
                path: url,
                __queryParams: {}
            }
            return
        }

        let div = shadow.querySelector('div')
        if (div.classList.contains('fullscreen')) {
            if (fullscreen === false) {
                div.classList.remove('fullscreen')
            }
        } else {
            if (fullscreen) {
                div.classList.add('fullscreen')
            }
        }



        let iframe = shadow.querySelector('iframe')
        iframe.src = url
    }

    set narrow(value) {
       // let menuButton = this.shadow.querySelector('ha-menu-button')
       // menuButton.hass = this.hass || {}
       // menuButton.narrow = value
    }

    setTitle(title) {
        let toolbar = this.shadow.querySelector('app-toolbar')
        if (toolbar.children.length === 0) {
            let menuButton = document.createElement('ha-menu-button')
            toolbar.appendChild(menuButton)

            let div = document.createElement('div')
            div.setAttribute('main-title', '')
            div.textContent = title
            toolbar.appendChild(div)
        }
    }
}

customElements.define('ha-panel-ha-iframe-panel', HaIframePanel);