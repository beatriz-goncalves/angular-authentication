import { Injectable } from '@angular/core';
import { Encryption, UserAuthentication } from '@core/userAuthentication';
import * as uuid from 'uuid';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  signup(userAuthentication: UserAuthentication) {
    if (!this.validateInput(userAuthentication))
      return this.response(true, 'Empty Fields!');
    const allUsers: UserAuthentication[] = this.fetchUsers();
    const userData = this.createUserData(userAuthentication, false);
    if (allUsers.some((user) => user.email === userData.email))
      return this.response(true, 'This email is already associated!');
    allUsers.push(userData);
    sessionStorage.setItem('userData', JSON.stringify(allUsers));
    return this.response(false, 'User Created!', userData);
  }

  login(userAuthentication: UserAuthentication) {
    if (!this.validateInput(userAuthentication))
      return this.response(true, 'Empty Fields!');
    const allUsers: UserAuthentication[] = this.fetchUsers();
    const index = this.findUserIndex(userAuthentication.email, allUsers);
    if (index < 0) return this.response(true, 'User Not Found!');
    if (
      this.encryptAndDecryptPassword(
        Encryption.decrypt,
        allUsers[index].password
      ) !== userAuthentication.password ||
      allUsers[index].email !== userAuthentication.email
    )
      return this.response(true, 'Invalid credentials!');
    allUsers[index].isLogged = true;
    sessionStorage.setItem('userData', JSON.stringify(allUsers));
    return this.response(false, 'Login done successfully!', allUsers[index]);
  }

  logout(userAuthentication: UserAuthentication) {
    const allUsers: UserAuthentication[] = this.fetchUsers();
    const indexLoggedUser = this.findUserIndex(
      userAuthentication.email,
      allUsers
    );
    if (indexLoggedUser < 0) return this.response(true, 'User Not Found!');
    allUsers[indexLoggedUser].isLogged = false;
    sessionStorage.setItem('userData', JSON.stringify(allUsers));
    return this.response(
      false,
      'Logout done successfully!',
      userAuthentication
    );
  }

  loggedIn(userAuthentication: UserAuthentication): boolean {
    const allUsers: UserAuthentication[] = this.fetchUsers();
    const indexLoggedUser = this.findUserIndex(
      userAuthentication.email,
      allUsers
    );
    if (indexLoggedUser < 0) return false;
    if (!allUsers[indexLoggedUser].isLogged) return false;
    return allUsers[indexLoggedUser].isLogged;
  }

  private validateInput(userAuthentication: UserAuthentication): boolean {
    if (!userAuthentication.email) return false;
    if (!userAuthentication.password) return false;
    return true;
  }

  private createUserData(
    userAuthentication: UserAuthentication,
    isLogged: boolean
  ): UserAuthentication {
    return {
      id: Number(uuid.v4()),
      name: userAuthentication.name,
      email: userAuthentication.email,
      password: this.encryptAndDecryptPassword(
        Encryption.encrypt,
        userAuthentication.password
      ),
      isLogged: isLogged,
    };
  }

  private fetchUsers(): UserAuthentication[] {
    var getUsers: any = sessionStorage.getItem('userData');
    return JSON.parse(getUsers) || [];
  }

  private findUserIndex(
    email: string,
    usersAuthentication: UserAuthentication[]
  ): number {
    return usersAuthentication.findIndex(
      (usersAuthentication) => usersAuthentication.email === email
    );
  }

  private encryptAndDecryptPassword(encryption: Encryption, password: string) {
    if (encryption === Encryption.encrypt) {
      return CryptoJS.AES.encrypt(password?.trim(), 'key').toString();
    }
    return CryptoJS.AES.decrypt(password?.trim(), 'key').toString(
      CryptoJS.enc.Utf8
    );
  }

  private response(
    hasError: boolean,
    message?: string,
    userAuthentication?: UserAuthentication
  ) {
    if (hasError)
      throw {
        message: message,
        userAuthentication: userAuthentication,
      };
    console.log(
      `Message: ${message}\n\nUser: ${JSON.stringify(userAuthentication)}`
    );
    return {
      message: message,
      userAuthentication: userAuthentication,
    };
  }
}
