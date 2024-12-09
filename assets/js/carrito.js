// DOM
document.addEventListener("DOMContentLoaded", () => {
          
        // Variables
        const baseDeDatos = [
        {
            id: 1,
            nombre: "Sombrero vueltiao con la bandera de Colombia, 23 vueltas",
            precio: 250000,
            imagen: "assets/img/feature_prod_01.jpg",
            categoria: "sombreros",
        },
        {
            id: 2,
            nombre: "Sombrero vueltiao machiembriao",
            precio: 150000,
            imagen: "assets/img/sombrero4.jpg",
            categoria: "sombreros",
        },
        {
            id: 3,
            nombre: "Sombrero vueltiao colombiano 15 vueltas tricolor",
            precio: 250000,
            imagen: "assets/img/feature_prod_02.jpg",
            categoria: "sombreros",
        },
        {
            id: 4,
            nombre: "Mochila wayuu azul 6",
            precio: 120000,
            imagen: "assets/img/shop_04.jpg",
            categoria: "mochilas",
        },
        {
            id: 5,
            nombre: "Bolso en fique",
            precio: 120000,
            imagen: "assets/img/shop_03.jpg",
            categoria: "bolsos",
        },
        {
            id: 6,
            nombre: "Hamaca Wayu",
            precio: 120000,
            imagen: "assets/img/hamaca1.jpg",
            categoria: "hamacas",
        },
        {
            id: 7,
            nombre: "Manilla",
            precio: 120000,
            imagen: "assets/img/Manilla.jpeg",
            categoria: "Manilla",
        },
        {
            id: 8,
            nombre: "Mochila Wayu",
            precio: 120000,
            imagen: "assets/img/mochila3.jpg",
            categoria: "Mochila",
        },
        {
            id: 8,
            nombre: "Mochila Wayu Colores",
            precio: 120000,
            imagen: "assets/img/mochila12.png",
            categoria: "Mochila",
        },
    

    ];

    let carrito = [];
    const divisa = "$";
    const DOMitems = document.querySelector("#items");
    const DOMcarrito = document.querySelector("#carrito");
    const DOMtotal = document.querySelector("#total");
    const DOMbotonVaciar = document.querySelector("#boton-vaciar");
    const filtroContainer = document.getElementById("filtro-container");
    const miLocalStorage = window.localStorage;

    // Crear categorías de filtro horizontalmente
    function crearFiltrosHorizontales() {
        const categorias = ["todas", ...new Set(baseDeDatos.map(producto => producto.categoria))];
        
        filtroContainer.innerHTML = categorias.map(categoria => `
            <div class="form-check form-check-inline">
                <input 
                    class="form-check-input" 
                    type="radio" 
                    name="categoria" 
                    id="filtro-${categoria}" 
                    value="${categoria}" 
                    ${categoria === 'todas' ? 'checked' : ''}
                >
                <label class="form-check-label" for="filtro-${categoria}">
                    ${categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                </label>
            </div>
        `).join('');

        // Añadir event listeners a los nuevos filtros
        filtroContainer.querySelectorAll('input[name="categoria"]').forEach(radio => {
            radio.addEventListener('change', renderizarProductos);
        });
    }

    // Renderizar productos
    function renderizarProductos() {
        DOMitems.innerHTML = "";
        const filtro = document.querySelector('input[name="categoria"]:checked').value;
        const productosFiltrados = baseDeDatos.filter(
            (producto) => filtro === "todas" || producto.categoria === filtro
        );

        productosFiltrados.forEach((info) => {
            const miNodo = document.createElement("div");
            miNodo.classList.add("col-md-4", "mb-4");

            const miNodoCard = document.createElement("div");
            miNodoCard.classList.add("card", "h-100");

            const miNodoImagen = document.createElement("img");
            miNodoImagen.classList.add("card-img-top");
            miNodoImagen.setAttribute("src", info.imagen);
            miNodoImagen.setAttribute("alt", info.nombre);

            const miNodoCardBody = document.createElement("div");
            miNodoCardBody.classList.add("card-body", "d-flex", "flex-column");

            const miNodoTitle = document.createElement("h5");
            miNodoTitle.classList.add("card-title");
            miNodoTitle.textContent = info.nombre;

            const miNodoPrecio = document.createElement("p");
            miNodoPrecio.classList.add("card-text", "mt-auto");
            miNodoPrecio.textContent = `${divisa} ${info.precio.toLocaleString()}`;

            const miNodoBoton = document.createElement("button");
            miNodoBoton.classList.add("btn", "btn-primary", "mt-2");
            miNodoBoton.innerHTML = `<i class="fa fa-cart-plus"></i> Agregar`; 
            miNodoBoton.setAttribute("marcador", info.id);
            miNodoBoton.addEventListener("click", anadirProductoAlCarrito);

            miNodoCardBody.appendChild(miNodoTitle);
            miNodoCardBody.appendChild(miNodoPrecio);
            miNodoCardBody.appendChild(miNodoBoton);

            miNodoCard.appendChild(miNodoImagen);
            miNodoCard.appendChild(miNodoCardBody);

            miNodo.appendChild(miNodoCard);

            DOMitems.appendChild(miNodo);
        });
    }

    function anadirProductoAlCarrito(evento) {
        carrito.push(evento.target.closest("button").getAttribute("marcador"));
        renderizarCarrito();
        guardarCarritoEnLocalStorage();
        actualizarCarritoValor(carrito.length);
    }

    function actualizarCarritoValor(valor) {
        const carritoContainer = document.getElementById("carrito-value");
        carritoContainer.textContent = `${valor}`;
    }

    function renderizarCarrito() {
        DOMcarrito.innerHTML = "";
        const carritoSinDuplicados = [...new Set(carrito)];

        const tabla = document.createElement("table");
        tabla.classList.add("table", "table-striped", "text-center");
        tabla.style.fontSize = "0.8rem";

        const thead = document.createElement("thead");
        thead.innerHTML = `
            <tr>
                <th>Producto</th>
                <th>Precio Unitario</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th>Acción</th>
            </tr>
        `;

        const tbody = document.createElement("tbody");

        carritoSinDuplicados.forEach((item) => {
            const miItem = baseDeDatos.filter(
                (itemBaseDatos) => itemBaseDatos.id === parseInt(item)
            );
            const numeroUnidadesItem = carrito.reduce(
                (total, itemId) => (itemId === item ? total + 1 : total),
                0
            );

            const subtotal = miItem[0].precio * numeroUnidadesItem;

            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${miItem[0].nombre}</td>
                <td>${divisa} ${miItem[0].precio.toLocaleString()}</td>
                <td>${numeroUnidadesItem}</td>
                <td>${divisa} ${subtotal.toLocaleString()}</td>
            `;

            const botonEliminar = document.createElement("button");
            botonEliminar.classList.add("btn", "btn-danger", "btn-sm");
            botonEliminar.innerHTML = `<i class="fa fa-trash"></i>`; 
            botonEliminar.dataset.item = item;
            botonEliminar.addEventListener("click", borrarItemCarrito);

            const celdaAccion = document.createElement("td");
            celdaAccion.appendChild(botonEliminar);

            fila.appendChild(celdaAccion);
            tbody.appendChild(fila);
        });

        tabla.appendChild(thead);
        tabla.appendChild(tbody);

        DOMcarrito.appendChild(tabla);

        DOMtotal.textContent = calcularTotal();
    }

    function borrarItemCarrito(evento) {
        const id = evento.target.closest("button").dataset.item;
        carrito = carrito.filter((carritoId) => carritoId !== id);
        renderizarCarrito();
        guardarCarritoEnLocalStorage();
        actualizarCarritoValor(carrito.length);
    }

    function calcularTotal() {
        return carrito
            .reduce((total, item) => {
                const miItem = baseDeDatos.filter(
                    (itemBaseDatos) => itemBaseDatos.id === parseInt(item)
                );
                return total + miItem[0].precio;
            }, 0)
            .toLocaleString();
    }

    function vaciarCarrito() {
        carrito = [];
        renderizarCarrito();
        localStorage.clear();
        actualizarCarritoValor(0);
    }

    function guardarCarritoEnLocalStorage() {
        miLocalStorage.setItem("carrito", JSON.stringify(carrito));
    }

    function cargarCarritoDeLocalStorage() {
        if (miLocalStorage.getItem("carrito") !== null) {
            carrito = JSON.parse(miLocalStorage.getItem("carrito"));
            actualizarCarritoValor(carrito.length);
        }
    }

    // Eventos
    DOMbotonVaciar.addEventListener("click", vaciarCarrito);

    // Inicio
    crearFiltrosHorizontales();
    cargarCarritoDeLocalStorage();
    renderizarProductos();
    renderizarCarrito();
});