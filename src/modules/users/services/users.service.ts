import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../models/entity/user.entity';
import { ProfileUpdateDto } from '../models/dto/profiile-update.dto';
import { UserAttribute } from '../models/entity/user-attribute.entity';
import { VisibilityService } from '../../visibility/services/visibility.service';
import { UsersAuthService } from './user-auth.service';
import Collection from '../../core/interfaces/collection/collection.interface';

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
    const publicVisibility = await this.visibilityService.getPublicVisibility(); //by default, making user profile public
    const result = await this.usersRepository.save({
      email: email,
      username: username,
      password: hashedPassword,
      visibility: publicVisibility,
    });
    const attribute = new UserAttribute();
    attribute.user = result;
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
    const visibility = await this.visibilityService.findOne(
      profileUpdateDto.visibilityId,
    );
    user.visibility = visibility;
    const userResult = await this.usersRepository.save(user);
    let attribute = await this.userAttributeRepository.findOne({
      user: user,
    });
    if (!attribute) attribute = new UserAttribute();
    attribute.user = userResult;
    attribute.instagramUserName = profileUpdateDto.instagramUserName;
    attribute.twitterUserName = profileUpdateDto.twitterUserName;
    await this.userAttributeRepository.save(attribute);
    return await this.usersRepository.findOne(id, {
      relations: ['userAttribute'],
    });
  }

  async getPublicUsers(query: {
    pageSize: number;
    pageNumber: number;
  }): Promise<Collection | undefined> {
    const pageSize = query.pageSize
      ? query.pageSize
      : parseInt(this.configService.get('DEFAULT_PAGINATION_VALUE'));
    const pageNumber = query.pageNumber ?? 1;

    const skippedItems = (pageNumber - 1) * pageSize;

    const publicVisibility = await this.visibilityService.getPublicVisibility();
    const sqlQuery = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userAttribute', 'userAttribute')
      .where('user.visibilityId = :visibilityId', {
        visibilityId: publicVisibility.id,
      });

    const users = await sqlQuery.take(pageSize).skip(skippedItems).getMany();
    const totalCount = await sqlQuery.getCount();

    return {
      items: users,
      pageNumber:
        typeof pageNumber === 'string' ? parseInt(pageNumber) : pageNumber,
      pageSize: typeof pageSize === 'string' ? parseInt(pageSize) : pageSize,
      totalCount: totalCount,
    };
  }
}
