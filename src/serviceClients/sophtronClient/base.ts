import * as http from '../../infra/http'
import {buildSophtronAuthCode} from '../..'

export default class SophtronBaseClient{
  apiConfig;
  constructor(apiConfig: any){
    this.apiConfig = apiConfig;
  }

  getAuthHeaders(method: string, path: string){
    // if(this.apiConfig.integrationKey){
    //   if(!forcePhrase){
    //     return {IntegrationKey: this.apiConfig.integrationKey}
    //   }
    //   return {
    //     Authorization: buildSophtronAuthCode(method, path, config.SophtronApiUserId, config.SophtronApiUserSecret)
    //   };
    // }
    return {
      Authorization: buildSophtronAuthCode(method, path, this.apiConfig.clientId, this.apiConfig.secret)
    }; 
  }

  async post(path: string, data?: any) {
    const authHeader = this.getAuthHeaders('post', path);
    const ret = await http.post(this.apiConfig.endpoint + path, data, authHeader);
    return ret;
  }
  async get(path: string) {
    const authHeader = this.getAuthHeaders('get', path);
    const ret = await http.get(this.apiConfig.endpoint + path, authHeader);
    return ret;
  }
  async put(path: string, data: any) {
    const authHeader = this.getAuthHeaders('put', path);
    const ret = await http.put(this.apiConfig.endpoint + path, data, authHeader);
    return ret;
  }
  async del(path: string) {
    const authHeader = this.getAuthHeaders('delete', path);
    const ret = await http.del(this.apiConfig.endpoint + path, authHeader);
    return ret;
  }
};
