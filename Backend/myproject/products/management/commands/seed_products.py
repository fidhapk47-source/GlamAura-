from django.core.management.base import BaseCommand
from products.models import Product

class Command(BaseCommand):
    help = "Seed all products from JSON"

    def handle(self, *args, **kwargs):

        Product.objects.all().delete()

        data = [
            {
                "name": "Compact",
                "category": "eye",
                "image": "products/RoseHighlighter.jpg",
                "new_price": 349,
                "old_price": 449,
            },
            {
                "name": "NARS Water Proof Foundation",
                "category": "face",
                "image": "products/NarsFoundation.jpg",
                "new_price": 649,
                "old_price": 699,
            },
            {
                "name": "Magic Foundation RoseWhite Shade",
                "category": "face",
                "image": "products/MagicFoundation.jpg",
                "new_price": 599,
                "old_price": 699,
            },
            {
                "name": "GlamAura WaterProof Foundation",
                "category": "face",
                "image": "products/foundatin-latest.jpg",
                "new_price": 449,
                "old_price": 549,
            },
            {
                "name": "MAC Studio LightWhite Foundation",
                "category": "face",
                "image": "products/MacFoundation.jpg",
                "new_price": 749,
                "old_price": 799,
            },
            {
                "name": "Rose Powder brown and nuderose Shade",
                "category": "face",
                "image": "products/RosePowder.jpg",
                "new_price": 349,
                "old_price": 449,
            },
            {
                "name": "EyePalet Brown Shade",
                "category": "eye",
                "image": "products/eyebrow-shader.jpg",
                "new_price": 199,
                "old_price": 249,
            },
            {
                "name": "Eyelash Curler",
                "category": "eye",
                "image": "products/eyelash-plucker-black.jpg",
                "new_price": 139,
                "old_price": 199,
            },
            {
                "name": "SkyHigh Mascaro",
                "category": "eye",
                "image": "products/mascaro.jpg",
                "new_price": 249,
                "old_price": 299,
            },
            {
                "name": "Lip Matte 1",
                "category": "lips",
                "image": "products/pink.jpg",
                "new_price": 399,
                "old_price": 499,
            },
            {
                "name": "Lip Matte 2",
                "category": "lips",
                "image": "products/meroon.jpg",
                "new_price": 349,
                "old_price": 599,
            },
            {
                "name": "Lip Matte 3",
                "category": "lips",
                "image": "products/red.jpg",
                "new_price": 199,
                "old_price": 299,
            },
            {
                "name": "Lip Matte 4",
                "category": "lips",
                "image": "products/light-pink.jpg",
                "new_price": 499,
                "old_price": 699,
            },
            {
                "name": "Lip Matte 5",
                "category": "lips",
                "image": "products/nudeshade.jpg",
                "new_price": 599,
                "old_price": 799,
            },
            {
                "name": "Lip Matte 6",
                "category": "lips",
                "image": "products/rose.jpg",
                "new_price": 349,
                "old_price": 499,
            },
            {
                "name": "Nail Polish 1",
                "category": "nail",
                "image": "products/nail-enamel.jpg",
                "new_price": 25,
                "old_price": 40,
            },
            {
                "name": "Nail Polish 2",
                "category": "nail",
                "image": "products/nail-essie-pink.jpg",
                "new_price": 28,
                "old_price": 42,
            },
            {
                "name": "Nail Polish 3",
                "category": "nail",
                "image": "products/nail-glossier.jpg",
                "new_price": 26,
                "old_price": 38,
            },
            {
                "name": "Brush Set 1",
                "category": "brushes-tools",
                "image": "products/white-brushes.jpg",
                "new_price": 80,
                "old_price": 120,
            },
            {
                "name": "Brush Set 2",
                "category": "brushes-tools",
                "image": "products/sponch.jpg",
                "new_price": 85,
                "old_price": 130,
            },
            {
                "name": "Nykaa light cream foundation",
                "category": "new-arrivals",
                "image": "products/facesecone.jpg",
                "new_price": 249,
                "old_price": 399,
            },
            {
                "name": "Nykaa light cream foundation",
                "category": "new-arrivals",
                "image": "products/facesecone.jpg",
                "new_price": 249,
                "old_price": 399,
            },
            {
                "name": "Nykaa light cream foundation",
                "category": "new-arrivals",
                "image": "products/facesecone.jpg",
                "new_price": 249,
                "old_price": 399,
            },
            {
                "name": "Bridal Bundle 1",
                "category": "bridal-bundle",
                "image": "products/bridal-one.jpg",
                "new_price": 120,
                "old_price": 180,
            },
            {
                "name": "Bridal Bundle 1",
                "category": "bridal-bundle",
                "image": "products/bridal-one.jpg",
                "new_price": 120,
                "old_price": 180,
            },
            {
                "name": "Glow Skin 1",
                "category": "skincare",
                "image": "products/care-centellapink.jpg",
                "new_price": 45,
                "old_price": 70,
            },
            {
                "name": "Glow Skin 1",
                "category": "skincare",
                "image": "products/care-centellapink.jpg",
                "new_price": 45,
                "old_price": 70,
            },
            
        ]

        products = [Product(**item) for item in data]

        Product.objects.bulk_create(products)

        self.stdout.write(self.style.SUCCESS("✅ All products inserted!"))