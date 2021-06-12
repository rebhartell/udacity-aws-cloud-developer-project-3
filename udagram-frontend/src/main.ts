import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';


console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
console.log('environment.production = '+environment.production);
console.log('environment.appName = '+environment.appName);
console.log('environment.apiHost = '+environment.apiHost);
console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++');

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
