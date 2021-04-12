import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CommonWonderWithResource1618139548109
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'common_wonder_with_resource',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'wonderTitle',
            type: 'varchar',
            length: '255',
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
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
