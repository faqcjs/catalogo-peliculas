const API_KEY = "c033bcf225d6588894bd1bb4abde125e"
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";


const contenedor = document.querySelector("#peliculas")
const form = document.getElementById("form-busqueda");
const input = document.getElementById("input-busqueda");
const btnFav = document.querySelector("#btnFav")
const btnMostrarFav = document.querySelector("#mostrar-fav")
const btnMostrarTodo = document.querySelector("#mostrar-todos")
const btnGenero = document.querySelectorAll(".btn-genero")
let peliculas = []
const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

const obtenerPeliculasPop = async () =>{
    try{
        const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-ES&page=1`)
        const data = await res.json()
        peliculas = data.results
        renderizarPeliculas(peliculas)
    }catch(error){
        console.log(error)
    }
}


const renderizarPeliculas = (peliculas) =>{
    contenedor.innerHTML= ""
    const favoritos = JSON.parse(localStorage.getItem("favoritos"))|| []
    peliculas.forEach(pelicula => {
        const div = document.createElement("div");
        
        let esFavorita = favoritos.includes(pelicula.id)
       
    
        div.classList.add("pelicula");
        div.innerHTML = `
        <img src="${IMG_URL + pelicula.poster_path}" alt="${pelicula.title}" />
        <div class="info">
            <h3>${pelicula.title}</h3>
            <p>⭐ ${pelicula.vote_average.toFixed(1)}</p>
            <button class="btnFav ${esFavorita ? "favorito" : ""}" data-id="${pelicula.id}">
                ${esFavorita ? "❤️" : "🤍"}
            </button>
        </div>
        `;

        contenedor.appendChild(div);

      });
}



contenedor.addEventListener("click", (e) => {
    if (e.target.classList.contains("btnFav")) {
        const id = parseInt(e.target.dataset.id);
        agregarFavorito(id)
        e.target.classList.toggle("favorito");
        e.target.textContent = e.target.classList.contains("favorito") ? "❤️" : "🤍";
    }
  });

const agregarFavorito = (id) =>{
    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    
    if(favoritos.includes(id)){
        favoritos = favoritos.filter(favId => favId !== id);
        Swal.fire("Eliminado de favoritos");
    }else{
        favoritos.push(id) 
        Swal.fire("Agregada a favoritos");  
    }
    localStorage.setItem("favoritos", JSON.stringify(favoritos))
    
    
}

btnMostrarFav.addEventListener("click", ()=>{
    contenedor.innerHTML=""
    obtenerFavoritos()
    
})

const obtenerFavoritos = async() =>{
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) || []
    
    const promesas = favoritos.map(id =>
        fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`)
      .then(res => res.json())
    )
    
    const peliculasFavoritas = await Promise.all(promesas)
    renderizarPeliculas(peliculasFavoritas)
}

btnMostrarTodo.addEventListener("click", ()=>{
    contenedor.innerHTML=""
    renderizarPeliculas(peliculas)
})




form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = input.value.trim();
  console.log(query)
  if (query === "") {
    try{
        const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-ES&page=1`)
        const data = await res.json()
        renderizarPeliculas(data.results)
        

    }catch(error){
        console.log("error")
    }

  }else{

      try {
        const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=es-ES&query=${encodeURIComponent(query)}`);
        const data = await res.json();
        renderizarPeliculas(data.results);
      } catch (error) {
        console.error("Error al buscar películas:", error);
      }
  }

});

btnGenero.forEach(boton => {
    
    boton.addEventListener("click", () => {
      const generoId = boton.dataset.genero;
      filtrarPorGenero(generoId)
    });
  });

document.getElementById("toggle-menu").addEventListener("click", () => {
    const menu = document.getElementById("menu-generos");
    menu.classList.toggle("oculto");
  });
  

const filtrarPorGenero = async(generoId) =>{
    try{
        const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=es-ES&sort_by=popularity.desc&with_genres=${generoId}`)
        const data = await res.json()
        const menu = document.getElementById("menu-generos");
        menu.classList.toggle("oculto");
        renderizarPeliculas(data.results)
        
    }catch(error){
        console.log(error)
    }
}


obtenerPeliculasPop()

