import os
import yaml
import uuid
import logging
from aiohttp import web
from homeassistant.components.http import HomeAssistantView
import homeassistant.config as conf_util

_LOGGER = logging.getLogger(__name__)

DOMAIN = 'ha_iframe_panel'
VERSION = '1.4'
URL = '/ha_iframe_panel-api-' + str(uuid.uuid4())
ROOT_PATH = '/ha_iframe_panel-local/' + VERSION

def setup(hass, config):

    # 显示插件信息
    _LOGGER.info('''
-------------------------------------------------------------------
    左侧iframe面板【作者QQ：635147515】
    
    版本：''' + VERSION + '''    
        
    项目地址：https://github.com/shaonianzhentan/ha_iframe_panel
-------------------------------------------------------------------''')

    cfg  = config[DOMAIN]
    # 注册静态目录
    local = hass.config.path("custom_components/ha_iframe_panel/local")
    if os.path.isdir(local):
        hass.http.register_static_path(ROOT_PATH, local, False)

    hass.components.frontend.add_extra_js_url(hass, ROOT_PATH + '/ha-iframe-panel.js')
    for i, item in enumerate(cfg):
        _dict = {}
        frontend_url_path = 'ha_iframe_panel_' + str(i)
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
            _dict['api'] = URL + '?index=' + str(i)
            _name = 'TAB页面'
        else:
            continue

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

    hass.http.register_view(HassGateView)
    return True


class HassGateView(HomeAssistantView):

    url = URL
    name = DOMAIN
    requires_auth = False
        
    async def post(self, request):
        hass = request.app["hass"]
        try:
            query = request.query
            config = await conf_util.async_hass_config_yaml(hass)            
            cfg  = config[DOMAIN]
            index = int(query.get('index'))
            _list = cfg[index]['list']
            return self.json({'code':0, 'msg': '查询成功', 'data': _list})
        except Exception as e:
            print(e)
            return self.json({'code':1, 'msg': '出现异常'})