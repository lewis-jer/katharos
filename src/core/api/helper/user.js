class User {
  constructor(data) {
    this.data = {
      userLocalSession: {},
      userProfile: {},
      userCount: 0
    };
    this.next = null;
  }

  configure(config) {
    console.log();
  }

  getLocalStorageItem() {
    return localStorage.getItem('user') || null;
  }

  getUsername() {
    return this.data.username;
  }

  setLocalStorageItem(user) {
    localStorage.setItem('user', user);
  }

  parseUserObject(user) {
    for (const [key, value] of Object.entries(user)) {
      Object.assign(this.data.userLocalSession, { ...value });
    }
    setLocalStorageItem(user);
  }

  initializeUser(user) {
    typeof user == 'object' ? parseUserObject(user) : setLocalStorageItem(user);
  }

  setUserProfile(data) {
    Object.assign(this.data.userProfile, { ...data });
    this.data.username = data.username;
  }

  setUsername(username) {
    this.data.username = username;
  }

  getUserProfileData(key) {
    return this.data.userProfile[key];
  }

  getUserItem(item, lookupValue) {
    const object = this.data.userProfile[item.target];
    var response;
    object.forEach((element) => {
      element[item.lookupIndex];
      if (element[item.lookupIndex] == lookupValue) {
        response = element.Category;
      }
    });
    return response;
  }

  getUserItems(item, lookupValue) {
    const object = this.data.userProfile[item.target];
    var response;
    object.forEach((element) => {
      if (element[item.lookupIndex] == lookupValue) {
        response = element;
      }
    });
    return response;
  }
  getRandomUserItem(key) {
    var randomNumber =
      Math.floor(Math.random() * (this.data.userProfile[key].length - 1 - 0)) +
      0;
    return this.data.userProfile[key][randomNumber];
  }
  getUserStatus() {
    if (this.getLocalStorageItem() != null) {
      return true;
    } else {
      return false;
    }
  }
  getUserCount() {
    return this.data.userCount;
  }
  setUserCount() {
    this.data.userCount++;
  }
}

export { User };
