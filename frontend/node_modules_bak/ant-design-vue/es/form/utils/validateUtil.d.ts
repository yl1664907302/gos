import type { InternalNamePath, RuleError, RuleObject, ValidateOptions } from '../interface';
/**
 * We use `async-validator` to validate the value.
 * But only check one value in a time to avoid namePath validate issue.
 */
export declare function validateRules(namePath: InternalNamePath, value: any, rules: RuleObject[], options: ValidateOptions, validateFirst: boolean | 'parallel', messageVariables?: Record<string, string>): Promise<RuleError[]>;
