import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Resource1614003446448 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'resource',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'url',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'audioClipLink',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'imageLink',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'urlImage',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'visibilityId',
            type: 'int',
          },
          {
            name: 'resourceTypeId',
            type: 'int',
          },
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'wonderId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'isSpecial',
            type: 'boolean',
            isNullable: true,
          },
          {
            name: 'isSaved',
            type: 'boolean',
            default: false,
          },
          {
            name: 'originalResourceId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'keywords',
            type: 'text',
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
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
          },
          {
            columnNames: ['visibilityId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'visibility',
          },
          {
            columnNames: ['resourceTypeId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'resource_type',
          },
          {
            columnNames: ['wonderId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'wonder',
          },
          {
            columnNames: ['originalResourceId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'resource',
          },
        ],
        indices: [{ columnNames: ['title', 'keywords'], isFulltext: true }],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
