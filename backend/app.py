from flask import Flask, render_template, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from mongoengine import connect
from config import Config

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
    return render_template('index.html')

# Health check
@app.route('/api/health')
def health():
    return jsonify({'status': 'healthy', 'message': 'API is running'}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
