const cartItemTemplate = (barcode, name, price) => `
    <div class="d-flex py-3 align-items-center cart-item" data-barcode="${barcode}" data-price=${price}>
        <input type="hidden" name="barcode" value="${barcode}"/>
        <div class="col-5">
            <div class="fw-bold">${name}</div>
            <div class="text-secondary price">${formatter().format(price)}</div>
        </div>
        <div class="ms-auto col-3">
            <i class="bi bi-dash-circle-fill btn-minus"></i>
            <input
                type="number"
                name="quantity"
                class="quantity"
                value="1"
                min="1"
            />
            <i class="bi bi-plus-circle-fill btn-plus"></i>
        </div>
        <div class="price text-large subtotal col-3 text-end" data-price="${price}">${formatter().format(price)}</div>
        <div class="btn-remove col-1 text-end"><i class="bi bi-x-lg"></i></div>
    </div>`

const cartList = []

$('.cart-item-list').on('click', '.btn-remove', function() {
    let cartItem = $(this).closest('.cart-item');
    let barcode = cartItem.data("barcode")
    cartList.splice(cartList.indexOf(barcode), 1)
    cartItem.remove();
    $('#current-quantity').text(cartList.length);
    updateTotal();
})  

$('.cart-item-list').on('click', '.btn-minus', function() {
    let cartItem = $(this).closest('.cart-item');
    let newQuantity = parseInt(cartItem.find('.quantity').val()) - 1;
    let price = parseInt(cartItem.data('price'));
    if (newQuantity === 0) 
        return;
    let newPrice = price * newQuantity;
    cartItem.find('.quantity').val(newQuantity)
    cartItem.find('.subtotal').text(formatter().format(newPrice)).data('price', newPrice)
    updateTotal();
})  

$('.cart-item-list').on('click', '.btn-plus', function() {
    let cartItem = $(this).closest('.cart-item');
    let newQuantity = parseInt(cartItem.find('.quantity').val()) + 1;
    let price = parseInt(cartItem.data('price'));
    let newPrice = price * newQuantity;
    cartItem.find('.quantity').val(newQuantity)
    cartItem.find('.subtotal').text(formatter().format(newPrice)).data('price', newPrice)
    updateTotal();
})  

$('.cart-item-list').on('change', '.quantity', function() {
    let cartItem = $(this).closest('.cart-item');
    let newQuantity = parseInt($(this).val());
    if (newQuantity <= 0) {
        $(this).val(1);
        return ;
    }
    let price = parseInt(cartItem.data('price'));
    let newPrice = price * newQuantity;
    cartItem.find('.quantity').val(newQuantity)
    cartItem.find('.subtotal').text(formatter().format(newPrice)).data('price', newPrice)
    updateTotal();
})  



$('table').on('click', '.product-row', function() {
    let barcode = $(this).data('barcode');
    let name = $(this).data('name');
    let price = $(this).data('price');
    
    if (cartList.includes(barcode)) {
        return;
    }
    cartList.push(barcode);
    $('.cart-item-list').append(cartItemTemplate(barcode, name, price));
    $('#current-quantity').text(cartList.length);
    updateTotal()
    console.log(cartList)
})

function updateTotal() {
    let total = 0;
    $('.subtotal').each((i, e) => {
        let price = parseInt($(e).data('price'));
        total += price;
    })
    $('#total').text(formatter().format(total));
}


function formatter() {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      });
    
}

$(document).ready(function(){
    $('.cart-item').each((i, e) => {
        cartList.push($(e).data('barcode'));
    })
    console.log(cartList);
    $("#input-product-name").on("keyup", function(){
        var inputValue = $(this).val();
        $.ajax({
            url: '/staff/cart/search',
            method: 'POST',
            dataType: 'json',
            data: {
                data: inputValue,
            },
            success: function(data){
                $('#tb-product-search').html("");
                var listProducts = data.data;
                if (inputValue!==""){
                    listProducts.forEach(product=>{
                        let html = `
                        <tr class="product-row" data-barcode="${product.barcode}" data-name="${product.name}" data-price="${product.retailPrice}">
                            <td>${product.barcode}</td>
                            <td>${product.name}</td>
                            <td style="text-align: right">${formatter().format(product.retailPrice)}</td>
                        </tr>
                        `
                        $('#tb-product-search').append(html);
                    })
                }
            },
            error: function(error){
                console.log("Error")
            }
        });
    })
    $("#btnAddProduct").on("click",function(){
        var inputSearch = $("#input-barcode").val();
        $.ajax({
            url: '/staff/cart/searchBC',
            method: "POST",
            dataType: "json",
            data:{
                data:inputSearch
            },
            success: function(data){
                const productFind = data.data[0];
                let barcode = productFind.barcode;
                let name = productFind.name;
                let price = productFind.retailPrice;
                
                console.log(cartList)
                console.log(barcode)
                if (!cartList.includes(parseInt(barcode))) {
                    cartList.push(parseInt(barcode));
                    $('.cart-item-list').append(cartItemTemplate(barcode, name, price));
                    $('#current-quantity').text(cartList.length);
                    updateTotal()
                }
                
            },
            error: function(error){
                console.log("Error")
            }
        })
    })
})