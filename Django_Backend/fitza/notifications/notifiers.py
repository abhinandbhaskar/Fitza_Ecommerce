from .services import NotificationService

class OrderNotifier(NotificationService):
    def __init__(self,user,sender=None):
        super().__init__(user=user, sender=sender)
        self.defaults.update({
            'type':'success',
            'priority':'high',
            'expires_in':72 # 3days
        })
    
    def order_confirmed(self, order_id):
        return self.send(
            message=f"Your order #{order_id} has been confirmed",
            redirect_url=f'/orders/{order_id}'
        )
    
    def order_shipped(self,order_id, tracking_number):
        return self.send(
            message=f"Your order #{order_id} has shipped. Tracking : {tracking_number}",
            redirect_url=f'/order/{order_id}'
        )
    

    
    def order_cancelled(self, order_id):
        """Notify when order is cancelled"""
        return self.send(
            message=f"Your order #{order_id} has been cancelled",
            redirect_url=f'/orders/{order_id}'
        )
  
    
    
    def order_delivered(self, order_id):
        """Notify when order is delivered"""
        return self.send(
            message=f"Your order #{order_id} has been delivered",
            redirect_url=f'/orders/{order_id}'
        )


class SecurityNotifier(NotificationService):
    def __init__(self,user):
        super().__init__(user=user)
        self.defaults.update({
            'type':'info',
            'priority':'high',
            'expires_in':24
        })
    
    def password_change(self):
        return self.send(
            message="Your password was changes successfully.",
            redirect_url='/account/security'
        )
from datetime import datetime
class MarketingNotifier(NotificationService):
    def __init__(self, group='all_users', user=None):
        """
        Initialize the notifier with either a group or a specific user.

        Args:
            group (str): The group to send notifications to (default is 'all_users').
            user (User or None): The specific user to send the notification to.
        """
        if user:
            # Send notification to a specific user
            target = f"user:{user.id}"
        else:
            # Send notification to a group
            target = group

        super().__init__(group=target)
        self.defaults.update({
            'type': 'success',
            'priority': 'medium',
            'expires_in': 48  # Notification expires in 48 hours
        })

    def new_offer(self, offer_title, discount):
        """
        Send a notification about a new offer.
        """
        return self.send(
            message=f"New Offer: {offer_title} - {discount}% off!",
            redirect_url='/offers'
        )

    def new_coupon(self, coupon_code, discount_type, discount_value, expires_on):
        """
        Send a notification about a new coupon.
        """
        return self.send(
            message=f"New Coupon: {coupon_code} ({discount_type} - {discount_value}) available until {expires_on}.",
            redirect_url='/coupons'
        )

    def product_offer(self, product_name, offer_title, discount_percentage, expires_on):
        """
        Send a notification about a product-specific offer.
        """
        return self.send(
            message=f"Special Offer: {offer_title} on {product_name} - Save {discount_percentage}%! Offer valid until {expires_on}.",
            redirect_url=f'/products/{product_name}'
        )

    def discount_card(self, card_name, discount_percentage, expires_on):
        """
        Send a notification about a new discount card.
        """
        return self.send(
            message=f"New Discount Card: {card_name} - {discount_percentage}% off! Valid until {expires_on}.",
            redirect_url='/discount-cards'
        )

    def free_shipping_offer(self, min_order_amount, expires_on):
        """
        Send a notification about a free shipping offer.
        """
        return self.send(
            message=f"Free Shipping on orders over ${min_order_amount}! Offer valid until {expires_on}.",
            redirect_url='/free-shipping'
        )



class ReturnRefundNotifier(NotificationService):
    def __init__(self, user,sender=None):
        super().__init__(user=user, sender=sender)
        self.defaults.update({
            'type':'info',
            'priority':'medium',
            'expires_in':48,
        })

    def return_requested(self, order_id):
        """Notify when a return request is submitted."""
        return self.send(
            message=f"Your return request for order #{order_id} has been submitted.",
            redirect_url=f'/orders/{order_id}/return'
        )
    
    def return_approved(self, order_id):
        """Notify when a return request is approved."""
        return self.send(
            message=f"Your return request for order #{order_id} has been approved. Please proceed to return the product.",
            redirect_url=f'/orders/{order_id}/return'
        )
    
    def return_rejected(self, order_id):
        """Notify when a return request is rejected."""
        return self.send(
            message=f"Your return request for order #{order_id} has been rejected.",
            redirect_url=f'/orders/{order_id}/return'
        )
    
    def refund_initiated(self, order_id, refund_amount):
        """Notify when a refund has been initiated."""
        return self.send(
            message=f"Your refund of ${refund_amount} for order #{order_id} has been initiated.",
            redirect_url=f'/orders/{order_id}/refund'
        )
    
    def refund_completed(self, order_id, refund_amount):
        """Notify when a refund has been completed."""
        return self.send(
            message=f"Your refund of ${refund_amount} for order #{order_id} has been completed.",
            redirect_url=f'/orders/{order_id}/refund'
        )







# class CartNotifier(NotificationService):
#     def __init__(self,user):
#         super().__init__(user=user)
#         self.defaults.update({
#             'type':'warning',
#             'priority':'high',
#             'expires_in':48
#         })
    
#     def abandoned_cart(self, cart_items_count):
#         return self.send(
#             message=f"You have {cart_items_count} item(s) waiting in your cart",
#             redirect_url='/cart'
#         )