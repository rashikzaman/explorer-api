import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class UserAttribute1615384748919 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_attribute',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'twitterUserName',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'instagramUserName',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'profileImage',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'TIMESTAMP',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'TIMESTAMP',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            name: 'userId',
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
