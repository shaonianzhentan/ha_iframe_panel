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


# 更新日志

### v1.3
- 解决不能操作侧边栏显示隐藏的问题
- 添加https打开http链接时提示

### v1.2
- 解决tabs选项卡中，在手机端无法打开http页面的问题

### v1.0
- 基本功能完成