import { RegexContract } from './regex.contract';

export class RemoveSpaceRegex extends RegexContract {
  execute(text: string): string {
    return text.replace(/\s/g, '');
  }
}
