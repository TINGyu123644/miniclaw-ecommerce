// 默认智能体显示名：电商客服助手
// 旧名 Miniclaw / Default Agent 统一归到这个名字
export function getAgentProfileDisplayName(name?: string | null): string {
  return !name || name === 'Default Agent' || name === 'Miniclaw'
    ? '电商客服助手'
    : name;
}
