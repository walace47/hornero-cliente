import { Pipe, PipeTransform } from '@angular/core';
import * as vkbeautify from 'vkbeautify';

@Pipe({
  name: 'xml'
})
export class XmlPipePipe implements PipeTransform {

  transform(value: string): string {
    return vkbeautify.xml(value);
}

}
