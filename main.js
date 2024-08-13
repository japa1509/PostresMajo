let carrito = [];
// Función para cargar el archivo JSON
async function cargarProductos() {
    try {
        //realiza una solicitud para obtener el archivo JSON
        const response = await fetch('data.json');
        // Convierte la respuesta en un objeto JSON
        const productos = await response.json();
        // Llama a la funcion para mostrar los productos en el DOM
        mostrarProductos(productos);
    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
}

// Función para mostrar los productos en el DOM
function mostrarProductos(productos) {
    // Obtiene el contenedor donde se mostrarán los productos
    const contenedor = document.getElementById('productos');
    // Itera sobre cada producto en el array de productos
    productos.forEach((producto, index) => {
        // Crea un nuevo elemento 'li' para cada producto
        const productoDiv = document.createElement('li');
        // Añade clases de estilo al elemento 'li'
        productoDiv.classList.add('producto', 'rounded');
        // Establece el contenido HTML del elemento 'li' usando una plantilla de cadena de texto
        productoDiv.innerHTML = `
            <img class="rounded-lg mb-2 border hover:border-red-500" src="${producto.image.desktop}" alt="${producto.name}">
            <div class="flex justify-between"> 
                <h3 class="flex items-center text-sm font-medium text-stone-700">${producto.name}</h3>
                <span class="flex items-center text-red-500 font-medium">$${producto.price.toFixed(2)}</span>
            </div>
            <p class="font-semibold text-base pb-3">${producto.category}</p>
            <a id="add-to-cart-${index}" class="flex border hover:border-red-500 gap-1 items-center justify-center font-medium  text-sm px-2 py-2 rounded-full shadow-md bg-white" href=""><span><img src="/assets/images/icon-add-to-cart.svg" alt=""></span>Add to cart</a>
            <div id="contador-${index}" class=" hidden space-x-4 ">
                    <a class="flex justify-between w-full bg-red-500  gap-1 items-center  font-semibold text-sm px-2 py-2 rounded-full shadow-md ">
                        <span><img id="decrementar-${index}" class="pl-2 w-6" src="/assets/images/icon-decrement-quantity.svg" alt="Decrementar"></span>
                        <span id="cantidad-${index}">0</span>
                        <span><img id="incrementar-${index}" class="pr-2 w-6" src="/assets/images/icon-increment-quantity.svg" alt="Incrementar"></span>
                    </a>
                </div>
        `;

        contenedor.appendChild(productoDiv); //añade el producto al contenedor

        inicializarContador(producto, index); // Iniicializa el contador para este producto
    });
}

// Función para inicializar el contador de un producto
function inicializarContador(producto, index) {
    const addToCartBtn = document.getElementById(`add-to-cart-${index}`);
        const contadorDiv = document.getElementById(`contador-${index}`);
    const decrementarBtn = document.getElementById(`decrementar-${index}`);
    const incrementarBtn = document.getElementById(`incrementar-${index}`);
    const cantidadSpan = document.getElementById(`cantidad-${index}`);

    let cantidad = 1;

    function actualizarCantidad() {
        cantidadSpan.textContent = cantidad;

        if (cantidad === 0) {
            contadorDiv.classList.add('hidden');
            addToCartBtn.classList.remove('hidden');
          // Reasignar el event listener al botón "Add to Cart"
          addToCartBtn.addEventListener('click', handleAddToCartClick);
        }
    }

    function handleAddToCartClick(event) {
        event.preventDefault();
        addToCartBtn.classList.add('hidden');
        contadorDiv.classList.remove('hidden');
        cantidad = 1; // Inicializar el contador en 1
        actualizarCantidad();
        agregarAlCarrito(producto,cantidad)
        // Remover el event listener para evitar múltiples asignaciones
        addToCartBtn.removeEventListener('click',(event) => handleAddToCartClick(event,producto));
    }

    addToCartBtn.addEventListener('click',(event) => handleAddToCartClick(event,producto));

    decrementarBtn.addEventListener('click', (event) => {
        event.preventDefault();
        if (cantidad > 0) {
            cantidad--;
            actualizarCantidad();
            actualizarCarrito(producto, cantidad);
        }
    });

    incrementarBtn.addEventListener('click', (event) => {
        event.preventDefault();
        cantidad++;
        actualizarCantidad();
        actualizarCarrito(producto, cantidad);
    });

    actualizarCantidad();
}

// Función para agregar un producto al carrito
function agregarAlCarrito(producto, cantidad) {
    const itemCarrito = {
        nombre: producto.name,
        precio: producto.price,
        cantidad: cantidad
    };
    carrito.push(itemCarrito);
    mostrarCarrito();
    confirmedCart();
}

// Función para actualizar el carrito
function actualizarCarrito(producto, cantidad) {
    const item = carrito.find(item => item.nombre === producto.name);
    if (item) {
        item.cantidad = cantidad;
        if (cantidad === 0) {
            carrito = carrito.filter(item => item.nombre !== producto.name);
        }
    }
    mostrarCarrito();
    confirmedCart();
}

// Función para mostrar el carrito en el DOM
function mostrarCarrito() {
    const listaCarrito = document.getElementById('lista-carrito');
    listaCarrito.innerHTML = '';
    let total = 0;

    carrito.forEach(item => {
        const itemTotal = item.precio * item.cantidad;
        total += itemTotal;

        const li = document.createElement('li');
        li.classList.add('pb-2', 'w-full', 'border-b-2','border-red-100');
        li.innerHTML = `
            <div class="flex justify-between">
                <div>
                    <p class="font-semibold">${item.nombre}</p>
                    <p><span class="text-red-500 font-semibold"> ${item.cantidad} x</span> <span class=" font-medium text-stone-600">$${item.precio.toFixed(2)} = $${itemTotal.toFixed(2)} </span></p>
                </div>
            </div>
        `;
        listaCarrito.appendChild(li);
    });

    const ordenTotal = document.getElementById('orden-total');
    ordenTotal.textContent = `Orden Total: $${total.toFixed(2)}`;
} 

//new

function confirmedCart() {
    const confirCarrito = document.getElementById('confirmed');
    confirCarrito.innerHTML = '';
    let total = 0;

    carrito.forEach(item => {
        const itemTotal = item.precio * item.cantidad;
        total += itemTotal;

        const li = document.createElement('li');
        li.classList.add('pb-2', 'w-full', 'border-b-2','border-red-100');
        li.innerHTML = `
            <div class="flex justify-between">
                <div>
                    <p class="font-semibold">${item.nombre}</p>
                    <p><span class="text-red-500 font-semibold"> ${item.cantidad} x</span> <span class=" font-medium text-stone-600">$${item.precio.toFixed(2)} = $${itemTotal.toFixed(2)} </span></p>
                </div>
            </div>
        `;
        confirCarrito.appendChild(li);
    });

    const ordenTotal = document.getElementById('orden-total');
    ordenTotal.textContent = `Orden Total: $${total.toFixed(2)}`;
}

// Llamar a la función para cargar los productos cuando la página se cargue
window.onload = cargarProductos;


