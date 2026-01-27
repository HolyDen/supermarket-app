from mongoengine import connect
from models.user import User
from models.product import Product
from config import Config

# Connect to database
connect(host=Config.MONGODB_URI)

# Check if already seeded
if Product.objects.count() > 0:
    print('Database already seeded. Skipping...')
    exit()

print('Seeding full dataset...')

# Create admin user
admin = User(username='admin', email='admin@supermarket.com', is_admin=True)
admin.set_password('admin123')
admin.save()
print('✓ Admin user created')

# Create regular user
user = User(username='user', email='user@supermarket.com')
user.set_password('user123')
user.save()
print('✓ Regular user created')

# Full product catalog with realistic images and prices
products_data = [
    # Fresh Produce
    {'name': 'Organic Bananas', 'description': 'Fresh organic bananas, sold by the pound', 'price': 0.79, 'category': 'Fresh Produce', 'image_url': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400', 'stock': 150},
    {'name': 'Fuji Apples', 'description': 'Crisp and sweet Fuji apples', 'price': 1.99, 'category': 'Fresh Produce', 'image_url': 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400', 'stock': 120},
    {'name': 'Roma Tomatoes', 'description': 'Fresh Roma tomatoes, perfect for cooking', 'price': 2.49, 'category': 'Fresh Produce', 'image_url': 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400', 'stock': 80},
    {'name': 'Iceberg Lettuce', 'description': 'Crisp iceberg lettuce head', 'price': 1.79, 'category': 'Fresh Produce', 'image_url': 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400', 'stock': 60},
    {'name': 'Baby Carrots', 'description': '1 lb bag of fresh baby carrots', 'price': 1.99, 'category': 'Fresh Produce', 'image_url': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400', 'stock': 90},
    {'name': 'Red Bell Peppers', 'description': 'Sweet red bell peppers', 'price': 3.99, 'category': 'Fresh Produce', 'image_url': 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400', 'stock': 70},
    {'name': 'Strawberries', 'description': 'Fresh strawberries, 1 lb container', 'price': 4.99, 'category': 'Fresh Produce', 'image_url': 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400', 'stock': 50},
    {'name': 'Seedless Grapes', 'description': 'Green seedless grapes', 'price': 3.49, 'category': 'Fresh Produce', 'image_url': 'https://images.unsplash.com/photo-1599819177959-1f1bb4e9b8ac?w=400', 'stock': 65},
    
    # Meat & Seafood
    {'name': 'Chicken Breast', 'description': 'Boneless skinless chicken breast, per lb', 'price': 8.99, 'category': 'Meat & Seafood', 'image_url': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400', 'stock': 40},
    {'name': 'Ground Beef', 'description': '80/20 ground beef, per lb', 'price': 6.99, 'category': 'Meat & Seafood', 'image_url': 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400', 'stock': 45},
    {'name': 'Salmon Fillet', 'description': 'Fresh Atlantic salmon fillet, per lb', 'price': 14.99, 'category': 'Meat & Seafood', 'image_url': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400', 'stock': 30},
    {'name': 'Pork Chops', 'description': 'Bone-in pork chops, per lb', 'price': 7.49, 'category': 'Meat & Seafood', 'image_url': 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=400', 'stock': 35},
    {'name': 'Shrimp', 'description': 'Large raw shrimp, 1 lb', 'price': 12.99, 'category': 'Meat & Seafood', 'image_url': 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400', 'stock': 25},
    
    # Dairy & Eggs
    {'name': 'Whole Milk', 'description': 'Fresh whole milk, 1 gallon', 'price': 4.49, 'category': 'Dairy & Eggs', 'image_url': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400', 'stock': 80},
    {'name': 'Large Eggs', 'description': 'Grade A large eggs, dozen', 'price': 3.99, 'category': 'Dairy & Eggs', 'image_url': 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400', 'stock': 100},
    {'name': 'Cheddar Cheese', 'description': 'Sharp cheddar cheese, 8 oz block', 'price': 5.49, 'category': 'Dairy & Eggs', 'image_url': 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=400', 'stock': 60},
    {'name': 'Greek Yogurt', 'description': 'Plain Greek yogurt, 32 oz', 'price': 6.99, 'category': 'Dairy & Eggs', 'image_url': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400', 'stock': 50},
    {'name': 'Butter', 'description': 'Unsalted butter, 1 lb', 'price': 4.99, 'category': 'Dairy & Eggs', 'image_url': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400', 'stock': 70},
    {'name': 'Mozzarella Cheese', 'description': 'Fresh mozzarella, 8 oz', 'price': 4.49, 'category': 'Dairy & Eggs', 'image_url': 'https://images.unsplash.com/photo-1624148160296-8e5c4c0a5e4a?w=400', 'stock': 45},
    
    # Bakery
    {'name': 'Sourdough Bread', 'description': 'Fresh baked sourdough loaf', 'price': 4.99, 'category': 'Bakery', 'image_url': 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400', 'stock': 40},
    {'name': 'Whole Wheat Bread', 'description': '100% whole wheat bread loaf', 'price': 3.49, 'category': 'Bakery', 'image_url': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', 'stock': 50},
    {'name': 'Croissants', 'description': 'Butter croissants, 4 pack', 'price': 5.99, 'category': 'Bakery', 'image_url': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400', 'stock': 35},
    {'name': 'Bagels', 'description': 'Assorted bagels, 6 pack', 'price': 4.49, 'category': 'Bakery', 'image_url': 'https://images.unsplash.com/photo-1551106652-a5bcf4b29ab6?w=400', 'stock': 45},
    
    # Canned Goods
    {'name': 'Diced Tomatoes', 'description': 'Canned diced tomatoes, 14.5 oz', 'price': 1.29, 'category': 'Canned Goods', 'image_url': 'https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?w=400', 'stock': 120},
    {'name': 'Black Beans', 'description': 'Canned black beans, 15 oz', 'price': 0.99, 'category': 'Canned Goods', 'image_url': 'https://images.unsplash.com/photo-1587334207988-c2f7e2e1cf9c?w=400', 'stock': 100},
    {'name': 'Chicken Noodle Soup', 'description': 'Condensed chicken noodle soup, 10.75 oz', 'price': 1.49, 'category': 'Canned Goods', 'image_url': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400', 'stock': 90},
    {'name': 'Tuna', 'description': 'Chunk light tuna in water, 5 oz', 'price': 1.79, 'category': 'Canned Goods', 'image_url': 'https://images.unsplash.com/photo-1600959907703-125ba1374a12?w=400', 'stock': 110},
    
    # Pasta & Grains
    {'name': 'Spaghetti', 'description': 'Traditional spaghetti pasta, 16 oz', 'price': 1.99, 'category': 'Pasta & Grains', 'image_url': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400', 'stock': 100},
    {'name': 'Brown Rice', 'description': 'Long grain brown rice, 2 lb', 'price': 3.99, 'category': 'Pasta & Grains', 'image_url': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', 'stock': 80},
    {'name': 'Penne Pasta', 'description': 'Penne rigate pasta, 16 oz', 'price': 1.99, 'category': 'Pasta & Grains', 'image_url': 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400', 'stock': 90},
    {'name': 'Quinoa', 'description': 'Organic quinoa, 1 lb', 'price': 5.99, 'category': 'Pasta & Grains', 'image_url': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', 'stock': 60},
    
    # Snacks & Sweets
    {'name': 'Potato Chips', 'description': 'Classic potato chips, 8 oz bag', 'price': 3.49, 'category': 'Snacks & Sweets', 'image_url': 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400', 'stock': 75},
    {'name': 'Dark Chocolate Bar', 'description': '70% cacao dark chocolate, 3.5 oz', 'price': 3.99, 'category': 'Snacks & Sweets', 'image_url': 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400', 'stock': 85},
    {'name': 'Granola Bars', 'description': 'Chewy granola bars, 6 pack', 'price': 4.49, 'category': 'Snacks & Sweets', 'image_url': 'https://images.unsplash.com/photo-1560717845-968905be3f2a?w=400', 'stock': 70},
    {'name': 'Mixed Nuts', 'description': 'Roasted & salted mixed nuts, 10 oz', 'price': 6.99, 'category': 'Snacks & Sweets', 'image_url': 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400', 'stock': 55},
    
    # Beverages
    {'name': 'Orange Juice', 'description': 'Fresh squeezed orange juice, 64 oz', 'price': 5.49, 'category': 'Beverages', 'image_url': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400', 'stock': 60},
    {'name': 'Bottled Water', 'description': 'Spring water, 24 pack', 'price': 4.99, 'category': 'Beverages', 'image_url': 'https://images.unsplash.com/photo-1550592704-6c76defa9985?w=400', 'stock': 100},
    {'name': 'Coffee Beans', 'description': 'Medium roast coffee beans, 12 oz', 'price': 9.99, 'category': 'Beverages', 'image_url': 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400', 'stock': 50},
    {'name': 'Green Tea', 'description': 'Organic green tea, 20 bags', 'price': 4.99, 'category': 'Beverages', 'image_url': 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400', 'stock': 65},
    
    # Household Items
    {'name': 'Paper Towels', 'description': 'Paper towels, 6 rolls', 'price': 9.99, 'category': 'Household Items', 'image_url': 'https://images.unsplash.com/photo-1584820927498-cfe5714e5114?w=400', 'stock': 80},
    {'name': 'Dish Soap', 'description': 'Liquid dish soap, 24 oz', 'price': 3.99, 'category': 'Household Items', 'image_url': 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400', 'stock': 90},
    {'name': 'Laundry Detergent', 'description': 'Liquid laundry detergent, 100 oz', 'price': 12.99, 'category': 'Household Items', 'image_url': 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400', 'stock': 60},
    {'name': 'Trash Bags', 'description': '13 gallon trash bags, 40 count', 'price': 8.99, 'category': 'Household Items', 'image_url': 'https://images.unsplash.com/photo-1609862786670-f2d2a5da3c7f?w=400', 'stock': 70},
    
    # Frozen Foods
    {'name': 'Frozen Pizza', 'description': 'Pepperoni pizza, 12 inch', 'price': 6.99, 'category': 'Frozen Foods', 'image_url': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', 'stock': 50},
    {'name': 'Ice Cream', 'description': 'Vanilla ice cream, 1.5 quart', 'price': 4.99, 'category': 'Frozen Foods', 'image_url': 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400', 'stock': 60},
    {'name': 'Frozen Vegetables', 'description': 'Mixed vegetables, 16 oz', 'price': 2.99, 'category': 'Frozen Foods', 'image_url': 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400', 'stock': 75},
    {'name': 'Fish Sticks', 'description': 'Breaded fish sticks, 24 oz', 'price': 7.49, 'category': 'Frozen Foods', 'image_url': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400', 'stock': 45},
]

for data in products_data:
    product = Product(
        name=data['name'],
        description=data['description'],
        price=data['price'],
        category=data['category'],
        image_url=data['image_url'],
        stock=data['stock']
    )
    product.save()

print(f'✓ Created {len(products_data)} products')
print('')
print('DONE Full seeding complete!')
print('')
print('Login credentials:')
print('  Admin - username: admin, password: admin123')
print('  User  - username: user, password: user123')
