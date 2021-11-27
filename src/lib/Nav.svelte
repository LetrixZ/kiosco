<script>
  import NavLink from "./NavLink.svelte";
</script>

<nav>
  <ul
    class="flex px-4 bg-yellow-100 border-b border-black border-opacity-50 h-10 items-center"
  >
    <li class="mr-6">
      <NavLink href="/">Venta</NavLink>
    </li>
    <li class="mr-6">
      <NavLink href="/productos">Listado de productos</NavLink>
    </li>
  </ul>
</nav>
