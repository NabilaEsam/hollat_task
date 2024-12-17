import { DBConfig } from 'ngx-indexed-db';

export const dbConfig: DBConfig = {
  name: 'EmploymentAgencyDB',
  version: 1,
  objectStoresMeta: [
    {
      store: 'users',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'username', keypath: 'username', options: { unique: true } },
        { name: 'password', keypath: 'password', options: { unique: false } },
        { name: 'role', keypath: 'role', options: { unique: false } },
        { name: 'token', keypath: 'token', options: { unique: false } },
        { name: 'name', keypath: 'name', options: { unique: false } },
        { name: 'email', keypath: 'email', options: { unique: false } },
        { name: 'title', keypath: 'title', options: { unique: false } },
        {
          name: 'technologies',
          keypath: 'technologies',
          options: { unique: false },
        },
        { name: 'photo', keypath: 'photo', options: { unique: false } },
        { name: 'rating', keypath: 'rating', options: { unique: false } },
        { name: 'budget', keypath: 'budget', options: { unique: false } },
        { name: 'ratedBy', keypath: 'ratedBy', options: { unique: false } },
        { name: 'isHero', keypath: 'isHero', options: { unique: false } },
        {
          name: 'isVerified',
          keypath: 'isVerified',
          options: { unique: false },
        },
      ],
    },
  ],
};
