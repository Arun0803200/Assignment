import { Authorized, Body, BodyParam, Delete, Get, JsonController, Param, Post, Req, Res } from "routing-controllers";
import { UserService } from "../services/UserService";
import * as jsonwebtoken from 'jsonwebtoken';
import { Token } from "../models/Token";
import { TokenService } from "../services/TokenService";
import { UserFeedService } from "../services/UserFeedService";
import { FeedService } from "../services/FeedService";
import { In } from "typeorm";
@JsonController('/user')
export class UserController {
    constructor(private userService: UserService, private tokenService: TokenService, private userFeedService: UserFeedService, private feedService:  FeedService) {}

    // user user Login
    @Post()
    public async userLogin(@BodyParam('email') email: string, @BodyParam('password') password: string, @Res() response: any): Promise<any> {
        const findUser: any = await this.userService.findOne({where: {email}});
        if (!findUser) {
            return response.status(400).send({status: 0, message: 'Invalid username !!'});
        }
        const bcrypt = require('bcrypt');
        const comparePassword = await bcrypt.compare(password, findUser.password);
        if (!comparePassword) {
            return response.status(400).send({status: 0, message: 'Invalid password !!'});
        }
        
        const tokens = await jsonwebtoken.sign({userId: findUser.id, role: 'user'}, 'fsha%@%xcb754wejh');
        const newToken: any = new Token();
        newToken.token = tokens;
        const createToken = await this.tokenService.create(newToken)

        if (createToken) {
            const successResponse = {
                status: 1,
                message: 'Successfully create the Token',
                token: createToken
            };
            return response.status(200).send(successResponse);
        }
        return response.status(400).send({status: 0, message: 'Invalid login !!'});
    }

    // User Feed and details
    @Authorized(['user'])
    @Get()
    public async getUserFeed(@Res() response: any, @Req() request: any): Promise<any> {
        const id = request.user.id
        const findUserFeed = await this.userFeedService.find({where: {userId: id}}).then( async (value) => {
            const feedMap = value.map((data) => data.feedId);
            const findAdminUser = await this.userService.findOne({where: {id}});
            const adminFeedsData = await this.feedService.find({where: {
                id: In(feedMap)
            }});
            findAdminUser.adminFeed = adminFeedsData
            return findAdminUser;
        });;
        const successMessage = {
            status: 1,
            message: 'Successfully get the admin feed list !!',
            data: findUserFeed
        };
        const errorMessage = {
            status: 0,
            message: 'Invalid admin id !!'
        };
        return response.status(findUserFeed ? 200 : 400).send(findUserFeed ? successMessage : errorMessage);
    }
}