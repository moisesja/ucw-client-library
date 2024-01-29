import AkoyaClient from '../serviceClients/akoyaClient';

type Account = {
  accountId: string; 
};

export default async function GetVc(
  vcClient: AkoyaClient,
  connection_id: string,
  type: string,
  userId: string
){
  let token = await vcClient.getIdToken(userId)
  switch(type){
    case 'identity':
      let customer = await vcClient.getCustomerInfo(connection_id, token.id_token);
      return {credentialSubject: {customer}};
    case 'accounts':
      let accounts = await vcClient.getAccountInfo(connection_id, [], token.id_token);
      return {credentialSubject: {accounts}};
    case 'transactions':
      let allAccounts = await vcClient.getAccountInfo(connection_id, [], token.id_token);
      let accountId = (Object.values(allAccounts[0])[0] as Account).accountId;
      const transactions = await vcClient.getTransactions(connection_id, accountId, token.id_token);
      return {credentialSubject: {transactions}};
  }
}
