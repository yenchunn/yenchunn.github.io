
function handleAddToCart() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (!productId) {
    alert("找不到商品資料");
    return;
  }


  let product = null;

  if (Array.isArray(window.productData)) {
    product = window.productData.find(p => p.id === productId) || null;
  } else if (typeof products === "object" && products) {
  const p = products[productId];
  if (p) {
    product = {
      id: productId,
      name: p.name,
      price: p.price,
      image: p.img,   
      spec: ""
    };
  }
}

  const qty = parseInt(document.getElementById("qty-num").textContent) || 1;

 
  addToCart({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    spec: product.spec,
    quantity: qty
  });

  
  alert("已加入購物車！");
}
