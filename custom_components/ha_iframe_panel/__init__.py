import os
import uuid

DOMAIN = 'ha_iframe_panel'
VERSION = '1.0'
ROOT_PATH = '/ha_iframe_panel-api/' + VERSION

def setup(hass, config):
    cfg  = config[DOMAIN]
    # 注册静态目录
    local = hass.config.path("custom_components/ha_iframe_panel/local")
    if os.path.isdir(local):
        hass.http.register_static_path(ROOT_PATH, local, False)

    hass.components.frontend.add_extra_js_url(hass, ROOT_PATH + '/ha-iframe-panel.js')
    for i, item in enumerate(cfg):
        _dict = {}
        frontend_url_path = 'ha_iframe_panel_'+str(i)
        if item['type'] == 'fullscreen':
            _dict['fullscreen'] = True
            _dict['url'] = item['url']
            _name = '全屏显示'
        elif item['type'] == 'blank':
            _dict['blank'] = True
            _dict['url'] = item['url']
            _name = '新开页面'
        elif item['type'] == 'hass':
            _dict['hass'] = True
            _name = '内置页面'
            frontend_url_path = item['url'].strip('/')
        elif item['type'] == 'tabs':
            _dict['list'] = item['list']
            _name = 'TAB页面'
        
        if 'name' in item:
            _name = item['name']
        
        _icon = 'mdi:react'    
        if 'icon' in item:
            _icon = item['icon']
        
        hass.components.frontend.async_register_built_in_panel(
            "ha-iframe-panel",
            _name,
            _icon,
            frontend_url_path,
            config=_dict,
            require_admin=False)

    return True