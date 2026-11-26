#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/46a1ed89bf9e5a028506e886963efd48c0bb0a9d342fb547776db5c05da19175/contract';
import endContract from '../../snapshots/46a1ed89bf9e5a028506e886963efd48c0bb0a9d342fb547776db5c05da19175/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/c2d114d6cfcc13abca42f2fef1aca37f07f2693812736afbad691e8fdea48d74/contract';
import startContract from '../../snapshots/c2d114d6cfcc13abca42f2fef1aca37f07f2693812736afbad691e8fdea48d74/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'Restaurant',
        column: col('user_id', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
