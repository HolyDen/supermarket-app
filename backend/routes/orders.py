from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.order import Order, OrderItem
from models.user import User
from models.product import Product

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/', methods=['GET'])
@jwt_required()
def get_orders():
    try:
        user_id = get_jwt_identity()
        user = User.objects(id=user_id).first()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        orders = Order.objects(user=user).order_by('-created_at')
        
        return jsonify({
            'orders': [o.to_dict() for o in orders]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/', methods=['POST'])
@jwt_required()
def create_order():
    try:
        user_id = get_jwt_identity()
        user = User.objects(id=user_id).first()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        # Validate input
        if 'items' not in data or not data['items']:
            return jsonify({'error': 'Order must contain items'}), 400
        
        order_items = []
        total = 0
        
        # Process each item
        for item in data['items']:
            product = Product.objects(id=item['product_id']).first()
            
            if not product:
                return jsonify({'error': f"Product {item['product_id']} not found"}), 404
            
            # Check stock
            if product.stock < item['quantity']:
                return jsonify({
                    'error': f"Insufficient stock for {product.name}. Available: {product.stock}"
                }), 400
            
            # Create order item
            order_item = OrderItem(
                product_id=str(product.id),
                product_name=product.name,
                quantity=item['quantity'],
                price=product.price
            )
            order_items.append(order_item)
            total += product.price * item['quantity']
            
            # Subtract from stock
            product.stock -= item['quantity']
            product.save()
        
        # Create order
        order = Order(
            user=user,
            items=order_items,
            total=total
        )
        order.save()
        
        return jsonify({
            'message': 'Order created successfully',
            'order': order.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
