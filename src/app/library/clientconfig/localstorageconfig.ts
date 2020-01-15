
export class LocalStorageConfig {

  private static currentUserKey = 'currentUser';

  public static RemoveUser() {
    localStorage.removeItem(this.currentUserKey);
  }

  public static SetUser(pJSONStringify: string) {
    localStorage.setItem(this.currentUserKey, pJSONStringify);
  }

  public static GetUser() {
    const user = localStorage.getItem(this.currentUserKey);
    return JSON.parse(user);
  }

}
