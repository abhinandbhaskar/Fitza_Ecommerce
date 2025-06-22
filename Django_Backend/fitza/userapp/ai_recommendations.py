# import tensorflow as tf
# import numpy as np
# from django.core.cache import cache
# import pickle
# from django.contrib.auth import get_user_model
# from common.models import Product

# class AIRecommender:
#     @staticmethod
#     def prepare_data():
#         """Convert interactions to training data"""
#         from common.models import Interaction
#         interactions = Interaction.objects.all()
        
#         # Create mappings
#         user_ids = {u.id: i for i, u in enumerate(get_user_model().objects.all())}
#         product_ids = {p.id: i for i, p in enumerate(Product.objects.all())}
        
#         # Prepare training data
#         X = []
#         y = []
#         for interaction in interactions:
#             X.append([user_ids[interaction.user.id], product_ids[interaction.product.id]])
#             y.append(interaction.weight)  # Using your pre-defined weights
        
#         return np.array(X), np.array(y), user_ids, product_ids

#     @staticmethod
#     def train_model():
#         """Train a simple neural network"""
#         X, y, user_ids, product_ids = AIRecommender.prepare_data()
        
#         if len(X) == 0:
#             return False  # No data to train on
        
#         # Simple neural network model
#         model = tf.keras.Sequential([
#             tf.keras.layers.Dense(64, activation='relu', input_shape=(2,)),
#             tf.keras.layers.Dense(32, activation='relu'),
#             tf.keras.layers.Dense(1, activation='sigmoid')
#         ])
        
#         model.compile(optimizer='adam', loss='mse')
#         model.fit(X, y, epochs=10, batch_size=32, verbose=0)
        
#         # Cache everything needed for predictions
#         cache.set('ai_recommender', {
#             'model': pickle.dumps(model),
#             'user_ids': user_ids,
#             'product_ids': product_ids,
#             'product_ids_rev': {v: k for k, v in product_ids.items()}
#         }, timeout=None)  # Cache indefinitely
        
#         return True

#     @staticmethod
#     def predict(user_id, num_recs=5):
#         """Get AI-based recommendations"""
#         cache_data = cache.get('ai_recommender')
#         if not cache_data:
#             return []
        
#         model = pickle.loads(cache_data['model'])
#         user_idx = cache_data['user_ids'].get(user_id)
#         if user_idx is None:
#             return []
        
#         # Predict scores for all products
#         products = list(cache_data['product_ids'].values())
#         test_data = np.array([[user_idx, p] for p in products])
#         predictions = model.predict(test_data, verbose=0).flatten()
        
#         # Get top recommendations
#         top_indices = np.argsort(predictions)[-num_recs:][::-1]
#         return [cache_data['product_ids_rev'][products[i]] for i in top_indices]







import tensorflow as tf
import numpy as np
from django.core.cache import cache
import pickle
import logging
from django.contrib.auth import get_user_model
from common.models import Product
from datetime import datetime

logger = logging.getLogger(__name__)

class AIRecommender:
    MODEL_VERSION = 'v1.3'  # Updated version
    MIN_INTERACTIONS = 100  # Minimum interactions needed for training
    
    @staticmethod
    def prepare_data():
        """Convert interactions to training data with safe feature handling"""
        from common.models import Interaction
        
        # Get all available users and products
        users = get_user_model().objects.all()
        products = Product.objects.all()
        
        if not users.exists() or not products.exists():
            logger.info("No users or products found")
            return None
            
        # Create mappings
        user_ids = {u.id: i for i, u in enumerate(users)}
        product_ids = {p.id: i for i, p in enumerate(products)}
        
        # Get all interactions
        interactions = Interaction.objects.select_related('user', 'product')
        
        if interactions.count() < AIRecommender.MIN_INTERACTIONS:
            logger.info(f"Not enough interactions ({interactions.count()}). Need at least {AIRecommender.MIN_INTERACTIONS}.")
            return None
        
        # Prepare training data with safe feature access
        X = []
        y = []
        
        for interaction in interactions:
            if interaction.user.id not in user_ids or interaction.product.id not in product_ids:
                continue
                
            # Safe feature extraction
            price = interaction.product.price if hasattr(interaction.product, 'price') else 0
            rating = interaction.product.rating if hasattr(interaction.product, 'rating') else 3.0
            
            features = [
                user_ids[interaction.user.id],
                product_ids[interaction.product.id],
                price / 1000.0,  # Normalized price
                rating / 5.0  # Normalized rating
            ]
            
            X.append(features)
            y.append(interaction.weight)
        
        if not X:  # No valid interactions found
            return None
            
        return {
            'X': np.array(X),
            'y': np.array(y),
            'user_ids': user_ids,
            'product_ids': product_ids,
            'product_features': {
                p.id: [
                    p.price / 1000.0 if hasattr(p, 'price') else 0,
                    p.rating / 5.0 if hasattr(p, 'rating') else 0.6
                ] for p in products
            }
        }

    @staticmethod
    def build_model(input_shape):
        """Build recommendation model with dynamic input shape"""
        model = tf.keras.Sequential([
            tf.keras.layers.Dense(128, activation='relu', input_shape=(input_shape,)),
            tf.keras.layers.BatchNormalization(),
            tf.keras.layers.Dropout(0.3),
            tf.keras.layers.Dense(64, activation='relu'),
            tf.keras.layers.Dense(32, activation='relu'),
            tf.keras.layers.Dense(1, activation='sigmoid')
        ])
        
        model.compile(
            optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
            loss='mse',
            metrics=['mae']
        )
        return model

    @staticmethod
    def train_model():
        """Train the recommendation model with validation"""
        data = AIRecommender.prepare_data()
        if not data:
            logger.warning("No valid data available for training")
            return False
            
        X, y = data['X'], data['y']
        
        # Split data into train and validation
        split_idx = int(0.8 * len(X))
        X_train, X_val = X[:split_idx], X[split_idx:]
        y_train, y_val = y[:split_idx], y[split_idx:]
        
        model = AIRecommender.build_model(X.shape[1])
        
        early_stopping = tf.keras.callbacks.EarlyStopping(
            monitor='val_loss',
            patience=3,
            restore_best_weights=True
        )
        
        history = model.fit(
            X_train, y_train,
            validation_data=(X_val, y_val),
            epochs=20,
            batch_size=64,
            callbacks=[early_stopping],
            verbose=0
        )
        
        # Cache everything needed for predictions
        cache_data = {
            'model': pickle.dumps(model),
            'user_ids': data['user_ids'],
            'product_ids': data['product_ids'],
            'product_ids_rev': {v: k for k, v in data['product_ids'].items()},
            'product_features': data['product_features'],
            'version': AIRecommender.MODEL_VERSION,
            'last_trained': str(datetime.now()),
            'metrics': {
                'train_loss': history.history['loss'][-1],
                'val_loss': history.history['val_loss'][-1]
            }
        }
        
        cache.set('ai_recommender', cache_data, timeout=60*60*24*7)  # Cache for 1 week
        logger.info(f"Model trained successfully. Version: {AIRecommender.MODEL_VERSION}")
        return True

    @staticmethod
    def predict(user_id, num_recs=5, diversity=0.2):
        """Get AI-based recommendations with safe defaults"""
        cache_data = cache.get('ai_recommender')
        if not cache_data:
            logger.warning("No trained model found in cache")
            return []
        
        try:
            model = pickle.loads(cache_data['model'])
            user_idx = cache_data['user_ids'].get(user_id)
            if user_idx is None:
                logger.info(f"User {user_id} not found in training data")
                return []
            
            # Prepare prediction data with safe feature access
            test_data = []
            product_list = []
            
            for product_id, product_idx in cache_data['product_ids'].items():
                features = cache_data['product_features'].get(product_id, [0, 0.6])
                test_data.append([
                    user_idx,
                    product_idx,
                    features[0],  # Normalized price
                    features[1]   # Normalized rating
                ])
                product_list.append(product_id)
            
            # Get predictions
            predictions = model.predict(np.array(test_data), verbose=0).flatten()
            
            # Apply diversity to recommendations
            product_scores = list(zip(product_list, predictions))
            product_scores.sort(key=lambda x: x[1], reverse=True)
            
            top_n = min(50, len(product_scores))
            selected_indices = np.arange(top_n)
            weights = np.exp(-diversity * np.arange(top_n))
            weights = weights / weights.sum()
            
            rec_ids = np.random.choice(
                selected_indices,
                size=min(num_recs, top_n),
                replace=False,
                p=weights
            )
            
            return [product_scores[i][0] for i in rec_ids]
            
        except Exception as e:
            logger.error(f"Prediction error: {str(e)}", exc_info=True)
            return []