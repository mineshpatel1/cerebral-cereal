import { Utils } from 'cerebral-cereal-common';
const SERVER_URL = 'https://cerebral-cereal.com';

const get = Utils.genGet(SERVER_URL);
const post = Utils.genPost(SERVER_URL);

class Api {
  constructor() {}
  
  static signIn = async idToken => { return post('login', {idToken}) }
  static signOut = async () => { return get('logout') }
  static checkUser = async () => { return get('session') }
}

export default Api;