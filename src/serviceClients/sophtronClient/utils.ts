import CryptoJS from "crypto-js";

function hmac(text: string, key: string) {
   let hmac = CryptoJS.algo.HMAC.create(
      CryptoJS.algo.SHA256,
      CryptoJS.enc.Base64.parse(key)
   );
   hmac.update(text);
   return CryptoJS.enc.Base64.stringify(hmac.finalize());
}

export function buildSophtronAuthCode(
   httpMethod: string,
   url: string,
   apiUserID: string,
   secret: string
) {
   let authPath = url.substring(url.lastIndexOf("/")).toLowerCase();
   let text = httpMethod.toUpperCase() + "\n" + authPath;
   let b64Sig = hmac(text, secret);
   let authString = "FIApiAUTH:" + apiUserID + ":" + b64Sig + ":" + authPath;
   return authString;
}
