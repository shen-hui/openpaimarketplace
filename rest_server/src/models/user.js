// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
const { isNil, isEmpty } = require('lodash');
const modelSyncHandler = require('./model_init_handler');

class User {
  constructor(sequelize, DataTypes) {
    this.orm = sequelize.define('User', {
      name: { type: DataTypes.STRING, primaryKey: true },
    });
    this.sequelize = sequelize;
  }

  associate(models) {
    this.orm.belongsToMany(models.MarketplaceItem.orm, {
      through: 'StarRelation',
    });
    this.models = models;
  }

  async create(userReq) {
    const handler = modelSyncHandler(async userReq => {
      await this.orm.create({ name: userReq });
    });

    return await handler(userReq, this.models);
  }

  async list() {
    const handler = modelSyncHandler(async () => {
      const users = await this.orm.findAll();
      return users;
    });

    return await handler(this.models);
  }

  async del(username) {
    const handler = modelSyncHandler(async username => {
      const user = await this.orm.findOne({
        where: { name: username },
      });
      if (isNil(user)) {
        return null;
      } else {
        return await user.destroy();
      }
    });

    return await handler(username, this.models);
  }

  async listItems(username) {
    const handler = modelSyncHandler(async username => {
      const user = await this.orm.findOne({ where: { name: username } });
      if (isNil(user)) {
        return null;
      } else {
        return user.getMarketplaceItems();
      }
    });

    return await handler(username, this.models);
  }

  async getItem(username, itemId) {
    const handler = modelSyncHandler(async (username, itemId) => {
      const user = await this.orm.findOne({ where: { name: username } });
      if (isNil(user)) {
        return null;
      } else {
        const items = await user.getMarketplaceItems({
          where: { id: itemId },
        });
        return items;
      }
    });

    return await handler(username, itemId, this.models);
  }

  async updateItem(username, itemId) {
    const handler = modelSyncHandler(async (username, itemId) => {
      const user = await this.orm.findOne({ where: { name: username } });
      if (isNil(user)) {
        return null;
      } else {
        const items = await user.getMarketplaceItems({
          where: { id: itemId },
        });
        if (isEmpty(items)) {
          const item = await this.models.MarketplaceItem.orm.findOne({
            where: { id: itemId },
          });
          if (isNil(item)) {
            return 'item not exists';
          }
          const t = await this.sequelize.transaction();
          try {
            await user.addMarketplaceItem(item, { transaction: t });
            await item.increment('starNumber', { transaction: t });
            await t.commit();
          } catch (e) {
            await t.rollback();
            throw e;
          }
          return true;
        } else {
          return false;
        }
      }
    });

    return await handler(username, itemId, this.models);
  }

  async deleteItem(username, itemId) {
    const handler = modelSyncHandler(async (username, itemId) => {
      const user = await this.orm.findOne({ where: { name: username } });
      if (isNil(user)) {
        return null;
      } else {
        const items = await user.getMarketplaceItems({
          where: { id: itemId },
        });
        if (isEmpty(items)) {
          return false;
        } else {
          const t = await this.sequelize.transaction();
          try {
            await user.removeMarketplaceItem(items, { transaction: t });
            const item = await this.models.MarketplaceItem.orm.findOne({
              where: { id: itemId },
            });
            await item.decrement('starNumber', { transaction: t });
            await t.commit();
          } catch (e) {
            await t.rollback();
            throw e;
          }
          return true;
        }
      }
    });

    return await handler(username, itemId, this.models);
  }
}

module.exports = User;
