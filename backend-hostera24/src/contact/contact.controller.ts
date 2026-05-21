import { Body, Controller, Post } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateMesajContactDto } from './dto/create-mesaj-contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  create(@Body() dto: CreateMesajContactDto) {
    return this.contactService.create(dto);
  }
}
