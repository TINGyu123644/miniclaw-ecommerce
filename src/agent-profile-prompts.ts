import type { AgentProfilePromptMode, AgentProfilePrompts } from './types.js';

export const AGENT_PROMPT_SECTION_MAX_LENGTH = 20_000;

export const EMPTY_AGENT_PROFILE_PROMPTS: AgentProfilePrompts = {
  identity_prompt: '',
  soul_prompt: '',
  agents_prompt: '',
  tools_prompt: '',
  prompt_mode: 'append',
};

/**
 * 四段式人设：IDENTITY(身份) / SOUL(价值观) / AGENTS(能力规则) / TOOLS(工具约束)
 * 各段独立存储、独立版本、独立回退，避免改一段连带改坏另一段（对抗大模型幻觉）。
 */
export function buildAgentProfilePrompt(
  input: Partial<AgentProfilePrompts>,
): string {
  const prompts = {
    identity_prompt: input.identity_prompt ?? '',
    soul_prompt: input.soul_prompt ?? '',
    agents_prompt: input.agents_prompt ?? '',
    tools_prompt: input.tools_prompt ?? '',
  };
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
