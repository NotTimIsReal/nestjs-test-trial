import { Injectable, HttpStatus } from '@nestjs/common';
import { hasher } from './../account/account.service';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/model/user.model';
import { Model, Types } from 'mongoose';
import { unlink, readFileSync as readFile } from 'fs';
@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}
  async findUserById(id: string): Promise<User> {
    return await this.userModel.findOne({ userid: id });
  }
  async findUserByName(name: string) {
    return await this.userModel.findOne({ username: name });
  }
  async deleteUserById(id: string): Promise<HttpStatus> {
    await this.userModel.findOneAndDelete({ userid: id });
    return HttpStatus.OK;
  }
  async getFilesByUserId(id: string): Promise<Array<string>> {
    const user = await this.findUserById(id);
    return user.files;
  }
  async deleteFileByUserId(id: string, file: string): Promise<string[]> {
    const allFiles = await this.getFilesByUserId(id);
    const newarr = allFiles.filter((e) => e !== file);
    await this.userModel.updateOne({ userid: id }, { files: newarr });
    unlink(file, (err) => {
      if (err) return console.error(err);
    });
    return await this.getFilesByUserId(id);
  }
  async getFileByUserId(id: string, file: string): Promise<string> {
    console.log(file);
    const allFiles = await this.getFilesByUserId(id);
    const newarr = allFiles.filter((e) => e.split('/')[2] === file);
    console.log(newarr);
    return newarr[0];
  }
  async getFilesByUserIdAndReturnAsBuffer(
    id: string,
    file: string,
  ): Promise<Buffer | null> {
    const allFiles = await this.getFilesByUserId(id);
    const newarr = allFiles.filter((e) => e.split('/')[2] === file);
    if (!newarr[0]) return null;
    const buffer = readFile(newarr[0]);
    return buffer;
  }
}
