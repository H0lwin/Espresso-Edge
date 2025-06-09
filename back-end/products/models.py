# models.py

from django.db import models
from slugify import slugify

class CoffeeProduct(models.Model):
    category = models.ForeignKey('categories.Category', on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField()
    image = models.ImageField(upload_to='coffee_images/')
    price = models.PositiveIntegerField()

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while CoffeeProduct.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'coffee_product'
        verbose_name_plural = 'coffee_products'
