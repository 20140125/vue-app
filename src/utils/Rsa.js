import { JSEncrypt } from 'jsencrypt'

export default {
  /**
   * todo:私钥解密
   * @param encryptData
   * @return {*}
   */
  decryptData(encryptData) {
    const privateKey = '-----BEGIN PRIVATE KEY-----' +
        'MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBALsyvhwEtLegdKIT' +
        'neAOf4MDKCHr6zambRD84wN+yTfu7PPckgT6tTiPrb7D4JVjNZ4VB9zc6dr9ibv+' +
        'UBAyATNc/ASY1GIx6eQPK/m+SC66y5Qm08ZvTzOi1aNqHsbSefSyiRgkDMsDjbs/' +
        '+2bGHzDxygv0w90dGmoagGCC+lF/AgMBAAECgYAicezPRQJnw2uSox9qqeBGoB8T' +
        'VtC6BpeNB6tR6lNmKl2JZa2souETnkRvFKXPdyjXhLEkr7WMKRjd8aaTxE+57h0A' +
        '72i+cLdGkqd44985x6D3GT2Hz8TJCqk78WtnWGcPhZSifcIUFXQZXsyWIP6o71wH' +
        'Lid4Z/4SjugBsDIkWQJBAOVNhmzdqdZpThVlOnl/XsxlMh6gVIVKgV/qQPAKH3J6' +
        'On9wMo/tRTDi10KWaMzcs94Xvu0bvWB1jEt17zT2tVMCQQDQ/kUvN/W954+28lcB' +
        'h1QKyditIvhfO2LbClLcFmDbRFHYfR3/MJ2LrIzY3EIFeIn71f8dotjoQmUUgtyi' +
        'UWGlAkALyZ10cTyu2gD6lpaX8lVEOpuF+YX+yCK4dIlcDZkqQGBLdtASmAbriW25' +
        'bZP7nAjfDOdytu9YSxKoOmrOlTQjAkAstxqKXcjAVvkSxYsEErZSkJlBggfuKECg' +
        'aPcNi+QxRc7VKP/wB7DNn5+LDqU5km7DaSfqaVtLZllGKDGYsRzZAkAa74IcG51B' +
        '9UouQkxPzjkFLkUfDaiT219Ip9oX8u02Ri7dNOwxLIoAWl6AZmDV/wz5pFYiQzbf' +
        'MZpZul3aUoD9' +
        '-----END PRIVATE KEY-----';
    const decrypt = new JSEncrypt();
    decrypt.setPrivateKey(privateKey);
    return decrypt.decrypt(encryptData);
  },
  /**
   * todo:公钥加密
   * @param encryptData
   * @return {*}
   */
  encryptData(encryptData) {
    const publicKey = '-----BEGIN PUBLIC KEY-----' +
        'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC7Mr4cBLS3oHSiE53gDn+DAygh' +
        '6+s2pm0Q/OMDfsk37uzz3JIE+rU4j62+w+CVYzWeFQfc3Ona/Ym7/lAQMgEzXPwE' +
        'mNRiMenkDyv5vkguusuUJtPGb08zotWjah7G0nn0sokYJAzLA427P/tmxh8w8coL' +
        '9MPdHRpqGoBggvpRfwIDAQAB' +
        '-----END PUBLIC KEY-----';
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    return encrypt.encrypt(encryptData);
  },
  /**
   * todo:字符串转数组
   * @param string
   * @param splitLength
   * @return {boolean|*[]}
   */
  str_split(string, splitLength) {
    if (splitLength === null) {
      splitLength = 1
    }
    if (string === null || splitLength < 1) {
      return false
    }
    string += ''
    const chunks = []
    let pos = 0
    const len = string.length
    while (pos < len) {
      chunks.push(string.slice(pos, pos += splitLength))
    }
    return chunks
  },
  /**
   * todo:16进制转buffer
   * @param data
   * @return {Buffer|*}
   */
  hexToBuffer(data) {
    const hexArray = data.map(el => parseInt(el, 16));
    if (!Array.isArray(data)) {
      return hexArray([data])
    }
    const uarr = new Uint8Array(hexArray);
    return Buffer.from(uarr)
  },
  /**
   * todo:buffer转16进制
   * @param data
   * @return {string[]}
   */
  bufferToHex(data) {
    const uarr = Array.prototype.slice.call(data);
    return uarr.map(el => Number(el).toString(16))
  }
}