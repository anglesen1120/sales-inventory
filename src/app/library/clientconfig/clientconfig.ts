
export class ClientConfig {
  private static resClientConfig: any = require('../../../assets/document/resclient-config.json');
  private static charSplit = ';';
  private static keyClientConfig = 'ClientConfig';

  public static GetResClientConfig(pKey: string) {
    return this.resClientConfig[this.keyClientConfig][pKey];
  }

  public static GetPageSizeOptions(): Array<string> {
    const value = this.resClientConfig[this.keyClientConfig].PageSizeOptions;
    return value.split(this.charSplit);
  }
  public static GetPageLable(): string {
    return this.resClientConfig[this.keyClientConfig].PageLable;
  }
  public static GetFunction(): string {
    return this.resClientConfig[this.keyClientConfig].Funtion;
  }





}

