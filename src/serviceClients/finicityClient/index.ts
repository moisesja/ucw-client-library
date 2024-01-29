import {Config} from '../../config';
import axios, { AxiosHeaderValue, AxiosInstance } from 'axios'

type ApiConfig = {
  provider: string;
  appKey: AxiosHeaderValue | undefined;
  secret: any;
  partnerId: any;
  basePath: string;

}

function makeFinicityAuthHeaders(apiConfig: ApiConfig, tokenRes: { token: string; }){
  return {
    'Finicity-App-Key': apiConfig.appKey,
    'Finicity-App-Token': tokenRes.token,
    'Content-Type': 'application/json',
    'accept': 'application/json'
  }
}

export default class FinicityClient{
  apiConfig: ApiConfig;
  axios: AxiosInstance | undefined;
  config: Config;

  constructor(apiConfig: ApiConfig, config: Config){
    this.apiConfig = apiConfig
    this.config = config;
  }

  getAuthToken(){
    return axios.post(this.apiConfig.basePath + '/aggregation/v2/partners/authentication', {
      'partnerId': this.apiConfig.partnerId,
      'partnerSecret': this.apiConfig.secret
    }, {
      headers: {
        'Finicity-App-Key': this.apiConfig.appKey,
        'Content-Type': 'application/json'
      }
    }).then(res => res.data).catch(err => {
      console.error(`Error at finicityClient.getAuthToken`,  err?.response?.data)
    })
  }

  getInstitutions(){
    return this.get('institution/v2/institutions');
  }

  getInstitution(institutionId: string){
    return this.get(`institution/v2/institutions/${institutionId}`)
  }

  getCustomers(){
    return this.get('aggregation/v1/customers')
  }

  getCustomer(unique_name: string){
    return this.get(`aggregation/v1/customers?username=${unique_name}`)
      .then(ret => ret.customers?.[0])
  }

  deleteCustomer(customerId: string){
    return this.del(`aggregation/v1/customers/${customerId}`)
  }

  getCustomerAccounts(customerId: string){
    return this.get(`aggregation/v1/customers/${customerId}/accounts`)
  }

  getCustomerAccountsByInstitutionLoginId(customerId: string, institutionLoginId: string){
    return this.get(`aggregation/v1/customers/${customerId}/institutionLogins/${institutionLoginId}/accounts`)
      .then(res => res.accounts)
  }

  getAccountOwnerDetail(customerId: string, accountId: string){
    return this.get(`aggregation/v3/customers/${customerId}/accounts/${accountId}/owner`)
      .then(res => res.holders?.[0])
  }

  getAccountAchDetail(customerId: string, accountId: string){
    // {
    //   "routingNumber": "123456789",
    //   "realAccountNumber": 2345678901
    // }
    return this.get(`aggregation/v1/customers/${customerId}/accounts/${accountId}/details`)
  }

  getTransactions(customerId: string, accountId: string, fromDate: string, toDate: string){
    return this.get(`aggregation/v4/customers/${customerId}/accounts/${accountId}/transactions`, 
      {
        fromDate: Date.parse(fromDate) / 1000, 
        toDate: Date.parse(toDate) / 1000,
        limit: 2
      }
    )
  }

  generateConnectLiteUrl(institutionId: string, customerId: string, request_id: string){
    return this.post('connect/v2/generate/lite',{
      language: 'en-US',
      partnerId: this.apiConfig.partnerId,
      customerId: customerId,
      institutionId,
      redirectUri: `${this.config.HostUrl}/oauth/${this.apiConfig.provider}/redirect_from?connection_id=${request_id}`,
      webhook: `${this.config.WebhookHostUrl}/webhook/${this.apiConfig.provider}/?connection_id=${request_id}`,
      webhookContentType: 'application/json',
      // 'singleUseUrl': true,
      // 'experience': 'default',
    }).then(ret => ret.link)
  }

  createCustomer(unique_name: string){
    return this.post(`aggregation/v2/customers/${this.apiConfig.provider === 'finicity_sandbox' ? 'testing': 'active'}`, {
      username: unique_name,
      firstName: 'John',
      lastName: 'Smith',
      // applicationId: '123456789',
      phone: '1-801-984-4200',
      email: 'myname@mycompany.com'
    })
  }

  post(path: string, body: any){
    return this.request('post', path, null, body)
  }
  get(path: string, params?: any){
    return this.request('get', path, params)
  }
  del(path: string, params?: any){
    return this.request('delete', path, params)
  }
  async request(method: string, url: string, params: any, data?: any){
    if(!this.axios){
      const token = await this.getAuthToken();
      const headers = makeFinicityAuthHeaders(this.apiConfig, token);
      this.axios = axios.create({
        baseURL: this.apiConfig.basePath,
        headers
      })
    }
    let ret = await this.axios.request({
        url,
        method,
        params,
        data
      })
      .then(res => res.data)
      .catch(err => {
        console.error(`Error at finicityClient.${method} ${url}`,  err?.response?.data)
      })
    return ret;
  }
};

