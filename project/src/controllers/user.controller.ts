import { Controller, DefaultValuePipe, Get, Ip, ParseIntPipe, Query, UseGuards } from "@nestjs/common";
import { RolesReflector } from "src/common/roles.reflector";
import { UserRoles } from "common-lib-nestjs-https-api/dist";
import { RolesGuard } from "src/guards/roles.guard";
import { JwtGuard } from "src/guards/verify.guard";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Observable } from "rxjs";
import { AuthGuard } from "@nestjs/passport";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { AllUsersCommands } from "src/queries/user/allUsers/allUsers.commands";
import { GenerateUserCommand } from "src/commands/user/generateUser/generateUser.commands";

@ApiTags('User')
@RolesReflector(UserRoles.ADMIN)
@Controller('user')
export class UserController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) { }

  @Get('all-users')
  @RolesReflector(UserRoles.MODERATOR)
  @UseGuards(JwtGuard, RolesGuard)
  @UseGuards(AuthGuard('api-key'))
  
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiQuery({ name: 'limit', description: 'Limit the number of users', required: false, type: Number })
  @ApiQuery({ name: 'offset', description: 'Offset for pagination', required: false, type: Number })
  async allUsers(
    @Query('limit', new DefaultValuePipe(99999999), ParseIntPipe) limit,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset) {

    return this.queryBus.execute(new AllUsersCommands(limit, offset))
  }

  @Get('generate-user')
  @UseGuards(JwtGuard, RolesGuard)
  @UseGuards(AuthGuard('api-key'))

  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Generate users', responses: {}})
  @ApiResponse({ status: 200, description: 'Users generated successfully' })
  @ApiQuery({ name: 'count', description: 'Number of users to generate', required: true, type: Number })
  async generateUser(@Query('count') count: number): Promise<Observable<{ msg: string }>> {
    return await this.commandBus.execute(new GenerateUserCommand(count))
  }
}