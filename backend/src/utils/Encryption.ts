export class Encryption {
  static shared = new Encryption();
  private constructor() {}
  
  private xor_key: string = "kd19OS#fwl2Idl1os)";

  private xorIt(input: string, key: string, type: number = 0): string {
    let sLength = input.length;
    let xLength = key.length;
    let result = "";

    for (let i = 0; i < sLength; i++) {
      let charCode = input.charCodeAt(i);
      for (let j = 0; j < xLength; j++) {
        if (type === 1) {
          // decrypt
          charCode ^= key.charCodeAt(j);
        } else {
          // encrypt
          charCode ^= key.charCodeAt(j);
        }
      }
      result += String.fromCharCode(charCode);
    }

    return result;
  }

  encryptPassword(password: string): string {
    let encrypted = this.xorIt(password, this.xor_key);
    return Buffer.from(encrypted).toString("base64");
  }

  decryptPassword(password: string): string {
    let decoded = Buffer.from(password, "base64").toString("utf-8");
    return this.xorIt(decoded, this.xor_key, 1);
  }
}
