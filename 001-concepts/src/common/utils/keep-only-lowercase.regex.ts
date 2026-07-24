import { RegexContract } from './regex.contract';

export class KeepOnlyLowerCaseRegex extends RegexContract {
  execute(text: string): string {
    return text.replace(/[^a-z]/g, '');
  }
}
