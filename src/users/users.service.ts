import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { comparePasswords } from 'src/shared/utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ){}
  
  async create(createUserDto: CreateUserDto) {
    const {username, password, email } = createUserDto;

    // check if the user exists in the db    
    const userInDb = await this.userRepository.findOne({ 
        where: { username } 
    });
    if (userInDb) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);    
    }

    const user: User = await this.userRepository.create({username, password, email,});
    return await this.userRepository.save(user);
  }


  async findOne(options?: any): Promise<User> {
    const user = await this.userRepository.findOne(options);
    return user;
  }

  async findByLogin({ username, password }: LoginUserDto): Promise<User> {    
    const user = await this.userRepository.findOne({ username });
    
    if (!user) {
        throw new UnauthorizedException("User Not Found");   
    }
    
    // compare passwords    
    const areEqual = await comparePasswords(user.password, password);
    
    if (!areEqual) {
        throw new UnauthorizedException("Incorrect Password");   
    }
    
    return user;  
  }

  async findByPayload({ username }: any): Promise<User> {
    return await this.findOne({ 
        where:  { username } });  
  }
  
}




