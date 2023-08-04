import { JsonController, Authorized, Put, Res, Get, Post, Body, Delete, BodyParam, Param, Req } from "routing-controllers";
import { UserFeed } from "../models/UserFeedModel";
import { UserFeedService } from "../services/UserFeedService";
import { UserService } from "../services/UserService";
import { FeedService } from "../services/FeedService";
import { In } from "typeorm";
@JsonController('/user-feed')
export class UserFeedController {
    constructor(private userFeedService: UserFeedService, private userService: UserService, private feedService: FeedService) {}

    // Create or update Admin Feed
    @Authorized(['super-admin', 'admin'])
    @Post()
    public async userFeed(@Body({validate: true}) userFeed: {feedId: [], userId: number}, @Res() response: any, @Req() request: any): Promise<any> {
        const feedId = userFeed.feedId;
        const findUserFeed = await this.userFeedService.find({where: {userId: userFeed.userId}});
        if (findUserFeed) {
            for (const data of findUserFeed) {
                await this.userFeedService.delete(data.id);
            }
        }
            // Create
            if (feedId.length > 0) {
                for (const id of feedId) {
                    const newUserFeed = new UserFeed();
                    newUserFeed.feedId = id;
                    newUserFeed.userId = userFeed.userId;
                    const createData = await this.userFeedService.create(newUserFeed);
                    if (!createData) {
                        const errorMessage = {
                            status: 0,
                            message: 'Unable to create the user feed data !!'
                        };
                        return response.status(400).send(errorMessage);
                    }
                }
            }
            const successMessage = {
                status: 1,
                message: 'Successfully created or modified the user feed data !!'
            };
            return response.status(200).send(successMessage);
    }

    // Get admin feed depends on admin
    @Authorized(['super-admin', 'admin'])
    @Get('/:id')
    public async getUserFeed(@Param('id') id: number, @Res() response: any): Promise<any> {
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
