class HaIframePanel extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({ mode: 'open' });
        const div = document.createElement('div');
        div.className = 'ha-iframe-panel'
        div.innerHTML = `
		  <app-header-layout style="height:100%;">
    
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
	
	  // 触发事件
    fire(type, data) {
        const event = new Event(type, {
            bubbles: true,
            cancelable: false,
            composed: true
        });
        event.detail = data;
        this.dispatchEvent(event);
    }

    get panel() {
        return this._panel
    }

    set panel(value) {
        this._panel = value

        this.init(value.config, value.title)
    }

    setUrl(link) {
        // 如果当前是http，并且在手机端，则打开新页面
		let isSafe = location.protocol === 'https:' && link.indexOf('http://') === 0
		if(isSafe){
			this.fire('hass-notification', {message: '请手动允许访问http链接'})
		}
        if (isSafe && /Android|iPhone|iPad/.test(navigator.userAgent)) {
            window.open(link)
        }
        let iframe = this.shadow.querySelector('iframe')
        iframe.src = link
    }

    init({ url, fullscreen, blank, hass, list }, title) {
        const { shadow } = this
        if (Array.isArray(list)) {
            let tabs = shadow.querySelector('paper-tabs')
            if (tabs.children.length === 0) {
                tabs.addEventListener('iron-activate', () => {
                    setTimeout(() => {
                        let tab = tabs.querySelector('.iron-selected')
                        let link = tab.getAttribute('page-name')
                        this.setUrl(link)
                    }, 50)
                })
				// 设置初始化链接
				if(list.length > 0) this.setUrl(list[0].url)
				setTimeout(()=>{
					let style = document.createElement('style')
					style.textContent = `
					paper-icon-button[icon='paper-tabs:chevron-left'].not-visible{
						opacity: 1!important;
					}
					paper-icon-button[icon='paper-tabs:chevron-left'].not-visible:before{
						content: '≡';
						position: absolute;
						margin-left: 5px;
						font-size: 25px;
						background-color: var(--primary-color);
						z-index: 1;
					}
					`
					tabs.shadowRoot.appendChild(style)
					let lb = tabs.shadowRoot.querySelector("paper-icon-button[icon='paper-tabs:chevron-left']")
					lb.addEventListener('click',()=>{
						if(lb.classList.contains('not-visible')){
							this.fire('hass-toggle-menu')
						}
					})
				},1000)
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


        this.setUrl(url)
    }
}

customElements.define('ha-panel-ha-iframe-panel', HaIframePanel);