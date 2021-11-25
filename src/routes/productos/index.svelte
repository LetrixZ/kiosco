<script context="module" lang="typescript">
  export async function load({ page, fetch }) {
    const res = await fetch("/api/prod");
    const json = await res.json();
    return { props: { items: json } };
  }
</script>

<script lang="typescript">
  export let items;
</script>

<h1>Listado de productos</h1>
<ul>
  {#each items as item}
    <li>{item.nombre}</li>
  {/each}
</ul>
