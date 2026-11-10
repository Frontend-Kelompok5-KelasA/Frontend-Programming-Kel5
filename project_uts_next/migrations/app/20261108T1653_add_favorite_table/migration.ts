#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/cfe9542dc68a86f472c3daa70d5c28d22560ee08ff8246e60eb155f3d5122e4f/contract';
import startContract from '../../snapshots/cfe9542dc68a86f472c3daa70d5c28d22560ee08ff8246e60eb155f3d5122e4f/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/c2d114d6cfcc13abca42f2fef1aca37f07f2693812736afbad691e8fdea48d74/contract';
import endContract from '../../snapshots/c2d114d6cfcc13abca42f2fef1aca37f07f2693812736afbad691e8fdea48d74/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'Favorite',
        columns: [
          col('created_at', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('favorite_id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('restaurant_id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('user_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['favorite_id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Favorite',
        constraint: 'Favorite_user_id_restaurant_id_key',
        columns: ['user_id', 'restaurant_id'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
