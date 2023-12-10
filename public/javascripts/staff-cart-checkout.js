

$('#input-amount').keyup(function(event) {
    var selection = window.getSelection().toString(); 
    if (selection !== '') {
        return; 
    }       
    // When the arrow keys are pressed, abort.
    if ($.inArray(event.keyCode, [38, 40, 37, 39]) !== -1) {
        return; 
    }       
    var $this = $(this);            
    // Get the value.
    var input = $this.val();            
    input = input.replace(/[\D\s\._\-]+/g, ""); 
    input = input?parseInt(input, 10):0; 
    $('#input-amountGiven').val(input);
    let total = $('#total').data('value');
    let change = input - total;
    if (change < 0) {
        $(this).addClass('is-invalid').removeClass('is-valid');
        $('#input-change').val(0);
    }
    else {
        $(this).removeClass('is-invalid').addClass('is-valid');
        $('#input-change').val(change.toLocaleString("vi-VN"));
        
    }
    $this.val(function () {
        return (input === 0)? "" :input.toLocaleString("vi-VN"); 
    });
})



$('#input-phone').keyup(function() {
    let phone = $(this).val();
    if (phone.length < 10) {
        $(this).addClass('is-invalid');
    }
    else 
        $(this).removeClass('is-invalid');
    if (phone.length !== 10) return;
    $('#success-text').addClass('d-none');
    $('#failure-text').addClass('d-none');
    $.get('/staff/cart/checkout/getCustomerByPhoneNumber?q=' + phone, function(res) {
        if (res.success) {
            $('#success-text').removeClass('d-none');
            
            $('#input-fullname').val(res.data.fullName);
            $('#found-address').removeClass('d-none');
            $('#input-found-address').val(res.data.address);
            $('#new-address').addClass('d-none');

        }
        else {
            $('#failure-text').removeClass('d-none');
            $('#input-fullname').val('');
            $('#found-address').addClass('d-none');
            $('#new-address').removeClass('d-none');
        }
    })
})



function formatter() {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      });
    
}