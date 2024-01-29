import * as http from '../../infra/http'
import SophtronBaseClient from './base';

type ApiConfig = { clientId: string; secret: string; endpoint: string; vcEndpoint: string; provider: string; available: boolean; }

export default class SophtronClient extends SophtronBaseClient{
  constructor(apiConfig: ApiConfig){
    super(apiConfig);
  }

  async getUserIntegrationKey() {
    const data = {Id: this.apiConfig.clientId}
    const ret = await this.post('/User/GetUserIntegrationKey', data);
    return ret;
  }

  getUserInstitutionById(id: string) {
    return this.post('/UserInstitution/GetUserInstitutionByID', {
      UserInstitutionID: id,
    });
  }

  // getUserInstitutionsByUser(id) {
  //   return this.post('/UserInstitution/GetUserInstitutionsByUser', { UserID: id });
  // }
  deleteUserInstitution(id: string) {
    return this.post('/UserInstitution/DeleteUserInstitution', {
      UserInstitutionID: id,
    });
  }

  getUserInstitutionAccounts(userInstitutionID: string) {
    return this.post('/UserInstitution/GetUserInstitutionAccounts', {
      UserInstitutionID: userInstitutionID,
    });
  }

  getInstitutionById(id: string) {
    const data = { InstitutionID: id };
    return this.post('/Institution/GetInstitutionByID', data);
  }

  getInstitutionByRoutingNumber(number: string) {
    return this.post('/Institution/GetInstitutionByRoutingNumber', {
      RoutingNumber: number,
    });
  }

  async getInstitutionsByName(name: string) {
    // console.log(name);
    if ((name || '').length > 0) {
      const data = await this.post('/Institution/GetInstitutionByName', {
        InstitutionName: name,
        Extensive: true,
        InstitutionType: 'All',
      });
      if (data?.length > 0) {
        return data
          .sort((a: any, b: any) => a.InstitutionName.length - b.InstitutionName.length)
          .slice(0, 9);
      }
      return data;
    }
    return [];
  }

  getJob(id: string) {
    return this.post('/Job/GetJobByID', { JobID: id });
  }

  async jobSecurityAnswer(jobId: string, answer: string) {
    const ret = await this.post('/Job/UpdateJobSecurityAnswer', {
      JobID: jobId,
      SecurityAnswer: JSON.stringify(answer),
    });
    return ret === 0 ? {} : { error: 'SecurityAnswer failed' };
  }

  async jobTokenInput(jobId: string, tokenChoice: string, tokenInput: string, verifyPhoneFlag: string) {
    const ret = await this.post('/Job/UpdateJobTokenInput', {
      JobID: jobId,
      TokenChoice: tokenChoice,
      TokenInput: tokenInput,
      VerifyPhoneFlag: verifyPhoneFlag,
    });
    return ret === 0 ? {} : { error: 'TokenInput failed' };
  }

  async jobCaptchaInput(jobId: string, input: string) {
    const ret = await this.post('/Job/UpdateJobCaptcha', {
      JobID: jobId,
      CaptchaInput: input,
    });
    return ret === 0 ? {} : { error: 'Captcha failed' };
  }

  createUserInstitutionWithRefresh(username: string, password: string, institutionId: string) {
    const url = '/UserInstitution/CreateUserInstitutionWithRefresh';
    const data = {
      UserName: username,
      Password: password,
      InstitutionID: institutionId,
      UserID: this.apiConfig.clientId,
    };
    return this.post(url, data);
  }

  createUserInstitutionWithProfileInfo(username: string, password: string, institutionId: string) {
    const url = '/UserInstitution/CreateUserInstitutionWithProfileInfo';
    const data = {
      UserName: username,
      Password: password,
      InstitutionID: institutionId,
      UserID: this.apiConfig.clientId,
    };
    return this.post(url, data);
  }

  createUserInstitutionWithAllPlusProfile(username: string, password: string, institutionId: string){
    var url = '/UserInstitution/CreateUserInstitutionWithAllPlusProfile';
    var data = {
        UserName: username,
        Password: password,
        InstitutionID: institutionId,
        UserID: this.apiConfig.clientId,
    };
    return this.post(url, data);
  }

  createUserInstitutionWithFullHistory(username: string, password: string, institutionId: string) {
    const url = '/UserInstitution/CreateUserInstitutionWithFullHistory';
    const data = {
      UserName: username,
      Password: password,
      InstitutionID: institutionId,
      UserID: this.apiConfig.clientId,
    };
    return this.post(url, data);
  }

  createUserInstitutionWithFullAccountNumbers(
    username: string,
    password: string,
    institutionId: string
  ) {
    const url = '/UserInstitution/CreateUserInstitutionWithFullAccountNumbers';
    const data = {
      UserName: username,
      Password: password,
      InstitutionID: institutionId,
      UserID: this.apiConfig.clientId,
    };
    return this.post(url, data);
  }

  createUserInstitutionWOJob(username: string, password: string, institutionId: string) {
    const url = '/UserInstitution/CreateUserInstitutionWOJob';
    return this.post(url, {
      UserName: username,
      Password: password,
      InstitutionID: institutionId,
    });
  }

  updateUserInstitution(username: string, password: string, userInstitutionID: string) {
    const url = '/UserInstitution/UpdateUserInstitution';
    return this.post(url, {
      UserName: username,
      Password: password,
      UserInstitutionID: userInstitutionID,
    });
  }

  getUserInstitutionProfileInfor(userInstitutionID: string) {
    const url = '/UserInstitution/GetUserInstitutionProfileInfor';
    return this.post(url, { UserInstitutionID: userInstitutionID }).then((data) => {
      data.UserInstitutionID = userInstitutionID;
      return data;
    });
  }

  refreshUserInstitution(userInstitutionID: string) {
    const url = '/UserInstitution/RefreshUserInstitution';
    return this.post(url, { UserInstitutionID: userInstitutionID }).then((data) => {
      data.UserInstitutionID = userInstitutionID;
      return data;
    });
  }

  getFullAccountNumberWithinJob(accountId: string, jobId: string){
    const url = '/UserInstitutionAccount/GetFullAccountNumberWithinJob';
    return this.post(url, { AccountID: accountId, JobID: jobId });
  }

  ping = () => {
    return http.get(
      `${this.apiConfig.endpoint}/UserInstitution/Ping`
    );
  }

};
