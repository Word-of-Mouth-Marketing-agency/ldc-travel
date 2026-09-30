import * as migration_20260921_112401_initial_schema from './20260921_112401_initial_schema';
import * as migration_20260921_141433_add_custom_trip_inquiry_fields from './20260921_141433_add_custom_trip_inquiry_fields';
import * as migration_20260930_084129_add_saudi_office_address from './20260930_084129_add_saudi_office_address';

export const migrations = [
  {
    up: migration_20260921_112401_initial_schema.up,
    down: migration_20260921_112401_initial_schema.down,
    name: '20260921_112401_initial_schema',
  },
  {
    up: migration_20260921_141433_add_custom_trip_inquiry_fields.up,
    down: migration_20260921_141433_add_custom_trip_inquiry_fields.down,
    name: '20260921_141433_add_custom_trip_inquiry_fields',
  },
  {
    up: migration_20260930_084129_add_saudi_office_address.up,
    down: migration_20260930_084129_add_saudi_office_address.down,
    name: '20260930_084129_add_saudi_office_address'
  },
];
