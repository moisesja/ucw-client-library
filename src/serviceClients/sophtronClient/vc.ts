import * as http from '../../infra/http';
import SophtronBaseClient from './base';
import {buildSophtronAuthCode} from '../..'
import SophtronClient from './';

export default class SophtronVcClient extends SophtronBaseClient{
  sophtronClient: SophtronClient;
  constructor(apiConfig: any){
    super(apiConfig);
    this.sophtronClient = new SophtronClient(apiConfig);
  }

  async getVC(path: string) {
    const res = await this.sophtronClient.getUserIntegrationKey();
    const headers = { 
      IntegrationKey: res.IntegrationKey,
      Authorization: buildSophtronAuthCode('get', path, this.apiConfig.clientId, this.apiConfig.secret)
    };
    const ret = await http.get(`${this.apiConfig.vcEndpoint}vc/${path}`, headers)
    return ret?.vc || ret;
  }
};
