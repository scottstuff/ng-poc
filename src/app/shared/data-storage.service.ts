import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";
import 'rxjs/Rx';
import { AuthService } from "../auth/auth.service";

@Injectable()

export class DataStorageService {
  httpUrl: string = 'https://ng-recipe-booka.firebaseio.com/recipes.json';
  constructor(private http: Http,
              private recipeService: RecipeService,
              private authService: AuthService){}

  storeRecipes() {
    const headers = new Headers({'Content-Type': 'application/json'});
    const token = this.authService.getToken();
    return  this.http.put(this.httpUrl + '?auth=' + token, 
        this.recipeService.getRecipes(),
        {headers: headers});
  }

  getRecipes() {
    const token = this.authService.getToken();
    this.http.get('https://ng-recipe-booka.firebaseio.com/recipes.json?auth=' + token)
      .map(
          (response: Response) => {
            const recipes: Recipe[] = response.json();
            for (let recipe of recipes) {
                if (!recipe['ingredients']) {
                    recipe['ingredients'] = [];
                }
            }
            return recipes;
          }
      )
      .subscribe(
         (recipes: Recipe[]) => {
             this.recipeService.setRecipes(recipes);
         }
     );
  }

}