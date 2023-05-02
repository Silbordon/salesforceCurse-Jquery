

$(document).ready(function () {
    var urlApi = "https://60a6e6f9b970910017eb2862.mockapi.io/users/products";

    //GET
    $.get(urlApi, function (data, status) {
        data.sort(function (a, b) {
            return a.id - b.id;
        });
        data.reverse();
        $.each(data, function (index, product) {
            var html =
                '<div class="card m-3 bg-light rounded-5" style="width: 18rem">' +
                '<img src="' +
                product.url +
                '" class="w-50 mx-auto d-block mt-3 " alt="' +
                product.name +
                '">' +
                '<div class="card-body">' +
                '<h5 class="card-title text-center">' +
                product.name +
                "</h5>" +
                '<p class="fs-6 fst-italic h-50">' +
                product.description +
                "</p>" +
                '<div class="card-footer d-flex justify-content-around bg-white mb-0">' +
                '<button type="button" class="btn btn-danger delete" data-id=' + product.id + '>Delete</button>' +
                '<button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#staticBackdropUpdate" id="update" data-id=' + product.id + '>Update</button>' +
                "</div>" +
                "</div>" +
                "</div>";

            $("#products-container").append(html);
        });
    });



    //POST
    $('#create').on('click', function () {
        var productImage = $('#productImage').val();
        var productName = $('#productName').val();
        var productDescription = $('#productDescription').val();

        var newProduct = {
            name: productName,
            description: productDescription,
            image: productImage
        };


        if (!productImage || !productName || !productDescription) {
            swal("WAIT", "You must complete all fields!", "warning");
            return;
        }
        if (!productImage.match(/^https:\/\/.*/)) {
            swal("WAIT", "The URL must start with 'https://'", "warning");
            return;
        }

        $.ajax({
            type: 'POST',
            url: urlApi,
            contentType: 'application/json',
            data: JSON.stringify(newProduct)
        })
            .done(function (resp) {
                console.log('Product added:', resp);
                swal("Good job!", "Product created successfully!", "success");
            })
            .fail(function (error) {
                swal("WAIT", "something happened", "error");
                console.error(error);
            })

        // Limpiar los campos del formulario después de enviar los datos
        $('#myForm').trigger('reset');

        // Cerrar el modal después de enviar los datos
        $('#staticBackdrop').modal('hide');
    })

});


//DELETE
$(document).on('click', '.delete', function () {

    var urlApi = "https://60a6e6f9b970910017eb2862.mockapi.io/users/products/";
    let productId = $(this).data('id');
    console.log(productId);

    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this imaginary file!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
            $.ajax({
                url: urlApi + productId,
                type: "DELETE",
                success: function (result) {
                    swal("Poof! Your product has been deleted!", {
                        icon: "success",
                      });
                },
                error: function (xhr, status, error) {
                    swal("WAIT", "something happened", "error");
                    console.error(error);
                }
            });
        } else {
          swal("Your product is safe!");
        }
      });

    
})


//UPDATE
$(document).ready(function () {
    var urlApi = "https://60a6e6f9b970910017eb2862.mockapi.io/users/products/";

    $(document).on("click", "#update", function () {
        var id = $(this).data("id"); 
        $.ajax({
            type: 'GET',
            url: urlApi + id,
            success: function (product) {
                $('#myFormUpdate').attr('data-id', product.id);
                $('#productImageUpdate').val(product.url);
                $('#productNameUpdate').val(product.name);
                $('#productDescriptionUpdate').val(product.description);
            }
        });

        $(document).on("click", "#updateModal", function () {
            var productImage = $('#productImageUpdate').val();
            var productName = $('#productNameUpdate').val();
            var productDescription = $('#productDescriptionUpdate').val();

            var editProduct = {
                name: productName,
                description: productDescription,
                image: productImage
            };


            if (!productImage || !productName || !productDescription) {
                swal("WAIT", "You must complete all fields!", "warning");
                return;
            }
            if (!productImage.match(/^https:\/\/.*/)) {
                swal("WAIT", "The URL must start with 'https://'", "warning");
                return;
            }

            $.ajax({
                type: 'PUT',
                url: urlApi + id,
                contentType: 'application/json',
                data: JSON.stringify(editProduct)
            })
                .done(function (resp) {
                    console.log('Product added:', resp);
                    swal("Good job!", "Product updated successfully!", "success");
                })
                .fail(function (error) {
                    swal("WAIT", "something happened", "error");
                    console.error(error);
                })
            $('#myFormUpdate').trigger('reset');
            $('#staticBackdropUpdate').modal('hide');
        })
    });
});




