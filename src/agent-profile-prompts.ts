import type { AgentProfilePromptMode, AgentProfilePrompts } from './types.js';

export const AGENT_PROMPT_SECTION_MAX_LENGTH = 20_000;

export const EMPTY_AGENT_PROFILE_PROMPTS: AgentProfilePrompts = {
  identity_prompt: '',
  soul_prompt: '',
  agents_prompt: '',
  tools_prompt: '',
  prompt_mode: 'append',
};

export const DEFAULT_ECOMMERCE_AGENT_PROFILE_PROMPTS: AgentProfilePrompts = {
  identity_prompt:
    '你是店铺数字员工“电商客服助手”，负责接待顾客、解答商品咨询，并协助处理订单物流与售后问题。',
  soul_prompt:
    '热情、耐心、清晰，不越权承诺；不夸大商品效果，不承诺无法兑现的补偿、退款或售后结果。',
  agents_prompt:
    '按商品咨询、订单物流、退换货三条业务线工作。先识别店铺与顾客意图，再使用当前工作区已授权的信息和工具；信息不足时提出必要问题。涉及退款、补偿、改价、地址修改等操作时，遵守店铺规则与确认流程，不绕过权限边界。',
  tools_prompt:
    '仅查询和操作当前店铺、当前顾客授权范围内的数据。调用工具前核对店铺与订单标识；工具不可用或数据缺失时如实说明，不编造商品、订单、物流或售后结果。',
  prompt_mode: 'append',
};

export function promptModeFromLegacyPreset(
  includeClaudePreset: boolean | undefined,
): AgentProfilePromptMode {
  return includeClaudePreset === false ? 'replace' : 'append';
}

export function includeClaudePresetForMode(
  mode: AgentProfilePromptMode,
): boolean {
  return mode === 'append';
}

function normalizePrompt(value: unknown): string {
  // Request schemas reject over-limit edits. Preserve legacy/database content
  // verbatim here so normalization never turns a visible validation problem
  // into a silent prompt rewrite.
  return typeof value === 'string' ? value : '';
}

export function normalizeAgentProfilePrompts(
  input?: Partial<AgentProfilePrompts> | null,
): AgentProfilePrompts {
  return {
    identity_prompt: normalizePrompt(input?.identity_prompt),
    soul_prompt: normalizePrompt(input?.soul_prompt),
    agents_prompt: normalizePrompt(input?.agents_prompt),
    tools_prompt: normalizePrompt(input?.tools_prompt),
    prompt_mode: input?.prompt_mode === 'replace' ? 'replace' : 'append',
  };
}

export function hasAgentProfilePrompts(
  prompts: Pick<
    AgentProfilePrompts,
    'identity_prompt' | 'soul_prompt' | 'agents_prompt' | 'tools_prompt'
  >,
): boolean {
  return !!(
    prompts.identity_prompt.trim() ||
    prompts.soul_prompt.trim() ||
    prompts.agents_prompt.trim() ||
    prompts.tools_prompt.trim()
  );
}

/**
 * Build the user-configurable Agent prompt in one canonical order. This is not
 * the complete Miniclaw system prompt: platform runtime, channel, and memory
 * instructions are appended outside this block and cannot be removed by
 * prompt_mode=replace.
 */
export function buildAgentProfilePrompt(
  input: Partial<AgentProfilePrompts>,
): string {
  const prompts = normalizeAgentProfilePrompts(input);
  if (!hasAgentProfilePrompts(prompts)) return '';
  return [
    ['IDENTITY', prompts.identity_prompt],
    ['SOUL', prompts.soul_prompt],
    ['AGENTS', prompts.agents_prompt],
    ['TOOLS', prompts.tools_prompt],
  ]
    .filter(([, text]) => text.trim().length > 0)
    .map(([title, text]) => `## ${title}\n${text}`)
    .join('\n\n');
}

export function agentProfilePromptsFromLegacy(
  identityPrompt: string | undefined,
  includeClaudePreset: boolean | undefined,
): AgentProfilePrompts {
  return normalizeAgentProfilePrompts({
    // The old all-in-one identity prompt mostly described operating behavior,
    // so migrate it losslessly into AGENTS instead of pretending it was the
    // new, deliberately narrow IDENTITY section.
    agents_prompt: identityPrompt ?? '',
    prompt_mode: promptModeFromLegacyPreset(includeClaudePreset),
  });
}
