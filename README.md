# 电商 Miniclaw

<p align="center">
  <img src="web/public/icons/logo-1024.png" alt="电商 Miniclaw logo" width="96" />
</p>

<p align="center">
  <strong>自托管、多店铺多渠道的 AI 电商客服工作台</strong><br />
  把数字客服、店铺工作区、记忆、商品/订单工具与消息渠道组织在同一个可控运行环境中。
</p>

> 面向电商场景：每个店铺一个独立工作区，售前/售后数字员工按业务线分配，顾客在微信、飞书、Telegram 等渠道的咨询自动路由到对应店铺，商品咨询、订单物流、退换货全流程由 Agent 自主处理。

## 产品定位

电商 Miniclaw 是一个面向电商店铺的自托管 AI 客服工作台。它不是只保存聊天记录的对话框，而是把以下对象放在同一个产品模型中：

- **多店铺隔离**：一个店铺 = 一个独立工作区，记忆、会话、商品库、订单库互不串扰。
- **四段式人设**：身份 / 价值观 / 能力 / 规则四段独立配置，支持分版本修改与回退。
- **多渠道接入**：微信、飞书、Telegram、QQ、钉钉、Discord、WhatsApp 等渠道通过适配器接入，新增渠道只加适配器不改核心。
- **数字员工**：售前、售后按业务线分配不同 Agent，一个工作区一条业务线一个 Agent。
- **工具与自动化**：MCP、Skills、Subagents、Cron 任务，订单/物流查询、退换货流程由 Agent 自主执行。

## 架构

```text
Web Client / 消息渠道
       │ HTTP + WebSocket / Channel Adapters
       ▼
  Miniclaw Backend (Auth · API · Queue · Scheduler · ACL)
       │
  ┌────┴─────┬──────────┐
  ▼          ▼          ▼
Workspace  Capability  Channel
Session    Registry    Binding
Memory     Skills/MCP Delivery
       │
       ▼
  Pi Agent Runner (Host / Docker)
       │
       ▼
  Pi Agent Runtime — Tools · Extensions · Subagents
```

## 快速开始

```bash
npm install
npm --prefix web install
npm --prefix container/agent-runner install
npm run build:all
WEB_PORT=3000 npm start
```

默认地址 http://127.0.0.1:3000 ，首次进入创建管理员并配置 Provider。

## 电商场景默认配置

内置默认智能体「电商客服助手」预置了四段式人设：
- **IDENTITY**：店铺数字员工，接待顾客、解答商品/物流/售后。
- **SOUL**：热情耐心不越权，不夸大、不承诺做不到的售后。
- **AGENTS**：商品咨询 / 订单物流 / 退换货流程 + 红线规则。
- **TOOLS**：只查当前顾客订单，不编造数据。

## License

MIT License。
