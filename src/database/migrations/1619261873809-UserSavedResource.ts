import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class UserSavedResource1619261873809 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_saved_resource',
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
            isNullable: false,
          },
          {
            name: 'resourceId',
            type: 'int',
            isNullable: false,
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
            columnNames: ['resourceId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'resource',
            onDelete: 'CASCADE',
          },
          {
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
