import { NgModule } from "@angular/core";

import { SigninComponent } from "./signin/signin.component";
import { FormsModule } from "@angular/forms";
import { SignupComponent } from "./signup/signup.component";
import { AuthRoutingModule } from "./auth-routing.module";

@NgModule({
    declarations: [
        SigninComponent,
        SignupComponent
    ],
    imports: [
        FormsModule,
        AuthRoutingModule
      ]
})
export class AuthModule {}
