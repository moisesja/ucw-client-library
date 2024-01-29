import CryptoJS from 'crypto-js';
import * as crypto from 'crypto';
import {Config} from './config';
import {getConfiguration} from './configuration';
import axios from 'axios';

import AkoyaClient from './serviceClients/akoyaClient';
import FinicityClient from './serviceClients/finicityClient';
import {MxVcClient} from './serviceClients/mxClient/vc';
import SophtronVcClient from './serviceClients/sophtronClient/vc';

import {GetSophtronVc} from './providers/sophtron';
import GetMxVc from './providers/mx';
import GetAkoyaVc from './providers/akoya';
import GetFinicityVc from './providers/finicity';

export function buildSophtronAuthCode(httpMethod: string, url: string, apiUserID: string, secret: string) {
  let authPath = url.substring(url.lastIndexOf('/')).toLowerCase();
  let text = httpMethod.toUpperCase() + '\n' + authPath;
  let b64Sig = hmac(text, secret);
  let authString = 'FIApiAUTH:' + apiUserID + ':' + b64Sig + ':' + authPath;
  return authString;
}

function hmac(text: string, key: string) {
  let hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, CryptoJS.enc.Base64.parse(key));
  hmac.update(text);
  return CryptoJS.enc.Base64.stringify(hmac.finalize());
}

export default class UCWClient {
  config: Config;
  akoyaClient: AkoyaClient;
  finicityClient: FinicityClient;
  mxClientInt: MxVcClient;
  mxClientProd: MxVcClient;
  sophtronClient: SophtronVcClient;

  constructor(config: Config) {
      this.config = config;
      this.akoyaClient = new AkoyaClient(getConfiguration(config).akoyaProd, config);
      this.finicityClient = new FinicityClient(getConfiguration(config).finicityProd, config);
      this.mxClientInt = new MxVcClient(getConfiguration(config).mxInt);
      this.mxClientProd = new MxVcClient(getConfiguration(config).mxProd);
      this.sophtronClient = new SophtronVcClient(getConfiguration(config).sophtron);
  }

  encrypt(text: string, keyHex: string, ivHex: string) {
    if (!text) {
        return '';
    }
    const key = Buffer.from(keyHex, 'hex');
    const iv = Buffer.from(ivHex, 'hex');
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
  }

  async post(path: string, data: any) {
    const phrase = 'basic ' + Buffer.from(`${this.config.UcpClientId}:${this.config.UcpClientSecret}`).toString('base64');
    const res = await axios.post(this.config.AuthServiceEndpoint + path, data, { headers: { Authorization: phrase } })
    return res.data;
  }

  secretExchange(payload: any) {
    return this.post(`/secretexchange`, { Payload: payload })
  }

  async getAuthCode() {
    const key = Buffer.from(this.config.UcpEncryptionKey, 'base64').toString('hex');
    const iv = crypto.randomBytes(16).toString('hex');
    const ProviderCredentials = getConfiguration(this.config);
    const payload = this.encrypt(JSON.stringify(ProviderCredentials), key, iv);
    const token = await this.secretExchange(payload);
    const str = `ucp;${token.Token};${iv}`
    const b64 = Buffer.from(str).toString('base64')
    return b64;
  }

  getVc(provider: string, connectionId: string, type: string, userId: string, account_id: string, startTime?: string, endTime?: string){
    console.info(`Getting vc from provider`, provider);
    switch(provider){
      case 'mx':
        return GetMxVc(this.mxClientProd, connectionId, type, userId, account_id);
      case 'mx-int':
      case 'mx_int':
        return GetMxVc(this.mxClientInt, connectionId, type, userId, account_id);
      case 'akoya':
        return GetAkoyaVc(this.akoyaClient, connectionId, type, userId);
      case 'finicity':
        return GetFinicityVc(this.finicityClient, connectionId, type, userId);
      case 'sophtron':
        return GetSophtronVc(this.sophtronClient, connectionId, type, userId, account_id, startTime, endTime);
    }
  }
}