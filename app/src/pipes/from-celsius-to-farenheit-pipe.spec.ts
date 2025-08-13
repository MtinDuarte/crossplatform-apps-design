import { FromCelsiusToFarenheitPipe } from './from-celsius-to-farenheit-pipe';

describe('FromCelsiusToFarenheitPipe', () => {
  it('create an instance', () => {
    const pipe = new FromCelsiusToFarenheitPipe();
    expect(pipe).toBeTruthy();
  });
});
