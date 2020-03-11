import { ValidationError } from 'class-validator';
export default class BusinessException extends Error {
  __proto__: Error;

  children: any;

  isPermission: boolean | undefined;

  constructor(message?: string, children?: any, isPermission? : boolean) {
    const trueProto = new.target.prototype;
    super(message);
    // eslint-disable-next-line no-proto
    this.__proto__ = trueProto;
    this.children = children;
    this.isPermission = isPermission;
  }

  public static GENERAL = {
    NULL_VALUE: 'GENERAL_NULL_VALUE',
    PERMISSION: 'PERMISSION'
  };

  public static AUTH = {
    INVALID_USERNAME: 'AUTH_INVALID_USERNAME',
    INVALID_PASSWORD: 'AUTH_INVALID_PASSWORD'
  };

  public static BILL = {
    AUSENT: 'BILL_AUSENT',
    INVALID_VALUES: 'BILL_INVALID_VALUES'
  };

  public static CONTRACTOR = {
    NOT_FOUND: 'CONTRACTOR_NOT_FOUND'
  };

  public static BOLETO = {
    NOT_FOUND: 'BOLETO_NOT_FOUND',
    INVALID_IDENTIFICATION: 'INVALID_IDENTIFICATION'
  };

  public static TRANSACTION = {
    NOT_FOUND: 'TRANSACTION_NOT_FOUND'
  };

  public toJson() {
    return [<ValidationError>{
      constraints: {
        code: this.message
      },
      property: '',
      children: this.children ? this.children : []
    }];
  }
}
