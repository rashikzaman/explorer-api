import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Invite1619932466297 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'invite',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'resourceId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'wonderId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'hostId',
            type: 'int',
          },
          {
            name: 'inviteeId',
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
            columnNames: ['hostId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
          },
          {
            columnNames: ['inviteeId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
          },
          {
            columnNames: ['wonderId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'wonder',
          },
          {
            columnNames: ['resourceId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'resource',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
