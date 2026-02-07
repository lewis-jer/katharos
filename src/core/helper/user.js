class User {
  constructor(data) {
    this.data = {
      user: {},
      userLocalSession: {},
      userProfile: {},
      userCount: 0,
      models: { categories: 'bcat', types: 'btype', transactions: 'tx', pendingTransactions: 'tx_u' },
      modelConfig: {
        bcat: {
          table: 'categories'
        },
        btype: {
          table: 'types'
        },
        tx: {
          table: 'transactions'
        },
        tx_u: {
          table: 'pendingTransactionsTable'
        }
      }
    };
    this.next = null;
  }

  setUser(user) {
    this.data.user = user;
  }

  setUserItem(key, value) {
    this.data.user[key] = value;
  }

  getUser() {
    return this.data.user;
  }

  getUserData() {
    return this.data.userProfile;
  }

  getUserProfileData(key) {
    return this.data.userProfile[key];
  }

  getUserCount() {
    return this.data.userCount;
  }
  async setUserCount() {
    await Promise.resolve(this.data.userCount++);
  }

  addUserProfileItem(key, data) {
    Array.isArray(this.data.userProfile[key]) && this.data.userProfile[key].push(data);
  }

  setUserProfile(data) {
    Object.assign(this.data.userProfile, { ...data });
  }

  setUserProfileItem(key, data) {
    typeof data != 'string' && 'status' in data && delete data.status;
    this.data.userProfile[key] = data;
  }

  getRandomUserItem(key) {
    var randomNumber = Math.floor(Math.random() * (this.data.userProfile[key].length - 1 - 0)) + 0;
    return this.data.userProfile[key][randomNumber];
  }

  updateUserProfileItem(key, data, object) {
    this.data.userProfile[key].forEach((item, index) => {
      if (this.data.userProfile[key][index][object] == data[object]) {
        this.data.userProfile[key][index] = data;
      }
    });
  }

  removeUserProfileItem(key, data, object) {
    this.data.userProfile[key].forEach((item, index) => {
      if (this.data.userProfile[key][index][object] == data[object]) {
        this.data.userProfile[key].splice(index, 1);
      }
    });
  }

  getUserItem(item, lookupValue) {
    if (lookupValue === undefined) return undefined;
    const object = this.data.userProfile[item.target];
    var response;
    object.forEach((element) => {
      element[item.lookupIndex];
      if (element[item.lookupIndex] == lookupValue) {
        response = element.category;
      }
    });
    return response;
  }

  getUserItems(item, lookupValue) {
    if (lookupValue === undefined) return undefined;
    const object = this.data.userProfile[item.target];
    var response;

    for (let element of object) {
      if (element[item.lookupIndex] == lookupValue) {
        response = element;
        break;
      } else {
        response = {};
        continue;
      }
    }

    // object.forEach((element) => {
    //   if (element[item.lookupIndex] == lookupValue) {
    //     response = element;
    //   } else {
    //     response = {};
    //   }
    // });

    return response;
  }

  getUserStatus() {
    if (this.data.user != null || Object.keys(this.data.user).length === 0) {
      return true;
    } else {
      return false;
    }
  }

  findUserItem(identifier) {
    let result = [];
    for (var dataset in this.data.userProfile) {
      let data = this.data.userProfile[dataset];
      for (var item of data) {
        if (item.SN == identifier) {
          let location = this.data.models[dataset];
          let locationConfig = this.data.modelConfig[location];
          result.push({ data: item, location: location, table: locationConfig.table });
        }
      }
    }
    if (result.length === 1) return result[0];
  }
}

export { User };
