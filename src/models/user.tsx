import {Realm} from '@realm/react'
import {ObjectSchema} from 'realm'

export class Users extends Realm.Object<Users> {
  _id!: Realm.BSON.ObjectId
  dni!: 'string'
  gender!: 'string'
  name!: 'string'
  phone!: 'string'
  createdAt!: Date
  country!: {
    code: 'string'
    name: 'string'
    phoneCode: 'string'
  }

  static schema: ObjectSchema = {
    name: 'Users',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      dni: 'string',
      gender: 'string',
      name: 'string',
      phone: 'string',
      createdAt: 'date',
    },
  }
}
