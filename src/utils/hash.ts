import * as bcrypt from 'bcrypt';

export const hashInput = async (input) => {
  return bcrypt.hash(input, 6);
};
