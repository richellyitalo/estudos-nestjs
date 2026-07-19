import { Injectable } from '@nestjs/common';

@Injectable()
export class StringUtils {
  reverse(text: string) {
    return text.split('').reverse().join('');
  }
}
