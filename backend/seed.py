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

def run_seed():
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

    # Base URL for GitHub-hosted images
    BASE_URL = 'https://raw.githubusercontent.com/HolyDen/supermarket-assets/main/images'

    # Full product catalog with GitHub-hosted images
    products_data = [
        # Fresh Produce
        {'name': 'Organic Bananas', 'description': 'Fresh organic bananas, sold by the pound', 'price': 0.79, 'category': 'Fresh Produce', 'image_url': f'{BASE_URL}/organic-bananas.jpg', 'stock': 150},
        {'name': 'Fuji Apples', 'description': 'Crisp and sweet Fuji apples', 'price': 1.99, 'category': 'Fresh Produce', 'image_url': f'{BASE_URL}/fuji-apples.jpg', 'stock': 120},
        {'name': 'Roma Tomatoes', 'description': 'Fresh Roma tomatoes, perfect for cooking', 'price': 2.49, 'category': 'Fresh Produce', 'image_url': f'{BASE_URL}/roma-tomatoes.jpg', 'stock': 80},
        {'name': 'Iceberg Lettuce', 'description': 'Crisp iceberg lettuce head', 'price': 1.79, 'category': 'Fresh Produce', 'image_url': f'{BASE_URL}/iceberg-lettuce.jpg', 'stock': 60},
        {'name': 'Baby Carrots', 'description': '1 lb bag of fresh baby carrots', 'price': 1.99, 'category': 'Fresh Produce', 'image_url': f'{BASE_URL}/baby-carrots.jpg', 'stock': 90},
        {'name': 'Bell Peppers', 'description': 'Sweet bell peppers', 'price': 3.99, 'category': 'Fresh Produce', 'image_url': f'{BASE_URL}/bell-peppers.jpg', 'stock': 70},
        {'name': 'Strawberries', 'description': 'Fresh strawberries, 1 lb container', 'price': 4.99, 'category': 'Fresh Produce', 'image_url': f'{BASE_URL}/strawberries.jpg', 'stock': 50},
        {'name': 'Seedless Grapes', 'description': 'Green seedless grapes', 'price': 3.49, 'category': 'Fresh Produce', 'image_url': f'{BASE_URL}/seedless-grapes.jpg', 'stock': 65},
        
        # Meat & Seafood
        {'name': 'Chicken Breast', 'description': 'Boneless skinless chicken breast, per lb', 'price': 8.99, 'category': 'Meat & Seafood', 'image_url': f'{BASE_URL}/chicken-breast.jpg', 'stock': 40},
        {'name': 'Ground Beef', 'description': '80/20 ground beef, per lb', 'price': 6.99, 'category': 'Meat & Seafood', 'image_url': f'{BASE_URL}/ground-beef.jpg', 'stock': 45},
        {'name': 'Salmon Fillet', 'description': 'Fresh Atlantic salmon fillet, per lb', 'price': 14.99, 'category': 'Meat & Seafood', 'image_url': f'{BASE_URL}/salmon-fillet.jpg', 'stock': 30},
        {'name': 'Pork Chops', 'description': 'Bone-in pork chops, per lb', 'price': 7.49, 'category': 'Meat & Seafood', 'image_url': f'{BASE_URL}/pork-chops.jpg', 'stock': 35},
        {'name': 'Shrimp', 'description': 'Large raw shrimp, 1 lb', 'price': 12.99, 'category': 'Meat & Seafood', 'image_url': f'{BASE_URL}/shrimp.jpg', 'stock': 25},
        
        # Dairy & Eggs
        {'name': 'Whole Milk', 'description': 'Fresh whole milk, 1 gallon', 'price': 4.49, 'category': 'Dairy & Eggs', 'image_url': f'{BASE_URL}/whole-milk.jpg', 'stock': 80},
        {'name': 'Large Eggs', 'description': 'Grade A large eggs, dozen', 'price': 3.99, 'category': 'Dairy & Eggs', 'image_url': f'{BASE_URL}/large-eggs.jpg', 'stock': 100},
        {'name': 'Cheddar Cheese', 'description': 'Sharp cheddar cheese, 8 oz block', 'price': 5.49, 'category': 'Dairy & Eggs', 'image_url': f'{BASE_URL}/cheddar-cheese.jpg', 'stock': 60},
        {'name': 'Greek Yogurt', 'description': 'Plain Greek yogurt, 32 oz', 'price': 6.99, 'category': 'Dairy & Eggs', 'image_url': f'{BASE_URL}/greek-yogurt.jpg', 'stock': 50},
        {'name': 'Butter', 'description': 'Unsalted butter, 1 lb', 'price': 4.99, 'category': 'Dairy & Eggs', 'image_url': f'{BASE_URL}/butter.jpg', 'stock': 70},
        {'name': 'Mozzarella Cheese', 'description': 'Fresh mozzarella, 8 oz', 'price': 4.49, 'category': 'Dairy & Eggs', 'image_url': f'{BASE_URL}/mozzarella-cheese.jpg', 'stock': 45},
        
        # Bakery
        {'name': 'Sourdough Bread', 'description': 'Fresh baked sourdough loaf', 'price': 4.99, 'category': 'Bakery', 'image_url': f'{BASE_URL}/sourdough-bread.jpg', 'stock': 40},
        {'name': 'Whole Wheat Bread', 'description': '100% whole wheat bread loaf', 'price': 3.49, 'category': 'Bakery', 'image_url': f'{BASE_URL}/whole-wheat-bread.jpg', 'stock': 50},
        {'name': 'Croissants', 'description': 'Butter croissants, 4 pack', 'price': 5.99, 'category': 'Bakery', 'image_url': f'{BASE_URL}/croissants.jpg', 'stock': 35},
        {'name': 'Bagels', 'description': 'Assorted bagels, 6 pack', 'price': 4.49, 'category': 'Bakery', 'image_url': f'{BASE_URL}/bagels.jpg', 'stock': 45},
        
        # Canned Goods
        {'name': 'Diced Tomatoes', 'description': 'Canned diced tomatoes, 14.5 oz', 'price': 1.29, 'category': 'Canned Goods', 'image_url': f'{BASE_URL}/diced-tomatoes.jpg', 'stock': 120},
        {'name': 'Black Beans', 'description': 'Canned black beans, 15 oz', 'price': 0.99, 'category': 'Canned Goods', 'image_url': f'{BASE_URL}/black-beans.jpg', 'stock': 100},
        {'name': 'Chicken Noodle Soup', 'description': 'Condensed chicken noodle soup, 10.75 oz', 'price': 1.49, 'category': 'Canned Goods', 'image_url': f'{BASE_URL}/chicken-noodle-soup.jpg', 'stock': 90},
        {'name': 'Tuna', 'description': 'Chunk light tuna in water, 5 oz', 'price': 1.79, 'category': 'Canned Goods', 'image_url': f'{BASE_URL}/tuna.jpg', 'stock': 110},
        
        # Pasta & Grains
        {'name': 'Spaghetti', 'description': 'Traditional spaghetti pasta, 16 oz', 'price': 1.99, 'category': 'Pasta & Grains', 'image_url': f'{BASE_URL}/spaghetti.jpg', 'stock': 100},
        {'name': 'Brown Rice', 'description': 'Long grain brown rice, 2 lb', 'price': 3.99, 'category': 'Pasta & Grains', 'image_url': f'{BASE_URL}/brown-rice.jpg', 'stock': 80},
        {'name': 'Penne Pasta', 'description': 'Penne rigate pasta, 16 oz', 'price': 1.99, 'category': 'Pasta & Grains', 'image_url': f'{BASE_URL}/penne-pasta.jpg', 'stock': 90},
        {'name': 'Quinoa', 'description': 'Organic quinoa, 1 lb', 'price': 5.99, 'category': 'Pasta & Grains', 'image_url': f'{BASE_URL}/quinoa.jpg', 'stock': 60},
        
        # Snacks & Sweets
        {'name': 'Potato Chips', 'description': 'Classic potato chips, 8 oz bag', 'price': 3.49, 'category': 'Snacks & Sweets', 'image_url': f'{BASE_URL}/potato-chips.jpg', 'stock': 75},
        {'name': 'Dark Chocolate Bar', 'description': '70% cacao dark chocolate, 3.5 oz', 'price': 3.99, 'category': 'Snacks & Sweets', 'image_url': f'{BASE_URL}/dark-chocolate-bar.jpg', 'stock': 85},
        {'name': 'Granola Bars', 'description': 'Chewy granola bars, 6 pack', 'price': 4.49, 'category': 'Snacks & Sweets', 'image_url': f'{BASE_URL}/granola-bars.jpg', 'stock': 70},
        {'name': 'Mixed Nuts', 'description': 'Roasted & salted mixed nuts, 10 oz', 'price': 6.99, 'category': 'Snacks & Sweets', 'image_url': f'{BASE_URL}/mixed-nuts.jpg', 'stock': 55},
        
        # Beverages
        {'name': 'Orange Juice', 'description': 'Fresh squeezed orange juice, 64 oz', 'price': 5.49, 'category': 'Beverages', 'image_url': f'{BASE_URL}/orange-juice.jpg', 'stock': 60},
        {'name': 'Bottled Water', 'description': 'Spring water, 24 pack', 'price': 4.99, 'category': 'Beverages', 'image_url': f'{BASE_URL}/bottled-water.jpg', 'stock': 100},
        {'name': 'Coffee Beans', 'description': 'Medium roast coffee beans, 12 oz', 'price': 9.99, 'category': 'Beverages', 'image_url': f'{BASE_URL}/coffee-beans.jpg', 'stock': 50},
        {'name': 'Green Tea', 'description': 'Organic green tea, 20 bags', 'price': 4.99, 'category': 'Beverages', 'image_url': f'{BASE_URL}/green-tea.jpg', 'stock': 65},
        
        # Household Items
        {'name': 'Paper Towels', 'description': 'Paper towels, 6 rolls', 'price': 9.99, 'category': 'Household Items', 'image_url': f'{BASE_URL}/paper-towels.jpg', 'stock': 80},
        {'name': 'Dish Soap', 'description': 'Liquid dish soap, 24 oz', 'price': 3.99, 'category': 'Household Items', 'image_url': f'{BASE_URL}/dish-soap.jpg', 'stock': 90},
        {'name': 'Laundry Detergent', 'description': 'Liquid laundry detergent, 100 oz', 'price': 12.99, 'category': 'Household Items', 'image_url': f'{BASE_URL}/laundry-detergent.jpg', 'stock': 60},
        {'name': 'Trash Bags', 'description': '13 gallon trash bags, 40 count', 'price': 8.99, 'category': 'Household Items', 'image_url': f'{BASE_URL}/trash-bags.jpg', 'stock': 70},
        
        # Frozen Foods
        {'name': 'Frozen Pizza', 'description': 'Pepperoni pizza, 12 inch', 'price': 6.99, 'category': 'Frozen Foods', 'image_url': f'{BASE_URL}/frozen-pizza.jpg', 'stock': 50},
        {'name': 'Ice Cream', 'description': 'Vanilla ice cream, 1.5 quart', 'price': 4.99, 'category': 'Frozen Foods', 'image_url': f'{BASE_URL}/ice-cream.jpg', 'stock': 60},
        {'name': 'Frozen Vegetables', 'description': 'Mixed vegetables, 16 oz', 'price': 2.99, 'category': 'Frozen Foods', 'image_url': f'{BASE_URL}/frozen-vegetables.jpg', 'stock': 75},
        {'name': 'Fish Sticks', 'description': 'Breaded fish sticks, 24 oz', 'price': 7.49, 'category': 'Frozen Foods', 'image_url': f'{BASE_URL}/fish-sticks.jpg', 'stock': 45},
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
    print('Login credentials:')
    print('  Admin - username: admin, password: admin123')
    print('  User  - username: user, password: user123')


if __name__ == "__main__":
    run_seed()