import { Pipe, PipeTransform } from '@angular/core';
import { Hero } from '../interfaces/hero.interface';


@Pipe({
  name: 'heroImage'
})
export class HeroImagePipe implements PipeTransform {

  transform(hero: Hero): string {
    if (!hero.localized_name && !hero.alt_image)
      return "assets/no-image.png";

    if (hero.alt_image) return hero.alt_image;

    return "assets/heroes/"+hero.name.replace("npc_dota_hero_", "") + ".png"
    
  }

}
