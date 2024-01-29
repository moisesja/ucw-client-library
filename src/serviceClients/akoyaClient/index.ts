import {Config} from '../../config';
import * as http from '../../infra/http';
import CryptoJS from "crypto-js";

const version = 'v2';

type ApiConfig = {
  basePath: any;
  productPath: any; 
  clientId: string; 
  secret: string; 
  provider: string
};

function makeAkoyaAuthHeaders(apiConfig: ApiConfig){
  let words = CryptoJS.enc.Utf8.parse(`${apiConfig.clientId}:${apiConfig.secret}`);
  return {
    Authorization: `Basic ${ CryptoJS.enc.Base64.stringify(words)}`,
    'content-type': 'application/x-www-form-urlencoded', 
    accept: 'application/json'
  }
}

function makeAkoyaBearerHeaders(token: string){
  return {
    Authorization: `Bearer ${token}`,
    accept: 'application/json'
  }
}

export default class AkoyaClient{
  apiConfig: ApiConfig;
  client_redirect_url: string;
  authParams: { client_id: any; client_secret: any; };

  constructor(apiConfig: ApiConfig, config: Config){
    this.apiConfig = apiConfig
    this.client_redirect_url = `${config.HostUrl}/oauth/${this.apiConfig.provider}/redirect_from`;
    this.authParams = {
      client_id: apiConfig.clientId,
      client_secret: apiConfig.secret
    }
  }
  getOauthUrl(institution_id: string, client_redirect_url: string, state: string){
    return `https://${this.apiConfig.basePath}/auth?connector=${institution_id}&client_id=${this.apiConfig.clientId}&redirect_uri=${client_redirect_url}&state=${state}&response_type=code&scope=openid email profile offline_access`
  }

  getIdToken(authCode: string){
    let body = {grant_type: 'authorization_code', code: authCode, redirect_uri: this.client_redirect_url};
    // let body = `grant_type=authorization_code&code=${authCode}`; //&redirect_uri=${this.client_redirect_url}
    return this.post('token', body)
  }
  refreshToken(existingRefreshToken: string){
    return this.post('token', {grant_type: 'refresh_token', refresh_token: existingRefreshToken, client_id: this.apiConfig.clientId, client_secret: this.apiConfig.secret})
  }

  getAccountInfo(institution_id: string, accountIds: string[], token: string){
    return this.get(`accounts-info/${version}/${institution_id}`, token)
      .then(res => res.accounts)
  }
  getBalances(institution_id: string, token: string){
    return this.get(`balances/${version}/${institution_id}`, token)
  }
  getInvestments(institution_id: string, token: string){
    return this.get(`accounts/${version}/${institution_id}`, token)
  }
  getPayments(institution_id: string, accountId: string, token: string){
    return this.get(`payments/${version}/${institution_id}/${accountId}/payment-networks`, token)
  }
  getTransactions(institution_id: string, accountId: string, token: string){
    return this.get(`transactions/${version}/${institution_id}/${accountId}?offset=0&limit=50`, token)
  }
  getCustomerInfo(institution_id: string, token: string){
    return this.get(`customers/${version}/${institution_id}/current`, token)
  }

  post(path: string, body: any){
    let headers = makeAkoyaAuthHeaders(this.apiConfig);
    return http.post(`https://${this.apiConfig.basePath}/${path}`, body, headers)
  }
  get(path: string, token: string){
    let headers = makeAkoyaBearerHeaders(token);
    return http.get(`https://${this.apiConfig.productPath}/${path}`, headers)
  }
};

