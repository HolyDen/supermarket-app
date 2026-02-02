from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from mongoengine import connect
from config import Config
import os

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

# Seed endpoint with token-based security
@app.route('/api/seed', methods=['GET', 'POST'])
def seed_endpoint():
    """
    Seeds the database with initial data.
    
    Security:
        - Development: No token required
        - Production: Requires SEED_TOKEN environment variable and matching token parameter
    
    Query Parameters:
        mode (optional): 'test' | 'full' | 'auto' (default)
            - test: Seeds 5 minimal test products
            - full: Seeds 47 production products
            - auto: Auto-detects based on FLASK_ENV
        token (required in production): Secret token matching SEED_TOKEN env var
    
    Examples:
        Development:
            /api/seed                    -> Auto-detect (seeds test data)
            /api/seed?mode=full          -> Force full data
        
        Production:
            /api/seed?token=SECRET       -> Auto-detect (seeds full data)
            /api/seed?mode=test&token=SECRET -> Force test data
    
    Setup:
        1. Generate token: python -c "import secrets; print(secrets.token_hex(16))"
        2. Set SEED_TOKEN in Render environment variables
        3. Call endpoint once with token
        4. Remove SEED_TOKEN from environment to disable endpoint
    """
    from seed import run_seed
    from seed_test import run_seed_test
    from models.user import User
    from models.product import Product
    
    try:
        # Security check for production
        env = os.getenv('FLASK_ENV', 'production')
        
        if env == 'production':
            # Check if SEED_TOKEN is configured
            expected_token = os.getenv('SEED_TOKEN')
            
            if not expected_token:
                return jsonify({
                    'status': 'disabled',
                    'message': 'Seed endpoint is disabled in production (no SEED_TOKEN configured)',
                    'hint': 'Set SEED_TOKEN environment variable to enable'
                }), 403
            
            # Verify provided token
            provided_token = request.args.get('token')
            
            if not provided_token:
                return jsonify({
                    'status': 'unauthorized',
                    'message': 'Token required in production',
                    'hint': 'Add ?token=YOUR_SEED_TOKEN to the URL'
                }), 401
            
            if provided_token != expected_token:
                return jsonify({
                    'status': 'unauthorized',
                    'message': 'Invalid seed token'
                }), 401
        
        # Check if already seeded
        product_count = Product.objects.count()
        user_count = User.objects.count()
        
        if product_count > 0:
            return jsonify({
                'status': 'already_seeded',
                'message': 'Database already contains data',
                'products': product_count,
                'users': user_count,
                'hint': 'Delete existing data first if you want to re-seed'
            }), 200
        
        # Get mode from query params
        mode = request.args.get('mode', 'auto').lower()
        
        # Determine which seeder to run
        if mode == 'test':
            run_seed_test()
            data_type = 'test (5 products)'
        elif mode == 'full':
            run_seed()
            data_type = 'full (47 products)'
        else:  # auto
            if env == 'development':
                run_seed_test()
                data_type = 'test (auto-detected development, 5 products)'
            else:
                run_seed()
                data_type = 'full (auto-detected production, 47 products)'
        
        return jsonify({
            'status': 'success',
            'message': f'Database seeded successfully!',
            'data_type': data_type,
            'products': Product.objects.count(),
            'users': User.objects.count(),
            'mode': mode,
            'environment': env,
            'next_step': 'Remove SEED_TOKEN from environment variables to disable this endpoint'
        }), 201
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)