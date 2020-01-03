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
		  <app-header-layout has-scrolling-region>
    
			<app-header class="header" fixed="" slot="header" style="transition-duration: 0ms; transform: translate3d(0px, 0px, 0px);">		  
			  <paper-tabs scrollable role="tablist" selected="0"></paper-tabs>
			</app-header>

            <iframe></iframe>
			 </app-header-layout>
        `
        shadow.appendChild(div)

        const style = document.createElement('style')
        style.textContent = `
            app-header{
                background-color: var(--primary-color);
                font-weight: 400;
                color: var(--text-primary-color, white);
            }
            app-header ha-icon{height:18px;}
            .ha-iframe-panel{
                position: relative;
                width: 100%;
                overflow: hidden;
                height: 100vh;
                z-index: 0;}
            .ha-iframe-panel iframe{width:100%;height:calc(100vh - 48px);border:none;}
            .ha-iframe-panel.fullscreen app-header{display:none;}
            .ha-iframe-panel.fullscreen iframe{height:100vh;}
            .hide{display:none;}
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
	
            let tabs = shadow.querySelector('paper-tabs')
			if(tabs.children.length === 0){
				tabs.addEventListener('iron-activate',()=>{
					let tab = tabs.querySelector('.iron-selected')
					shadow.querySelector('iframe').src = tab.getAttribute('page-name')
				})
			}
			tabs.innerHTML = ''
            list.forEach((ele, index) => {
                let tab = document.createElement('paper-tab')
                tab.innerHTML = `<ha-icon icon="${ele.icon}"></ha-icon>${ele.name}`
				tab.setAttribute('page-name', ele.url)
                tabs.appendChild(tab)
            })
			
            return
        }
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
}

customElements.define('ha-panel-ha-iframe-panel', HaIframePanel);