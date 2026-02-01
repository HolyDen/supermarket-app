from flask import Flask, render_template, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from mongoengine import connect
from config import Config
from seed import run_seed

app = Flask(__name__)
app.config.from_object(Config)

app.url_map.strict_slashes = False

# Initialize extensions
CORS(app, 
     origins=Config.CORS_ORIGINS,
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"])

jwt = JWTManager(app)

# Connect to MongoDB
connect(host=Config.MONGODB_URI)

# Register blueprints
from routes.auth import auth_bp
from routes.products import products_bp
from routes.orders import orders_bp
from routes.cart import cart_bp

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(products_bp, url_prefix='/api/products')
app.register_blueprint(orders_bp, url_prefix='/api/orders')
app.register_blueprint(cart_bp, url_prefix='/api/cart')

# Docs route with Jinja2
@app.route('/docs')
def docs_page():
    return render_template('docs.html')

# Health check
@app.route('/api/health')
def health():
    return jsonify({'status': 'healthy', 'message': 'API is running'}), 200

# One-time seed endpoint for production
@app.route('/api/seed', methods=['GET', 'POST'])
def seed_endpoint():
    """
    Seeds the database with initial data.
    Visit: https://your-backend.onrender.com/api/seed
    """
    try:
        from models.user import User
        from models.product import Product
        
        # Check if already seeded
        if Product.objects.count() > 0:
            return jsonify({
                'status': 'already_seeded',
                'message': 'Database already contains data',
                'products': Product.objects.count(),
                'users': User.objects.count()
            }), 200
        
        run_seed()
                
        return jsonify({
            'status': 'success',
            'message': 'Database seeded successfully!',
            'products': Product.objects.count(),
            'users': User.objects.count()
        }), 201
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)