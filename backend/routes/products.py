from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from models.product import Product

products_bp = Blueprint('products', __name__)

@products_bp.route('/', methods=['GET'])
def get_products():
    try:
        # Get query parameters
        category = request.args.get('category')
        search = request.args.get('search')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))
        
        # Build query
        query = {}
        if category:
            query['category'] = category
        if search:
            query['name__icontains'] = search
        
        # Get products with pagination
        products = Product.objects(**query).skip((page - 1) * per_page).limit(per_page)
        total = Product.objects(**query).count()
        
        return jsonify({
            'products': [p.to_dict() for p in products],
            'total': total,
            'page': page,
            'per_page': per_page,
            'total_pages': (total + per_page - 1) // per_page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('/<product_id>', methods=['GET'])
def get_product(product_id):
    try:
        product = Product.objects(id=product_id).first()
        
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        return jsonify(product.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('/categories', methods=['GET'])
def get_categories():
    try:
        categories = Product.objects.distinct('category')
        return jsonify({'categories': categories}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('/', methods=['POST'])
@jwt_required()
def create_product():
    try:
        # Check if admin
        claims = get_jwt()
        if not claims.get('is_admin'):
            return jsonify({'error': 'Admin access required'}), 403
        
        data = request.get_json()
        
        # Validate input
        required = ['name', 'price', 'category', 'stock']
        if not all(k in data for k in required):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Create product
        product = Product(
            name=data['name'],
            description=data.get('description', ''),
            price=data['price'],
            category=data['category'],
            image_url=data.get('image_url', ''),
            stock=data['stock']
        )
        product.save()
        
        return jsonify({
            'message': 'Product created successfully',
            'product': product.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('/<product_id>', methods=['PATCH'])
@jwt_required()
def update_product(product_id):
    try:
        # Check if admin
        claims = get_jwt()
        if not claims.get('is_admin'):
            return jsonify({'error': 'Admin access required'}), 403
        
        product = Product.objects(id=product_id).first()
        
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        data = request.get_json()
        
        # Update fields
        if 'name' in data:
            product.name = data['name']
        if 'description' in data:
            product.description = data['description']
        if 'price' in data:
            product.price = data['price']
        if 'category' in data:
            product.category = data['category']
        if 'image_url' in data:
            product.image_url = data['image_url']
        if 'stock' in data:
            product.stock = data['stock']
        
        product.save()
        
        return jsonify({
            'message': 'Product updated successfully',
            'product': product.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('/<product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    try:
        # Check if admin
        claims = get_jwt()
        if not claims.get('is_admin'):
            return jsonify({'error': 'Admin access required'}), 403
        
        product = Product.objects(id=product_id).first()
        
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        product.delete()
        
        return jsonify({'message': 'Product deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
