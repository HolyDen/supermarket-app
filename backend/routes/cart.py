from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.cart import Cart, CartItem
from models.user import User
from models.product import Product
from datetime import datetime

cart_bp = Blueprint('cart', __name__)

@cart_bp.route('/', methods=['GET'])
@jwt_required()
def get_cart():
    try:
        user_id = get_jwt_identity()
        user = User.objects(id=user_id).first()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get or create cart
        cart = Cart.objects(user=user).first()
        if not cart:
            cart = Cart(user=user)
            cart.save()
        
        # Build cart items with product details
        items_with_details = []
        total = 0
        
        for item in cart.items:
            product = Product.objects(id=item.product_id).first()
            
            if product:
                # Product exists and is available
                item_total = product.price * item.quantity
                total += item_total
                
                items_with_details.append({
                    'product_id': str(product.id),
                    'product_name': product.name,
                    'price': product.price,
                    'quantity': item.quantity,
                    'stock': product.stock,
                    'image_url': product.image_url,
                    'is_available': True
                })
            else:
                # Product deleted or not found
                items_with_details.append({
                    'product_id': item.product_id,
                    'product_name': 'Product no longer available',
                    'price': 0,
                    'quantity': item.quantity,
                    'stock': 0,
                    'image_url': '',
                    'is_available': False
                })
        
        return jsonify({
            'items': items_with_details,
            'total': total
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cart_bp.route('/', methods=['POST'])
@jwt_required()
def add_to_cart():
    try:
        user_id = get_jwt_identity()
        user = User.objects(id=user_id).first()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        if 'product_id' not in data or 'quantity' not in data:
            return jsonify({'error': 'Missing product_id or quantity'}), 400
        
        product_id = data['product_id']
        quantity = data['quantity']
        
        # Validate product exists
        product = Product.objects(id=product_id).first()
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        # Get or create cart
        cart = Cart.objects(user=user).first()
        if not cart:
            cart = Cart(user=user)
        
        # Check if item already in cart
        existing_item = None
        for item in cart.items:
            if item.product_id == product_id:
                existing_item = item
                break
        
        if existing_item:
            # Update quantity
            new_quantity = existing_item.quantity + quantity
            
            if new_quantity > product.stock:
                return jsonify({
                    'error': f'Cannot add more. Only {product.stock} in stock',
                    'stock': product.stock,
                    'current_quantity': existing_item.quantity
                }), 400
            
            existing_item.quantity = new_quantity
        else:
            # Add new item
            if quantity > product.stock:
                return jsonify({
                    'error': f'Only {product.stock} available in stock',
                    'stock': product.stock
                }), 400
            
            cart.items.append(CartItem(
                product_id=product_id,
                quantity=quantity
            ))
        
        cart.updated_at = datetime.utcnow()
        cart.save()
        
        return jsonify({
            'message': 'Item added to cart',
            'cart': cart.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cart_bp.route('/<product_id>', methods=['PATCH'])
@jwt_required()
def update_cart_item(product_id):
    try:
        user_id = get_jwt_identity()
        user = User.objects(id=user_id).first()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        if 'quantity' not in data:
            return jsonify({'error': 'Missing quantity'}), 400
        
        quantity = data['quantity']
        
        if quantity < 1:
            return jsonify({'error': 'Quantity must be at least 1'}), 400
        
        # Get cart
        cart = Cart.objects(user=user).first()
        if not cart:
            return jsonify({'error': 'Cart not found'}), 404
        
        # Find item in cart
        cart_item = None
        for item in cart.items:
            if item.product_id == product_id:
                cart_item = item
                break
        
        if not cart_item:
            return jsonify({'error': 'Item not in cart'}), 404
        
        # Validate stock
        product = Product.objects(id=product_id).first()
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        if quantity > product.stock:
            return jsonify({
                'error': f'Only {product.stock} available in stock',
                'stock': product.stock
            }), 400
        
        # Update quantity
        cart_item.quantity = quantity
        cart.updated_at = datetime.utcnow()
        cart.save()
        
        return jsonify({
            'message': 'Cart updated',
            'cart': cart.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cart_bp.route('/<product_id>', methods=['DELETE'])
@jwt_required()
def remove_from_cart(product_id):
    try:
        user_id = get_jwt_identity()
        user = User.objects(id=user_id).first()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        cart = Cart.objects(user=user).first()
        if not cart:
            return jsonify({'error': 'Cart not found'}), 404
        
        # Remove item
        cart.items = [item for item in cart.items if item.product_id != product_id]
        cart.updated_at = datetime.utcnow()
        cart.save()
        
        return jsonify({
            'message': 'Item removed from cart',
            'cart': cart.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cart_bp.route('/', methods=['DELETE'])
@jwt_required()
def clear_cart():
    try:
        user_id = get_jwt_identity()
        user = User.objects(id=user_id).first()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        cart = Cart.objects(user=user).first()
        if cart:
            cart.items = []
            cart.updated_at = datetime.utcnow()
            cart.save()
        
        return jsonify({'message': 'Cart cleared'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500