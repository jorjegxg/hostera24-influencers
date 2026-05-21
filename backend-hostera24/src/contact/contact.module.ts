import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { MesajContact } from './mesaj-contact.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MesajContact])],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
