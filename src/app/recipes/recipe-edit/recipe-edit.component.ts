import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {

  id: number;
  editMode = false;
  recipeForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private recipeServcie: RecipeService,
              private router: Router) { }

  ngOnInit() {

  	this.route.params
  	 .subscribe( 
  	 	(params: Params) => {
  	 	  this.id = +params['id'];
         this.editMode = params['id'] != null;
         this.initForm();
// console.log(this.editMode);
  	 	});
  }


  onSubmit() {

    const newRecipe = new Recipe(this.recipeForm.value['name'],
                                  this.recipeForm.value['imagePath'],
                                  this.recipeForm.value['description'],
                                  this.recipeForm.value['ingredients']);

    if (this.editMode) {
      this.recipeServcie.updateRecipe(this.id, this.recipeForm.value);
    } else {
      this.recipeServcie.addRecipe(this.recipeForm.value);
    }
    this.onCancel();
  }
  
  onAddIngredient() {
   (<FormArray>this.recipeForm.get('ingredients')).push(
    new FormGroup({
      'name': new FormControl(null, Validators.required),
      'amount': new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[1-9]+[0-9]*$/)
      ]),
    })
   );

  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route });
  }
  
  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);
// console.log(this.editMode);
    if (this.editMode) {
      const recipe = this.recipeServcie.getRecipe(this.id);
// console.log(recipe);
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescription = recipe.description;
      if (recipe['ingredients']) {
        for (let ingredient of recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              'name': new FormControl(ingredient.name, Validators.required),
              'amount': new FormControl(ingredient.amount, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/),
              ])
            })
          );
        }
      }
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients
    });
  }
}
