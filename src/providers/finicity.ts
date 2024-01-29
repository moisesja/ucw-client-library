import { finicity as mapper } from '../adapters';
import FinicityClient from '../serviceClients/finicityClient';

export default async function GetVc(
  vcClient: FinicityClient,
  connection_id: string,
  type: string,
  userId: string
){
  let accounts = await vcClient.getCustomerAccountsByInstitutionLoginId(userId, connection_id);
  let accountId = accounts?.[0].id;
  switch(type){
    case 'identity':
      let customer = await vcClient.getAccountOwnerDetail(userId, accountId);
      let identity = mapper.mapIdentity(userId, customer)
      return {credentialSubject: { customer: identity}};
    case 'accounts':
      return {credentialSubject: { accounts: accounts.map(mapper.mapAccount)}};
    case 'transactions':
      let startDate = new Date(new Date().setDate(new Date().getDate() - 30))
      const transactions = await vcClient.getTransactions(userId, accountId, startDate.toString(), new Date().toString());
      return {credentialSubject: {transactions: transactions.map((t: { type: any; amount: any; id: any; postedDate: any; transactionDate: string | number | Date; description: any; memo: any; Category: any; Status: any; categorization: { normalizedPayeeName: any; }; checkNum: any; }) => mapper.mapTransaction(t, accountId))}};
  }
}