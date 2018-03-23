import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CallbackComponent} from './callback/callback.component';
import { UserProfileComponent } from './user-profile/user-profile.component'
import { ImageDetailComponent } from './image-detail/image-detail.component';
import { SearchComponent } from './search/search.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { UploadPhotoComponent } from './upload-photo/upload-photo.component';
import { HomeComponent } from './home/home.component';
const routes: Routes = [
  { path: 'oauth_callback', component: CallbackComponent },
  { path: 'user', component:UserProfileComponent},
  { path: 'detail/:id', component: ImageDetailComponent},
  { path: 'search', component: SearchComponent,
      children:[
        { path: 'result', component: SearchResultComponent }
     ] },
  { path: 'upload', component: UploadPhotoComponent },
  { path: 'home', component: HomeComponent }

];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}