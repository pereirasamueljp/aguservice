import { Module } from "@nestjs/common";
import { CoreModule } from "./core/core.module";
import { TaskModule } from "./modules/task/task.module";








@Module({
    imports: [
        CoreModule,
        TaskModule
    ],
    controllers: [

    ],
    providers: [
    ],
})
export class AguModule { }
