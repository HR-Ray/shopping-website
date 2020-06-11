// 从本地加载已选的商品，并初始化购物车
function initCartProductByLocalStorage() {
    var productsJson = localStorage.getItem('products')

    var cartBody = $('#cartTable tbody')

    if (productsJson != '' && productsJson != null && productsJson != undefined) {
        // 将 JSON数据 转化为 JS对象
        var products = JSON.parse(productsJson)

        // 动态添加商品项
        $.each(products, function () {
            /*console.log(this.image);
            console.log(this.name);
            console.log(this.total);
            console.log(this.price);*/

            var productEle =
                '<tr>' +
                '<td><input type="checkbox" name="productCheck" /></td>' +
                '<td class="cart-product-name">' +
                ' <img src=' +
                this.image +
                ' alt="No Image" />' +
                '<span>' +
                this.name +
                '</span>' +
                '</td>' +
                '<td class="cart-product-price">' +
                this.price +
                '</td>' +
                '<td class="cart-product-count">' +
                '<span class="reduce">-</span>' +
                '<input class="count-input" type="text" value=' +
                this.total +
                ' />' +
                '<span class="add">+</span>' +
                '</td>' +
                '<td class="cart-product-subtotal">' +
                this.price * this.total +
                '</td>' +
                '<td class="cart-product-operation">' +
                '<span class="delete">删除</span>' +
                '</td>' +
                '</tr > '

            cartBody.append(productEle)
        })

        // 为商品数量绑定 change 事件（当某商品数量变化时就调整其商品小计）
        cartBody.on('change', '.count-input', function () {
            updataSubTotal(this)
            updataProductsTotalCountAndTotalAmount()
        })

        // 点击增加商品数量按钮
        cartBody.on('click', '.add', function () {
            var input = $(this).prev() // prev() 返回上一个同胞元素
            var inputValue = parseInt(input.val())
            inputValue += 1
            input.val(inputValue)

            updataSubTotal(input)
            updataProductsTotalCountAndTotalAmount()
        })

        // 点击减少商品数量按钮
        cartBody.on('click', '.reduce', function () {
            var input = $(this).next() // next() 返回下一个同胞元素
            var inputValue = parseInt(input.val())
            // 商品数量必须大于等于1
            inputValue = inputValue > 1 ? inputValue - 1 : inputValue
            input.val(inputValue)

            updataSubTotal(input)
            updataProductsTotalCountAndTotalAmount()
        })

        // 点击商品项前的单选框时，更新总数量和总金额
        cartBody.on('click', 'input:checkbox', function () {
            updataProductsTotalCountAndTotalAmount()
        })

        // 点击全选按钮
        $('#selectAllProduct').on('click', function () {
            var checkAllStatus = $(this).prop('checked')
            //alert(checkStatus);

            cartBody.find('input:checkbox').prop('checked', checkAllStatus)

            updataProductsTotalCountAndTotalAmount()
        })

        // 删除某个商品
        cartBody.on('click', '.delete', function () {
            var productItem = $(this).parent().parent()

            var productName = productItem.find('.cart-product-name span').text()

            productItem.remove()

            updataProductsTotalCountAndTotalAmount()

            // 从本地存储中删除指定商品
            //console.log(products);
            $.each(products, function (index, element) {
                if (this.name == productName) {
                    // 从数组中删除指定元素
                    products.splice(index, 1) // (下标，长度)

                    // 重新保存到本地
                    localStorage.setItem('products', JSON.stringify(products))
                    return
                }
            })
        })

        // 删除全部商品
        $('#deleteAllProduct').on('click', function () {
            var result = confirm('是否确认删除所有商品？')
            if (result == true) {
                cartBody.empty()

                updataProductsTotalCountAndTotalAmount()

                localStorage.removeItem('products')
            }
        })
    }
}

// 更新商品的小计，传入参数为DOM元素 .count-input
function updataSubTotal(element) {
    var inputValue = parseInt($(element).val())

    // 调整小计(单价*数量)
    var subtotalValue = parseFloat($(element).parent().next().text())
    var unitPriceValue = parseFloat($(element).parent().prev().text())
    subtotalValue = unitPriceValue * inputValue
    $(element).parent().next().text(subtotalValue.toFixed(2)) // 保留两位小数
}

// 更新准备结算商品的总数量和总金额
function updataProductsTotalCountAndTotalAmount() {
    var selectedTotalCount = 0 // 总数量
    var selectedTotalAmount = 0 // 总金额

    $('#cartTable tbody input:checkbox[name="productCheck"]:checked').each(function () {
        var productItem = $(this).parent().parent()

        var productCount = productItem.find('.count-input').val()
        selectedTotalCount += parseInt(productCount)

        var productAmount = productItem.find('.cart-product-subtotal').text()
        selectedTotalAmount += parseFloat(productAmount)
    })

    $('#selectedTotalCount').text(selectedTotalCount)
    $('#selectedTotalAmount').text(selectedTotalAmount)
}

// 未开发模块设置提醒
function addAlert() {
    $('#header a.unfinished, #cartFooter .closing').on('click', function () {
        alert('该项功能暂未开发，请您先体验其他功能吧！')
    })
}

// jQuery ready函数
$(function () {
    initCartProductByLocalStorage()

    addAlert()
})
