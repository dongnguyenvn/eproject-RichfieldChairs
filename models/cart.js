module.exports = function Cart(cart) {
    this.items = cart.items || {};
    this.totalItems = cart.totalItems || 0;
    this.totalPrice = cart.totalPrice || 0;

    this.add = function(item, id) {
        var cartItem = this.items[id];
        if (!cartItem) {
            cartItem = this.items[id] = {item: item, quantity: 0, price: 0};
        }
        cartItem.quantity++;
        cartItem.price = cartItem.item.Price * cartItem.quantity;
        this.totalItems++;
        this.totalPrice += cartItem.item.Price;
        
    };
    console.log(cart);

    this.remove = function(id) {
        this.totalItems -= this.items[id].quantity;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    };

    this.reduceByOne = function(id) {
        this.items[id].quantity--
        this.items[id].price -= this.items[id].item.Price
        this.totalItems--
        this.totalPrice -= this.items[id].item.Price

        if (this.items[id].quantity <= 0) {
            delete this.items[id]
        }
    }
    this.increaseByOne = function(id) {
        this.items[id].quantity++
        this.items[id].price += this.items[id].item.Price
        this.totalItems++
        this.totalPrice += this.items[id].item.Price
    }


    this.getItems = function() {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
};