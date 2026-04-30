import { Controller, Get } from '@nestjs/common';
import { SubstitutionsService } from './substitutions.service';

@Controller('substitutions')
export class SubstitutionsController {
  constructor(private readonly substitutionsService: SubstitutionsService) {}

  @Get()
  getSubstitutions() {
    return this.substitutionsService.getSubstitutions();
  }
}
