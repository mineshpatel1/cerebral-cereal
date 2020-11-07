import { ALTER_USER } from './types';

export const alterUser = (userInfo = null) => ({
  type: ALTER_USER,
  userInfo,
});

