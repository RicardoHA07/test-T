<script>
  import { collection, getDocs, addDoc } from 'firebase/firestore';
  import { db } from '$lib/firebase';
  import Navbar from '$lib/components/Navbar.svelte';
  import "../app.css";
  import { onMount } from 'svelte';

  // Variables del formulario
  let sustancia = "";
  let foto = null;
  let reactivo = "";
  let color = "";
  let lugar = "";
  let experiencia = "";
  let confirmacion = "";
  let preview = null;
  let intentoFallido = false;
  let descripcionVisual = "";
  let inputSustancia;
  let selectReactivo;
  let inputColor;
  let selectConfirmacion;

  // Lista de reactivos y reportes
  const reactivos = ["Marquis", "Mecke", "Ehrlich", "Otros"];
  let tests = [];

  // ✅ Cargar reportes al iniciar
  async function cargarReportes() {
    const querySnapshot = await getDocs(collection(db, "reportes"));
    tests = querySnapshot.docs.map(doc => doc.data());
    console.log("Reportes cargados:", tests);
  }

  onMount(() => {
    cargarReportes();
  });

  // ✅ Validación del formulario
  function formularioValido() {
    return (
      sustancia.trim() &&
      reactivo.trim() &&
      color.trim() &&
      confirmacion.trim()
    );
  }

  // ✅ Envío del formulario
  async function handleSubmit(event) {
    event.preventDefault();

    if (!formularioValido()) {
      intentoFallido = true;

      if (!sustancia.trim()) {
        inputSustancia.focus();
      } else if (!reactivo.trim()) {
        selectReactivo.focus();
      } else if (!color.trim()) {
        inputColor.focus();
      } else if (!confirmacion.trim()) {
        selectConfirmacion.focus();
      }

      return;
    }

    const nuevoTest = {
      sustancia,
      foto: preview || "https://via.placeholder.com/400x200?text=Sin+imagen",
      reactivo,
      color,
      lugar,
      experiencia,
      confirmacion,
      descripcionVisual,
      fecha: new Date()
    };

    try {
      await addDoc(collection(db, "reportes"), nuevoTest);
      console.log("Guardado en Firestore ✅");

      tests = [...tests, nuevoTest]; // Se agrega también al frontend
    } catch (error) {
      console.error("Error al guardar en Firestore ❌", error);
    }

    // Resetear formulario
    sustancia = "";
    foto = null;
    reactivo = "";
    color = "";
    lugar = "";
    experiencia = "";
    confirmacion = "";
    descripcionVisual = "";
    intentoFallido = false;
    preview = null;

    alert("¡Gracias por compartir! Con tu contribución, nos protegemos entre todos 💜");
  }
</script>

<svelte:head>
  <title>Testea y Trippea</title>
</svelte:head>

<!-- ✅ Navbar va fuera del fondo morado -->
<Navbar />

<!-- ✅ Fondo morado solo para el encabezado -->
<section class="bg-gradient-to-r from-purple-800/80 to-fuchsia-600/80 text-white py-20 px-6 rounded-b-3xl shadow-md backdrop-blur-sm">
  <div class="max-w-5xl mx-auto text-center">
    <h1 class="text-4xl font-bold mb-2">Para la reducción de daño :)</h1>
    <p class="text-lg">Aquí podrás compartir los resultados de tus sustancias, experiencias y más.</p>
  </div>
</section>

<!-- Formulario -->
<section id="formulario" class="pt-10 pb-16 bg-gray-100 px-4">
  <div class="max-w-2xl mx-auto bg-white shadow-md rounded-2xl p-8">
    <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">
      Subir reporte de sustancia
    </h2>    
   

    <form on:submit={handleSubmit} class="space-y-6">
      <!-- Sustancia -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          💊 Vendido como:
          {#if intentoFallido && !sustancia.trim()}<span class="text-red-600 font-bold">*</span>{/if}
        </label>
        <input
          type="text"
          bind:this={inputSustancia}
          bind:value={sustancia}
          placeholder="Ej: LSD, MDMA, 2cb"
          class="w-full rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500
          {intentoFallido && !sustancia.trim() ? 'border-red-500 border' : 'border-gray-300 border'}"
        />
        {#if intentoFallido && !sustancia.trim()}
          <p class="text-red-600 text-xs mt-1">Este campo es obligatorio</p>
        {/if}
      </div>
      <!-- Descripción visual -->
      <div>
         <label class="block text-sm font-medium text-gray-700 mb-1">🔍 Descripción visual </label>
         <textarea
           bind:value={descripcionVisual}
          rows="3"
          placeholder="(Opcional) Ej: pastilla redonda, azul con logo de delfín. Papel con diseño fractal en tonos morados."
          class="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
      ></textarea>
</div>
    
      <!-- Foto -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">📸 Foto de la sustancia (opcional)</label>
        <input
          type="file"
          accept="image/*"
          on:change={(e) => {
            foto = e.target.files[0];
            preview = foto ? URL.createObjectURL(foto) : null;
          }}
          class="block w-full text-sm text-gray-600 bg-white border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {#if preview}
          <div class="mt-4">
            <p class="text-sm text-gray-500 mb-2">Vista previa:</p>
            <img src={preview} alt="Previsualización" class="w-full max-h-64 object-contain rounded-md border" />
          </div>
        {/if}
      </div>
    
      <!-- Reactivo -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          🧪 Reactivo usado:
          {#if intentoFallido && !reactivo.trim()}<span class="text-red-600 font-bold">*</span>{/if}
        </label>
        <select
        bind:this={selectReactivo}
        bind:value={reactivo}
        class="w-full rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500
          {intentoFallido && !reactivo.trim() ? 'border-red-500 border' : 'border-gray-300 border'}"
        >
          <option value="">Selecciona uno</option>
          {#each reactivos as r}
            <option value={r}>{r}</option>
          {/each}
        </select>
        {#if intentoFallido && !reactivo.trim()}
          <p class="text-red-600 text-xs mt-1">Este campo es obligatorio</p>
        {/if}
      </div>
    
      <!-- Color -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          🎨 Cambio de color:
          {#if intentoFallido && !color.trim()}<span class="text-red-600 font-bold">*</span>{/if}
        </label>
        <input
          type="text"
          bind:this={inputColor}
          bind:value={color}

          placeholder="Ej: púrpura oscuro"
          class="w-full rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500
          {intentoFallido && !color.trim() ? 'border-red-500 border' : 'border-gray-300 border'}"
        />
        {#if intentoFallido && !color.trim()}
          <p class="text-red-600 text-xs mt-1">Este campo es obligatorio</p>
        {/if}
      </div>
    
      <!-- Lugar (opcional, sin validación) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">🛒 Lugar de compra</label>
        <input
          type="text"
          bind:value={lugar}
          placeholder="(Opcional) Ciudad, estado, etc."
          class="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    
      <!-- Experiencia -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          ✍️ Experiencia:
        </label>
        <textarea
        bind:value={experiencia}
        rows="4"
        placeholder="(Opcional) ¿Cómo te fue?"
        class="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
      ></textarea>
      </div>
    
      <!-- Confirmación -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          ✅ ¿Coincidió con lo que te dijeron que era?
          {#if intentoFallido && !confirmacion.trim()}<span class="text-red-600 font-bold">*</span>{/if}
        </label>
        <select
        bind:this={selectConfirmacion}
        bind:value={confirmacion}

        class="w-full rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500
          {intentoFallido && !confirmacion.trim() ? 'border-red-500 border' : 'border-gray-300 border'}"
        >
          <option value="">Selecciona una opción</option>
          <option value="Sí, coincide">✅ Sí, coincide</option>
          <option value="No, era otra sustancia">❌ No, era otra sustancia</option>
          <option value="No estoy seguro">🤔 No estoy seguro</option>
        </select>
        {#if intentoFallido && !confirmacion.trim()}
          <p class="text-red-600 text-xs mt-1">Este campo es obligatorio</p>
        {/if}
      </div>
    
      <!-- Botón -->
      <div class="text-center">
        <button
          type="submit"
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition"
        >
          Enviar
        </button>
      </div>
    </form>
    
  </div>
</section>

<!-- Galería -->
<section id="galeria" class="pt-10 pb-16 bg-gray-50">
  <div class="max-w-6xl mx-auto px-4">
    <h2 class="text-2xl font-bold text-center mb-8">🧪 Galería de Sustancias Testeadas</h2>

    <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {#each tests as test}
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <img src={test.foto} alt="foto de sustancia" class="w-full h-48 object-cover" />
          <div class="p-4 space-y-2">
            <p class="text-lg font-semibold text-gray-800">Vendido como: {test.sustancia}</p>
            <p class="text-sm text-gray-600"><strong>Reactivo:</strong> {test.reactivo}</p>
            <p class="text-sm text-gray-600"><strong>Cambio de color:</strong> {test.color}</p>
            <p class="text-sm text-gray-600"><strong>Lugar:</strong> {test.lugar}</p>
            <p class="text-sm text-gray-600"><strong>Experiencia:</strong><br />{test.experiencia}</p>
            <p class="text-sm text-gray-600"><strong>¿Coincidió?:</strong> {test.confirmacion}</p>
            {#if test.descripcionVisual}
  <p class="text-sm text-gray-600"><strong>Descripción visual:</strong> {test.descripcionVisual}</p>
{/if}

          </div>          
        </div>
      {/each}
    </div>
  </div>
</section>


<!-- Acerca de -->
<section id="acerca" class="pt-10 pb-16">
  <div class="max-w-3xl mx-auto text-center">
    <h2 class="text-2xl font-semibold mb-4">Sobre el Proyecto</h2>
    <p class="text-gray-600">
      Este proyecto busca reducir riesgos dando un espacio para compartir resultados de testeo y experiencias con sustancias.
    </p>
  </div>
</section>
