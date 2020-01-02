import os
import uuid

DOMAIN = 'ha_iframe_panel'
VERSION = '1.0'
URL = '/ha_iframe_panel-api-' + str(uuid.uuid4())
ROOT_PATH = URL + '/' + VERSION

def setup(hass, config):
    cfg  = config[DOMAIN]
    # 注册静态目录
    local = hass.config.path("custom_components/ha_iframe_panel/local")
    if os.path.isdir(local):
        hass.http.register_static_path(ROOT_PATH, local, False)

    hass.components.frontend.add_extra_js_url(hass, ROOT_PATH + '/ha-iframe-panel.js')
    for i, item in enumerate(cfg):
        _dict = {}
        if item['type'] == 'fullscreen':
            _dict['fullscreen'] = True
            _dict['url'] = item['url']
        elif item['type'] == 'blank':
            _dict['blank'] = True
            _dict['url'] = item['url']
        elif item['type'] == 'hass':
            _dict['hass'] = True
            _dict['url'] = item['url']
        elif item['type'] == 'tabs':
            _dict['list'] = item['list']
        
        _name = '页面' + str(i)
        _icon = 'mdi:react'
        if 'name' in item:
            _name = item['name']
            _icon = item['icon']
            
        hass.components.frontend.async_register_built_in_panel(
            "ha-iframe-panel",
            _name,
            _icon,
            frontend_url_path='ha_iframe_panel_'+str(i),
            config=_dict,
            require_admin=False
        )