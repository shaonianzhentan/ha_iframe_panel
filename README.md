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


### v1.4.1
- 修复动态加载切换卡列表超级慢的问题
- 优化切换卡加载与存储的逻辑

### v1.4
- 支持动态加载切换卡列表（修改后无需重启HA）
- 解决type填写错误后，出现未知页面的问题
- 解决刷新后样式失效的问题

### v1.3
- 解决不能操作侧边栏显示隐藏的问题
- 添加https打开http链接时提示

### v1.2
- 解决tabs选项卡中，在手机端无法打开http页面的问题

### v1.0
- 基本功能完成