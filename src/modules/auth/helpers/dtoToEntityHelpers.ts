import { User } from '../../users/models/user.entity';

export const registerDtoToUser = (dto) => {
  const user = new User();
  user.email = dto.email;
  user.password = dto.password;
  user.firstName = dto.firstName;
  user.lastName = dto.lastName;
  return user;
};
