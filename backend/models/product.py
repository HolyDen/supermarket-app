from mongoengine import Document, StringField, FloatField, IntField

class Product(Document):
    name = StringField(required=True, max_length=200)
    description = StringField(max_length=1000)
    price = FloatField(required=True, min_value=0)
    category = StringField(required=True, max_length=100)
    image_url = StringField()
    stock = IntField(required=True, min_value=0, default=0)
    
    meta = {'collection': 'products'}
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': str(self.id),
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'category': self.category,
            'image_url': self.image_url,
            'stock': self.stock
        }
