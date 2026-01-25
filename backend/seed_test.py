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

print('Seeding test data...')

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

# Create minimal test products
products_data = [
    {'name': 'Test Bread', 'price': 2.99, 'category': 'Bakery', 'stock': 50},
    {'name': 'Test Milk', 'price': 3.49, 'category': 'Dairy', 'stock': 30},
    {'name': 'Test Apples', 'price': 4.99, 'category': 'Produce', 'stock': 100},
    {'name': 'Test Chicken', 'price': 8.99, 'category': 'Meat', 'stock': 25},
    {'name': 'Test Cheese', 'price': 5.49, 'category': 'Dairy', 'stock': 40}
]

for data in products_data:
    product = Product(
        name=data['name'],
        description='Test product for development',
        price=data['price'],
        category=data['category'],
        image_url='https://via.placeholder.com/300x300?text=' + data['name'].replace(' ', '+'),
        stock=data['stock']
    )
    product.save()

print(f'✓ Created {len(products_data)} test products')
print('')
print('🎉 Test seeding complete!')
print('Login credentials:')
print('  Admin - username: admin, password: admin123')
print('  User  - username: user, password: user123')
