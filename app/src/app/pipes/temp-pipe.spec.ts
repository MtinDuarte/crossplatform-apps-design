import { FromCelsiusToFarenheitPipe } from './temp-pipe';

describe('TempPipe', () => {
  it('create an instance', () => {
    const pipe = new FromCelsiusToFarenheitPipe();
    expect(pipe).toBeTruthy();
  });
});
