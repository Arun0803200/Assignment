import { JsonController, Authorized, Put, Res, Get, Post, Body, Delete, BodyParam, Param, Req } from "routing-controllers";
import { FeedService } from "../services/FeedService";
import { FeedRequest } from "./request/FeedRequest";
import { Feed } from "../models/FeedModel";
import { Log } from "../models/LogModel";
import { LogService } from "../services/LogService";
import { Roles } from "../models/LogModel";
@JsonController('/feed')
export class FeedControl {
    constructor(private feedService: FeedService, private logService: LogService) {}

    // Create Feed
    @Authorized()
    @Post()
    public async createFeed(@Body({validate: true}) feedRequest: FeedRequest, @Res() response: any, @Req() request: any): Promise<any> {
        // Create Feed
        const newFeed = new Feed();
        newFeed.name = feedRequest.name;
        newFeed.url = feedRequest.url;
        newFeed.description = feedRequest.description;
        const createFeed = await this.feedService.create(newFeed);

        // Create Log
        const newLog = new Log();
        newLog.name = createFeed.name;
        newLog.role = 'Feed';
        newLog.action = 'Create',
        newLog.actionBy = request.superAdmin.name;
        newLog.actionByRole = Roles[0];
        await this.logService.create(newLog)

            const successResponse = {
                status: 1,
                message: 'Successfully created the Feed !!',
                data: createFeed
            };
            const errorResponse = {
                status: 1,
                message: 'Unable to create the Feed !!'
            }
            return response.status(createFeed ? 200 : 400).send(createFeed ? successResponse : errorResponse);
    }

    // feed update api
    @Authorized()
    @Put('/:id')
    public async updateFeed(@Param('id') id: number, @Body({validate: true}) updateRequest: {name: string, url: string, description: string}, @Res() response, @Req() request: any): Promise<any> {
        const findFeed = await this.feedService.findOne({where: {id}});
        if (!findFeed) {
            return response.status(400).send({status: 0, message: 'Invalid feed id !!'});
        }
        findFeed.name = updateRequest.name;
        findFeed.url = updateRequest.url;
        findFeed.description = updateRequest.description;
        const updateFeed = await this.feedService.update(findFeed.id, findFeed);
        
        // Create Log
        const newLog = new Log();
        newLog.name = updateFeed.name;
        newLog.role = 'Feed';
        newLog.action = 'Update';
        newLog.actionBy = request.superAdmin.name;
        newLog.actionByRole = Roles[0];
        await this.logService.create(newLog);

        const successResponse = {
            status: 0,
            message: 'Successfully update the feed data !!',
            data: updateFeed
        }
        const errorResponse = {
            status: 0,
            message: 'Unable to update the feed data !!'
        }
        return response.status(updateFeed ? 200 : 400).send(updateFeed ? successResponse : errorResponse);
    }

    // feed detail api
    @Authorized()
    @Get('/:id')
    public async FeedDetail(@Param('id') id: number, @Res() response: any): Promise<any> {
        const findFeed = await this.feedService.findOne({where: {id}});
        const successResponse = {
            status: 0,
            message: 'Successfully got the detail of a feed !!',
            data: findFeed
        }
        const errorResponse = {
            status: 0,
            message: 'Invalid feed id !!'
        }
        return response.status(findFeed ? 200 : 400).send(findFeed ? successResponse : errorResponse);
    }

    // Feed List api
    @Authorized()
    @Get()
    public async feedList(@Res() response: any, @Req() request: any): Promise<any> {
        const findFeed = await this.feedService.findAll();
        return response.status(200).send({status: 1, message: 'Successfully got the feed list !!', data: findFeed});
    }

    // Feed delete api
    @Authorized()
    @Delete('/:id')
    public async deletefeed(@Param('id') id: number, @Res() response: any, @Req() request: any): Promise<any> {
        const findFeed = await this.feedService.findOne({where: {id}});
        if (!findFeed) {
            return response.status(400).send({status: 0, message: 'Invalid feed id !!'});
        }
        const deleteFeed = await this.feedService.delete(id);

        // Create Log
        const newLog = new Log();
        newLog.name = findFeed.name;
        newLog.role = 'Feed';
        newLog.action = 'Delete';
        newLog.actionBy = request.superAdmin.name;
        newLog.actionByRole = Roles[0];
        await this.logService.create(newLog);

        const successResponse = {
            status: 1,
            message: 'Successfully delete a feed !!'
        };

        const errorResponse = {
            status: 0,
            message: 'Unable to delet a feed !!'
        }
        return response.status(deleteFeed ? 200 : 400).send(deleteFeed ? successResponse : errorResponse);
    }
}