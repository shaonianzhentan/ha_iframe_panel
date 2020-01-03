# ha_iframe_panel
一个在HA里使用的iframe面板

# 使用方式

```

ha_iframe_panel:
  - type: fullscreen
    name: 全屏
    icon: mdi:react
    url: https://demo.home-assistant.io/
  - type: blank
    name: 打开新页面
    icon: mdi:react
    url: https://demo.home-assistant.io/
  - type: hass
    name: 打开内置页面
    icon: mdi:react
    url: /config/integrations/dashboard
  - type: tabs
    name: 切换卡页面
    icon: mdi:react
    list:
      - name: 第一个页面
        icon: mdi:react
        url: https://demo.home-assistant.io/
      - name: 第二个页面
        url: https://demo.home-assistant.io/
      - name: 第二个页面
        url: https://demo.home-assistant.io/
      - name: 第二个页面
        url: https://demo.home-assistant.io/
      - name: 第二个页面
        url: https://demo.home-assistant.io/
      - name: 第二个页面
        url: https://demo.home-assistant.io/
      - name: 第二个页面
        url: https://demo.home-assistant.io/

```