---
title: 在非443端口下配置HTTPS协议
date: 2024/05/02
categories:
  - Article
  - Web
---
在HTTPS请求中嵌套HTTP请求会因为浏览器的MIXED_BLOCK问题导致JS和CSS等资源被拦截，这种情况在Nginx+Docker配置子域名反代的时候尤为常见——通常根域名的SSL证书由监听了80和443端口的Nginx容器管理，而子服务则监听服务器上的其他端口，由Nginx根据server_name字段来制定转发策略

HTTPS协议要求证书注册的域名和请求域名必须相同，举例来说，向 https://blog.47saikyo.moe/ 发送请求时，必须要求对方服务器拥有 *.47saikyo.moe 域名的SSL证书才行，在这种情况下，我们无法通过HTTPS协议向IP发送请求，只能向域名发送请求。然而，我们无法在域名后添加端口，做到形如 https://blog.47saikyo.moe:47474 的写法。因此，Nginx中对于 proxy_pass 的配置成为了一个问题

- http://{ip_address}:{port} ，会由于https中的嵌套http请求导致资源无法正常加载
- https://{ip_address}:{port} ，会由于证书和域名的不匹配而导致浏览器警告甚至拦截
- https://{domain}:{port} ，这种写法是不支持的
- https://{domain} 默认转发到443端口，而443端口由被Nginx监听而非子服务，只会导致Nginx的循环重定向

当把域名托管给Cloud-Flare管理（即Nameserver）时，Cloud-Flare的Rules是一个强大的转发功能，可以根据特定的规则对请求进行重写/重定向/转发，可以替代Nginx来负责反向代理的功能，其中OriginRules可以制定域名的端口转发规则，设定blog.47saikyo.moe子域名转发到47474端口（WordPress容器中443端口的映射）下后，就可以实现在保留域名的情况下向非443端口发送请求。
