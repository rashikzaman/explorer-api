import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../models/entity/user.entity';
import { ProfileUpdateDto } from '../models/dto/profiile-update.dto';
import { UserAttribute } from '../models/entity/user-attribute.entity';
import { VisibilityService } from '../../visibility/services/visibility.service';
import { UsersAuthService } from './user-auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(UserAttribute)
    private userAttributeRepository: Repository<UserAttribute>,
    private configService: ConfigService,
    private visibilityService: VisibilityService,
    @Inject(forwardRef(() => UsersAuthService)) //to resolve circular dependancy
    private userAuthService: UsersAuthService,
  ) {}

  async findOne(id: string): Promise<User | undefined> {
    return this.usersRepository.findOne(id, { relations: ['userAttribute'] });
  }

  async create(email: string, username: string, hashedPassword: string) {
    const result = await this.usersRepository.save({
      email: email,
      username: username,
      password: hashedPassword,
    });
    const publicVisibility = await this.visibilityService.getPublicVisibility(); //by default, making user profile public
    const attribute = new UserAttribute();
    attribute.user = result;
    attribute.visibility = publicVisibility;
    await this.userAttributeRepository.save(attribute);
    return result;
  }

  async update(
    id: string,
    profileUpdateDto: ProfileUpdateDto,
  ): Promise<User | undefined | any> {
    if (
      profileUpdateDto.oldPassword &&
      profileUpdateDto.newPassword &&
      profileUpdateDto.confirmNewPassword
    ) {
      await this.userAuthService.changePassord(
        profileUpdateDto.email,
        profileUpdateDto.oldPassword,
        profileUpdateDto.newPassword,
        profileUpdateDto.confirmNewPassword,
      );
    }

    const user = await this.usersRepository.findOne(id);
    user.name = profileUpdateDto.name;
    user.email = profileUpdateDto.email;
    user.username = profileUpdateDto.username;
    const userResult = await this.usersRepository.save(user);
    let attribute = await this.userAttributeRepository.findOne({
      user: user,
    });
    if (!attribute) attribute = new UserAttribute();
    const visibility = await this.visibilityService.getVisibility(
      profileUpdateDto.visibilityId,
    );

    attribute.user = userResult;
    attribute.visibility = visibility;
    attribute.instagramUserName = profileUpdateDto.instagramUserName;
    attribute.twitterUserName = profileUpdateDto.twitterUserName;
    const attributeResult = await this.userAttributeRepository.save(attribute);
    return await this.usersRepository.findOne(id, {
      relations: ['userAttribute'],
    });
  }

  async getPublicUsers(): Promise<Array<User> | undefined> {
    const publicVisibility = await this.visibilityService.getPublicVisibility();
    const users = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.userAttribute', 'userAttribute')
      .where('userAttribute.visibilityId = :visibilityId', {
        visibilityId: publicVisibility.id,
      })
      .getMany();
    return users;
  }
}
