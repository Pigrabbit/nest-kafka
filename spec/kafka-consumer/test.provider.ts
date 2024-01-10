import { Injectable } from '@nestjs/common';

@Injectable()
export class TestProvider {
  test(...args: unknown[]) {
    // do nothing
  }
}
