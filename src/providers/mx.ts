import {MxVcClient} from '../serviceClients/mxClient/vc';

export default async function getVC(
  vcClient: MxVcClient,
  connection_id: string,
  type: string,
  userId: string,
  account_id: string
){
  let path = '';
  switch (type) {
    case 'identity':
      path = `users/${userId}/members/${connection_id}/customers?filters=name,addresses`;
      break;
    case 'accounts':
    case 'banking':
      path = `users/${userId}/members/${connection_id}/accounts`;
      break;
    case 'transactions':
      path = `users/${userId}/accounts/${account_id}/transactions`;
    default:
      break;
  }
  if (path) {
    console.info(`Getting mx vc ${type}`, path);
    return vcClient.getVC(path).then((vc) => {
      // for data security purpose when doing demo, should remove the connection once vc is returned to client.
      // clearConnection(vc, connection_id, userId);
      // console.log(vc)
      return vc;
    });
  }
  return null;
}
