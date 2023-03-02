paypal.Buttons({
    style: {
        display: 'none'
    },
    createOrder: function(data, actions) {
    
        return fetch(main.base_url + 'paypal/order',{
            method: 'post',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                
                "paypal_auth" : main.getCookie('pay_pal'),
                "amount" : document.querySelector('input[name="payment"]:checked').value,
                "currency_code" : "USD",
                "brand_name" : "standard"
            })
            
        }).then(function(res) {
            return res.json();
        }).then(function(orderData) {
            return orderData.id;
        });
    },
    
    // Call your server to finalize the transaction
    onApprove: function(data, actions) {
        return fetch(main.base_url + 'paypal/order/capture', {
            method: 'post',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                "order_id" : data.orderID,
                "paypal_auth" : main.getCookie('pay_pal'),
            })
        }).then(function(res) {
            return res.json();
        }).then(function(orderData) {
            // Three cases to handle:
            //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
            //   (2) Other non-recoverable errors -> Show a failure message
            //   (3) Successful transaction -> Show confirmation or thank you

            // This example reads a v2/checkout/orders capture response, propagated from the server
            // You could use a different API or structure for your 'orderData'
            var errorDetail = Array.isArray(orderData.details) && orderData.details[0];

            if (errorDetail && errorDetail.issue === 'INSTRUMENT_DECLINED') {
                return actions.restart(); // Recoverable state, per:
                // https://developer.paypal.com/docs/checkout/integration-features/funding-failure/
            }

            if (errorDetail) {
                var msg = 'Sorry, your transaction could not be processed.';
                if (errorDetail.description) msg += '\n\n' + errorDetail.description;
                if (orderData.debug_id) msg += ' (' + orderData.debug_id + ')';
                return alert(msg); // Show a failure message (try to avoid alerts in production environments)
            }

            
            var transaction = orderData.purchase_units[0].payments.captures[0];
            
            _signup(JSON.parse(main.getCookie('reg_det')));
            
        });
    }

}).render('#paypal-button-container');