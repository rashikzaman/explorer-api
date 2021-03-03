import { Wonder } from '../../modules/wonders/models/entities/wonder.entity';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Wonder1614016987238 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'wonder',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            generationStrategy: 'increment',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'coverPhotoUrl',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'visibilityId',
            type: 'int',
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
            name: 'wonder',
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
          },
          {
            name: 'visibility',
            columnNames: ['visibilityId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'visibility',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
