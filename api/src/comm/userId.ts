import * as crypto from 'crypto';

const ALLOWED =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-~!@#$%&*()_';
const MAX_LEN = 12;

export interface GenerateOptions {
  length?: number; // 默认 12
  salt?: string; // 仅 deterministic 模式使用
}

/**
 * 随机生成用户唯一标识
 * 由数字、大小写字母、常用符号组成，长度不超过 12 位
 */
export function generateRandomId(length: number = MAX_LEN): string {
  if (!Number.isInteger(length) || length < 1 || length > MAX_LEN) {
    throw new Error(`length must be an integer between 1 and ${MAX_LEN}`);
  }

  const charsetLen = ALLOWED.length;
  const bytes = crypto.randomBytes(length);
  let id = '';
  for (let i = 0; i < length; i++) {
    const idx = bytes[i] % charsetLen;
    id += ALLOWED[idx];
  }
  return id;
}

/**
 * 基于用户信息生成确定性 ID
 * 相同 seed + salt 始终生成相同的结果
 */
export function generateDeterministicId(
  seed: string,
  { length = MAX_LEN, salt = 'default_salt' }: GenerateOptions = {}
): string {
  if (!seed || typeof seed !== 'string') {
    throw new Error('seed must be a non-empty string');
  }
  if (!Number.isInteger(length) || length < 1 || length > MAX_LEN) {
    throw new Error(`length must be an integer between 1 and ${MAX_LEN}`);
  }

  const hmac = crypto.createHmac('sha256', salt);
  hmac.update(seed);
  const digest = hmac.digest();

  const charsetLen = ALLOWED.length;
  let id = '';
  for (let i = 0; id.length < length; i++) {
    const b = digest[i % digest.length];
    id += ALLOWED[b % charsetLen];
  }
  return id;
}

/**
 * 校验字符串是否符合 userId 规范
 */
export function isValidUserId(id: string): boolean {
  if (typeof id !== 'string') return false;
  if (id.length === 0 || id.length > MAX_LEN) return false;
  for (const ch of id) {
    if (!ALLOWED.includes(ch)) return false;
  }
  return true;
}

// 导出常量
export { ALLOWED, MAX_LEN };
