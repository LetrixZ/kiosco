<script>
  import NavLink from "./NavLink.svelte";
</script>

<nav >
  <ul
    class="flex px-4 bg-yellow-100 border-b border-black border-opacity-50 h-10 items-center gap-x-4"
  >
    <li>
      <NavLink href="/">Venta</NavLink>
    </li>
    <li>
      <NavLink href="/productos">Listado de productos</NavLink>
    </li>
    <li>
      <NavLink href="/facturas">Facturas</NavLink>
    </li>
  </ul>
</nav>
