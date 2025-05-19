
from .services import NotificationService

class OrderNotifier(NotificationService):
    def __init__(self,user,sender=None,group='all_users'):
        super().__init__(user=user, sender=sender, group=group)
        self.defaults.update({
            'type':'success',
            'priority':'high',
            'expires_in':72 # 3days
        })
    
    def order_confirmed(self, order_id):
        return self.send(
            message=f"Your order #{order_id} has been confirmed",
            redirect_url=f'/orders/{order_id}',
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
    def __init__(self,user, group='all_users'):
        super().__init__(user=user,group=group)
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
    def __init__(self, user,sender=None, group='all_users'):
        super().__init__(user=user, sender=sender,group=group)
        self.defaults.update({
            'type':'info',
            'priority':'medium',
            'expires_in':48,
        })

    def return_requested(self, order_id):
        """Notify when a return request is submitted."""
        return self.send(
            message=f"Your return request for order #{order_id} has been submitted.",
            redirect_url=f'/neworders/return'
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




class ProductNotifier(NotificationService):
    def __init__(self, user, sender=None,group="all_sellers"):
        super().__init__(user=user, sender=sender,group=group)
        self.defaults.update({
            'type': 'info',
            'priority': 'high',
            'expires_in': 72  # 3 days
        })

    def product_approved(self, product_name):
        """
        Notify the seller when their product is approved.
        """
        return self.send(
            message=f"Your product '{product_name}' has been approved and is now available for sale.",
            redirect_url='/approvals/orders'
        )

    def product_rejected(self, product_name, reason):
        """
        Notify the seller when their product is rejected, including the reason for rejection.
        """
        return self.send(
            message=f"Your product '{product_name}' has been rejected. Reason: {reason}.",
            redirect_url='/rejects'
        )



class SellerNotifier(NotificationService):
    def __init__(self, seller_user, sender=None,group="all_sellers"):
        super().__init__(user=seller_user, sender=sender,group=group)
        self.defaults.update({
            'type': 'info',  # Notification type
            'priority': 'high',  # High priority
            'expires_in': 72,  # 3 days
        })

    def new_order_received(self, order_id, user_name, order_total):
        """
        Notify the seller about a new order placed by a user.
        """
        return self.send(
            message=f"A new order #{order_id} has been placed by {user_name}. Order Total: ${order_total:.2f}.",
            redirect_url=f'/approvals/orders'
        )

    def order_canceled(self, order_id, cancellation_reason):
        """
        Notify the seller about an order cancellation along with the reason.
        """
        return self.send(
            message=f"Order #{order_id} has been canceled. Reason: {cancellation_reason}.",
            redirect_url=f'/rejects'
        )


class ComplaintNotifier(NotificationService):
    def __init__(self, user, sender=None):
        """
        Notification service for handling complaints, applicable for notifying admins and sellers.
        """
        super().__init__(user=user, sender=sender)
        self.defaults.update({
            'type': 'info',  # Notification type
            'priority': 'medium',  # Medium priority for complaint-related notifications
            'expires_in': 72,  # 3 days for complaint-related notifications
        })

    def notify_admin_new_complaint(self, complaint_id, complaint_subject, seller_name):
        """
        Notify the admin about a new complaint added by a seller.
        """
        return self.send(
            message=f"A new complaint (ID: {complaint_id}, Subject: '{complaint_subject}') has been submitted by (seller) {seller_name}.",
            redirect_url=f'/admin/complaints/view/{complaint_id}',
            group='all_admins'
        )

    def notify_seller_admin_reply(self, complaint_id, reply_message):
        """
        Notify the seller that the admin has replied to their complaint.
        """
        return self.send(
            message=f"The admin has replied to your complaint (ID: {complaint_id}): '{reply_message}'.",
            redirect_url=f'/seller/questions/',
            group='all_sellers'
        )




class QASectionNotifier(NotificationService):
    def __init__(self, user, sender=None):
        """
        Notification service for the Q&A section, applicable for both sellers and users.
        """
        super().__init__(user=user, sender=sender)
        self.defaults.update({
            'type': 'info',  # Notification type
            'priority': 'medium',  # Medium priority
            'expires_in': 48,  # 2 days
        })

    def new_question_added(self, question_id, product_name, user_name):
        """
        Notify the seller about a new question added by a user for their product.
        """
        return self.send(
            message=f"A new question (ID: {question_id}) has been added by {user_name} for the product '{product_name}'.",
            redirect_url=f'/seller/questions/',
            group='all_sellers'
        )

    def new_answer_added(self, question_id, product_name, seller_name):
        """
        Notify the user that the seller has added an answer to their question.
        """
        return self.send(
            message=f"Your question (ID: {question_id}) about the product '{product_name}' has been answered by {seller_name}.",
            redirect_url=f'/user/questions/{question_id}',
            group='all_users'
        )




class FeedbackAndReviewNotifier(NotificationService):
    def __init__(self, user, sender=None):
        """
        Notification service for feedback and reviews, applicable for both sellers and admins.
        """
        super().__init__(user=user, sender=sender)
        self.defaults.update({
            'type': 'info',  # Notification type
            'priority': 'medium',  # Medium priority
            'expires_in': 72,  # 3 days for feedback/review
        })

    def notify_admin_feedback(self, feedback_id, seller_name):
        """
        Notify the admin about feedback submitted by a seller.
        """
        return self.send(
            message=f"New feedback (ID: {feedback_id}) has been submitted by {seller_name}.",
            redirect_url=f'/admin/feedback/{feedback_id}',
            group='all_admins'
        )

    def notify_seller_feedback(self, feedback_id, user_name):
        """
        Notify the seller about feedback submitted by a user.
        """
        return self.send(
            message=f"A new feedback (ID: {feedback_id}) has been submitted by {user_name}.",
            redirect_url=f'/seller/questions/',
            group='all_sellers'
        )

    def notify_seller_review(self, review_id, product_name, user_name):
        """
        Notify the seller that a user has added a review for their product.
        """
        return self.send(
            message=f"User {user_name} has added a review (ID: {review_id}) for your product '{product_name}'.",
            redirect_url=f'/seller/questions/',
            group='all_sellers'
        )

    def notify_user_review_acknowledgment(self, review_id, product_name, seller_name):
        """
        Notify the user that their review has been acknowledged by the seller.
        """
        return self.send(
            message=f"Your review (ID: {review_id}) for the product '{product_name}' has been acknowledged by {seller_name}.",
            redirect_url=f'/user/reviews/{review_id}',
            group='all_users'
        )




class SellerApprovalNotifier(NotificationService):
    def __init__(self, user, sender=None):
        """
        Notification service for seller approval process, applicable for both admins and sellers.
        """
        super().__init__(user=user, sender=sender)
        self.defaults.update({
            'type': 'info',  # Notification type
            'priority': 'high',  # High priority for approvals
            'expires_in': 48,  # 2 days for approval-related notifications
        })

    def notify_admin_new_seller(self, seller_id, seller_name):
        """
        Notify the admin about a new seller waiting for approval.
        """
        return self.send(
            message=f"A new seller (ID: {seller_id}, Name: {seller_name}) has registered and is awaiting approval.",
            redirect_url=f'/admin/sellers/pending/',
            group='all_admins'
        )

    def notify_seller_approval(self, seller_id):
        """
        Notify the seller that they have been approved.
        """
        return self.send(
            message=f"Congratulations! Your seller account (ID: {seller_id}) has been approved. You can now start listing your products.",
            redirect_url='/seller/questions/',
            group='all_sellers'
        )

    def notify_seller_rejection(self, seller_id, reason):
        """
        Notify the seller that their application has been rejected.
        """
        return self.send(
            message=f"Unfortunately, your seller account (ID: {seller_id}) has been rejected. Reason: {reason}.",
            redirect_url='/rejects',
            group='all_sellers'
        )


class ProductApprovalNotifier(NotificationService):
    def __init__(self, user, sender=None):
        """
        Notification service for product approval process, specifically for notifying admins.
        """
        super().__init__(user=user, sender=sender)
        self.defaults.update({
            'type': 'info',  # Notification type
            'priority': 'high',  # High priority for product approvals
            'expires_in': 48,  # 2 days for approval-related notifications
        })

    def notify_admin_new_product(self, product_id, product_name, seller_name):
        """
        Notify the admin about a new product submitted by a seller for approval.
        """
        return self.send(
            message=f"A new product (ID: {product_id}, Name: '{product_name}') has been submitted by {seller_name} for approval.",
            redirect_url=f'/admin/products/pending/',
            group='all_admins'
        )


