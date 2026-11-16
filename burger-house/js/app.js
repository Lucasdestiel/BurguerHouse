// Burger House — dados demonstrativos. Personalize produtos, endereço e WhatsApp aqui.
const STORE = {
  whatsapp: "5541999999999", // DDI + DDD + número, somente dígitos
  name: "Burger House"
};

const products = [
  {id:1,name:"Classic Burger",category:"Hambúrgueres",description:"Pão brioche, burger 160g, queijo prato, alface e molho da casa.",price:28.90,image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85",tag:"Clássico"},
  {id:2,name:"House Bacon",category:"Hambúrgueres",description:"Burger 160g, cheddar cremoso, bacon crocante e maionese defumada.",price:34.90,image:"https://images.unsplash.com/photo-1553979459-d2229ba7433a?auto=format&fit=crop&w=900&q=85",tag:"Mais pedido"},
  {id:3,name:"Double Smash",category:"Hambúrgueres",description:"Dois smash burgers, queijo duplo, cebola caramelizada e molho especial.",price:36.90,image:"https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=85",tag:"Especial"},
  {id:4,name:"Chicken Crispy",category:"Hambúrgueres",description:"Frango empanado crocante, queijo, alface e molho honey mustard.",price:29.90,image:"https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=900&q=85",tag:""},
  {id:5,name:"Combo House",category:"Combos",description:"House Bacon + batata frita individual + refrigerante lata.",price:44.90,image:"https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=900&q=85",tag:"Combo"},
  {id:6,name:"Combo Duplo",category:"Combos",description:"Dois Classic Burgers + duas batatas individuais + dois refrigerantes.",price:69.90,image:"https://images.unsplash.com/photo-1553979459-d2229ba7433a?auto=format&fit=crop&w=900&q=85",tag:"Para dividir"},
  {id:7,name:"Batata com Cheddar",category:"Porções",description:"Batata frita crocante coberta com cheddar cremoso.",price:19.90,image:"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=85",tag:""},
  {id:8,name:"Onion Rings",category:"Porções",description:"Anéis de cebola empanados, dourados e crocantes.",price:18.90,image:"https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=900&q=85",tag:""},
  {id:9,name:"Refrigerante Lata",category:"Bebidas",description:"Coca-Cola, Guaraná ou Fanta — 350ml. Escolha no pedido.",price:6.00,image:"https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=900&q=85",tag:"350ml"},
  {id:10,name:"Milkshake Chocolate",category:"Bebidas",description:"Milkshake cremoso de chocolate — 400ml.",price:16.90,image:"https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=900&q=85",tag:"400ml"},
  {id:11,name:"Brownie com Sorvete",category:"Sobremesas",description:"Brownie de chocolate servido com uma bola de sorvete.",price:17.90,image:"https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=85",tag:""},
  {id:12,name:"Churros bites",category:"Sobremesas",description:"Mini churros com açúcar e canela, acompanhados de doce de leite.",price:14.90,image:"https://images.unsplash.com/photo-1624371414361-e670edf4898d?auto=format&fit=crop&w=900&q=85",tag:""}
];

const money = value => value.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
let cart = JSON.parse(localStorage.getItem("burgerHouseCart") || "[]");
let activeCategory = "Todos";

const productGrid = document.querySelector("#productGrid");
const categoryFilters = document.querySelector("#categoryFilters");
const searchInput = document.querySelector("#searchInput");
const cartDrawer = document.querySelector("#cartDrawer");
const cartBackdrop = document.querySelector("#cartBackdrop");
const checkoutModal = new bootstrap.Modal(document.querySelector("#checkoutModal"));

function renderCategories(){
  const categories = ["Todos",...new Set(products.map(product=>product.category))];
  categoryFilters.innerHTML = categories.map(category=>`
    <button class="filter-btn ${category===activeCategory?"active":""}" data-category="${category}">${category}</button>
  `).join("");
}

function renderProducts(){
  const term = searchInput.value.trim().toLowerCase();
  const filtered = products.filter(product=>
    (activeCategory==="Todos" || product.category===activeCategory) &&
    `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(term)
  );
  productGrid.innerHTML = filtered.length ? filtered.map(product=>`
    <div class="col-sm-6 col-lg-4 col-xl-3">
      <article class="product-card">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          ${product.tag?`<span class="product-tag">${product.tag}</span>`:""}
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="product-bottom">
            <span class="product-price">${money(product.price)}</span>
            <button class="add-btn" data-add="${product.id}" aria-label="Adicionar ${product.name}">+</button>
          </div>
        </div>
      </article>
    </div>
  `).join("") : `<div class="col-12 no-results">Não encontramos produtos com essa busca.</div>`;
}

function saveCart(){
  localStorage.setItem("burgerHouseCart",JSON.stringify(cart));
  renderCart();
}

function addToCart(id){
  const item = cart.find(item=>item.id===id);
  if(item) item.quantity++;
  else cart.push({id,quantity:1});
  saveCart();
}

function changeQuantity(id,change){
  const item = cart.find(item=>item.id===id);
  if(!item) return;
  item.quantity += change;
  if(item.quantity<=0) cart = cart.filter(product=>product.id!==id);
  saveCart();
}

function getCartDetails(){
  return cart.map(item=>{
    const product = products.find(product=>product.id===item.id);
    return product ? {...product,quantity:item.quantity,lineTotal:product.price*item.quantity} : null;
  }).filter(Boolean);
}

function renderCart(){
  const details = getCartDetails();
  const count = details.reduce((sum,item)=>sum+item.quantity,0);
  const total = details.reduce((sum,item)=>sum+item.lineTotal,0);
  document.querySelector("#cartCount").textContent = count;
  document.querySelector("#cartTotal").textContent = money(total);
  document.querySelector("#checkoutButton").disabled = details.length===0;
  document.querySelector("#cartItems").innerHTML = details.length ? details.map(item=>`
    <div class="cart-item">
      <div><h3>${item.name}</h3><small>${money(item.price)} cada</small>
        <div class="quantity-controls">
          <button data-change="-1" data-id="${item.id}" aria-label="Diminuir quantidade">−</button>
          <span>${item.quantity}</span>
          <button data-change="1" data-id="${item.id}" aria-label="Aumentar quantidade">+</button>
        </div>
      </div>
      <strong class="cart-item-price">${money(item.lineTotal)}</strong>
    </div>
  `).join("") : `<div class="empty-cart"><span>🛒</span><h3>Seu carrinho está vazio</h3><p>Adicione algo delicioso do nosso cardápio.</p></div>`;
}

function openCart(){
  cartDrawer.classList.add("open");
  cartBackdrop.classList.add("show");
  cartDrawer.setAttribute("aria-hidden","false");
  document.body.style.overflow="hidden";
}
function closeCart(){
  cartDrawer.classList.remove("open");
  cartBackdrop.classList.remove("show");
  cartDrawer.setAttribute("aria-hidden","true");
  document.body.style.overflow="";
}

function sendWhatsAppOrder(event){
  event.preventDefault();
  if(!cart.length) return;
  const name = document.querySelector("#customerName").value.trim();
  const orderType = document.querySelector("#orderType").value;
  const address = document.querySelector("#customerAddress").value.trim();
  const notes = document.querySelector("#orderNotes").value.trim();
  if(orderType==="Entrega" && !address){
    document.querySelector("#customerAddress").focus();
    return;
  }
  const details = getCartDetails();
  const total = details.reduce((sum,item)=>sum+item.lineTotal,0);
  const lines = [
    `🍔 *NOVO PEDIDO — ${STORE.name.toUpperCase()}*`,
    "",
    ...details.map(item=>`• ${item.quantity}x ${item.name} — ${money(item.lineTotal)}`),
    "",
    `*TOTAL: ${money(total)}*`,
    "",
    `*Cliente:* ${name}`,
    `*Recebimento:* ${orderType}`,
    ...(orderType==="Entrega"?[`*Endereço:* ${address}`]:[]),
    ...(notes?[`*Observações:* ${notes}`]:[]),
    "",
    "Aguardo a confirmação do pedido. Obrigado!"
  ];
  const url = `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
  window.open(url,"_blank","noopener,noreferrer");
  checkoutModal.hide();
}

categoryFilters.addEventListener("click",event=>{
  const button = event.target.closest("[data-category]");
  if(!button) return;
  activeCategory = button.dataset.category;
  renderCategories();
  renderProducts();
});
searchInput.addEventListener("input",renderProducts);
productGrid.addEventListener("click",event=>{
  const button = event.target.closest("[data-add]");
  if(button) addToCart(Number(button.dataset.add));
});
document.querySelector("#cartItems").addEventListener("click",event=>{
  const button = event.target.closest("[data-change]");
  if(button) changeQuantity(Number(button.dataset.id),Number(button.dataset.change));
});
document.querySelector("#openCart").addEventListener("click",openCart);
document.querySelector("#closeCart").addEventListener("click",closeCart);
cartBackdrop.addEventListener("click",closeCart);
document.querySelector("#checkoutButton").addEventListener("click",()=>{
  closeCart();
  checkoutModal.show();
});
document.querySelector("#checkoutForm").addEventListener("submit",sendWhatsAppOrder);
document.querySelector("#orderType").addEventListener("change",event=>{
  document.querySelector("#addressGroup").hidden = event.target.value!=="Entrega";
  document.querySelector("#customerAddress").required = event.target.value==="Entrega";
});
document.querySelector("#whatsappContact").addEventListener("click",()=>{
  window.open(`https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent("Olá! Gostaria de mais informações sobre o cardápio da Burger House.")}`,"_blank","noopener,noreferrer");
});
document.querySelector("#currentYear").textContent = new Date().getFullYear();

renderCategories();
renderProducts();
renderCart();
