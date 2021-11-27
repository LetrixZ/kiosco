<script context="module">
  /** @type {import('@sveltejs/kit').ErrorLoad} */
  export function load({ page, error, status }) {
    return {
      props: {
        status,
        error: error.message,
        barcode: page.params.code,
      },
    };
  }
</script>

<script>
  export let status, error, barcode;
</script>

<div class="w-full flex flex-col align-middle content-center m-auto justify-center mt-8 items-center gap-y-8">
  <p class="text-8xl font-light">{status}</p>
  {#if status == 404}
    <p class="text-2xl">No se ha encontrado el producto con el codigo <b>{barcode}</b></p>
  {:else if status == 500}
    <p class="text-2xl">Ha ocurrido un error en el servidor</p>
  {:else}
    <p class="text-2xl">Ha ocurrido un error en el servidor: {error}</p>
  {/if}
</div>
