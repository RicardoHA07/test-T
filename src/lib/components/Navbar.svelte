<script>
  import { onMount } from 'svelte'; 
  let active = "inicio";
  const sections = ["inicio", "formulario", "galeria", "acerca"];
  let scrolled = false;

  // Clase dinámica para el hover del logo
  $: linkHoverClass = scrolled ? 'hover:text-blue-600' : 'hover:text-blue-300';

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            active = entry.target.id;
          }
        }
      },
      { threshold: 0.5 }
    );

    sections.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    // Scroll listener
    const handleScroll = () => {
      scrolled = window.scrollY > 50;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  });
</script>

<nav class={`sticky top-0 z-50 transition-all duration-300 
  ${scrolled ? 'bg-fuchsia-700/90 shadow-md backdrop-blur-md text-white' : 'bg-gradient-to-r from-purple-800/80 to-fuchsia-600/80 backdrop-blur-md text-white'}`}>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16 items-center">
      <a href="#inicio" class={`text-xl font-bold transition ${linkHoverClass}`}>
        🧪 Testea y Trippea 🧪
      </a>

      <div class="space-x-6 text-sm font-medium hidden md:flex">
        {#each sections as id}
          <a
            href={`#${id}`}
            class={`transition ${
              active === id
                ? scrolled ? 'text-blue-400' : 'text-blue-300'
                : scrolled ? 'text-white' : 'text-white'
            } hover:text-blue-300`}
          >
            {id.charAt(0).toUpperCase() + id.slice(1)}
          </a>
        {/each}
      </div>
    </div>
  </div>
</nav>
