import { JsonController, Authorized, Put, Res, Get, Post, Body, Delete, BodyParam, Param, Req } from "routing-controllers";
import { AdminFeed } from "../models/AdminFeed";
import { AdminFeedService } from "../services/AdminFeedService";
import { AdminService } from "../services/AdminService";
import { FeedService } from "../services/FeedService";
import { In } from "typeorm";
@JsonController('/admin-feed')
export class AdminFeedController {
    constructor(private adminFeedService: AdminFeedService, private adminService: AdminService, private feedService: FeedService) {}

    // Create or update Admin Feed
    @Authorized()
    @Post()
    public async adminFeed(@Body({validate: true}) adminFeed: {feedId: [], adminId: number}, @Res() response: any, @Req() request: any): Promise<any> {
        const feedId = adminFeed.feedId;
        const findAdminFeed = await this.adminFeedService.find({where: {adminId: adminFeed.adminId}});
        if (findAdminFeed) {
            for (const data of findAdminFeed) {
                await this.adminFeedService.delete(data.id);
            }
        }
            // Create
            if (feedId.length > 0) {
                for (const id of feedId) {
                    const newAdminFeed = new AdminFeed();
                    newAdminFeed.feedId = id;
                    newAdminFeed.adminId = adminFeed.adminId;
                    const createData = await this.adminFeedService.create(newAdminFeed);
                    if (!createData) {
                        const errorMessage = {
                            status: 0,
                            message: 'Unable to create the admin feed data !!'
                        };
                        return response.status(400).send(errorMessage);
                    }
                }
            }
            const successMessage = {
                status: 1,
                message: 'Successfully created or modified the admin feed data !!'
            };
            return response.status(200).send(successMessage);
    }

    // Get admin feed depends on admin
    @Authorized(['super-admin','admin'])
    @Get('/:id')
    public async getAdminFeed(@Param('id') id: number, @Res() response: any): Promise<any> {
        const findAdminFeed = await this.adminFeedService.find({where: {adminId: id}}).then( async (value) => {
            const feedMap = value.map((data) => data.feedId);
            const findAdminUser = await this.adminService.findOne({where: {id}});
            const adminFeedsData = await this.feedService.find({where: {
                id: In(feedMap)
            }});
            findAdminUser.adminFeed = adminFeedsData
            return findAdminUser;
        });
        const successMessage = {
            status: 1,
            message: 'Successfully get the admin feed list !!',
            data: findAdminFeed
        };
        const errorMessage = {
            status: 0,
            message: 'Invalid admin id !!'
        };
        return response.status(findAdminFeed ? 200 : 400).send(findAdminFeed ? successMessage : errorMessage);
    }
}
