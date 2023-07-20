import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { CategoriesService } from './categories.service';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ExistsGuard } from 'src/commons/guards/exists.guard';
import { Entity } from 'src/commons/guards/Entity.decorator';
import { Category } from './entities/category.entity';
import { AdminGuard } from 'src/commons/guards/admin.guard';

@Resolver('category')
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(AuthGuard, AdminGuard)
  @Mutation('createCategory')
  create(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
  ) {
    return this.categoriesService.create(createCategoryInput);
  }

  @UseGuards(AuthGuard)
  @Query('categories')
  findAll() {
    return this.categoriesService.findAll();
  }

  @UseGuards(AuthGuard)
  @Query('category')
  findOne(@Args('id') id: number) {
    return this.categoriesService.findOne(id);
  }

  @UseGuards(AuthGuard, AdminGuard, ExistsGuard)
  @Entity('Category')
  @Mutation('updateCategory')
  update(
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
    @Context('updateCategory') category: Category,
  ) {
    return this.categoriesService.update(category, updateCategoryInput);
  }

  @UseGuards(AuthGuard, AdminGuard, ExistsGuard)
  @Entity('Category')
  @Mutation('removeCategory')
  remove(@Args('id') id: number) {
    return this.categoriesService.remove(id);
  }
}
