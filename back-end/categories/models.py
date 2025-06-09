from django.db import models
from slugify import slugify


class Category(models.Model):
    name = models.CharField(max_length=350)
    slug = models.SlugField(unique=True, blank=True, allow_unicode=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = 'category'
        verbose_name_plural = 'categories'
