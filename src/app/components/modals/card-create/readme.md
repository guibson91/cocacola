# Exemplo Crypto Card

```
<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js"></script>

<script>
var CryptoJSAesJson = {
    stringify: function (cipherParams) {
        var j = {ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64)};
        if (cipherParams.iv) j.iv = cipherParams.iv.toString();
        if (cipherParams.salt) j.s = cipherParams.salt.toString();
        return JSON.stringify(j);
    },
    parse: function (jsonStr) {
        var j = JSON.parse(jsonStr);
        var cipherParams = CryptoJS.lib.CipherParams.create({ciphertext: CryptoJS.enc.Base64.parse(j.ct)});
        if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv)
        if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s)
        return cipherParams;
    }
}
var key = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCRAt4G3LCUiWtOAFBm8rhyoyWC1p3O5HMraqC98MyvEXO+D7pe9L+9sZRw6ARMz7kXGvVavTjxK/GYKmnVmJfMI28m/CQVWrhh9JOSytySEN107dd1nnLbYAJEsYdjD2R6RuFz5U6pHckvnaxonJ1N/iVuXSFTNhBG2H5uT9ezmwIDAQAB";
// Dados do cartão de crédito
var card = {
    number: "1234567890123456",
    cvc: "123",
    exp_month: "12",
    exp_year: "2021",
    name: "John Doe",
    address_line1: "123 Main St.",
    address_line2: "Apt. 1",
    address_city: "Anytown",
    address_state: "NY",
    address_zip: "12345",
    address_country: "USA"
}
var encrypted = CryptoJS.AES.encrypt(JSON.stringify(card), key, {format: CryptoJSAesJson}).toString();

var decrypted = JSON.parse(CryptoJS.AES.decrypt(encrypted, key, {format: CryptoJSAesJson}).toString(CryptoJS.enc.Utf8));


</script>
```
