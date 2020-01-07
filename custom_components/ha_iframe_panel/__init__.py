import os
import yaml
import uuid
from aiohttp import web
from homeassistant.components.http import HomeAssistantView

DOMAIN = 'ha_iframe_panel'
VERSION = '1.4'
URL = '/ha_iframe_panel-api-' + str(uuid.uuid4())
ROOT_PATH = '/ha_iframe_panel-local/' + VERSION

def setup(hass, config):
    cfg  = config[DOMAIN]
    # 注册静态目录
    local = hass.config.path("custom_components/ha_iframe_panel/local")
    if os.path.isdir(local):
        hass.http.register_static_path(ROOT_PATH, local, False)

    hass.components.frontend.add_extra_js_url(hass, ROOT_PATH + '/ha-iframe-panel.js')
    for i, item in enumerate(cfg):
        _dict = {}
        _panel = "ha-iframe-panel"
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
        elif item['type'] == 'online':            
            _dict['url'] = ROOT_PATH + '/index.html?api=' + URL
            _panel = "iframe"
            _name = '在线TAB页面'
        
        if 'name' in item:
            _name = item['name']
        
        _icon = 'mdi:react'    
        if 'icon' in item:
            _icon = item['icon']
        
        hass.components.frontend.async_register_built_in_panel(
            _panel,
            _name,
            _icon,
            frontend_url_path,
            config=_dict,
            require_admin=True)

    return True


class HassGateView(HomeAssistantView):

    url = URL
    name = DOMAIN
    requires_auth = False
        
    async def post(self, request):
        hass = request.app["hass"]
        try:
            filename = hass.config.path("configuration.yaml")
            config = yaml.full_load(get_file_content(filename))
            cfg  = config[DOMAIN]
            _list = []
            for item in enumerate(cfg):
                if item['type'] == 'online':
                    _list.extend(item['list'])
            return self.json({'code':0, 'msg': '查询成功', 'data': _list})
        except Exception as e:
            print(e)
            return self.json({'code':1, 'msg': '出现异常'})

def get_file_content(filePath):
    with open(filePath, 'rb') as fp:
        return fp.read()