import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AssignmentModule } from './modules/assignment/assignment.module';
import { CameraModule } from './modules/camera/camera.module';
import { CommunicationModule } from './modules/communication/communication.module';
import { CrimeModule } from './modules/crime/crime.module';
import { EvidenceModule } from './modules/evidence/evidence.module';
import { HunterModule } from './modules/hunter/hunter.module';
import { IncidenceModule } from './modules/incidence/incidence.module';
import { JurisdictionModule } from './modules/jurisdiction/jurisdiction.module';
import { OperatorModule } from './modules/operator/operator.module';
import { PrismaModule } from './prisma/prisma.module';
import { RecordModule } from './modules/record/record.module';
import { SupervisorModule } from './modules/supervisor/supervisor.module';
import { UserModule } from './modules/user/user.module';
import { ZoneModule } from './modules/zone/zone.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    AssignmentModule,
    CameraModule,
    CommunicationModule,
    CrimeModule,
    EvidenceModule,
    HunterModule,
    IncidenceModule,
    JurisdictionModule,
    OperatorModule,
    PrismaModule,
    RecordModule,
    SupervisorModule,
    UserModule,
    ZoneModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
