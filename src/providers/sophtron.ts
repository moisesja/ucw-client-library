import SophtronVcClient from '../serviceClients/sophtronClient/vc';

export async function GetSophtronVc(
  vcClient: SophtronVcClient,
  connection_id: string,
  type: string,
  userId: string,
  account_id: string,
  startTime?: string,
  endTime?: string
){
  let path = '';
  switch (type) {
    case 'identity':
      path = `customers/${userId}/members/${connection_id}/identity`;
      break;
    case 'accounts':
    case 'banking':
      path = `customers/${userId}/members/${connection_id}/accounts`;
      break;
    case 'transactions':
      path = `customers/${userId}/accounts/${account_id}/transactions?startTime=${startTime}&endTime=${endTime}`;
    default:
      break;
  }
  if (path) {
    return vcClient.getVC(path).then((vc) => {
      // for data security purpose when doing demo, should remove the connection once vc is returned to client.
      // clearConnection(vc, connection_id, userId);
      // console.log(vc)
      return vc;
    });
  }
  return null;
}