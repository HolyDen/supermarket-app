from mongoengine import Document, ReferenceField, ListField, EmbeddedDocument, EmbeddedDocumentField, StringField, IntField, DateTimeField, DictField
from datetime import datetime
from .user import User

class CartItem(EmbeddedDocument):
    product_id = StringField(required=True)
    quantity = IntField(required=True, min_value=1)
    # Product snapshot - stored when item is added to cart
    product_snapshot = DictField(required=False, default=dict)
    # Structure: {
    #   'name': str,
    #   'price': float,
    #   'image_url': str,
    #   'category': str (optional)
    # }

class Cart(Document):
    user = ReferenceField(User, required=True, unique=True)
    items = ListField(EmbeddedDocumentField(CartItem), default=list)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'carts',
        'indexes': ['user']
    }
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'user_id': str(self.user.id),
            'items': [{
                'product_id': item.product_id,
                'quantity': item.quantity,
                'product_snapshot': item.product_snapshot or {}
            } for item in self.items],
            'updated_at': self.updated_at.isoformat()
        }