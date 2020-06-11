// 商品 hover 效果
function productHoverEffect() {
    $('#grid .product .product-detail').hover(
        // mouseenter事件
        function () {
            $(this).addClass('animate') // 给该标签添加class属性'animate'
        },
        // mouseleave事件
        function () {
            $(this).removeClass('animate')
        }
    )
}

// 切换商品显示布局
function switchProductLayout() {
    // large-grid 点击事件
    $('#gridSelector').on('click', '.large-grid', function () {
        // 切换图标
        $(this).children('a').addClass('active') // children 在儿子辈中选取所有满足条件的元素
        $('#gridSelector').find('.small-grid a').removeClass('active') // find 在所有后代中选取所有满足条件的元素

        // 切换视图
        $('#grid').find('.product').addClass('large')
        $('#grid').find('.info-large').show()

        // 隐藏原有小网格上的信息
        $('#grid').find('.product-detail .stats').hide()
        // off 解绑事件
        $('#grid .product .product-detail').off('mouseenter')
    })

    // small-grid 点击事件
    // 切换图标
    $('#gridSelector').on('click', '.small-grid', function () {
        $(this).children('a').addClass('active')
        $('#gridSelector').find('.large-grid a').removeClass('active')

        // 切换视图
        $('#grid').find('.product').removeClass('large')
        $('#grid').find('.info-large').hide()

        // 显示原有小网格上的信息
        $('#grid').find('.product-detail .stats').show()
        // 重新绑定hover事件
        productHoverEffect()
    })
}

// 将商品加入到购物车
function handleAddProductToCart() {
    $('#grid').on('click', '.add-product-to-cart, .add-cart-large', function () {
        var productCard = $(this).parents('.product').find('.product-card')
        //console.log(productCard);

        // 获取商品信息变量
        var productImage = productCard.find('.product-img').prop('src')
        var productName = productCard.find('.product-name').text()
        var productPrice = productCard.find('.product-price').text()

        var cartTarget = $('#cart')

        // 克隆一个 productCard 元素
        var cloneCard = productCard
            .clone()
            .css(productCard.offset()) // offset() 方法返回或设置匹配元素相对于文档的偏移（位置）
            .appendTo('body')

        //console.log('productCard: ');
        //console.log(productCard.offset());
        //console.log('cloneCard: ');
        //.log(cloneCard.offset());

        cloneCard
            // 飞入购物车效果
            .animate(
                {
                    left: cartTarget.offset().left,
                    top: cartTarget.offset().top + cartTarget.height(),
                    width: '50px',
                    height: '100px',
                },
                500 // 500ms
            )
            .fadeOut('fast', function () {
                // 处理是否为重复选择的商品
                var isProductSelected = handleDuplicateProduct(productName)

                // 如果未选择过此商品，则加入到购物车列表
                if (!isProductSelected) {
                    appendProductToCart(productImage, productName, productPrice, 1)
                }

                // 删除克隆元素
                cloneCard.remove()

                // 显示结算按钮
                showCheckoutBtn()

                // 将购物车中的商品信息保存到本地（利用 H5 中的 localStorage）
                saveProductsToLocalStorage()
            })
    })
}

// 处理重复商品
function handleDuplicateProduct(productName) {
    var isDuplicate = false
    // 遍历已经选择并添加到购物车列表的所有商品
    $('#cart')
        .find('.cart-item .box')
        .each(function () {
            //console.log($(this));
            var name = $(this).find('.name').html()
            //console.log(name);

            // 如果商品已经在购物车列表中（实际生产环境中建议利用商品 id 进行对比）
            if (productName == name) {
                // 获取商品数量
                var total = $(this).find('.total').text()

                // 商品数量 +1
                $(this)
                    .find('.total')
                    .text(parseInt(total) + 1)

                isDuplicate = true
            }
        })

    return isDuplicate
}

// 向左侧购物车中添加商品
function appendProductToCart(productImage, productName, productPrice, productTotal) {
    // console.log(productImage)
    var productItem =
        '<div class="cart-item">' +
        '<div class="img-wrap">' +
        '<img src="' +
        productImage +
        '" alt="">' +
        '</div>' +
        '<div class="box"><span class="name">' +
        productName +
        '</span> <span class="total">' +
        productTotal +
        '</span></div>' +
        '<strong class="price">' +
        productPrice +
        '</strong>' +
        '</div>'

    // 添加已经选择商品
    $('#cart').append(productItem)
}

// 购物车不为空时显示结算按钮
function showCheckoutBtn() {
    if (!$('#checkout').is(':visible')) {
        $('#checkout').show()

        // 隐藏“购物车为空”的文字
        $('#cart').find('.empty').hide()
    }
}

// 将购物车中的商品信息保存到本地
function saveProductsToLocalStorage() {
    var productData = []
    $('#cart')
        .find('.cart-item')
        .each(function () {
            var item = $(this)
            productData.push({
                image: item.find('img').prop('src'),
                name: item.find('.name').text(),
                total: item.find('.total').text(),
                price: item.find('.price').text(),
            }) // 将一个js对象作为数组的元素
        })

    // 将 JS对象 转化为 JSON数据 ，保存到本地
    localStorage.setItem('products', JSON.stringify(productData))
}

// 从本地读取购物车中的商品信息
function loadProductsFromLocalStorage() {
    var productJson = localStorage.getItem('products')

    if (productJson != '' && productJson != null && productJson != undefined) {
        // 将 JSON数据 转化为 JS对象
        var products = JSON.parse(productJson)

        $.each(products, function () {
            /*console.log(this.image);
            console.log(this.name);
            console.log(this.total);
            console.log(this.price);*/

            // 将商品信息添加到购物车中
            appendProductToCart(this.image, this.name, this.price, this.total)

            // 购物车不为空时显示结算按钮
            showCheckoutBtn()
        })
    }
}

// 未开发模块设置提醒
function addAlert() {
    $('#header a.unfinished, #sidebar .checklist a, #grid .view-product-detail').on(
        'click',
        function () {
            alert('该项功能暂未开发，请您先体验其他功能吧！')
        }
    )
}

// jQuery ready函数
$(function () {
    productHoverEffect()

    switchProductLayout()

    handleAddProductToCart()

    loadProductsFromLocalStorage()

    addAlert()
})
